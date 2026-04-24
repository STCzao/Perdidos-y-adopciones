import { useState, useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { logout, refreshAccessToken } from "./services/auth.js";
import { usuariosService } from "./services/usuarios";
import AppRouter from "./router/AppRouter.jsx";
import { ErrorBoundary } from "./components/ui/ErrorBoundary.jsx";

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUser = useCallback((nextUser) => {
    try {
      window.dispatchEvent(
        new CustomEvent("userProfileUpdated", { detail: { user: nextUser } }),
      );
    } catch (error) {
      console.warn("No se pudo despachar userProfileUpdated:", error);
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }

    setLogin(false);
    setUser(null);
    syncUser(null);

    if (window.adminService?.clearCache) {
      window.adminService.clearCache();
    }
  }, [syncUser]);

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
      setLoading(true);

      try {
        const refreshed = await refreshAccessToken();

        if (!refreshed.success) {
          setLogin(false);
          setUser(null);
          syncUser(null);
          return;
        }

        const userData = await usuariosService.getMiPerfil();

        if (!userData.ok || !userData.usuario) {
          setLogin(false);
          setUser(null);
          syncUser(null);
          return;
        }

        setUser(userData.usuario);
        setLogin(true);
        syncUser(userData.usuario);
      } catch (error) {
        console.error("Error al iniciar sesión persistida:", error);
        setLogin(false);
        setUser(null);
        syncUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapSession();
  }, [syncUser]);

  useEffect(() => {
    const handleForceLogout = () => {
      cerrarSesion();
    };

    window.addEventListener("forceLogout", handleForceLogout);
    return () => window.removeEventListener("forceLogout", handleForceLogout);
  }, [cerrarSesion]);

  useEffect(() => {
    const handleUserProfileUpdate = (event) => {
      const nextUser = event.detail?.user ?? null;
      setUser(nextUser);
      setLogin(!!nextUser);
    };

    window.addEventListener("userProfileUpdated", handleUserProfileUpdate);
    return () => window.removeEventListener("userProfileUpdated", handleUserProfileUpdate);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#FF7857]" />
      </div>
    );
  }

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
