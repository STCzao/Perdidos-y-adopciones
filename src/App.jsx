import { useState, useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { getAuthSyncKey } from "./services/api.js";
import { logout, refreshAccessToken } from "./services/auth.js";
import { usuariosService } from "./services/usuarios";
import AppRouter from "./router/AppRouter.jsx";
import { ErrorBoundary } from "./components/ui/ErrorBoundary.jsx";

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);

  const syncUser = useCallback((nextUser) => {
    try {
      window.dispatchEvent(
        new CustomEvent("userProfileUpdated", { detail: { user: nextUser } }),
      );
    } catch (error) {
      console.warn("No se pudo despachar userProfileUpdated:", error);
    }
  }, []);

  const clearSessionState = useCallback(() => {
    setLogin(false);
    setUser(null);
    syncUser(null);

    if (window.adminService?.clearCache) {
      window.adminService.clearCache();
    }
  }, [syncUser]);

  const hydrateSessionFromBackend = useCallback(async () => {
    const refreshed = await refreshAccessToken();

    if (!refreshed.success) {
      clearSessionState();
      return false;
    }

    const userData = await usuariosService.getMiPerfil();

    if (!userData.success || !userData.usuario) {
      clearSessionState();
      return false;
    }

    setUser(userData.usuario);
    setLogin(true);
    syncUser(userData.usuario);
    return true;
  }, [clearSessionState, syncUser]);

  const cerrarSesion = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }

    clearSessionState();
  }, [clearSessionState]);

  const guardarUsuario = useCallback(
    (datos) => {
      setUser(datos);
      setLogin(true);
      syncUser(datos);
    },
    [syncUser],
  );

  const iniciarSesion = useCallback(() => setLogin(true), []);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        await hydrateSessionFromBackend();
      } catch {
        clearSessionState();
      }
    };

    bootstrapSession();
  }, [clearSessionState, hydrateSessionFromBackend]);

  useEffect(() => {
    const handleForceLogout = () => {
      clearSessionState();
    };

    window.addEventListener("forceLogout", handleForceLogout);
    return () => window.removeEventListener("forceLogout", handleForceLogout);
  }, [clearSessionState]);

  useEffect(() => {
    const handleUserProfileUpdate = (event) => {
      const nextUser = event.detail?.user ?? null;
      setUser(nextUser);
      setLogin(!!nextUser);
    };

    window.addEventListener("userProfileUpdated", handleUserProfileUpdate);
    return () => window.removeEventListener("userProfileUpdated", handleUserProfileUpdate);
  }, []);

  useEffect(() => {
    const syncKey = getAuthSyncKey();

    const handleStorage = async (event) => {
      if (event.key !== syncKey || !event.newValue) return;

      try {
        const payload = JSON.parse(event.newValue);

        if (payload?.type === "logout" || payload?.type === "logout-all") {
          clearSessionState();
          return;
        }

        if (payload?.type === "login") {
          await hydrateSessionFromBackend();
        }
      } catch (error) {
        console.warn("No se pudo sincronizar la sesión entre pestañas:", error);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [clearSessionState, hydrateSessionFromBackend]);

  return (
    <ErrorBoundary>
      <AuthContext.Provider
        value={{ login, user, iniciarSesion, guardarUsuario, cerrarSesion }}
      >
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
