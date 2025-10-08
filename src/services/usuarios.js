const API_URL = import.meta.env.VITE_API_URL;

// Traer usuarios (SOLO ADMIN)
export const getUsuarios = async () => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${API_URL}/usuarios`, {
      headers: { "x-token": token },
    });
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se pudo obtener usuarios" };
  }
};

// Obtener perfil del usuario logueado - NUEVA FUNCIÓN
export const getMiPerfil = async () => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${API_URL}/usuarios/mi-perfil`, {
      headers: { "x-token": token },
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      return { msg: errorData.msg || "Error al obtener perfil" };
    }

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error(error);
    return { msg: "Error de conexión al servidor" };
  }
};

// Traer usuario por id
export const getUsuarioById = async (id) => {
  try {
    const token = localStorage.getItem("token");
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
    console.log(error);
    return { msg: "No se pudo actualizar usuario" };
  }
};

// Borrar usuario
export const borrarUsuario = async (id) => {
  try {
    const token = localStorage.getItem("token");
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

// Actualizar mi perfil
export const actualizarMiPerfil = async (datos) => {
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
    console.log(error);
    return { msg: "No se pudo actualizar perfil" };
  }
};
