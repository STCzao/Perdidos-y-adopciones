"use client";
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

    const {
      form,
      errors,
      setErrors,
      handleChange,
      resetForm,
      setFormImage,
      razasPorEspecie,
    } = usePublicacionForm(editData);

    const { handleImageUpload: uploadImage } = useImageUpload(setFormImage, setErrors);

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
        setResult(isEditing ? "Actualizando publicación..." : "Creando publicación...");

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

        let response;
        if (isEditing && editData?._id) {
          response = await publicacionesService.actualizarPublicacion(
            editData._id,
            datosParaEnviar,
          );
        } else {
          response = await publicacionesService.crearPublicacion(datosParaEnviar);
        }

        if (response.success) {
          const eventName = isEditing ? "publicacionActualizada" : "publicacionCreada";
          const payload = response.publicacion || response.data || datosParaEnviar;
          window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));

          setResult(
            isEditing
              ? "¡Publicación actualizada exitosamente!"
              : "¡Publicación creada exitosamente!",
          );
          resetForm();
          setTimeout(() => setOpen(false), 2000);
        } else if (response.errors) {
          setErrors(response.errors);
          setResult(response.msg || "Error en validación");
        } else {
          setResult(response.msg || "Error al procesar la publicación");
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
      <ModalShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex max-h-[80vh] w-full max-w-2xl flex-col items-center text-white"
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
                {isEditing ? "Editar publicación" : "Crear publicación"}
              </h1>
              <p className="mt-1 text-sm text-white/80">
                {isEditing ? "Modificá los datos del animal" : "Completá los datos del animal"}
              </p>
            </div>

            <div className="mt-4 space-y-4 overflow-y-auto pr-2">
              <CommonFields
                form={form}
                handleChange={handleChange}
                errors={errors}
                submitting={submitting}
                handleImageUpload={handleImageUploadWrapper}
                uploading={uploading}
                razasPorEspecie={razasPorEspecie}
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
                    ? "Actualizar publicación"
                    : "Crear publicación"}
              </button>
            </div>

            {result && <p className="mt-2 text-sm text-white/80">{result}</p>}
          </form>
        </motion.div>
      </ModalShell>
    );
  },
};
