import { apiRequest } from "../api";

// Todas las publicaciones
export function getPublicaciones() {
  return apiRequest("/publicaciones");
}

// Por tipo
export function getPerdidos() {
  return apiRequest("/publicaciones?tipo=PERDIDO");
}

export function getEncontrados() {
  return apiRequest("/publicaciones?tipo=ENCONTRADO");
}

export function getAdopciones() {
  return apiRequest("/publicaciones?tipo=ADOPCION");
}

// Crear publicacion
export function crearPublicacion(data, token) {
  return apiRequest("/publicaciones", "POST", data, token);
}
