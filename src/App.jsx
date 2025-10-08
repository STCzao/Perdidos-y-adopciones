import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../src/pages/LoginScreen/LoginScreen";
import RegisterScreen from "../src/pages/RegisterScreen/RegisterScreen";
import ForgotPasswordScreen from "../src/pages/ForgotPasswordScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "../src/pages/ResetPasswordScreen/ResetPasswordScreen";
import ProtectedRoutes from "../src/routes/ProtectedRoutes/ProtectedRoutes";
import HomeScreen from "../src/pages/HomeScreen/HomeScreen";
import { usuariosService } from "./services"; // ← ÚNICO IMPORT AGREGADO

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Verificar token al iniciar la app
  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // ✅ USAR getMiPerfil QUE SÍ EXISTE
        const userData = await usuariosService.getMiPerfil();

        if (userData.msg) {
          cerrarSesion();
        } else {
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
  };

  const iniciarSesion = () => setLogin(true);

  const cerrarSesion = () => {
    setLogin(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      <Routes>
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
        <Route path="/register" element={<RegisterScreen />} />

        {/* Recuperar contraseña */}
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordScreen />}
        />

        {/* Rutas protegidas */}
        {!loading && (
          <Route
            path="/"
            element={
              <ProtectedRoutes login={login}>
                <HomeScreen cerrarSesion={cerrarSesion} user={user} />
              </ProtectedRoutes>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
