import axiosInstance from '../utils/axiosInstance';

export const buscarPublicaciones = async (termino, tipo = "") => {
  try {
    const params = new URLSearchParams();
    params.append("search", termino);
    if (tipo) params.append("tipo", tipo.toUpperCase());
    const { data } = await axiosInstance.get(`/publicaciones?${params.toString()}`);
    return data;
  } catch (error) {
    console.error(error);
    return { 
      msg: error.response?.data?.msg || "Error en búsqueda de publicaciones" 
    };
  }
};
