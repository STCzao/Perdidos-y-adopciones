import axiosInstance from "./api";
import { buildServiceSuccess, getResponseRequestId, mapServiceError } from "./serviceUtils";

export const comunidadService = {
  obtenerComunidad: async () => {
    try {
      const response = await axiosInstance.get("/comunidad");
      const { data } = response;

      // El backend puede retornar la lista bajo distintas claves según la versión.
      // Normalizar aquí para que el resto del código tenga una interfaz estable.
      const lista = data.comunidades ?? data.posts ?? data.data ?? (Array.isArray(data) ? data : []);

      return buildServiceSuccess({
        comunidades: Array.isArray(lista) ? lista : [],
        total: data.total ?? lista.length,
        totalPages: data.totalPages ?? 1,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "No se pudo obtener comunidad");
    }
  },

  obtenerComunidadById: async (id) => {
    try {
      const response = await axiosInstance.get(`/comunidad/${id}`);
      const { data } = response;

      const comunidad = data.comunidad ?? data.post ?? data.data ?? null;

      return buildServiceSuccess({
        comunidad,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "No se encontró la publicación");
    }
  },

  crearComunidad: async (datos) => {
    try {
      const response = await axiosInstance.post("/comunidad", datos);
      const { data } = response;

      return buildServiceSuccess({
        comunidad: data.comunidad ?? data.post ?? data.data ?? null,
        msg: data.msg,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  actualizarComunidad: async (id, datos) => {
    try {
      const response = await axiosInstance.put(`/comunidad/${id}`, datos);
      const { data } = response;

      return buildServiceSuccess({
        comunidad: data.comunidad ?? data.post ?? data.data ?? null,
        msg: data.msg,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  borrarComunidad: async (id) => {
    try {
      const response = await axiosInstance.delete(`/comunidad/${id}`);
      const { data } = response;

      return buildServiceSuccess({
        msg: data.msg,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },
};
