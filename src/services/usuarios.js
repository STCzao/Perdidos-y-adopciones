const API_URL = import.meta.env.VITE_API_URL;
const token = JSON.parse(localStorage.getItem("token"));

// Traer usuarios
export const getUsuarios = async () => {
  try {
    const resp = await fetch(`${API_URL}/usuarios`, { headers: { "x-token": token } });
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se pudo obtener usuarios" };
  }
};

// Traer usuario por id
export const getUsuarioById = async (id) => {
  try {
    const resp = await fetch(`${API_URL}/usuarios/${id}`, {
      headers: { "x-token": token },
    });
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se pudo obtener el usuario" };
  }
};

// Crear usuario
export const crearUsuario = async (datos) => {
  try {
    const resp = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      body: JSON.stringify(datos),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se pudo registrar el usuario" };
  }
};

// Actualizar usuario
export const actualizarUsuario = async (id, datos) => {
  try {
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
    console.log(error);
    return { msg: "No se pudo actualizar usuario" };
  }
};

// Borrar usuario
export const borrarUsuario = async (id) => {
  try {
    const resp = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: { "x-token": token },
    });
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se pudo borrar usuario" };
  }
};
