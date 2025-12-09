"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { comunidadService } from "../../services/comunidad";

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
      categoria: "INFORMACION",
      img: "",
    });
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState(null);

    modalControl = { setOpen, setEditData };

    useEffect(() => {
      if (open) {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 600);
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        return () => clearTimeout(timer);
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }
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
          categoria: editData.categoria || "INFORMACION",
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
        categoria: "INFORMACION",
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
          const copy = { ...prev };
          delete copy[name];
          return copy;
        });
      }
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setErrors((prev) => ({ ...prev, img: "" }));

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, img: "Solo se permiten imagenes" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          img: "La imagen no puede superar 5MB",
        }));
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "pet_uploads");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dzxp6fhvu/image/upload",
          { method: "POST", body: formData }
        );

        const data = await response.json();

        if (data.secure_url) {
          setForm((prev) => ({ ...prev, img: data.secure_url }));
        } else {
          setErrors((prev) => ({ ...prev, img: "Error al subir imagen" }));
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, img: "Error de conexion" }));
      } finally {
        setUploading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (submitting) return;

      let valid = true;
      let newErrors = {};

      if (!form.titulo.trim()) {
        newErrors.titulo = "El titulo es obligatorio";
        valid = false;
      } else if (form.titulo.trim().length < 9) {
        newErrors.titulo = "El titulo debe tener al menos 10 caracteres";
        valid = false;
      } else if (form.titulo.trim().length > 81) {
        newErrors.titulo = "El titulo no puede contener más de 80 caracteres";
        valid = false;
      }

      if (!form.contenido.trim()) {
        newErrors.contenido = "El contenido es obligatorio";
        valid = false;
      } else if (form.contenido.trim().length < 19) {
        newErrors.contenido = "El contenido debe tener al menos 20 caracteres";
        valid = false;
      } else if (form.contenido.trim().length > 3001) {
        newErrors.contenido =
          "El contenido no puede contener más de 3000 caracteres";
        valid = false;
      }

      if (!form.categoria) {
        newErrors.categoria = "La categoria es obligatoria";
        valid = false;
      }

      if (!form.img.trim()) {
        newErrors.img = "La imagen es obligatoria";
        valid = false;
      } else if (
        !/^https:\/\/res\.cloudinary\.com\/.+\/.+\.(jpg|jpeg|png|webp)$/.test(
          form.img
        )
      ) {
        newErrors.img = "La URL de imagen no es válida";
        valid = false;
      }

      setErrors(newErrors);
      if (!valid) return;

      try {
        setSubmitting(true);
        setResult(editData ? "Actualizando..." : "Creando...");

        const datosParaEnviar = {
          titulo: form.titulo,
          contenido: form.contenido,
          categoria: form.categoria,
          img: form.img,
        };

        let resp;
        if (editData && editData._id) {
          resp = await comunidadService.actualizarComunidad(
            editData._id,
            datosParaEnviar
          );
        } else {
          resp = await comunidadService.crearComunidad(datosParaEnviar);
        }

        if (resp.success) {
          setResult(
            editData ? "Actualizado correctamente" : "Creado correctamente"
          );
          resetForm();
          setTimeout(() => setOpen(false), 1200);
          const eventName = editData
            ? "comunidadActualizada"
            : "comunidadCreada";
          const payload = resp.comunidad || resp.post || datosParaEnviar;
          window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
        } else {
          if (resp.errors) {
            setErrors(resp.errors);
            setResult(resp.msg || "Error en validacion");
          } else {
            setResult(resp.msg || "Error al procesar");
          }
        }
      } catch (error) {
        setResult("Error de conexion al servidor");
      } finally {
        setSubmitting(false);
      }
    };

    const isEditing = !!editData;
    if (!open) return null;

    return (
      <div className="fixed font-medium inset-0 z-[200] flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-white/90 w-full max-w-2xl max-h-[90vh]"
        >
          <form
            onSubmit={handleSubmit}
            className="max-w-6xl w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg bg-white/10 backdrop-blur-sm max-h-[90vh]"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-[#FF7857] transition-colors"
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
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-white text-3xl mt-2 font-medium">
                {isEditing ? "Editar caso de ayuda" : "Crear caso de ayuda"}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {isEditing ? "Modifique el contenido" : "Complete los datos"}
              </p>
            </div>

            <div className="overflow-y-auto mt-4 space-y-4 max-h-[70vh]">
              <div className="mt-4">
                <label className="flex items-left text-sm mb-1 ml-2">
                  Seleccione una imagen
                </label>
                <div className="flex items-center justify-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading || submitting}
                    className="bg-transparent text-gray-500 outline-none text-sm w-full file:h-10 file:ml-2 file:p-3 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF7857] file:text-white hover:file:bg-[#E5674F] text-center"
                  />
                </div>
                {errors.img && (
                  <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                    {errors.img}
                  </p>
                )}

                {form.img && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={form.img}
                      alt="Vista previa"
                      className="w-40 h-40 object-cover rounded-2xl border border-white/50"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="flex items-left text-sm mb-1 ml-2">
                  Ingrese el titulo
                </label>
                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Titulo *"
                    value={form.titulo}
                    onChange={handleChange}
                    disabled={submitting}
                    className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                  />
                </div>
                {errors.titulo && (
                  <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                    {errors.titulo}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="flex items-left text-sm mb-1 ml-2">
                  Ingrese el contenido
                </label>
                <div className="flex items-center w-full bg-white border border-gray-300/80 min-h-12 rounded-2xl overflow-hidden p-4 gap-2">
                  <textarea
                    name="contenido"
                    placeholder="Contenido *"
                    value={form.contenido}
                    onChange={handleChange}
                    disabled={submitting}
                    rows="10"
                    className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full resize-none"
                  />
                </div>
                {errors.contenido && (
                  <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                    {errors.contenido}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="flex items-left text-sm mb-1 ml-2">
                  Seleccione la categoria
                </label>
                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    disabled={submitting}
                    className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
                  >
                    <option value="ALERTA">Alerta</option>
                    <option value="HISTORIA">Historia</option>
                  </select>
                </div>
                {errors.categoria && (
                  <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                    {errors.categoria}
                  </p>
                )}
              </div>

              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? isEditing
                    : isEditing
                    ? "Actualizar caso"
                    : "Crear caso"}
                </button>
              </div>

              {result && <p className="mt-2 text-white/80 text-sm">{result}</p>}
            </div>
          </form>
        </motion.div>
      </div>
    );
  },
};
