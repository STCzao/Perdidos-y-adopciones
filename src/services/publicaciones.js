import axiosInstance from '../utils/axiosInstance';

export const publicacionesService = {
  getPublicaciones: async ({
    page = 1,
    limit = 12,
    tipo,
    estado,
    search,
  } = {}) => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);

      if (tipo) params.append("tipo", tipo);
      if (estado) params.append("estado", estado);
      if (search) params.append("search", search);

      const { data } = await axiosInstance.get(`/publicaciones?${params.toString()}`);
      return data;
    } catch (error) {
      return { success: false, msg: error.response?.data?.msg || "No se pudieron obtener publicaciones" };
    }
  },

  getPublicacionesUsuario: async (id) => {
    try {
      const { data } = await axiosInstance.get(`/publicaciones/usuario/${id}`);
      return data;
    } catch (error) {
      console.error("Error en getPublicacionesUsuario:", error);
      return {
        success: false,
        msg: error.response?.data?.msg || "No se pudieron obtener publicaciones del usuario",
        status: error.response?.status,
      };
    }
  },

  getPublicacionById: async (id) => {
    try {
      const { data } = await axiosInstance.get(`/publicaciones/${id}`);
      return data;
    } catch (error) {
      return { success: false, msg: error.response?.data?.msg || "No se pudo obtener publicación" };
    }
  },

  crearPublicacion: async (datos) => {
    try {
      const { data } = await axiosInstance.post('/publicaciones', datos);
      return data;
    } catch (error) {
      return { 
        success: false, 
        msg: error.response?.data?.msg || "Error de conexión al servidor",
        ...error.response?.data 
      };
    }
  },

  actualizarPublicacion: async (id, datos) => {
    try {
      const { data } = await axiosInstance.put(`/publicaciones/${id}`, datos);
      return data;
    } catch (error) {
      return {
        success: false,
        msg: error.response?.data?.msg || "Error de conexión al servidor",
        status: error.response?.status,
        ...error.response?.data,
      };
    }
  },

  actualizarEstado: async (id, estado) => {
    try {
      const { data } = await axiosInstance.put(`/publicaciones/${id}/estado`, { estado });
      return { success: true, publicacion: data.publicacion };
    } catch (error) {
      console.error("Error actualizando estado:", error);
      return { 
        success: false, 
        msg: error.response?.data?.msg || "Error de conexion al servidor" 
      };
    }
  },

  borrarPublicacion: async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/publicaciones/${id}`);
      return data;
    } catch (error) {
      return { 
        success: false, 
        msg: error.response?.data?.msg || "Error de conexión al servidor" 
      };
    }
  },
};
