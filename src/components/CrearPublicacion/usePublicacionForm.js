import { useState, useEffect } from "react";

/**
 * Hook personalizado para gestionar el estado del formulario de publicaciones
 */
export const usePublicacionForm = (editData) => {
  const initialFormState = {
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
    afinidadanimales: "",
    energia: "",
    castrado: false,
    whatsapp: "",
    img: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Cargar datos de edición
  useEffect(() => {
    if (!editData) {
      setForm(initialFormState);
      setErrors({});
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
      afinidadanimales:
        editData.tipo === "ADOPCION" ? editData.afinidadanimales || "" : "",
      energia: editData.tipo === "ADOPCION" ? editData.energia || "" : "",
      castrado: editData.tipo === "ADOPCION" ? !!editData.castrado : false,
      whatsapp: editData.whatsapp || "",
      img: editData.img || "",
    });
  }, [editData]);

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
        afinidadanimales: "",
        energia: "",
        castrado: false,
      }));

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.lugar;
        delete newErrors.fecha;
        delete newErrors.afinidad;
        delete newErrors.afinidadanimales;
        delete newErrors.energia;
        delete newErrors.castrado;
        return newErrors;
      });
    } else if (name === "whatsapp") {
      const numericValue = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: numericValue }));

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
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

  const resetForm = () => {
    setForm(initialFormState);
    setErrors({});
  };

  const setFormImage = (url) => {
    setForm((prev) => ({ ...prev, img: url }));
  };

  return {
    form,
    errors,
    setErrors,
    handleChange,
    resetForm,
    setFormImage,
  };
};
