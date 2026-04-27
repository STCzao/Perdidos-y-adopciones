import axiosInstance from "./api";
import { buildServiceSuccess, mapServiceError } from "./serviceUtils";

export const publicacionesService = {
  getRazas: async () => {
    try {
      const { data } = await axiosInstance.get("/publicaciones/razas");
      return data;
    } catch (error) {
      console.error("Error en getRazas:", error);
      return {
        success: false,
        razas: [],
        razasPorEspecie: {},
        msg: "No se pudieron obtener las razas",
        errors: {},
      };
    }
  },

  getPublicaciones: async ({ page = 1, limit = 12, tipo, estado, search } = {}) => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);

      if (tipo) params.append("tipo", tipo);
      if (estado) params.append("estado", estado);
      if (search) params.append("search", search);

      const { data } = await axiosInstance.get(`/publicaciones?${params.toString()}`);
      return data;
    } catch (error) {
      return mapServiceError(error, "No se pudieron obtener publicaciones");
    }
  },

  getPublicacionesUsuario: async (id) => {
    try {
      const { data } = await axiosInstance.get(`/publicaciones/usuario/${id}`);
      return data;
    } catch (error) {
      console.error("Error en getPublicacionesUsuario:", error);
      return mapServiceError(error, "No se pudieron obtener publicaciones del usuario");
    }
  },

  getPublicacionById: async (id) => {
    try {
      const { data } = await axiosInstance.get(`/publicaciones/${id}`);
      return data;
    } catch (error) {
      return mapServiceError(error, "No se pudo obtener la publicación");
    }
  },

  getContactoPublicacion: async (id) => {
    try {
      const { data } = await axiosInstance.get(`/publicaciones/contacto/${id}`);
      return buildServiceSuccess({
        whatsapp: data.whatsapp || "",
      });
    } catch (error) {
      return mapServiceError(error, "No se pudo obtener el contacto de la publicación");
    }
  },

  crearPublicacion: async (datos) => {
    try {
      const { data } = await axiosInstance.post("/publicaciones", datos);
      return data;
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  actualizarPublicacion: async (id, datos) => {
    try {
      const { data } = await axiosInstance.put(`/publicaciones/${id}`, datos);
      return data;
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  actualizarEstado: async (id, estado) => {
    try {
      const { data } = await axiosInstance.put(`/publicaciones/${id}/estado`, { estado });
      return buildServiceSuccess({ publicacion: data.publicacion });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  borrarPublicacion: async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/publicaciones/${id}`);
      return data;
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },
};
