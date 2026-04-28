import axiosInstance from "./api";
import { mapServiceError } from "./serviceUtils";

export const buscarPublicaciones = async (termino, tipo = "") => {
  try {
    const params = new URLSearchParams();
    params.append("search", termino);
    if (tipo) params.append("tipo", tipo.toUpperCase());
    const { data } = await axiosInstance.get(`/publicaciones?${params.toString()}`);
    return data;
  } catch (error) {
    console.error(error);
    return mapServiceError(error, "Error en búsqueda de publicaciones");
  }
};
