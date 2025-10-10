"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { publicacionesService } from "../../services/publicaciones";

let modalControl;

export const CrearPublicacion = {
  openModal: () => modalControl?.setOpen(true),
  Component: () => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
      titulo: "",
      descripcion: "",
      tipo: "",
      raza: "",
      lugar: "",
      fecha: "",
      sexo: "",
      tamaño: "",
      color: "",
      edad: "",
      detalles: "",
      afinidad: "",
      energia: "",
      castrado: false,
      whatsapp: "",
      img: "",
    });
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    modalControl = { setOpen };

    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      };
    }, [open]);

    React.useEffect(() => {
      const handleOpen = () => setOpen(true);
      window.addEventListener("openCrearPublicacion", handleOpen);
      return () =>
        window.removeEventListener("openCrearPublicacion", handleOpen);
    }, []);

    const resetForm = () => {
      setForm({
        titulo: "",
        descripcion: "",
        tipo: "",
        raza: "",
        lugar: "",
        fecha: "",
        sexo: "",
        tamaño: "",
        color: "",
        edad: "",
        detalles: "",
        afinidad: "",
        energia: "",
        castrado: false,
        whatsapp: "",
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
      const { name, value, type, checked } = e.target;

      if (name === "tipo") {
        setForm((prev) => ({
          ...prev,
          [name]: value,
          lugar: "",
          fecha: "",
          afinidad: "",
          energia: "",
          castrado: false,
        }));
        // Limpiar errores al cambiar tipo
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.lugar;
          delete newErrors.fecha;
          delete newErrors.afinidad;
          delete newErrors.energia;
          return newErrors;
        });
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
        // Limpiar error del campo al escribir
        if (errors[name]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Limpiar error anterior
      setErrors((prev) => ({ ...prev, img: "" }));

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, img: "Solo se permiten imágenes" }));
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
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          setForm((prev) => ({ ...prev, img: data.secure_url }));
        } else {
          setErrors((prev) => ({ ...prev, img: "Error al subir imagen" }));
        }
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        setErrors((prev) => ({ ...prev, img: "Error de conexión" }));
      } finally {
        setUploading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (submitting) return;

      let valid = true;
      let newErrors = {};

      // VALIDACIONES COMPLETAS DEL BACKEND

      // Título
      if (!form.titulo.trim()) {
        newErrors.titulo = "El título es obligatorio";
        valid = false;
      } else if (form.titulo.trim().length > 60) {
        newErrors.titulo = "El título no puede tener más de 60 caracteres";
        valid = false;
      } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!?()-]+$/.test(form.titulo)) {
        newErrors.titulo = "El título contiene caracteres no válidos";
        valid = false;
      }

      // Descripción
      if (!form.descripcion.trim()) {
        newErrors.descripcion = "La descripción es obligatoria";
        valid = false;
      } else if (form.descripcion.trim().length > 300) {
        newErrors.descripcion =
          "La descripción no puede tener más de 300 caracteres";
        valid = false;
      }

      // Tipo
      if (!form.tipo) {
        newErrors.tipo = "El tipo de publicación es obligatorio";
        valid = false;
      }

      // Raza
      if (!form.raza.trim()) {
        newErrors.raza = "La raza es obligatoria";
        valid = false;
      } else if (form.raza.trim().length > 30) {
        newErrors.raza = "La raza no puede tener más de 30 caracteres";
        valid = false;
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.raza)) {
        newErrors.raza = "La raza solo puede contener letras y espacios";
        valid = false;
      }

      // Sexo
      if (!form.sexo) {
        newErrors.sexo = "El sexo es obligatorio";
        valid = false;
      }

      // Tamaño
      if (!form.tamaño) {
        newErrors.tamaño = "El tamaño es obligatorio";
        valid = false;
      }

      // Color
      if (!form.color.trim()) {
        newErrors.color = "El color es obligatorio";
        valid = false;
      } else if (form.color.trim().length > 20) {
        newErrors.color = "El color no puede tener más de 20 caracteres";
        valid = false;
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s/-]+$/.test(form.color)) {
        newErrors.color = "El color contiene caracteres no válidos";
        valid = false;
      }

      // Edad
      if (!form.edad.trim()) {
        newErrors.edad = "La edad es obligatoria";
        valid = false;
      } else if (form.edad.trim().length > 20) {
        newErrors.edad = "La edad no puede tener más de 20 caracteres";
        valid = false;
      }

      // WhatsApp
      if (!form.whatsapp.trim()) {
        newErrors.whatsapp = "El WhatsApp es obligatorio";
        valid = false;
      } else if (form.whatsapp.trim().length > 15) {
        newErrors.whatsapp = "El WhatsApp no puede tener más de 15 caracteres";
        valid = false;
      } else if (!/^\+?[0-9\s\-()]{10,15}$/.test(form.whatsapp.trim())) {
        newErrors.whatsapp = "El formato de WhatsApp no es válido";
        valid = false;
      }

      // Imagen
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

      // Detalles
      if (form.detalles.trim().length > 150) {
        newErrors.detalles =
          "Los detalles no pueden tener más de 150 caracteres";
        valid = false;
      }

      // Validaciones específicas por tipo
      if (form.tipo === "PERDIDO" || form.tipo === "ENCONTRADO") {
        // Lugar
        if (!form.lugar.trim()) {
          newErrors.lugar = "El lugar es obligatorio";
          valid = false;
        } else if (form.lugar.trim().length > 50) {
          newErrors.lugar = "El lugar no puede tener más de 50 caracteres";
          valid = false;
        }

        // Fecha
        if (!form.fecha.trim()) {
          newErrors.fecha = "La fecha es obligatoria";
          valid = false;
        }
      }

      if (form.tipo === "ADOPCION") {
        if (!form.afinidad) {
          newErrors.afinidad = "La afinidad con niños es obligatoria";
          valid = false;
        }
        if (!form.energia) {
          newErrors.energia = "El nivel de energía es obligatorio";
          valid = false;
        }
      }

      setErrors(newErrors);
      if (!valid) return;

      try {
        setSubmitting(true);
        setResult("Creando publicación...");

        const datosParaEnviar = {
          titulo: form.titulo,
          descripcion: form.descripcion,
          tipo: form.tipo,
          raza: form.raza,
          sexo: form.sexo,
          tamaño: form.tamaño,
          color: form.color,
          edad: form.edad,
          whatsapp: form.whatsapp,
          img: form.img,
          detalles: form.detalles || "",
        };

        if (form.tipo === "PERDIDO" || form.tipo === "ENCONTRADO") {
          datosParaEnviar.lugar = form.lugar;
          datosParaEnviar.fecha = form.fecha;
        }

        if (form.tipo === "ADOPCION") {
          datosParaEnviar.afinidad = form.afinidad;
          datosParaEnviar.energia = form.energia;
          datosParaEnviar.castrado = form.castrado;
        }

        const result = await publicacionesService.crearPublicacion(
          datosParaEnviar
        );

        if (result.success) {
          setResult("¡Publicación creada exitosamente!");
          resetForm();
          setTimeout(() => setOpen(false), 2000);
        } else {
          // Manejar errores del backend
          if (result.errors) {
            setErrors(result.errors);
            setResult(result.msg || "Error en validación");
          } else {
            setResult(result.msg || "Error al crear publicación");
          }
        }
      } catch (error) {
        console.error(error);
        setResult("Error de conexión al servidor");
      } finally {
        setSubmitting(false);
      }
    };

    if (!open) return null;

    return (
      <div className="fixed font-medium inset-0 z-[200] flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-white/90 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-2xl w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg bg-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-white text-3xl mt-2 font-medium">
                Crear publicación
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Complete los datos de la mascota
              </p>
            </div>

            {/* Tipo de Publicación */}
            <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                disabled={submitting}
                className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
              >
                <option value="">Tipo de Publicación *</option>
                <option value="PERDIDO">Perdido</option>
                <option value="ENCONTRADO">Encontrado</option>
                <option value="ADOPCION">Adopción</option>
              </select>
            </div>
            {errors.tipo && (
              <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                {errors.tipo}
              </p>
            )}

            {/* Imagen */}
            <div className="flex items-center justify-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden gap-2">
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
                  className="w-32 h-32 object-cover rounded-2xl border border-white/50"
                />
              </div>
            )}

            {/* Título */}
            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <input
                type="text"
                name="titulo"
                placeholder="Título *"
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

            {/* Descripción */}
            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 min-h-12 rounded-2xl overflow-hidden p-4 gap-2">
              <textarea
                name="descripcion"
                placeholder="Descripción *"
                value={form.descripcion}
                onChange={handleChange}
                disabled={submitting}
                rows="3"
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full resize-none"
              />
            </div>
            {errors.descripcion && (
              <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                {errors.descripcion}
              </p>
            )}

            {/* WhatsApp */}
            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <input
                type="text"
                name="whatsapp"
                placeholder="WhatsApp de Contacto *"
                value={form.whatsapp}
                onChange={handleChange}
                disabled={submitting}
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              />
            </div>
            {errors.whatsapp && (
              <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                {errors.whatsapp}
              </p>
            )}

            {/* Campos para PERDIDO/ENCONTRADO */}
            {(form.tipo === "PERDIDO" || form.tipo === "ENCONTRADO") && (
              <>
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <input
                    type="text"
                    name="lugar"
                    placeholder="Lugar *"
                    value={form.lugar}
                    onChange={handleChange}
                    disabled={submitting}
                    className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                  />
                </div>
                {errors.lugar && (
                  <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                    {errors.lugar}
                  </p>
                )}

                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    disabled={submitting}
                    className="bg-transparent pr-8 text-gray-500 outline-none text-sm w-full h-full"
                  />
                </div>
                {errors.fecha && (
                  <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                    {errors.fecha}
                  </p>
                )}
              </>
            )}

            {/* Raza y Color */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <input
                  type="text"
                  name="raza"
                  placeholder="Raza *"
                  value={form.raza}
                  onChange={handleChange}
                  disabled={submitting}
                  className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                />
              </div>
              {errors.raza && (
                <p className="text-red-400 text-xs mt-1 text-left w-full px-4 col-span-2">
                  {errors.raza}
                </p>
              )}

              <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <input
                  type="text"
                  name="color"
                  placeholder="Color *"
                  value={form.color}
                  onChange={handleChange}
                  disabled={submitting}
                  className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                />
              </div>
              {errors.color && (
                <p className="text-red-400 text-xs mt-1 text-left w-full px-4 col-span-2">
                  {errors.color}
                </p>
              )}
            </div>

            {/* Sexo, Tamaño y Edad */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <select
                  name="sexo"
                  value={form.sexo}
                  onChange={handleChange}
                  disabled={submitting}
                  className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
                >
                  <option value="">Sexo *</option>
                  <option value="MACHO">Macho</option>
                  <option value="HEMBRA">Hembra</option>
                </select>
              </div>

              <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <select
                  name="tamaño"
                  value={form.tamaño}
                  onChange={handleChange}
                  disabled={submitting}
                  className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
                >
                  <option value="">Tamaño *</option>
                  <option value="PEQUEÑO">Pequeño</option>
                  <option value="MEDIANO">Mediano</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>

              <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <input
                  type="text"
                  name="edad"
                  placeholder="Edad *"
                  value={form.edad}
                  onChange={handleChange}
                  disabled={submitting}
                  className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                />
              </div>
            </div>

            {/* Mostrar errores de los campos grid */}
            {(errors.sexo || errors.tamaño || errors.edad) && (
              <div className="grid grid-cols-3 gap-4 mt-1">
                {errors.sexo && (
                  <p className="text-red-400 text-xs text-left px-4">
                    {errors.sexo}
                  </p>
                )}
                {errors.tamaño && (
                  <p className="text-red-400 text-xs text-left px-4">
                    {errors.tamaño}
                  </p>
                )}
                {errors.edad && (
                  <p className="text-red-400 text-xs text-left px-4">
                    {errors.edad}
                  </p>
                )}
              </div>
            )}

            {/* Campos para ADOPCION */}
            {form.tipo === "ADOPCION" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <select
                    name="afinidad"
                    value={form.afinidad}
                    onChange={handleChange}
                    disabled={submitting}
                    className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
                  >
                    <option value="">Afinidad con Niños *</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>

                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <select
                    name="energia"
                    value={form.energia}
                    onChange={handleChange}
                    disabled={submitting}
                    className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
                  >
                    <option value="">Nivel de Energía *</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>

                <div className="col-span-2 flex items-center justify-center mt-2">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      name="castrado"
                      checked={form.castrado}
                      onChange={handleChange}
                      disabled={submitting}
                      className="mr-2 w-4 h-4 text-[#FF7857] bg-white border-white rounded focus:ring-[#FF7857]"
                    />
                    ¿Está castrado?
                  </label>
                </div>

                {/* Mostrar errores de adopción */}
                {(errors.afinidad || errors.energia) && (
                  <div className="col-span-2 grid grid-cols-2 gap-4 mt-1">
                    {errors.afinidad && (
                      <p className="text-red-400 text-xs text-left px-4">
                        {errors.afinidad}
                      </p>
                    )}
                    {errors.energia && (
                      <p className="text-red-400 text-xs text-left px-4">
                        {errors.energia}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Detalles Adicionales */}
            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 min-h-12 rounded-2xl overflow-hidden p-4 gap-2">
              <textarea
                name="detalles"
                placeholder="Detalles Adicionales"
                value={form.detalles}
                onChange={handleChange}
                disabled={submitting}
                rows="2"
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full resize-none"
              />
            </div>
            {errors.detalles && (
              <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                {errors.detalles}
              </p>
            )}

            {/* Resultado */}
            {result && (
              <p
                className={`text-center mt-4 ${
                  result.includes("éxito") ? "text-green-400" : "text-red-400"
                }`}
              >
                {result}
              </p>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="px-6 py-2 rounded-full text-white bg-red-500  transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors disabled:opacity-50"
              >
                {submitting ? "Creando..." : "Crear Publicación"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    );
  },
};
