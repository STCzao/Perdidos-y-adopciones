import axiosInstance from '../utils/axiosInstance';

const SEED_TOKEN = import.meta.env.VITE_API_SEED_TOKEN;

// Login
export const authLogin = async (datos) => {
  try {
    const { data } = await axiosInstance.post('/auth/login', datos, {
      headers: {
        "x-token": SEED_TOKEN,
      },
    });

    // Backend devuelve { success, usuario, accessToken, refreshToken }
    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    }

    return data;
  } catch (error) {
    console.error(error);
    return { msg: error.response?.data?.msg || "Error al iniciar sesion" };
  }
};

// Registro
export const crearUsuario = async (datos) => {
  try {
    const { data } = await axiosInstance.post('/usuarios', datos, {
      headers: {
        "x-token": SEED_TOKEN,
      },
    });

    // Backend solo devuelve { usuario }, NO genera tokens en registro
    // El usuario debe hacer login después de registrarse
    return data;
  } catch (error) {
    console.error(error);
    return { msg: error.response?.data?.msg || "Error al registrar usuario" };
  }
};

// Refresh Token - Ya no se usa manualmente, axiosInstance lo maneja
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const { data } = await axiosInstance.post('/auth/refresh', { refreshToken });

    // Backend devuelve { success, accessToken, refreshToken }
    if (data.success && data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      
      return { success: true, token: data.accessToken };
    }

    return { success: false, msg: data.msg || "Error al refrescar token" };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { success: false, msg: "Error al refrescar token" };
  }
};

// Logout
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (token && refreshToken) {
      await axiosInstance.post('/auth/logout', { refreshToken });
    }
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    // Limpiar localStorage siempre
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};
