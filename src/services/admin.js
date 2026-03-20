import axiosInstance from './api';

const cache = { usuarios: null, usuariosTimestamp: null };
const CACHE_DURATION = 30000;

export const adminService = {
  
  getTodasPublicaciones: async () => {
    try {
      // Obtener primera página para saber el total
      const { data: firstData } = await axiosInstance.get('/publicaciones/admin/todas?page=1&limit=12');

      const publicacionesFirstPage = firstData.publicaciones || [];
      const totalPages = firstData.totalPages || 1;

      // Si solo hay una página, retornar eso
      if (totalPages <= 1) {
        return { success: true, publicaciones: publicacionesFirstPage };
      }

      // Obtener el resto de las páginas en paralelo
      const requests = [];
      for (let p = 2; p <= totalPages; p++) {
        requests.push(
          axiosInstance.get(`/publicaciones/admin/todas?page=${p}&limit=12`)
        );
      }

      const results = await Promise.all(requests);
      const restPublicaciones = results.flatMap(res => res.data.publicaciones || []);

      return { 
        success: true, 
        publicaciones: [...publicacionesFirstPage, ...restPublicaciones] 
      };
    } catch (error) {
      console.error("Error en getTodasPublicaciones:", error);
      return { 
        success: false, 
        msg: error.response?.data?.msg || "Error de conexión al servidor" 
      };
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

      const { data: firstData } = await axiosInstance.get('/usuarios?page=1&limit=20');
      const usuariosPrimeraPagina = firstData.usuarios || firstData.data || (Array.isArray(firstData) ? firstData : []);
      const totalPages = firstData.totalPages || 1;

      let todosUsuarios = [...usuariosPrimeraPagina];

      if (totalPages > 1) {
        const requests = [];
        for (let p = 2; p <= totalPages; p++) {
          requests.push(axiosInstance.get(`/usuarios?page=${p}&limit=20`));
        }
        const results = await Promise.all(requests);
        const restUsuarios = results.flatMap(res =>
          res.data.usuarios || res.data.data || (Array.isArray(res.data) ? res.data : [])
        );
        todosUsuarios = [...todosUsuarios, ...restUsuarios];
      }

      const result = { usuarios: todosUsuarios };
      cache.usuarios = result;
      cache.usuariosTimestamp = Date.now();

      return result;
    } catch (error) {
      return { 
        msg: error.response?.data?.msg || "Error de conexión al servidor" 
      };
    }
  },

  cambiarEstadoUsuario: async (id, estado) => {
    try {
      const { data } = await axiosInstance.put(`/usuarios/${id}/estado`, { estado });

      return { ok: true, usuario: data.usuario };
    } catch (error) {
      return { 
        ok: false, 
        msg: error.response?.data?.msg || "Error de conexión al servidor" 
      };
    }
  },

  clearCache: () => {
    cache.usuarios = null;
    cache.usuariosTimestamp = null;
  },
};
