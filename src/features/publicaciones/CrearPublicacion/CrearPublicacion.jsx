import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../../components/ui/ModalShell";
import { publicacionesService } from "../../../services/publicaciones";
import { usePublicacionForm } from "./usePublicacionForm";
import { useImageUpload } from "./useImageUpload";
import { validateForm } from "./FormValidation";
import { CommonFields } from "./CommonFields";
import { PerdidoEncontradoFields } from "./PerdidoEncontradoFields";
import { AdopcionFields } from "./AdopcionFields";
import { PUBLICACION_SIZE_FIELD } from "../utils/publicacionFields";

let modalControl;

const shellClassName =
  "relative max-h-[92vh] overflow-y-auto rounded-[1.7rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] p-4 shadow-[0_30px_90px_rgba(31,20,14,0.24)] sm:p-6";

const sectionClassName =
  "rounded-[1.35rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] p-5 shadow-[0_16px_45px_rgba(57,42,31,0.08)]";

const StatusMessage = ({ message, isError }) => {
  if (!message) return null;

  return (
    <p className={`mt-4 text-sm ${isError ? "text-[#9c4d3a]" : "text-[#4d6a2e]"}`}>
      {message}
    </p>
  );
};

export const CrearPublicacion = {
  openModal: (publicacion = null) => {
    modalControl?.setEditData(publicacion);
    modalControl?.setOpen(true);
  },
  Component: () => {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editData, setEditData] = useState(null);

    const {
      form,
      errors,
      setErrors,
      handleChange,
      resetForm,
      setFormImage,
      razasPorEspecie,
    } = usePublicacionForm(editData);

    const { handleImageUpload: uploadImage, uploading } = useImageUpload(
      setFormImage,
      setErrors,
    );

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

      window.addEventListener("openCrearPublicacion", handleOpen);
      return () => window.removeEventListener("openCrearPublicacion", handleOpen);
    }, []);

    const handleClose = () => {
      resetForm();
      setResult("");
      setSubmitting(false);
      setEditData(null);
      setOpen(false);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (submitting) return;

      const { valid, errors: validationErrors } = validateForm(form);
      setErrors(validationErrors);
      if (!valid) return;

      try {
        setSubmitting(true);
        setResult(isEditing ? "Actualizando publicacion..." : "Creando publicacion...");

        const datosParaEnviar = {
          tipo: form.tipo,
          especie: form.especie,
          raza: form.raza,
          sexo: form.sexo,
          [PUBLICACION_SIZE_FIELD]: form[PUBLICACION_SIZE_FIELD],
          color: form.color,
          whatsapp: form.whatsapp,
          img: form.img,
          ...(form.detalles?.trim() && { detalles: form.detalles }),
        };

        if (isEditing && form.estado) {
          datosParaEnviar.estado = form.estado;
        }

        if (form.tipo === "PERDIDO" || form.tipo === "ADOPCION") {
          datosParaEnviar.nombreanimal = form.nombreanimal;
          datosParaEnviar.edad = form.edad;
        }

        if (form.tipo === "ADOPCION") {
          datosParaEnviar.afinidad = form.afinidad;
          datosParaEnviar.afinidadanimales = form.afinidadanimales;
          datosParaEnviar.energia = form.energia;
          datosParaEnviar.castrado = !!form.castrado;
        }

        if (form.tipo === "PERDIDO" || form.tipo === "ENCONTRADO") {
          datosParaEnviar.localidad = form.localidad;
          datosParaEnviar.lugar = form.lugar;
          datosParaEnviar.fecha = form.fecha;
        }

        const response =
          isEditing && editData?._id
            ? await publicacionesService.actualizarPublicacion(editData._id, datosParaEnviar)
            : await publicacionesService.crearPublicacion(datosParaEnviar);

        if (response.success) {
          const eventName = isEditing ? "publicacionActualizada" : "publicacionCreada";
          const payload = response.publicacion || response.data || datosParaEnviar;
          window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));

          setResult(
            isEditing
              ? "Publicacion actualizada correctamente."
              : "Publicacion creada correctamente.",
          );
          resetForm();
          setTimeout(() => {
            setEditData(null);
            setOpen(false);
          }, 1800);
        } else if (response.errors) {
          setErrors(response.errors);
          setResult(response.msg || "Error en validacion");
        } else {
          setResult(response.msg || "Error al procesar la publicacion");
        }
      } catch (error) {
        console.error(error);
        setResult("Error de conexion al servidor");
      } finally {
        setSubmitting(false);
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
              aria-label="Cerrar formulario de publicacion"
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
                Publicaciones
              </span>
              <h1 className="font-editorial mt-3 text-[2rem] leading-[0.96] text-[#231a15] sm:text-[2.35rem]">
                {isEditing ? "Editar publicacion" : "Crear publicacion"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b4d43]">
                {isEditing
                  ? "Actualiza la informacion del caso para mantenerla clara, completa y confiable."
                  : "Carga un caso con informacion precisa para que la comunidad pueda ayudar mas rapido."}
              </p>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <section className={sectionClassName}>
                  <div className="flex flex-col gap-1">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                      Datos principales
                    </p>
                    <h2 className="text-lg font-semibold text-[#271d17]">
                      Informacion del animal
                    </h2>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <CommonFields
                      form={form}
                      handleChange={handleChange}
                      errors={errors}
                      submitting={submitting}
                      handleImageUpload={uploadImage}
                      uploading={uploading}
                      razasPorEspecie={razasPorEspecie}
                    />
                  </div>
                </section>

                {(form.tipo === "PERDIDO" || form.tipo === "ENCONTRADO") && (
                  <section className={sectionClassName}>
                    <div className="flex flex-col gap-1">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                        Ubicacion del caso
                      </p>
                      <h2 className="text-lg font-semibold text-[#271d17]">
                        Referencias de perdida o hallazgo
                      </h2>
                    </div>

                    <div className="mt-5 grid gap-4">
                      <PerdidoEncontradoFields
                        form={form}
                        handleChange={handleChange}
                        errors={errors}
                        submitting={submitting}
                      />
                    </div>
                  </section>
                )}

                {form.tipo === "ADOPCION" && (
                  <section className={sectionClassName}>
                    <div className="flex flex-col gap-1">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                        Convivencia
                      </p>
                      <h2 className="text-lg font-semibold text-[#271d17]">
                        Perfil del animal en adopcion
                      </h2>
                    </div>

                    <div className="mt-5 grid gap-4">
                      <AdopcionFields
                        form={form}
                        handleChange={handleChange}
                        errors={errors}
                        submitting={submitting}
                      />
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-5">
                <section className={sectionClassName}>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                    Recomendaciones
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-[#271d17]">
                    Antes de publicar
                  </h2>

                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#6d5a4f]">
                    <p>Usa una foto reciente y nitida donde el animal se vea completo.</p>
                    <p>Describe manchas, collar, heridas o cualquier rasgo que ayude a reconocerlo.</p>
                    <p>Si es un caso de perdida o hallazgo, agrega la zona mas precisa posible.</p>
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
                        ? "Estas editando una publicacion existente. Guarda solo cuando hayas revisado todos los cambios."
                        : "La publicacion se creara cuando todos los campos obligatorios esten completos."}
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
                          ? "Actualizar publicacion"
                          : "Crear publicacion"}
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
