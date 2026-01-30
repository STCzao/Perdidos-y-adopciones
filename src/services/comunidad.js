import axiosInstance from '../utils/axiosInstance';

export const comunidadService = {
  obtenerComunidad: async () => {
    try {
      const { data } = await axiosInstance.get('/comunidad');
      return data;
    } catch (error) {
      return { 
        success: false, 
        msg: error.response?.data?.msg || "No se pudo obtener comunidad" 
      };
    }
  },

  obtenerComunidadById: async (id) => {
    try {
      const { data } = await axiosInstance.get(`/comunidad/${id}`);
      return data;
    } catch (error) {
      return { 
        success: false, 
        msg: error.response?.data?.msg || "No se encontro la publicacion" 
      };
    }
  },

  crearComunidad: async (datos) => {
    try {
      const { data } = await axiosInstance.post('/comunidad', datos);
      return data;
    } catch (error) {
      return { 
        success: false, 
        msg: error.response?.data?.msg || "Error de conexion al servidor" 
      };
    }
  },

  actualizarComunidad: async (id, datos) => {
    try {
      const { data } = await axiosInstance.put(`/comunidad/${id}`, datos);
      return data;
    } catch (error) {
      return { 
        success: false, 
        msg: error.response?.data?.msg || "Error de conexion al servidor" 
      };
    }
  },

  borrarComunidad: async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/comunidad/${id}`);
      return data;
    } catch (error) {
      return { 
        success: false, 
        msg: error.response?.data?.msg || "Error de conexion al servidor" 
      };
    }
  },
};
