const API_URL = import.meta.env.VITE_API_URL;
const SEED_TOKEN = import.meta.env.VITE_API_SEED_TOKEN;

// Login
export const authLogin = async (datos) => {
  try {
    const resp = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "x-token": SEED_TOKEN, // siempre pide token
      },
      body: JSON.stringify(datos),
    });

    const data = await resp.json();

    if (data.token) {
      localStorage.setItem("token", data.token); // guardamos el JWT real
    }

    return data;
  } catch (error) {
    console.error(error);
    return { msg: "Error al iniciar sesion" };
  }
};

// Registro
export const crearUsuario = async (datos) => {
  try {
    const resp = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "x-token": SEED_TOKEN, // siempre pide token
      },
      body: JSON.stringify(datos),
    });

    const data = await resp.json();

    if (data.token) {
      localStorage.setItem("token", data.token); // guardamos el JWT real
    }

    return data;
  } catch (error) {
    console.error(error);
    return { msg: "Error al registrar usuario" };
  }
};
