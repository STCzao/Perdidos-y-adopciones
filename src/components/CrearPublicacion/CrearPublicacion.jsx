"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { publicacionesService } from "../../services/publicaciones";
import { usePublicacionForm } from "./usePublicacionForm";
import { useImageUpload } from "./useImageUpload";
import { validateForm } from "./FormValidation";
import { CommonFields } from "./CommonFields";
import { PerdidoEncontradoFields } from "./PerdidoEncontradoFields";
import { AdopcionFields } from "./AdopcionFields";

let modalControl;

export const CrearPublicacion = {
  openModal: (publicacion = null) => {
    modalControl?.setEditData(publicacion);
    modalControl?.setOpen(true);
  },
  Component: () => {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editData, setEditData] = useState(null);

    const { form, errors, setErrors, handleChange, resetForm, setFormImage } =
      usePublicacionForm(editData);

    const { handleImageUpload: uploadImage } = useImageUpload(setFormImage, setErrors);

    modalControl = { setOpen, setEditData };

    // Bloquear scroll cuando el modal está abierto
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
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      };
    }, [open]);

    // Event listener para abrir modal
    useEffect(() => {
      const handleOpen = () => setOpen(true);
      window.addEventListener("openCrearPublicacion", handleOpen);
      return () => window.removeEventListener("openCrearPublicacion", handleOpen);
    }, []);

    const handleClose = () => {
      resetForm();
      setResult("");
      setSubmitting(false);
      setOpen(false);
    };

    const handleImageUploadWrapper = async (e) => {
      setUploading(true);
      await uploadImage(e);
      setUploading(false);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (submitting) return;

      const { valid, errors: validationErrors } = validateForm(form);

      setErrors(validationErrors);
      if (!valid) return;

      try {
        setSubmitting(true);
        setResult(
          isEditing ? "Actualizando publicación..." : "Creando publicación..."
        );

        const datosParaEnviar = {
          tipo: form.tipo,
          especie: form.especie,
          raza: form.raza,
          sexo: form.sexo,
          tamaño: form.tamaño,
          color: form.color,
          whatsapp: form.whatsapp,
          img: form.img,
          ...(form.detalles?.trim() && { detalles: form.detalles }),
        };

        // Solo agregar estado si es edición
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

        let result;
        if (isEditing && editData?._id) {
          result = await publicacionesService.actualizarPublicacion(
            editData._id,
            datosParaEnviar
          );
        } else {
          result = await publicacionesService.crearPublicacion(datosParaEnviar);
        }

        if (result.success) {
          setResult(
            isEditing
              ? "¡Publicación actualizada exitosamente!"
              : "¡Publicación creada exitosamente!"
          );
          resetForm();
          setTimeout(() => setOpen(false), 2000);
          window.location.reload();

          const eventName = isEditing
            ? "publicacionActualizada"
            : "publicacionCreada";
          const payload = result.publicacion || result.data || datosParaEnviar;
          window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
        } else {
          if (result.errors) {
            setErrors(result.errors);
            setResult(result.msg || "Error en validación");
          } else {
            setResult(result.msg || "Error al procesar publicación");
          }
        }
      } catch (error) {
        console.error(error);
        setResult("Error de conexión al servidor");
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
          className="flex flex-col items-center text-white w-full max-w-2xl max-h-[80vh]"
        >
          <form
            onSubmit={handleSubmit}
            className="max-w-6xl w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg bg-white/10 backdrop-blur-sm flex flex-col max-h-[80vh]"
          >
            <button
              onClick={handleClose}
              type="button"
              className="absolute right-4 top-4 text-white hover:text-[#FF7857] transition-colors delay-100 duration-300"
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
                {isEditing ? "Editar publicación" : "Crear publicación"}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {isEditing
                  ? "Modifique los datos del animal"
                  : "Complete los datos del animal"}
              </p>
            </div>

            <div className="overflow-y-auto mt-4 space-y-4 pr-2">
              <CommonFields
                form={form}
                handleChange={handleChange}
                errors={errors}
                submitting={submitting}
                handleImageUpload={handleImageUploadWrapper}
                uploading={uploading}
              />

              <PerdidoEncontradoFields
                form={form}
                handleChange={handleChange}
                errors={errors}
                submitting={submitting}
              />

              <AdopcionFields
                form={form}
                handleChange={handleChange}
                errors={errors}
                submitting={submitting}
              />
            </div>

            {/* Botón de envío */}
            <div className="col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-full text-white bg-white/40 border border-white/70 hover:bg-[#FF7857] transition-colors delay-100 duration-300 disabled:opacity-50"
              >
                {submitting
                  ? editData
                    ? "Actualizando..."
                    : "Creando..."
                  : editData
                    ? "Actualizar publicación"
                    : "Crear publicación"}
              </button>
            </div>

            {result && <p className="mt-2 text-white/80 text-sm">{result}</p>}
          </form>
        </motion.div>
      </div>
    );
  },
};
