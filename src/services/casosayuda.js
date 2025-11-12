const API_URL = import.meta.env.VITE_API_URL;

export const casosAyudaService = {
  getCasosAyuda: async () => {
    try {
      const resp = await fetch(`${API_URL}/casosAyuda`);
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "No se pudieron obtener casos de ayuda" };
    }
  },

  getCasoAyudaUsuario: async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          msg: "No hay token disponible",
        };
      }

      const resp = await fetch(`${API_URL}/casosAyuda/usuario/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-token": token,
        },
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        return {
          success: false,
          msg: errorData.msg || "Error al obtener casos de ayuda",
          status: resp.status,
        };
      }

      const data = await resp.json();
      return data;
    } catch (error) {
      console.error("Error en getCasosAyudaUsuario:", error);
      return {
        success: false,
        msg: "No se pudieron obtener casos de ayuda del usuario",
      };
    }
  },

  getCasoAyudaById: async (id) => {
    try {
      const resp = await fetch(`${API_URL}/casosAyuda/${id}`);
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "No se pudo obtener caso de ayuda" };
    }
  },

  crearCasoAyuda: async (datos) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/casosAyuda`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-token": token,
        },
        body: JSON.stringify(datos),
      });
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "Error de conexión al servidor" };
    }
  },

  borrarCasoAyuda: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/casosAyuda/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-token": token,
        },
      });
      return await resp.json();
    } catch (error) {
      return { success: false, msg: "Error de conexión al servidor" };
    }
  },
};
