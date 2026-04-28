import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../components/ui/ModalShell";
import { comunidadService } from "../../services/comunidad";
import { withRequestIdMessage } from "../../services/serviceUtils";

let modalControl;

export const CrearComunidad = {
  openModal: (post = null) => {
    modalControl?.setEditData(post);
    modalControl?.setOpen(true);
  },
  Component: () => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
      titulo: "",
      contenido: "",
      categoria: "HISTORIA",
      img: "",
    });
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [, setLoading] = useState(false);
    const [editData, setEditData] = useState(null);

    modalControl = { setOpen, setEditData };

    useEffect(() => {
      if (open) {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
      }

      return () => {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      };
    }, [open]);

    useEffect(() => {
      const handleOpen = () => setOpen(true);
      window.addEventListener("openCrearComunidad", handleOpen);
      return () => window.removeEventListener("openCrearComunidad", handleOpen);
    }, []);

    useEffect(() => {
      if (editData) {
        setForm({
          titulo: editData.titulo || "",
          contenido: editData.contenido || "",
          categoria: editData.categoria || "HISTORIA",
          img: editData.img || "",
        });
      } else {
        resetForm();
      }
    }, [editData]);

    const resetForm = () => {
      setForm({
        titulo: "",
        contenido: "",
        categoria: "HISTORIA",
        img: "",
      });
      setErrors({});
      setResult("");
      setSubmitting(false);
    };

    const handleClose = () => {
      resetForm();
      setOpen(false);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setErrors((prev) => ({ ...prev, img: "" }));

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, img: "Solo se permiten imágenes" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          img: "La imagen no puede superar 5 MB",
        }));
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData },
        );

        const data = await response.json();

        if (data.secure_url) {
          setForm((prev) => ({ ...prev, img: data.secure_url }));
        } else {
          setErrors((prev) => ({ ...prev, img: "Error al subir la imagen" }));
        }
      } catch {
        setErrors((prev) => ({ ...prev, img: "Error de conexión" }));
      } finally {
        setUploading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (submitting) return;

      let valid = true;
      const newErrors = {};

      if (!form.titulo.trim()) {
        newErrors.titulo = "El título es obligatorio";
        valid = false;
      } else if (form.titulo.trim().length > 80) {
        newErrors.titulo = "El título no puede contener más de 80 caracteres";
        valid = false;
      }

      if (!form.contenido.trim()) {
        newErrors.contenido = "El contenido es obligatorio";
        valid = false;
      } else if (form.contenido.trim().length > 3000) {
        newErrors.contenido = "El contenido no puede contener más de 3000 caracteres";
        valid = false;
      }

      if (!form.categoria) {
        newErrors.categoria = "La categoría es obligatoria";
        valid = false;
      } else if (!["HISTORIA", "ALERTA"].includes(form.categoria)) {
        newErrors.categoria = "La categoría debe ser HISTORIA o ALERTA";
        valid = false;
      }

      if (!form.img.trim()) {
        newErrors.img = "La imagen es obligatoria";
        valid = false;
      } else if (!/^https:\/\/res\.cloudinary\.com\/[^/]+\/.+/.test(form.img)) {
        newErrors.img = "La URL de imagen no es válida";
        valid = false;
      }

      setErrors(newErrors);
      if (!valid) return;

      try {
        setSubmitting(true);
        setLoading(true);
        setResult(editData ? "Actualizando..." : "Creando...");

        const datosParaEnviar = {
          titulo: form.titulo.trim(),
          contenido: form.contenido.trim(),
          categoria: form.categoria,
          img: form.img.trim(),
        };

        const response =
          editData && editData._id
            ? await comunidadService.actualizarComunidad(editData._id, datosParaEnviar)
            : await comunidadService.crearComunidad(datosParaEnviar);

        if (response.success) {
          setResult(editData ? "Actualizado correctamente" : "Creado correctamente");
          resetForm();
          setTimeout(() => setOpen(false), 1200);

          const eventName = editData ? "comunidadActualizada" : "comunidadCreada";
          const payload = response.comunidad || datosParaEnviar;
          window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
        } else if (response.errors) {
          setErrors(response.errors);
          setResult(withRequestIdMessage(response.msg || "Error en validación", response.requestId));
        } else {
          setResult(withRequestIdMessage(response.msg || "Error al procesar", response.requestId));
        }
      } catch {
        setResult("Error de conexión al servidor");
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    };

    const isEditing = !!editData;
    if (!open) return null;

    return (
      <ModalShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex max-h-[80vh] w-full max-w-2xl flex-col items-center text-white/90"
        >
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[80vh] w-full max-w-6xl flex-col rounded-2xl border border-white/70 bg-white/10 px-8 py-6 text-center shadow-lg backdrop-blur-sm"
          >
            <button
              onClick={handleClose}
              type="button"
              className="absolute right-4 top-4 cursor-pointer text-white transition-colors delay-100 duration-300 hover:text-[#FF7857]"
              disabled={submitting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col items-center justify-center">
              <h1 className="mt-2 text-3xl font-medium text-white">
                {isEditing ? "Editar caso de ayuda" : "Crear caso de ayuda"}
              </h1>
              <p className="mt-1 text-sm text-white/80">
                {isEditing ? "Modificá el contenido" : "Completá los datos"}
              </p>
            </div>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
              <div className="mt-4">
                <label className="mb-1 ml-2 flex items-left text-sm">Título</label>
                <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/80 bg-white pl-6">
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Ingrese un título para el caso *"
                    value={form.titulo}
                    onChange={handleChange}
                    disabled={submitting}
                    className="h-full w-full bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
                  />
                </div>
                {errors.titulo && (
                  <p className="mt-1 w-full px-4 text-left text-xs text-red-400">
                    {errors.titulo}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="mb-1 ml-2 flex items-left text-sm">Imagen</label>
                <div className="flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-gray-300/80 bg-white">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading || submitting}
                    className="cursor-pointer bg-transparent text-center text-sm text-gray-500 outline-none file:ml-2 file:h-10 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#FF7857] file:p-3 file:px-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#E5674F]"
                  />
                </div>
                {errors.img && (
                  <p className="mt-1 w-full px-4 text-left text-xs text-red-400">{errors.img}</p>
                )}

                {form.img && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={form.img}
                      alt="Vista previa"
                      className="h-40 w-40 rounded-2xl border border-white/50 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="mb-1 ml-2 flex items-left text-sm">Contenido</label>
                <div className="flex w-full items-center gap-2 overflow-hidden rounded-2xl border border-gray-300/80 bg-white p-4">
                  <textarea
                    name="contenido"
                    placeholder="Ingrese el contenido del caso *"
                    value={form.contenido}
                    onChange={handleChange}
                    disabled={submitting}
                    rows="10"
                    className="w-full resize-none bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
                  />
                </div>
                {errors.contenido && (
                  <p className="mt-1 w-full px-4 text-left text-xs text-red-400">
                    {errors.contenido}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="mb-1 ml-2 flex items-left text-sm">Categoría</label>
                <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/80 bg-white pl-6">
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    disabled={submitting}
                    className="h-full w-full bg-transparent text-sm text-gray-500 outline-none"
                  >
                    <option value="">Seleccione la categoría del caso *</option>
                    <option value="ALERTA">Alerta</option>
                    <option value="HISTORIA">Historia</option>
                  </select>
                </div>
                {errors.categoria && (
                  <p className="mt-1 w-full px-4 text-left text-xs text-red-400">
                    {errors.categoria}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-2 mt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer rounded-full border border-white/70 bg-white/40 px-6 py-2 text-white transition-colors delay-100 duration-300 hover:bg-[#FF7857] disabled:opacity-50"
              >
                {submitting
                  ? isEditing
                    ? "Actualizando..."
                    : "Creando..."
                  : isEditing
                    ? "Actualizar caso"
                    : "Crear caso"}
              </button>
            </div>

            {result && <p className="mt-2 text-sm text-white/80">{result}</p>}
          </form>
        </motion.div>
      </ModalShell>
    );
  },
};
