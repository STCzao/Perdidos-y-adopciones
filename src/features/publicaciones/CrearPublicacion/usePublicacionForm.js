import { useState, useEffect } from "react";
import { publicacionesService } from "../../../services/publicaciones";
import {
  PUBLICACION_SIZE_FIELD,
  getPublicacionTamano,
} from "../utils/publicacionFields";

const initialFormState = {
  nombreanimal: "",
  especie: "",
  tipo: "",
  raza: "",
  localidad: "",
  lugar: "",
  fecha: "",
  sexo: "",
  [PUBLICACION_SIZE_FIELD]: "",
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

/**
 * Hook personalizado para gestionar el estado del formulario de publicaciones
 */
export const usePublicacionForm = (editData) => {
  const [razasPorEspecie, setRazasPorEspecie] = useState({});
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    publicacionesService.getRazas().then((res) => {
      if (res.razasPorEspecie) setRazasPorEspecie(res.razasPorEspecie);
    });
  }, []);

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
      localidad:
        editData.tipo === "PERDIDO" || editData.tipo === "ENCONTRADO"
          ? editData.localidad || ""
          : "",
      lugar:
        editData.tipo === "PERDIDO" || editData.tipo === "ENCONTRADO"
          ? editData.lugar || ""
          : "",
      fecha:
        editData.tipo === "PERDIDO" || editData.tipo === "ENCONTRADO"
          ? editData.fecha || ""
          : "",
      sexo: editData.sexo || "",
      [PUBLICACION_SIZE_FIELD]: getPublicacionTamano(editData),
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

  const clearFieldError = (name) => {
    if (!errors[name]) return;

    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "especie") {
      setForm((prev) => ({ ...prev, especie: value, raza: "" }));
      clearFieldError("especie");
      clearFieldError("raza");
      return;
    }

    if (name === "tipo") {
      setForm((prev) => ({
        ...prev,
        tipo: value,
        nombreanimal: "",
        edad: "",
        localidad: "",
        lugar: "",
        fecha: "",
        afinidad: "",
        afinidadanimales: "",
        energia: "",
        castrado: false,
      }));

      [
        "localidad",
        "lugar",
        "fecha",
        "afinidad",
        "afinidadanimales",
        "energia",
        "castrado",
      ].forEach(clearFieldError);
      return;
    }

    if (name === "whatsapp") {
      const numericValue = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, whatsapp: numericValue }));
      clearFieldError(name);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    clearFieldError(name);
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
    razasPorEspecie,
  };
};
