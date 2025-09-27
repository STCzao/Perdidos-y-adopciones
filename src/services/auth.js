const API_URL = import.meta.env.VITE_API_URL;

// Login
export const authLogin = async (datos) => {
  try {
    const resp = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(datos),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se conectó con backend" };
  }
};

// Renovar token
export const renovarToken = async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const resp = await fetch(`${API_URL}/auth/renew`, {
      method: "GET",
      headers: { "x-token": token },
    });
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { msg: "No se pudo renovar el token" };
  }
};
