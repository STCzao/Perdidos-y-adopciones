import { useState, useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "./components/layout/SidebarOpciones.jsx";
import { AuthContext } from "./context/AuthContext";
import { logout } from "./services/auth.js";
import { usuariosService } from "./services/usuarios";
import AppRouter from "./router/AppRouter.jsx";
import { ErrorBoundary } from "./components/ui/ErrorBoundary.jsx";

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Funciones de auth (DECLARADAS ANTES DEL useEffect) ---
  const cerrarSesion = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    setLogin(false);
    setUser(null);

    if (window.adminService?.clearCache) {
      window.adminService.clearCache();
    }

    // Notificar al Sidebar que el usuario cerró sesión
    try {
      window.dispatchEvent(
        new CustomEvent("userProfileUpdated", { detail: { user: null } }),
      );
    } catch (e) {
      console.warn("No se pudo despachar userProfileUpdated:", e);
    }
  }, []);

  const guardarUsuario = useCallback((datos) => {
    setUser(datos);
    setLogin(true);
    // Guardar usuario en localStorage
    localStorage.setItem("user", JSON.stringify(datos));
    // Notificar al Sidebar para sincronizar su estado de usuario
    try {
      window.dispatchEvent(
        new CustomEvent("userProfileUpdated", { detail: { user: datos } }),
      );
    } catch (e) {
      console.warn("No se pudo despachar userProfileUpdated:", e);
    }
  }, []);

  const iniciarSesion = useCallback(() => setLogin(true), []);

  // --- Verificar token al iniciar ---
  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        setLogin(false);
        return;
      }

      try {
        const userData = await usuariosService.getMiPerfil();

        if (!userData.ok) {
          if (userData.status === 401 || userData.msg === "Sesion expirada") {
            cerrarSesion();
          }
        } else {
          setUser(userData.usuario);
          setLogin(true);
          // Guardar usuario en localStorage para sincronización
          localStorage.setItem("user", JSON.stringify(userData.usuario));
          // Notificar al Sidebar que el usuario está cargado
          window.dispatchEvent(
            new CustomEvent("userProfileUpdated", {
              detail: { user: userData.usuario },
            }),
          );
        }
      } catch (err) {
        console.error("Error al verificar token:", err);
      } finally {
        setLoading(false);
      }
    };

    verificarToken();
  }, [cerrarSesion]);

  // --- Escuchar logout forzado desde axiosInstance (token expirado sin refresh) ---
  useEffect(() => {
    const handleForceLogout = () => cerrarSesion();
    window.addEventListener("forceLogout", handleForceLogout);
    return () => window.removeEventListener("forceLogout", handleForceLogout);
  }, [cerrarSesion]);

  // --- Loading global ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7857]"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthContext.Provider
        value={{ login, user, iniciarSesion, guardarUsuario, cerrarSesion }}
      >
        <BrowserRouter>
          <SidebarProvider cerrarSesion={cerrarSesion}>
            <AppRouter />
          </SidebarProvider>
        </BrowserRouter>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
