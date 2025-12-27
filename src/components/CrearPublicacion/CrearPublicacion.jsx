"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { publicacionesService } from "../../services/publicaciones";

let modalControl;

export const CrearPublicacion = {
  openModal: (publicacion = null) => {
    modalControl?.setEditData(publicacion);
    modalControl?.setOpen(true);
  },
  Component: () => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
      nombreanimal: "",
      especie: "",
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
    const [loading, setLoading] = useState(false);
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
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      };
    }, [open]);

    useEffect(() => {
      const handleOpen = () => setOpen(true);
      window.addEventListener("openCrearPublicacion", handleOpen);
      return () =>
        window.removeEventListener("openCrearPublicacion", handleOpen);
    }, []);

    useEffect(() => {
      if (!editData) {
        resetForm();
        return;
      }

      setForm({
        nombreanimal:
          editData.tipo === "PERDIDO" || editData.tipo === "ADOPCION"
            ? editData.nombreanimal || ""
            : "",
        edad:
          editData.tipo === "PERDIDO" || editData.tipo === "ADOPCION"
            ? editData.edad || ""
            : "",
        especie: editData.especie || "",
        tipo: editData.tipo || "",
        raza: editData.raza || "",
        lugar:
          editData.tipo === "PERDIDO" || editData.tipo === "ENCONTRADO"
            ? editData.lugar || ""
            : "",
        fecha:
          editData.tipo === "PERDIDO" || editData.tipo === "ENCONTRADO"
            ? editData.fecha || ""
            : "",
        sexo: editData.sexo || "",
        tamaño: editData.tamaño || "",
        color: editData.color || "",
        detalles: editData.detalles || "",
        afinidad: editData.tipo === "ADOPCION" ? editData.afinidad || "" : "",
        energia: editData.tipo === "ADOPCION" ? editData.energia || "" : "",
        castrado: editData.tipo === "ADOPCION" ? !!editData.castrado : false,
        whatsapp: editData.whatsapp || "",
        img: editData.img || "",
      });
    }, [editData]);

    const resetForm = () => {
      setForm({
        nombreanimal: "",
        especie: "",
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
          tipo: value,
          nombreanimal: "",
          edad: "",
          lugar: "",
          fecha: "",
          afinidad: "",
          energia: "",
          castrado: false,
        }));

        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.lugar;
          delete newErrors.fecha;
          delete newErrors.afinidad;
          delete newErrors.energia;
          delete newErrors.castrado;
          return newErrors;
        });
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));

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
          { method: "POST", body: formData }
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

      //Valid detalles
      if (form.detalles.trim().length > 251) {
        newErrors.detalles =
          "Los detalles no pueden contener más de 250 caracteres";
        valid = false;
      }

      //Valid tipo
      if (!form.tipo) {
        newErrors.tipo = "El tipo de publicación es obligatorio";
        valid = false;
      }

      //Valid raza
      if (!form.raza.trim()) {
        newErrors.raza = "La raza es obligatoria";
        valid = false;
      } else if (form.raza.trim().length > 41) {
        newErrors.raza = "La raza no puede contener más de 40 caracteres";
        valid = false;
      }

      //Valid sexo
      if (!form.sexo) {
        newErrors.sexo = "El sexo es obligatorio";
        valid = false;
      }

      //Valid tamaño
      if (!form.tamaño) {
        newErrors.tamaño = "El tamaño es obligatorio";
        valid = false;
      }

      //Valid color
      if (!form.color.trim()) {
        newErrors.color = "El color es obligatorio";
        valid = false;
      } else if (form.color.trim().length > 81) {
        newErrors.color = "El color no puede contener más de 80 caracteres";
        valid = false;
      }

      //Valid especie
      if (!form.especie) {
        newErrors.especie = "La especie es obligatoria";
        valid = false;
      }

      // Validacion WhatsApp
      if (!form.whatsapp.trim()) {
        newErrors.whatsapp = "El WhatsApp es obligatorio";
        valid = false;
      } else if (!/^\+?[0-9\s\-()]{10,15}$/.test(form.whatsapp)) {
        newErrors.whatsapp = "El formato de WhatsApp no es válido";
        valid = false;
      } else if (form.whatsapp.length > 16) {
        newErrors.whatsapp = "El WhatsApp no puede tener mas de 15 caracteres";
        valid = false;
      }

      // Validacion Imagen
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

      // VALIDACIONES SEGUN TIPO
      if (form.tipo === "PERDIDO" || form.tipo === "ENCONTRADO") {
        if (!form.lugar.trim()) {
          newErrors.lugar = "El lugar es obligatorio";
          valid = false;
        } else if (form.lugar.trim().length > 81) {
          newErrors.lugar = "El lugar no puede contener más de 80 caracteres";
          valid = false;
        }

        if (!form.fecha.trim()) {
          newErrors.fecha = "La fecha es obligatoria";
          valid = false;
        } else {
          const fechaIngresada = new Date(form.fecha);
          const hoy = new Date();

          // Normalizar
          fechaIngresada.setHours(0, 0, 0, 0);
          hoy.setHours(0, 0, 0, 0);

          if (fechaIngresada > hoy) {
            newErrors.fecha = "La fecha no puede ser mayor al dia actual";
            valid = false;
          }
        }
      }

      //Valid edad
      if (form.tipo === "PERDIDO" || form.tipo === "ADOPCION") {
        if (!form.edad) {
          newErrors.edad = "La edad es obligatoria";
          valid = false;
        }
      }

      //Valid nombre animal
      if (form.tipo === "ADOPCION" || form.tipo === "PERDIDO") {
        if (!form.nombreanimal.trim()) {
          newErrors.nombreanimal = "El nombre del animal es obligatorio";
          valid = false;
        } else if (form.nombreanimal.trim().length > 61) {
          newErrors.nombreanimal =
            "El nombre no puede contener más de 60 caracteres";
          valid = false;
        } else if (form.nombreanimal.trim().length < 3) {
          newErrors.nombreanimal = "El nombre debe tener al menos 3 caracteres";
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

        if (form.tipo === "PERDIDO" || form.tipo === "ADOPCION") {
          datosParaEnviar.nombreanimal = form.nombreanimal;
          datosParaEnviar.edad = form.edad;
        }

        if (form.tipo === "ADOPCION") {
          datosParaEnviar.afinidad = form.afinidad;
          datosParaEnviar.energia = form.energia;
          datosParaEnviar.castrado = !!form.castrado;
        }

        if (form.tipo === "PERDIDO" || form.tipo === "ENCONTRADO") {
          datosParaEnviar.lugar = form.lugar;
          datosParaEnviar.fecha = form.fecha; // "YYYY-MM-DD"
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
          className=" flex flex-col items-center text-white w-full max-w-2xl max-h-[80vh]"
        >
          <form
            onSubmit={handleSubmit}
            className="max-w-6xl w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg bg-white/10 backdrop-blur-sm flex flex-col max-h-[80vh]"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-white hover:text-[#FF7857] transition-colors"
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
                {" "}
                <line x1="18" y1="6" x2="6" y2="18" />{" "}
                <line x1="6" y1="6" x2="18" y2="18" />{" "}
              </svg>
            </button>

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-white text-3xl mt-2 font-medium">
                {isEditing ? "Editar publicación" : "Crear publicación"}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {isEditing
                  ? "Modifique los datos de la mascota"
                  : "Complete los datos de la mascota"}
              </p>
            </div>

            <div className="overflow-y-auto mt-4 space-y-4 pr-2">
              {/* Tipo */}
              <div className="mt-4">
                <label className="flex items-left text-sm mb-1 ml-2">
                  Seleccione el tipo de publicación
                </label>
                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    disabled={submitting}
                    className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
                  >
                    <option value="">
                      Seleccione entre perdido/encontrado/adopción *
                    </option>
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
              </div>

              {/*Nombre del animal*/}
              {(form.tipo === "ADOPCION" || form.tipo === "PERDIDO") && (
                <>
                  <div className="mt-4">
                    <label className="flex items-left text-sm mb-1 ml-2">
                      Nombre de su animal
                    </label>
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <input
                        type="text"
                        name="nombreanimal"
                        placeholder="Ingrese el nombre de su animal *"
                        value={form.nombreanimal}
                        onChange={handleChange}
                        disabled={submitting}
                        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                      />
                    </div>
                    {errors.nombreanimal && (
                      <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                        {errors.nombreanimal}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Imagen */}
              <div className="mt-4">
                <label className="flex items-left text-sm mb-1 ml-2">
                  Imagen
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
                      className="w-32 h-32 object-cover rounded-2xl border border-white/50"
                    />
                  </div>
                )}
              </div>

              {/* Especie */}
              <div className="mt-4">
                <label className="flex items-left text-sm mb-1 ml-2">
                  Especie
                </label>
                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <select
                    name="especie"
                    value={form.especie}
                    onChange={handleChange}
                    disabled={submitting}
                    className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                  >
                    <option value="">
                      Seleccione la especie de su animal *
                    </option>
                    <option value="PERRO">Perro</option>
                    <option value="GATO">Gato</option>
                    <option value="AVE">Ave</option>
                    <option value="CONEJO">Conejo</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                {errors.especie && (
                  <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                    {errors.especie}
                  </p>
                )}
              </div>

              {/* Campo PERDIDO */}

              {(form.tipo === "PERDIDO" || form.tipo === "ADOPCION") && (
                <>
                  <div className="mt-4">
                    <label className="flex text-left items-left text-sm mb-1 ml-2">
                      Edad aproximada de su animal
                    </label>
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <select
                        name="edad"
                        value={form.edad}
                        onChange={handleChange}
                        disabled={submitting}
                        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                      >
                        <option value="">
                          Seleccione la edad de su animal *
                        </option>
                        <option value="SIN ESPECIFICAR">Sin especificar</option>
                        <option value="CACHORRO">
                          Cachorro (hasta 12 meses)
                        </option>
                        <option value="ADULTO">Adulto (1 a 10 años)</option>
                        <option value="MAYOR">Mayor (Más de 10 años)</option>
                      </select>
                    </div>
                    {errors.edad && (
                      <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                        {errors.edad}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Campos PERDIDO/ENCONTRADO */}
              {(form.tipo === "PERDIDO" || form.tipo === "ENCONTRADO") && (
                <>
                  <div className="mt-4">
                    <label className="flex items-left text-sm mb-1 ml-2">
                      Descripción del lugar
                    </label>
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <input
                        type="text"
                        name="lugar"
                        placeholder="Describa el lugar donde perdió/encontró a su animal *"
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
                  </div>

                  <div className="mt-4">
                    <label className="flex items-left text-left text-sm mb-1 ml-2">
                      Fecha en que perdió/encontró a su animal
                    </label>
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
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
                  </div>
                </>
              )}

              {/* Raza, Color, Sexo, Tamaño, Edad */}
              <div className="flex flex-col">
                <div>
                  <label className="flex items-left text-sm mb-1 ml-2">
                    Raza
                  </label>
                  <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <input
                      type="text"
                      name="raza"
                      placeholder="Ingrese la raza de su animal *"
                      value={form.raza}
                      onChange={handleChange}
                      disabled={submitting}
                      className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                    />
                  </div>
                  {errors.raza && (
                    <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                      {errors.raza}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="flex items-left text-sm mb-1 ml-2">
                    Color
                  </label>
                  <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <input
                      type="text"
                      name="color"
                      placeholder="Ingrese el color principal del animal (especifique manchas y otros colores) *"
                      value={form.color}
                      onChange={handleChange}
                      disabled={submitting}
                      className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                    />
                  </div>
                  {errors.color && (
                    <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                      {errors.color}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="flex items-left text-sm mb-1 ml-2">
                    Sexo
                  </label>
                  <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <select
                      name="sexo"
                      value={form.sexo}
                      onChange={handleChange}
                      disabled={submitting}
                      className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                    >
                      <option value="">
                        Seleccione el sexo de su animal *
                      </option>
                      <option value="MACHO">Macho</option>
                      <option value="HEMBRA">Hembra</option>
                      <option value="DESCONOZCO">Desconozco</option>
                    </select>
                  </div>
                  {errors.sexo && (
                    <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                      {errors.sexo}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="flex items-left text-sm mb-1 ml-2">
                    Tamaño
                  </label>
                  <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <select
                      name="tamaño"
                      value={form.tamaño}
                      onChange={handleChange}
                      disabled={submitting}
                      className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                    >
                      <option value="">
                        Seleccione el tamaño de su animal *
                      </option>
                      <option value="SIN ESPECIFICAR">Sin especificar</option>
                      <option value="MINI">Mini</option>
                      <option value="PEQUEÑO">Pequeño</option>
                      <option value="MEDIANO">Mediano</option>
                      <option value="GRANDE">Grande</option>
                    </select>
                  </div>
                  {errors.tamaño && (
                    <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                      {errors.tamaño}
                    </p>
                  )}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="mt-4">
                <label className="flex items-left text-sm mb-1 ml-2">
                  Número de contacto
                </label>
                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <input
                    type="text"
                    name="whatsapp"
                    placeholder="Ingrese un número de teléfono válido *"
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
              </div>

              {/* ADOPCION */}
              {form.tipo === "ADOPCION" && (
                <>
                  <div className="mt-4">
                    <label className="flex items-left text-sm mb-1 ml-2">
                      Afinidad con niños
                    </label>
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <select
                        name="afinidad"
                        placeholder="Afinidad con niños *"
                        value={form.afinidad}
                        onChange={handleChange}
                        disabled={submitting}
                        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                      >
                        <option value="">
                          Seleccione la afinidad con niños *
                        </option>
                        <option value="ALTA">Alta</option>
                        <option value="MEDIA">Media</option>
                        <option value="BAJA">Baja</option>
                      </select>
                    </div>
                    {errors.afinidad && (
                      <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                        {errors.afinidad}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="flex items-left text-sm mb-1 ml-2">
                      Nivel de energía
                    </label>
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <select
                        name="energia"
                        placeholder="Nivel de energía *"
                        value={form.energia}
                        onChange={handleChange}
                        disabled={submitting}
                        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                      >
                        <option value="">
                          Seleccione el nivel de energía *
                        </option>
                        <option value="ALTA">Alta</option>
                        <option value="MEDIA">Media</option>
                        <option value="BAJA">Baja</option>
                      </select>
                    </div>
                    {errors.energia && (
                      <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                        {errors.energia}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center w-full mt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="castrado"
                        checked={form.castrado}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                      ¿Está castrado?
                    </label>
                  </div>
                  {errors.castrado && (
                    <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                      {errors.castrado}
                    </p>
                  )}
                </>
              )}

              {/* Detalles Adicionales */}
              <div className="mt-4">
                <label className="flex text-left items-left text-sm mb-1 ml-2">
                  Señas particulares y estado del animal
                </label>
                <div className="flex items-center w-full bg-white border border-gray-300/80 min-h-12 rounded-2xl overflow-hidden p-4 gap-2">
                  <textarea
                    name="detalles"
                    placeholder="Agregar aquí cualquier detalle que ayude a identificarlo o a tratar con él: manchas, cicatrices, heridas, si está medicado, si llevaba collar, temperamento o cualquier otra información importante."
                    value={form.detalles}
                    onChange={handleChange}
                    disabled={submitting}
                    rows="4"
                    className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full resize-none"
                  />
                </div>
                {errors.detalles && (
                  <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                    {errors.detalles}
                  </p>
                )}
              </div>
            </div>
            {/* Botón */}
            <div className="col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-full text-white bg-white/40 border border-white/70 hover:bg-[#FF7857] transition-colors disabled:opacity-50"
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
