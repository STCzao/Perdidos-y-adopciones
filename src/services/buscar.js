const API_URL = import.meta.env.VITE_API_URL;

export const buscarPublicaciones = async (termino, tipo = "") => {
  try {
    const resp = await fetch(
      `${API_URL}/publicaciones?termino=${termino}&tipo=${tipo.toUpperCase()}`,
      {
        headers: token ? { "x-token": token } : {},
      }
    );

    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "Error en búsqueda de publicaciones" };
  }
};
