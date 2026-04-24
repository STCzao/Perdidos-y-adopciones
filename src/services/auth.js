import axiosInstance, { clearAccessToken, setAccessToken } from "./api";

const mapAxiosError = (error, fallbackMsg) => ({
  success: false,
  msg: error.response?.data?.msg || fallbackMsg,
  errors: error.response?.data?.errors || {},
  ...error.response?.data,
});

export const authLogin = async (datos) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", datos);

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
    }

    return data;
  } catch (error) {
    return mapAxiosError(error, "Error al iniciar sesión");
  }
};

export const crearUsuario = async (datos) => {
  try {
    const { data } = await axiosInstance.post("/usuarios", datos);
    return data;
  } catch (error) {
    return mapAxiosError(error, "Error al registrar usuario");
  }
};

export const refreshAccessToken = async () => {
  try {
    const { data } = await axiosInstance.post("/auth/refresh", {});

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      return { success: true, accessToken: data.accessToken };
    }

    return {
      success: false,
      msg: data?.msg || "No se pudo refrescar la sesión",
    };
  } catch (error) {
    clearAccessToken();
    return mapAxiosError(error, "No se pudo refrescar la sesión");
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout", {});
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    clearAccessToken();
  }
};

export const logoutAll = async () => {
  try {
    const { data } = await axiosInstance.post("/auth/logout-all", {});
    return data;
  } catch (error) {
    return mapAxiosError(error, "No se pudo cerrar la sesión en todos los dispositivos");
  } finally {
    clearAccessToken();
  }
};

export const forgotPassword = async (correo) => {
  try {
    const { data } = await axiosInstance.post("/auth/forgot-password", { correo });
    return data;
  } catch (error) {
    return mapAxiosError(error, "No se pudo procesar la solicitud");
  }
};

export const resetPassword = async (token, body) => {
  try {
    const { data } = await axiosInstance.post(`/auth/reset-password/${token}`, body);
    return data;
  } catch (error) {
    return mapAxiosError(error, "No se pudo actualizar la contraseña");
  }
};
