const API_URL = import.meta.env.VITE_API_URL;

const cache = { publicaciones: null, usuarios: null, timestamp: null };
const CACHE_DURATION = 30000;

export const adminService = {
  
  getTodasPublicaciones: async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Obtener primera página para saber el total
      const firstRes = await fetch(`${API_URL}/publicaciones/admin/todas?page=1&limit=12`, {
        headers: { "x-token": token || "" },
      });

      if (!firstRes.ok) {
        let errorMsg = "Error al obtener publicaciones";
        const errorData = await firstRes.json().catch(() => ({}));
        return {
          success: false,
          msg: errorData.msg || errorMsg,
        };
      }

      const firstData = await firstRes.json();
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
          fetch(`${API_URL}/publicaciones/admin/todas?page=${p}&limit=12`, {
            headers: { "x-token": token || "" },
          }).then(res => res.json())
        );
      }

      const results = await Promise.all(requests);
      const restPublicaciones = results.flatMap(res => res.publicaciones || []);

      return { 
        success: true, 
        publicaciones: [...publicacionesFirstPage, ...restPublicaciones] 
      };
    } catch (error) {
      console.error("Error en getTodasPublicaciones:", error);
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
      if (!token) {
      }

      const resp = await fetch(`${API_URL}/usuarios`, {
        headers: { "x-token": token || "" },
      });

      if (!resp.ok) {
        let errorMsg = "Error al obtener usuarios";
        try {
          const errorData = await resp.json();
          errorMsg = errorData.msg || errorMsg;
        } catch (jsonErr) {}
        return { msg: errorMsg };
      }

      const data = await resp.json();

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

  cambiarEstadoUsuario: async (id, estado) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/usuarios/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": token || "",
        },
        body: JSON.stringify({ estado }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        return { ok: false, msg: data.msg || "Error al actualizar el estado" };
      }

      return { ok: true, usuario: data.usuario };
    } catch (error) {
      return { ok: false, msg: "Error de conexión al servidor" };
    }
  },

  clearCache: () => {
    cache.publicaciones = null;
    cache.usuarios = null;
    cache.timestamp = null;
  },
};
