import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../src/pages/LoginScreen/LoginScreen";
import RegisterScreen from "../src/pages/RegisterScreen/RegisterScreen";
import ForgotPasswordScreen from "../src/pages/ForgotPasswordScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "../src/pages/ResetPasswordScreen/ResetPasswordScreen";
import ProtectedRoutes from "../src/routes/ProtectedRoutes/ProtectedRoutes";
import HomeScreen from "../src/pages/HomeScreen/HomeScreen";
import PerdidosPage from "../src/pages/PublicacionesPages/PerdidosPage";
import EncontradosPage from "./pages/PublicacionesPages/EncontradosPage";
import AdopcionesPage from "./pages/PublicacionesPages/AdopcionesPage";
import PerdiScreen from "./pages/WhatDoScreen/PerdiScreen";
import EncontreScreen from "./pages/WhatDoScreen/EncontreScreen";
import CasosAyudaScreen from "./pages/CasesScreen/CasosAyudaScreen";
import ContactScreen from "./pages/ContactScreen/ContactScreen";
import { usuariosService } from "./services/usuarios";
import {
  SidebarProvider,
  SidebarOpciones,
} from "./components/SidebarOpciones/SidebarOpciones.jsx";
import { AdminPublicaciones } from "./components/AdminPublicaciones/AdminPublicaciones";
import { AdminUsuarios } from "./components/AdminUsuarios/AdminUsuarios";
import AdoptarScreen from "./pages/WhatDoScreen/AdoptarScreen.jsx";

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        }
      } catch (err) {
        console.error("Error al verificar token:", err);
      } finally {
        setLoading(false);
      }
    };

    verificarToken();
  }, []);

  // --- Funciones de auth ---
  const guardarUsuario = (datos) => {
    setUser(datos);
    setLogin(true);
  };

  const iniciarSesion = () => setLogin(true);

  const cerrarSesion = () => {
    setLogin(false);
    setUser(null);
    localStorage.removeItem("token");

    if (window.adminService?.clearCache) {
      window.adminService.clearCache();
    }
  };

  // --- Loading global ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7857]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {login ? (
        <SidebarProvider cerrarSesion={cerrarSesion}>
          {/* Sidebar global activo solo si login = true */}
          <SidebarOpciones />

          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoutes login={login}>
                  <HomeScreen user={user} />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/perdidos"
              element={
                <ProtectedRoutes login={login}>
                  <PerdidosPage user={user}  />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/encontrados"
              element={
                <ProtectedRoutes login={login}>
                  <EncontradosPage user={user}  />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/adopciones"
              element={
                <ProtectedRoutes login={login}>
                  <AdopcionesPage user={user}  />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/consejos-perdi"
              element={
                <ProtectedRoutes login={login}>
                  <PerdiScreen user={user}  />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/consejos-encontre"
              element={
                <ProtectedRoutes login={login}>
                  <EncontreScreen user={user}  />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/consejos-adopcion"
              element={
                <ProtectedRoutes login={login}>
                  <AdoptarScreen user={user}  />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/blog"
              element={
                <ProtectedRoutes login={login}>
                  <CasosAyudaScreen user={user}  />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/contacto"
              element={
                <ProtectedRoutes login={login}>
                  <ContactScreen user={user}  />
                </ProtectedRoutes>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SidebarProvider>
      ) : (
        <>
          <Routes>
            <Route
              path="/login"
              element={
                <LoginScreen
                  iniciarSesion={iniciarSesion}
                  guardarUsuario={guardarUsuario}
                />
              }
            />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordScreen />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </>
      )}

      {/* Modales Admin accesibles siempre */}
      <AdminPublicaciones.Component />
      <AdminUsuarios.Component />
    </BrowserRouter>
  );
}

export default App;
