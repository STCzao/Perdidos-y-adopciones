import axiosInstance from "./api";
import { buildServiceSuccess, getResponseRequestId, mapServiceError } from "./serviceUtils";

export const reclamosService = {
  getHuerfanos: async (telefono = "", page = 1, limit = 20) => {
    try {
      const query = new URLSearchParams({ page, limit });
      if (telefono) query.set("telefono", telefono);

      const response = await axiosInstance.get(`/reclamos/huerfanos?${query.toString()}`);

      return buildServiceSuccess({
        clusters: response.data.clusters || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  getHuerfanoDetalle: async (usuarioViejoId) => {
    try {
      const response = await axiosInstance.get(`/reclamos/huerfanos/${usuarioViejoId}`);

      return buildServiceSuccess({
        publicaciones: response.data.publicaciones || [],
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  asignarPublicaciones: async ({ usuarioViejoId, publicaciones, usuarioNuevo }) => {
    try {
      const body = usuarioViejoId
        ? { usuarioViejoId, usuarioNuevo }
        : { publicaciones, usuarioNuevo };

      const response = await axiosInstance.post("/reclamos/asignar", body);

      return buildServiceSuccess({
        publicacionesReasignadas: response.data.publicacionesReasignadas || 0,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },
};
