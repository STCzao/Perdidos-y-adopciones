const API_URL = import.meta.env.VITE_API_URL;

export const publicacionesService = {
  getPublicaciones: async () => {
    try {
      const resp = await fetch(`${API_URL}/publicaciones`);
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "No se pudieron obtener publicaciones" };
    }
  },

  getPublicacionesUsuario: async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          msg: "No hay token disponible",
        };
      }

      const resp = await fetch(`${API_URL}/publicaciones/usuario/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-token": token,
        },
      });

      // Verificar si la respuesta es OK
      if (!resp.ok) {
        const errorData = await resp.json();
        return {
          success: false,
          msg: errorData.msg || "Error al obtener publicaciones",
          status: resp.status,
        };
      }

      const data = await resp.json();
      return data;
    } catch (error) {
      console.error("Error en getPublicacionesUsuario:", error);
      return {
        success: false,
        msg: "No se pudieron obtener publicaciones del usuario",
      };
    }
  },

  getPublicacionById: async (id) => {
    try {
      const resp = await fetch(`${API_URL}/publicaciones/${id}`);
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "No se pudo obtener publicación" };
    }
  },

  crearPublicacion: async (datos) => {
    try {
      const token = localStorage.getItem("token");

      console.log("Datos:", datos);
      const resp = await fetch(`${API_URL}/publicaciones`, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-token": token,
        },
      });

      const data = await resp.json();

      if (!resp.ok) {
        return { success: false, ...data };
      }
      return data;
    } catch (error) {
      return { success: false, msg: "Error de conexión al servidor" };
    }
  },

  actualizarPublicacion: async (id, datos) => {
    try {
      const token = localStorage.getItem("token");

      const resp = await fetch(`${API_URL}/publicaciones/${id}`, {
        method: "PUT",
        body: JSON.stringify(datos),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-token": token,
        },
      });

      const data = await resp.json();

      if (!resp.ok) {
        return {
          success: false,
          ...data,
          status: resp.status,
        };
      }

      return data;
    } catch (error) {
      return { success: false, msg: "Error de conexión al servidor" };
    }
  },

  actualizarEstado: async (id, estado) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/publicaciones/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": token || "",
        },
        body: JSON.stringify({ estado }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        return {
          success: false,
          msg: errorData.msg || "Error al actualizar estado",
        };
      }

      const data = await resp.json();
      return { success: true, publicacion: data.publicacion };
    } catch (error) {
      console.error("Error actualizando estado:", error);
      return { success: false, msg: "Error de conexion al servidor" };
    }
  },

  borrarPublicacion: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/publicaciones/${id}`, {
        method: "DELETE",
        headers: { "x-token": token },
      });
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "Error de conexión al servidor" };
    }
  },
};
