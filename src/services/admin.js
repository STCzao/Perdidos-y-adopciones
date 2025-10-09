const API_URL = import.meta.env.VITE_API_URL;

// Cache simple para evitar llamadas duplicadas
const cache = {
  publicaciones: null,
  usuarios: null,
  timestamp: null,
};

const CACHE_DURATION = 30000; // 30 segundos

export const adminService = {
  getTodasPublicaciones: async () => {
    try {
      // Verificar cache
      if (
        cache.publicaciones &&
        cache.timestamp &&
        Date.now() - cache.timestamp < CACHE_DURATION
      ) {
        return cache.publicaciones;
      }

      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/publicaciones/admin/todas`, {
        headers: { "x-token": token },
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        return {
          success: false,
          msg: errorData.msg || "Error al obtener publicaciones",
        };
      }

      const data = await resp.json();

      // Actualizar cache
      cache.publicaciones = data;
      cache.timestamp = Date.now();

      return data;
    } catch (error) {
      return { success: false, msg: "Error de conexión al servidor" };
    }
  },

  getTodosUsuarios: async () => {
    try {
      if (
        cache.usuarios &&
        cache.timestamp &&
        Date.now() - cache.timestamp < CACHE_DURATION
      ) {
        return cache.usuarios;
      }

      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/usuarios`, {
        headers: { "x-token": token },
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        return { msg: errorData.msg || "Error al obtener usuarios" };
      }

      const data = await resp.json();

      // Normalizar formato: asegurar que siempre devuelva { usuarios: [...] }
      const usuarios =
        data.usuarios || data.data || (Array.isArray(data) ? data : []) || [];

      const result = { usuarios };

      cache.usuarios = result;
      cache.timestamp = Date.now();

      return result;
    } catch (error) {
      return { msg: "Error de conexión al servidor" };
    }
  },

  clearCache: () => {
    cache.publicaciones = null;
    cache.usuarios = null;
    cache.timestamp = null;
  },
};
