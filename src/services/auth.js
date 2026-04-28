import axiosInstance, {
  broadcastAuthEvent,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./api";
import { getResponseRequestId, mapServiceError } from "./serviceUtils";

export const authLogin = async (datos) => {
  try {
    const response = await axiosInstance.post("/auth/login", datos);
    const { data } = response;

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
    }

    broadcastAuthEvent("login");

    return {
      ...data,
      requestId: data?.requestId || getResponseRequestId(response),
    };
  } catch (error) {
    return mapServiceError(error, "Error al iniciar sesión");
  }
};

export const crearUsuario = async (datos) => {
  try {
    const response = await axiosInstance.post("/usuarios", datos);
    return {
      ...response.data,
      requestId: response.data?.requestId || getResponseRequestId(response),
    };
  } catch (error) {
    return mapServiceError(error, "Error al registrar usuario");
  }
};

let refreshPromise = null;

export const refreshAccessToken = async () => {
  // Deduplicar llamadas concurrentes (React StrictMode doble-mount, cross-tab, etc.).
  // Si ya hay un refresh en vuelo, todas las llamadas simultáneas comparten la misma
  // Promise → un solo request HTTP → el backend nunca ve el mismo token dos veces.
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh", {});
      const { data } = response;

      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        return {
          success: true,
          accessToken: data.accessToken,
          requestId: data?.requestId || getResponseRequestId(response),
        };
      }

      return {
        success: false,
        msg: data?.msg || "No se pudo refrescar la sesión",
        errors: {},
        requestId: data?.requestId || getResponseRequestId(response),
      };
    } catch (error) {
      if (!getAccessToken()) {
        clearAccessToken();
      }
      return mapServiceError(error, "No se pudo refrescar la sesión");
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout", {});
  } catch (error) {
    const status = error.response?.status;

    if (![400, 401, 429].includes(status)) {
      console.error("Error during logout:", error);
    }
  } finally {
    clearAccessToken();
    broadcastAuthEvent("logout");
  }
};

export const logoutAll = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout-all", {});
    return {
      ...response.data,
      requestId: response.data?.requestId || getResponseRequestId(response),
    };
  } catch (error) {
    return mapServiceError(error, "No se pudo cerrar la sesión en todos los dispositivos");
  } finally {
    clearAccessToken();
    broadcastAuthEvent("logout-all");
  }
};

export const forgotPassword = async (correo) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", { correo });
    return {
      ...response.data,
      requestId: response.data?.requestId || getResponseRequestId(response),
    };
  } catch (error) {
    return mapServiceError(error, "No se pudo procesar la solicitud");
  }
};

export const resetPassword = async (token, body) => {
  try {
    const response = await axiosInstance.post(`/auth/reset-password/${token}`, body);
    return {
      ...response.data,
      requestId: response.data?.requestId || getResponseRequestId(response),
    };
  } catch (error) {
    return mapServiceError(error, "No se pudo actualizar la contraseña");
  }
};
