import axiosInstance from "./api";
import { buildServiceSuccess, mapServiceError } from "./serviceUtils";

const cache = { usuarios: null, usuariosTimestamp: null };
const CACHE_DURATION = 30000;

export const adminService = {
  getTodasPublicaciones: async () => {
    try {
      const { data: firstData } = await axiosInstance.get("/publicaciones/admin/todas?page=1&limit=12");

      const publicacionesFirstPage = firstData.publicaciones || [];
      const totalPages = firstData.totalPages || 1;

      if (totalPages <= 1) {
        return buildServiceSuccess({ publicaciones: publicacionesFirstPage });
      }

      const requests = [];
      for (let p = 2; p <= totalPages; p += 1) {
        requests.push(axiosInstance.get(`/publicaciones/admin/todas?page=${p}&limit=12`));
      }

      const results = await Promise.all(requests);
      const restPublicaciones = results.flatMap((res) => res.data.publicaciones || []);

      return buildServiceSuccess({
        publicaciones: [...publicacionesFirstPage, ...restPublicaciones],
      });
    } catch (error) {
      console.error("Error en getTodasPublicaciones:", error);
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  getTodosUsuarios: async () => {
    try {
      if (
        cache.usuarios &&
        cache.usuariosTimestamp &&
        Date.now() - cache.usuariosTimestamp < CACHE_DURATION
      ) {
        return cache.usuarios;
      }

      const { data: firstData } = await axiosInstance.get("/usuarios?page=1&limit=20");
      const usuariosPrimeraPagina =
        firstData.usuarios || firstData.data || (Array.isArray(firstData) ? firstData : []);
      const totalPages = firstData.totalPages || 1;

      let todosUsuarios = [...usuariosPrimeraPagina];

      if (totalPages > 1) {
        const requests = [];
        for (let p = 2; p <= totalPages; p += 1) {
          requests.push(axiosInstance.get(`/usuarios?page=${p}&limit=20`));
        }
        const results = await Promise.all(requests);
        const restUsuarios = results.flatMap(
          (res) => res.data.usuarios || res.data.data || (Array.isArray(res.data) ? res.data : []),
        );
        todosUsuarios = [...todosUsuarios, ...restUsuarios];
      }

      const result = buildServiceSuccess({ usuarios: todosUsuarios });
      cache.usuarios = result;
      cache.usuariosTimestamp = Date.now();

      return result;
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  cambiarEstadoUsuario: async (id, estado) => {
    try {
      const { data } = await axiosInstance.put(`/usuarios/${id}/estado`, { estado });

      return buildServiceSuccess({
        ok: true,
        usuario: data.usuario,
      });
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor", { ok: false });
    }
  },

  clearCache: () => {
    cache.usuarios = null;
    cache.usuariosTimestamp = null;
  },
};
