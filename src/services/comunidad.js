const API_URL = import.meta.env.VITE_API_URL;

export const comunidadService = {
  obtenerComunidad: async () => {
    try {
      const resp = await fetch(`${API_URL}/comunidad`);
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "No se pudo obtener comunidad" };
    }
  },

  obtenerComunidadById: async (id) => {
    try {
      const resp = await fetch(`${API_URL}/comunidad/${id}`);
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "No se encontro la publicacion" };
    }
  },

  crearComunidad: async (datos) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/comunidad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-token": token,
        },
        body: JSON.stringify(datos),
      });
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "Error de conexion al servidor" };
    }
  },

  actualizarComunidad: async (id, datos) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/comunidad/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-token": token,
        },
        body: JSON.stringify(datos),
      });
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "Error de conexion al servidor" };
    }
  },

  borrarComunidad: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/comunidad/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-token": token,
        },
      });
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "Error de conexion al servidor" };
    }
  },
};
