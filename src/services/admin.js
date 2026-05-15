import axiosInstance from "./api";
import { buildServiceSuccess, getResponseRequestId, mapServiceError } from "./serviceUtils";

export const adminService = {
  getPublicacionesPagina: async (page = 1, limit = 15, params = {}) => {
    try {
      const query = new URLSearchParams({ page, limit });

      if (params.search) query.set("search", params.search);
      if (params.tipo) query.set("tipo", params.tipo);
      if (params.estado) query.set("estado", params.estado);
      if (params.raza) query.set("raza", params.raza);
      if (params.localidad) query.set("localidad", params.localidad);
      if (params.sortBy) query.set("sortBy", params.sortBy);
      if (params.sortOrder) query.set("sortOrder", params.sortOrder);

      const response = await axiosInstance.get(`/publicaciones/admin/todas?${query.toString()}`);

      return buildServiceSuccess({
        publicaciones: response.data.publicaciones || [],
        totalPages: response.data.totalPages || 1,
        totalDocs: response.data.totalDocs || 0,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  exportarPublicaciones: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.tipo) query.set("tipo", params.tipo);
    if (params.estado) query.set("estado", params.estado);
    if (params.raza) query.set("raza", params.raza);
    if (params.localidad) query.set("localidad", params.localidad);

    const response = await axiosInstance.get(
      `/publicaciones/admin/exportar?${query.toString()}`,
      { responseType: "blob" },
    );
    return response.data;
  },

  getTodasPublicaciones: async () => {
    try {
      const firstResponse = await axiosInstance.get("/publicaciones/admin/todas?page=1&limit=12");
      const firstData = firstResponse.data;
      const publicacionesFirstPage = firstData.publicaciones || [];
      const totalPages = firstData.totalPages || 1;

      if (totalPages <= 1) {
        return buildServiceSuccess({
          publicaciones: publicacionesFirstPage,
          requestId: getResponseRequestId(firstResponse),
        });
      }

      const requests = [];
      for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
        requests.push(
          axiosInstance.get(`/publicaciones/admin/todas?page=${currentPage}&limit=12`),
        );
      }

      const results = await Promise.all(requests);
      const restPublicaciones = results.flatMap((res) => res.data.publicaciones || []);

      return buildServiceSuccess({
        publicaciones: [...publicacionesFirstPage, ...restPublicaciones],
        requestId: getResponseRequestId(firstResponse),
      });
    } catch (error) {
      console.error("Error en getTodasPublicaciones:", error);
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  getUsuariosAdmin: async (params = {}) => {
    try {
      const query = new URLSearchParams();

      if (params.page) query.set("page", params.page);
      if (params.limit) query.set("limit", params.limit || 20);
      if (params.sortBy) query.set("sortBy", params.sortBy);
      if (params.sortOrder) query.set("sortOrder", params.sortOrder);
      if (params.search) query.set("search", params.search);
      if (params.rol) query.set("rol", params.rol);
      if (params.estado) query.set("estado", params.estado);

      const response = await axiosInstance.get(`/usuarios/admin?${query.toString()}`);

      return buildServiceSuccess({
        usuarios: response.data.usuarios || [],
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  cambiarRolUsuario: async (id, rol) => {
    try {
      const response = await axiosInstance.patch(`/usuarios/${id}/rol`, { rol });

      return buildServiceSuccess({
        usuario: response.data.usuario,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  cambiarEstadoUsuario: async (id, estado) => {
    try {
      const response = await axiosInstance.put(`/usuarios/${id}/estado`, { estado });
      const { data } = response;

      return buildServiceSuccess({
        usuario: data.usuario,
        requestId: getResponseRequestId(response),
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },
};
