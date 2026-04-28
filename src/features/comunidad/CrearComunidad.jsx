import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../components/ui/ModalShell";
import { useCloudinaryWidget } from "../../hooks/useCloudinaryWidget";
import { comunidadService } from "../../services/comunidad";
import { withRequestIdMessage } from "../../services/serviceUtils";

let modalControl;

const shellClassName =
  "relative max-h-[92vh] overflow-y-auto rounded-[1.7rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] p-4 shadow-[0_30px_90px_rgba(31,20,14,0.24)] sm:p-6";

const sectionClassName =
  "rounded-[1.35rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] p-5 shadow-[0_16px_45px_rgba(57,42,31,0.08)]";

const labelClassName = "text-sm font-semibold text-[#352820]";
const inputClassName =
  "mt-2 w-full rounded-[1.1rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-4 py-3 text-sm text-[#3d332d] outline-none shadow-[0_12px_30px_rgba(59,43,34,0.06)] transition-colors duration-300 placeholder:text-[#8f7f74] focus:border-[color:var(--shell-accent-strong)]/45 focus:ring-2 focus:ring-[color:var(--shell-accent-strong)]/15 disabled:cursor-not-allowed disabled:opacity-60";
const errorClassName = "mt-2 text-xs text-[#a84632]";

const StatusMessage = ({ message, isError }) => {
  if (!message) return null;

  return (
    <p className={`mt-4 text-sm ${isError ? "text-[#9c4d3a]" : "text-[#4d6a2e]"}`}>
      {message}
    </p>
  );
};

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
    const [submitting, setSubmitting] = useState(false);
    const [, setLoading] = useState(false);
    const [editData, setEditData] = useState(null);
    const { openWidget, uploading } = useCloudinaryWidget();

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
      const handleOpen = () => {
        setEditData(null);
        setOpen(true);
      };

      window.addEventListener("openCrearComunidad", handleOpen);
      return () => window.removeEventListener("openCrearComunidad", handleOpen);
    }, []);

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

    useEffect(() => {
      if (editData) {
        setForm({
          titulo: editData.titulo || "",
          contenido: editData.contenido || "",
          categoria: editData.categoria || "HISTORIA",
          img: editData.img || "",
        });
        setErrors({});
        setResult("");
        return;
      }

      resetForm();
    }, [editData]);

    const handleClose = () => {
      resetForm();
      setEditData(null);
      setOpen(false);
    };

    const clearFieldError = (fieldName) => {
      setErrors((current) => {
        if (!current[fieldName]) return current;

        const next = { ...current };
        delete next[fieldName];
        return next;
      });
    };

    const handleChange = (event) => {
      const { name, value } = event.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      clearFieldError(name);
    };

    const handleImageUpload = () =>
      openWidget("comunidad", {
        onSuccess: (url) => {
          setForm((prev) => ({ ...prev, img: url }));
          clearFieldError("img");
        },
        onError: () =>
          setErrors((prev) => ({
            ...prev,
            img: "Error al subir la imagen. Intentá nuevamente.",
          })),
      });

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (submitting) return;

      let valid = true;
      const newErrors = {};

      if (!form.titulo.trim()) {
        newErrors.titulo = "El titulo es obligatorio";
        valid = false;
      } else if (form.titulo.trim().length > 80) {
        newErrors.titulo = "El titulo no puede contener mas de 80 caracteres";
        valid = false;
      }

      if (!form.contenido.trim()) {
        newErrors.contenido = "El contenido es obligatorio";
        valid = false;
      } else if (form.contenido.trim().length > 3000) {
        newErrors.contenido = "El contenido no puede contener mas de 3000 caracteres";
        valid = false;
      }

      if (!form.categoria) {
        newErrors.categoria = "La categoria es obligatoria";
        valid = false;
      } else if (!["HISTORIA", "ALERTA"].includes(form.categoria)) {
        newErrors.categoria = "La categoria debe ser HISTORIA o ALERTA";
        valid = false;
      }

      if (!form.img.trim()) {
        newErrors.img = "La imagen es obligatoria";
        valid = false;
      } else if (!/^https:\/\/res\.cloudinary\.com\/[^/]+\/.+/.test(form.img)) {
        newErrors.img = "La URL de imagen no es valida";
        valid = false;
      }

      setErrors(newErrors);
      if (!valid) return;

      try {
        setSubmitting(true);
        setLoading(true);
        setResult(editData ? "Actualizando caso..." : "Creando caso...");

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
          setResult(editData ? "Caso actualizado correctamente." : "Caso creado correctamente.");
          resetForm();
          setTimeout(() => {
            setEditData(null);
            setOpen(false);
          }, 1400);

          const eventName = editData ? "comunidadActualizada" : "comunidadCreada";
          const payload = response.comunidad || datosParaEnviar;
          window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
        } else if (response.errors) {
          setErrors(response.errors);
          setResult(withRequestIdMessage(response.msg || "Error en validacion", response.requestId));
        } else {
          setResult(withRequestIdMessage(response.msg || "Error al procesar", response.requestId));
        }
      } catch {
        setResult("Error de conexion al servidor");
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    };

    const isEditing = !!editData;
    const isResultError =
      result.includes("Error") || result.includes("error") || result.includes("validacion");

    if (!open) return null;

    return (
      <ModalShell className="p-3 sm:p-5">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full max-w-5xl"
        >
          <form onSubmit={handleSubmit} className={shellClassName}>
            <button
              onClick={handleClose}
              type="button"
              className="absolute right-4 top-4 cursor-pointer rounded-full border border-[#d1c2b5] bg-white/70 p-2 text-[#5c4b42] transition-colors duration-200 hover:bg-white"
              disabled={submitting}
              aria-label="Cerrar formulario comunitario"
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

            <div className="pr-12">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#8d6e5c]">
                Comunidad
              </span>
              <h1 className="font-editorial mt-3 text-[2rem] leading-[0.96] text-[#231a15] sm:text-[2.35rem]">
                {isEditing ? "Editar caso de ayuda" : "Crear caso de ayuda"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b4d43]">
                {isEditing
                  ? "Ajusta el contenido para que el mensaje siga siendo claro, actual y accionable."
                  : "Comparte una alerta o una historia con el contexto necesario para movilizar a la comunidad."}
              </p>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <section className={sectionClassName}>
                  <div className="flex flex-col gap-1">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                      Contenido principal
                    </p>
                    <h2 className="text-lg font-semibold text-[#271d17]">
                      Informacion del caso
                    </h2>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <label className={labelClassName}>
                      Titulo
                      <input
                        type="text"
                        name="titulo"
                        placeholder="Resume el caso en una frase clara"
                        value={form.titulo}
                        onChange={handleChange}
                        disabled={submitting}
                        maxLength={80}
                        className={inputClassName}
                      />
                      {errors.titulo && <p className={errorClassName}>{errors.titulo}</p>}
                    </label>

                    <label className={labelClassName}>
                      Categoria
                      <select
                        name="categoria"
                        value={form.categoria}
                        onChange={handleChange}
                        disabled={submitting}
                        className={inputClassName}
                      >
                        <option value="">Selecciona la categoria del caso</option>
                        <option value="ALERTA">Alerta</option>
                        <option value="HISTORIA">Historia</option>
                      </select>
                      {errors.categoria && <p className={errorClassName}>{errors.categoria}</p>}
                    </label>

                    <label className={labelClassName}>
                      Contenido
                      <textarea
                        name="contenido"
                        placeholder="Explica que paso, por que es importante y como puede ayudar la comunidad."
                        value={form.contenido}
                        onChange={handleChange}
                        disabled={submitting}
                        rows="10"
                        className={`${inputClassName} resize-y`}
                      />
                      {errors.contenido && <p className={errorClassName}>{errors.contenido}</p>}
                    </label>
                  </div>
                </section>

                <section className={sectionClassName}>
                  <div className="flex flex-col gap-1">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                      Imagen
                    </p>
                    <h2 className="text-lg font-semibold text-[#271d17]">
                      Recurso visual del caso
                    </h2>
                  </div>

                  <label className={labelClassName}>
                    Imagen
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploading || submitting}
                      className={`${inputClassName} flex cursor-pointer items-center gap-3 border-dashed text-left hover:border-[color:var(--shell-accent-strong)]/35 hover:bg-white`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        className="h-5 w-5 shrink-0 text-[#816959]"
                        aria-hidden="true"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-[#4f4037]">
                          {uploading
                            ? "Subiendo..."
                            : form.img
                              ? "Cambiar imagen del caso"
                              : "Seleccionar imagen"}
                        </p>
                        <p className="mt-1 text-xs text-[#7b6a5e]">
                          JPG, PNG o WEBP. Maximo 5 MB.
                        </p>
                      </div>
                    </button>
                  </label>

                  {errors.img && <p className={errorClassName}>{errors.img}</p>}

                  {form.img && (
                    <div className="mt-4 overflow-hidden rounded-[1.1rem] border border-[#2f241d]/10 bg-white/70 p-2">
                      <img
                        src={form.img}
                        alt="Vista previa del caso comunitario"
                        className="h-56 w-full rounded-[0.9rem] object-cover"
                      />
                    </div>
                  )}
                </section>
              </div>

              <div className="space-y-5">
                <section className={sectionClassName}>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                    Buenas practicas
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-[#271d17]">
                    Como lograr mas claridad
                  </h2>

                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#6d5a4f]">
                    <p>Usa titulos concretos para que el objetivo del caso se entienda de inmediato.</p>
                    <p>Si es una alerta, prioriza datos accionables y evita rodeos innecesarios.</p>
                    <p>Si es una historia, mantene el foco en el mensaje y acompana con una imagen legible.</p>
                  </div>
                </section>

                <section className={sectionClassName}>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                    Estado del formulario
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-[#271d17]">Acciones</h2>

                  <div className="mt-4 rounded-[1rem] border border-[#2f241d]/8 bg-white/70 px-4 py-3">
                    <p className="text-sm leading-relaxed text-[#6d5a4f]">
                      {isEditing
                        ? "Estas editando un caso existente. Revisa titulo, categoria y contenido antes de guardar."
                        : "El caso se publicara cuando completes los campos obligatorios y cargues una imagen valida."}
                    </p>
                  </div>

                  <StatusMessage message={result} isError={isResultError} />

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="cursor-pointer rounded-full bg-[#2a1f19] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#3a2c24] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? isEditing
                          ? "Actualizando..."
                          : "Creando..."
                        : isEditing
                          ? "Actualizar caso"
                          : "Crear caso"}
                    </button>

                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      className="cursor-pointer rounded-full border border-[#cbb9aa] bg-[#fff8f0] px-5 py-2.5 text-sm font-semibold text-[#4e3c31] transition-colors duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </form>
        </motion.div>
      </ModalShell>
    );
  },
};
