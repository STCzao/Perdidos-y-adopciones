import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../src/pages/LoginScreen/LoginScreen";
import RegisterScreen from "../src/pages/RegisterScreen/RegisterScreen";
import ForgotPasswordScreen from "../src/pages/ForgotPasswordScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "../src/pages/ResetPasswordScreen/ResetPasswordScreen";
import HomeScreen from "../src/pages/HomeScreen/HomeScreen";
import PerdiScreen from "./pages/WhatDoScreen/PerdiScreen";
import EncontreScreen from "./pages/WhatDoScreen/EncontreScreen";
import CasosAyudaScreen from "./pages/CasesScreen/ComunidadScreen.jsx";
import ContactScreen from "./pages/ContactScreen/ContactScreen";
import { usuariosService } from "./services/usuarios";
import {
  SidebarProvider,
  SidebarOpciones,
} from "./components/SidebarOpciones/SidebarOpciones.jsx";
import { AdminPublicaciones } from "./components/AdminPublicaciones/AdminPublicaciones";
import { AdminUsuarios } from "./components/AdminUsuarios/AdminUsuarios";
import AdoptarScreen from "./pages/WhatDoScreen/AdoptarScreen.jsx";
import MediaScreen from "./pages/MediaScreen/MediaScreen.jsx";
import PublicacionesPage from "./pages/PublicacionesPages/PublicacionesPage.jsx";
import PublicacionesExitosas from "./pages/PublicacionesPages/PublicacionesExitosas.jsx";
import { AuthContext } from "./context/AuthContext";

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Funciones de auth (DECLARADAS ANTES DEL useEffect) ---
  const cerrarSesion = useCallback(() => {
    setLogin(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    if (window.adminService?.clearCache) {
      window.adminService.clearCache();
    }

    // Notificar al Sidebar que el usuario cerró sesión
    try {
      window.dispatchEvent(
        new CustomEvent("userProfileUpdated", { detail: { user: null } })
      );
    } catch (e) {
      console.warn("No se pudo despachar userProfileUpdated:", e);
    }
  }, []);

  const guardarUsuario = (datos) => {
    setUser(datos);
    setLogin(true);
    // Guardar usuario en localStorage
    localStorage.setItem("user", JSON.stringify(datos));
    // Notificar al Sidebar para sincronizar su estado de usuario
    try {
      window.dispatchEvent(
        new CustomEvent("userProfileUpdated", { detail: { user: datos } })
      );
    } catch (e) {
      console.warn("No se pudo despachar userProfileUpdated:", e);
    }
  };

  const iniciarSesion = () => setLogin(true);

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
            new CustomEvent("userProfileUpdated", { detail: { user: userData.usuario } })
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

  // --- Loading global ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7857]"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ login, user, iniciarSesion, guardarUsuario, cerrarSesion }}>
      <BrowserRouter>
        <SidebarProvider cerrarSesion={cerrarSesion}>
          {/* Sidebar global dentro de SidebarProvider para usar useSidebar() */}
          <SidebarOpciones />

          <Routes>
          {/* Rutas públicas - accesibles sin autenticación */}
          <Route path="/" element={<HomeScreen user={user} />} />
          <Route path="/publicaciones/:tipo" element={<PublicacionesPage user={user} />} />
          <Route path="/publicaciones-exitosas" element={<PublicacionesExitosas user={user} />} />
          <Route path="/consejos-perdi" element={<PerdiScreen user={user} />} />
          <Route path="/consejos-encontre" element={<EncontreScreen user={user} />} />
          <Route path="/consejos-adopcion" element={<AdoptarScreen user={user} />} />
          <Route path="/perdidos-informacion" element={<MediaScreen type="perdidos" />} />
          <Route path="/encontrados-informacion" element={<MediaScreen type="encontrados" />} />
          <Route path="/adopciones-informacion" element={<MediaScreen type="adopciones" />} />
          <Route path="/casos-ayuda" element={<CasosAyudaScreen user={user} />} />
          <Route path="/contacto" element={<ContactScreen user={user} />} />

          {/* Rutas de autenticación */}
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
          <Route path="/register" element={login ? <Navigate to="/" /> : <RegisterScreen />} />
          <Route path="/forgot-password" element={login ? <Navigate to="/" /> : <ForgotPasswordScreen />} />
          <Route
            path="/reset-password/:token"
            element={login ? <Navigate to="/" /> : <ResetPasswordScreen />}
          />

          <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* Modales Admin accesibles siempre */}
          <AdminPublicaciones.Component />
          <AdminUsuarios.Component />
        </SidebarProvider>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
