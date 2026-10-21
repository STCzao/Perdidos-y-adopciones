import { PUBLICACION_SIZE_FIELD } from "../utils/publicacionFields";

// Código que devuelve el backend cuando no pudo geocodificar `lugar` (422 o 502)
export const CODIGO_UBICACION_NO_RESUELTA = "UBICACION_NO_RESUELTA";

const AVISO_DIRECCION_NO_ENCONTRADA =
  "No encontramos esa dirección. Podés usar tu ubicación actual o marcar el punto en el mapa.";
const AVISO_GEOCODING_CAIDO =
  "No pudimos verificar la dirección en este momento. Podés usar tu ubicación actual o marcar el punto en el mapa.";

/**
 * Arma el payload para POST/PUT /publicaciones a partir del estado del formulario.
 */
export const construirDatosParaEnviar = (form, isEditing) => {
  const datosParaEnviar = {
    tipo: form.tipo,
    especie: form.especie,
    raza: form.raza,
    sexo: form.sexo,
    [PUBLICACION_SIZE_FIELD]: form[PUBLICACION_SIZE_FIELD],
    color: form.color,
    whatsapp: form.whatsapp,
    imgs: form.imgs,
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

    // Si vienen coordenadas el backend no geocodifica `lugar`
    if (form.lat != null && form.lng != null) {
      datosParaEnviar.lat = form.lat;
      datosParaEnviar.lng = form.lng;
    }
  }

  return datosParaEnviar;
};

/**
 * Clasifica la respuesta del servicio para que handleSubmit decida qué mostrar.
 * Devuelve { tipo: "exito" | "ubicacionNoResuelta" | "validacion" | "error", msg, errors }.
 */
export const interpretarRespuestaPublicacion = (response) => {
  if (response?.success) {
    return { tipo: "exito" };
  }

  if (response?.codigo === CODIGO_UBICACION_NO_RESUELTA) {
    return {
      tipo: "ubicacionNoResuelta",
      msg: response.status === 502 ? AVISO_GEOCODING_CAIDO : AVISO_DIRECCION_NO_ENCONTRADA,
    };
  }

  if (response?.errors) {
    return {
      tipo: "validacion",
      msg: response.msg || "Error en validacion",
      errors: response.errors,
    };
  }

  return { tipo: "error", msg: response?.msg || "Error al procesar la publicacion" };
};
