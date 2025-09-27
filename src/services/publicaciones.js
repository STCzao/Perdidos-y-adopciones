const API_URL = import.meta.env.VITE_API_URL;
const token = JSON.parse(localStorage.getItem("token"));

// Traer publicaciones activas
export const getPublicaciones = async () => {
  try {
    const resp = await fetch(`${API_URL}/publicaciones`);
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se pudieron obtener publicaciones" };
  }
};

// Traer publicación por id
export const getPublicacionById = async (id) => {
  try {
    const resp = await fetch(`${API_URL}/publicaciones/${id}`);
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se pudo obtener publicación" };
  }
};

// Crear publicación
export const crearPublicacion = async (datos) => {
  try {
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
    console.log(error);
    return { msg: "No se pudo crear publicación" };
  }
};

// Actualizar publicación
export const actualizarPublicacion = async (id, datos) => {
  try {
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
    console.log(error);
    return { msg: "No se pudo actualizar publicación" };
  }
};

// Borrar publicación
export const borrarPublicacion = async (id) => {
  try {
    const resp = await fetch(`${API_URL}/publicaciones/${id}`, {
      method: "DELETE",
      headers: { "x-token": token },
    });
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se pudo borrar publicación" };
  }
};
