const API_URL = import.meta.env.VITE_API_URL;

export const getPublicaciones = async () => {
  try {
    const resp = await fetch(`${API_URL}/publicaciones`);
    return await resp.json();
  } catch (error) {
    return { success: false, msg: "No se pudieron obtener publicaciones" };
  }
};

export const getPublicacionById = async (id) => {
  try {
    const resp = await fetch(`${API_URL}/publicaciones/${id}`);
    return await resp.json();
  } catch (error) {
    return { success: false, msg: "No se pudo obtener publicación" };
  }
};

export const crearPublicacion = async (datos) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${API_URL}/publicaciones`, {
      method: "POST",
      body: JSON.stringify(datos),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": token,
      },
    });
    return await resp.json();
  } catch (error) {
    return { success: false, msg: "Error de conexión al servidor" };
  }
};

export const actualizarPublicacion = async (id, datos) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${API_URL}/publicaciones/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": token,
      },
    });
    return await resp.json();
  } catch (error) {
    return { success: false, msg: "Error de conexión al servidor" };
  }
};

export const borrarPublicacion = async (id) => {
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
};
