import axiosInstance from '../utils/axiosInstance';

export const buscarPublicaciones = async (termino, tipo = "") => {
  try {
    const { data } = await axiosInstance.get(`/publicaciones?termino=${termino}&tipo=${tipo.toUpperCase()}`);
    return data;
  } catch (error) {
    console.log(error);
    return { 
      msg: error.response?.data?.msg || "Error en búsqueda de publicaciones" 
    };
  }
};
