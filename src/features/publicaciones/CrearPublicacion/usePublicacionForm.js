import { useState, useEffect } from "react";
import { publicacionesService } from "../../../services/publicaciones";
import {
  PUBLICACION_SIZE_FIELD,
  getPublicacionTamano,
} from "../utils/publicacionFields";

const UBICACION_VACIA = { lat: null, lng: null, fuenteUbicacion: null };

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
  imgs: [],
  // Origen de lat/lng: "gps" | "mapa" | null. Si hay ubicación elegida, el pin manda
  // y `lugar` queda solo como texto descriptivo.
  ...UBICACION_VACIA,
};

/**
 * Calcula el siguiente estado del formulario ante el cambio de un campo.
 * Es una función pura para poder testearla sin renderizar el hook.
 */
export const aplicarCambioCampo = (prev, { name, value, type, checked }) => {
  if (name === "especie") {
    return { ...prev, especie: value, raza: "" };
  }

  if (name === "tipo") {
    return {
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
      ...UBICACION_VACIA,
    };
  }

  if (name === "whatsapp") {
    return { ...prev, whatsapp: value.replace(/\D/g, "") };
  }

  // `lugar` cae acá a propósito: editar la dirección NO descarta una ubicación elegida
  // explícitamente (GPS o mapa). El usuario la quita con "Quitar ubicación".
  return { ...prev, [name]: type === "checkbox" ? checked : value };
};

export const aplicarUbicacion = (prev, { lat, lng }, fuente) => ({
  ...prev,
  lat,
  lng,
  fuenteUbicacion: fuente,
});

export const quitarUbicacion = (prev) => ({ ...prev, ...UBICACION_VACIA });

/**
 * Hook personalizado para gestionar el estado del formulario de publicaciones
 */
export const usePublicacionForm = (editData) => {
  const [razasPorEspecie, setRazasPorEspecie] = useState({});
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [capturandoUbicacion, setCapturandoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState("");
  // Aviso que se muestra cuando el backend no pudo geocodificar `lugar`
  const [avisoUbicacion, setAvisoUbicacion] = useState("");

  useEffect(() => {
    publicacionesService.getRazas().then((res) => {
      if (res.razasPorEspecie) setRazasPorEspecie(res.razasPorEspecie);
    });
  }, []);

  useEffect(() => {
    setAvisoUbicacion("");
    setErrorUbicacion("");

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
      imgs:
        editData.imgs?.length > 0 ? editData.imgs : editData.img ? [editData.img] : [],
      ...UBICACION_VACIA,
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

    setForm((prev) => aplicarCambioCampo(prev, { name, value, type, checked }));
    clearFieldError(name);

    if (name === "especie") {
      clearFieldError("raza");
      return;
    }

    if (name === "tipo") {
      [
        "localidad",
        "lugar",
        "fecha",
        "afinidad",
        "afinidadanimales",
        "energia",
        "castrado",
      ].forEach(clearFieldError);
      setAvisoUbicacion("");
      setErrorUbicacion("");
      return;
    }

    // Si el usuario corrige la dirección, el aviso de "no la encontramos" ya no aplica
    if (name === "lugar") setAvisoUbicacion("");
  };

  const resetForm = () => {
    setForm(initialFormState);
    setErrors({});
    setAvisoUbicacion("");
    setErrorUbicacion("");
  };

  const setFormImgs = (urls) => setForm((prev) => ({ ...prev, imgs: urls }));

  const capturarUbicacionGPS = () => {
    if (!navigator.geolocation) {
      setErrorUbicacion("Tu navegador no admite geolocalización");
      return;
    }

    setCapturandoUbicacion(true);
    setErrorUbicacion("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) =>
          aplicarUbicacion(
            prev,
            { lat: position.coords.latitude, lng: position.coords.longitude },
            "gps",
          ),
        );
        setAvisoUbicacion("");
        setCapturandoUbicacion(false);
      },
      () => {
        setErrorUbicacion("No pudimos obtener tu ubicación. Probá marcando el punto en el mapa.");
        setCapturandoUbicacion(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const marcarUbicacionEnMapa = ({ lat, lng }) => {
    setForm((prev) => aplicarUbicacion(prev, { lat, lng }, "mapa"));
    setAvisoUbicacion("");
    setErrorUbicacion("");
  };

  const quitarUbicacionElegida = () => setForm(quitarUbicacion);

  return {
    form,
    errors,
    setErrors,
    handleChange,
    resetForm,
    setFormImgs,
    razasPorEspecie,
    capturarUbicacionGPS,
    capturandoUbicacion,
    errorUbicacion,
    marcarUbicacionEnMapa,
    quitarUbicacionElegida,
    avisoUbicacion,
    setAvisoUbicacion,
  };
};
