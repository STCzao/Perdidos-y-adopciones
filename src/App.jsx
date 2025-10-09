import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../src/pages/LoginScreen/LoginScreen";
import RegisterScreen from "../src/pages/RegisterScreen/RegisterScreen";
import ForgotPasswordScreen from "../src/pages/ForgotPasswordScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "../src/pages/ResetPasswordScreen/ResetPasswordScreen";
import ProtectedRoutes from "../src/routes/ProtectedRoutes/ProtectedRoutes";
import HomeScreen from "../src/pages/HomeScreen/HomeScreen";
import { usuariosService } from "./services/usuarios";
import { AdminPublicaciones } from "./components/AdminPublicaciones/AdminPublicaciones";
import { AdminUsuarios } from "./components/AdminUsuarios/AdminUsuarios";

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Verificar token al iniciar la app
  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem("token");

      // Si no hay token, ir directamente a login
      if (!token) {
        setLoading(false);
        setLogin(false);
        return;
      }

      try {
        const userData = await usuariosService.getMiPerfil();

        // Si hay un mensaje de error, el token es inválido
        if (userData.msg || userData.errors) {
          console.warn("Token inválido:", userData.msg || userData.errors);
          cerrarSesion();
        } else {
          // Token válido
          setUser(userData);
          setLogin(true);
        }
      } catch (error) {
        console.error("Error al verificar token:", error);
        cerrarSesion();
      } finally {
        setLoading(false);
      }
    };

    verificarToken();
  }, []);

  const guardarUsuario = (datos) => {
    setUser(datos);
    setLogin(true);
  };

  const iniciarSesion = () => setLogin(true);

  const cerrarSesion = () => {
    setLogin(false);
    setUser(null);
    localStorage.removeItem("token");
    // Limpiar cualquier cache de servicios
    if (window.adminService?.clearCache) {
      window.adminService.clearCache();
    }
  };

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7857]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz - redirige según autenticación */}
        <Route
          path="/"
          element={
            login ? (
              <ProtectedRoutes login={login}>
                <HomeScreen cerrarSesion={cerrarSesion} user={user} />
              </ProtectedRoutes>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            login ? (
              <Navigate to="/" />
            ) : (
              <LoginScreen
                iniciarSesion={iniciarSesion}
                guardarUsuario={guardarUsuario}
              />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={login ? <Navigate to="/" /> : <RegisterScreen />}
        />

        {/* Recuperar contraseña */}
        <Route
          path="/forgot-password"
          element={login ? <Navigate to="/" /> : <ForgotPasswordScreen />}
        />

        <Route
          path="/reset-password/:token"
          element={login ? <Navigate to="/" /> : <ResetPasswordScreen />}
        />

        {/* Ruta de fallback para URLs no encontradas */}
        <Route path="*" element={<Navigate to={login ? "/" : "/login"} />} />
      </Routes>

      {/* Renderizar componentes modales de admin globalmente */}
      <AdminPublicaciones.Component />
      <AdminUsuarios.Component />
    </BrowserRouter>
  );
}

export default App;
