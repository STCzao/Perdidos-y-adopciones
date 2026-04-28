import { validarFechaNoFutura } from "../../../utils/dateHelpers";
import { PUBLICACION_SIZE_FIELD } from "../utils/publicacionFields";

/**
 * Validaciones para el formulario de publicaciones
 */
export const validateForm = (form) => {
  let valid = true;
  const newErrors = {};

  if (form.detalles.trim().length > 250) {
    newErrors.detalles = "Los detalles no pueden contener más de 250 caracteres";
    valid = false;
  }

  if (!form.tipo) {
    newErrors.tipo = "El tipo de publicación es obligatorio";
    valid = false;
  }

  if (!form.raza) {
    newErrors.raza = "La raza es obligatoria";
    valid = false;
  }

  if (!form.sexo) {
    newErrors.sexo = "El sexo es obligatorio";
    valid = false;
  }

  if (!form[PUBLICACION_SIZE_FIELD]) {
    newErrors[PUBLICACION_SIZE_FIELD] = "El tamaño es obligatorio";
    valid = false;
  }

  if (!form.color.trim()) {
    newErrors.color = "El color es obligatorio";
    valid = false;
  } else if (form.color.trim().length > 50) {
    newErrors.color = "El color no puede contener más de 50 caracteres";
    valid = false;
  }

  if (!form.especie) {
    newErrors.especie = "La especie es obligatoria";
    valid = false;
  }

  if (!form.whatsapp.trim()) {
    newErrors.whatsapp = "El WhatsApp es obligatorio";
    valid = false;
  } else if (!/^[0-9]+$/.test(form.whatsapp)) {
    newErrors.whatsapp = "El WhatsApp solo debe contener números";
    valid = false;
  } else if (form.whatsapp.length < 10) {
    newErrors.whatsapp = "El WhatsApp debe tener al menos 10 dígitos";
    valid = false;
  } else if (form.whatsapp.length > 15) {
    newErrors.whatsapp = "El WhatsApp no puede tener más de 15 dígitos";
    valid = false;
  }

  if (!form.img.trim()) {
    newErrors.img = "La imagen es obligatoria";
    valid = false;
  } else if (!/^https:\/\/res\.cloudinary\.com\/.+$/.test(form.img)) {
    newErrors.img = "La URL de imagen no es válida";
    valid = false;
  }

  if (form.tipo === "PERDIDO" || form.tipo === "ENCONTRADO") {
    if (!form.localidad) {
      newErrors.localidad = "La localidad es obligatoria";
      valid = false;
    }

    if (!form.lugar.trim()) {
      newErrors.lugar = "El lugar es obligatorio";
      valid = false;
    } else if (form.lugar.trim().length > 80) {
      newErrors.lugar = "El lugar no puede contener más de 80 caracteres";
      valid = false;
    }

    if (!form.fecha.trim()) {
      newErrors.fecha = "La fecha es obligatoria";
      valid = false;
    } else if (!validarFechaNoFutura(form.fecha)) {
      newErrors.fecha = "La fecha no puede ser mayor al día actual";
      valid = false;
    }
  }

  if (form.tipo === "PERDIDO" || form.tipo === "ADOPCION") {
    if (!form.edad) {
      newErrors.edad = "La edad es obligatoria";
      valid = false;
    }
  }

  if (form.tipo === "ADOPCION" || form.tipo === "PERDIDO") {
    if (!form.nombreanimal.trim()) {
      newErrors.nombreanimal = "El nombre del animal es obligatorio";
      valid = false;
    } else if (form.nombreanimal.trim().length > 60) {
      newErrors.nombreanimal = "El nombre no puede contener más de 60 caracteres";
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
    if (!form.afinidadanimales) {
      newErrors.afinidadanimales = "La afinidad con otros animales es obligatoria";
      valid = false;
    }
    if (!form.energia) {
      newErrors.energia = "El nivel de energía es obligatorio";
      valid = false;
    }
  }

  return { valid, errors: newErrors };
};
