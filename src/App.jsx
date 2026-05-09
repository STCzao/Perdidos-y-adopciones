import { useState, useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { getAuthSyncKey } from "./services/api.js";
import { logout, refreshAccessToken } from "./services/auth.js";
import { adminService } from "./services/admin";
import { usuariosService } from "./services/usuarios";
import AppRouter from "./router/AppRouter.jsx";
import { ErrorBoundary } from "./components/ui/ErrorBoundary.jsx";
import LoadingState from "./components/ui/LoadingState.jsx";

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

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
    adminService.clearCache();
  }, [syncUser]);

  const hydrateSessionFromBackend = useCallback(async () => {
    const refreshed = await refreshAccessToken();

    if (!refreshed.success) {
      clearSessionState();
      return false;
    }

    const nextUser = refreshed.usuario ?? null;

    if (nextUser) {
      setUser(nextUser);
      setLogin(true);
      syncUser(nextUser);
      return true;
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

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      try {
        await hydrateSessionFromBackend();
      } catch {
        if (!cancelled) {
          clearSessionState();
        }
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      cancelled = true;
    };
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
      <AuthContext.Provider value={{ login, user, guardarUsuario, cerrarSesion }}>
        {isHydrating ? (
          <LoadingState fullScreen label="Cargando..." />
        ) : (
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        )}
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
