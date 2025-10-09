const API_URL = import.meta.env.VITE_API_URL;

export const usuariosService = {
  getMiPerfil: async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/usuarios/mi-perfil`, {
        headers: { "x-token": token },
      });
      return await resp.json();
    } catch (error) {
      return { msg: "Error de conexión al servidor" };
    }
  },

  actualizarPerfil: async (datos) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/usuarios/mi-perfil`, {
        method: "PUT",
        body: JSON.stringify(datos),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "x-token": token,
        },
      });
      return await resp.json();
    } catch (error) {
      return { msg: "Error de conexión al servidor" };
    }
  },

  borrarUsuario: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: { "x-token": token },
      });
      return await resp.json();
    } catch (error) {
      return { msg: "Error de conexión al servidor" };
    }
  },

  actualizarUsuario: async (id, datos) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(datos),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "x-token": token,
        },
      });
      return await resp.json();
    } catch (error) {
      return { msg: "Error de conexión al servidor" };
    }
  },
};
