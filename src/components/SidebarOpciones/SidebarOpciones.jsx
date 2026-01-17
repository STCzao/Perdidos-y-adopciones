"use client";
import React from "react";
import { motion } from "motion/react";
import { EditarPerfil } from "../EditarPerfil/EditarPerfil";
import { VerPublicaciones } from "../VerPublicaciones/VerPublicaciones";
import { AdminPublicaciones } from "../AdminPublicaciones/AdminPublicaciones";
import { AdminUsuarios } from "../AdminUsuarios/AdminUsuarios";
import { usuariosService } from "../../services/usuarios";
import { CrearComunidad } from "../CrearComunidad/CrearComunidad";
import { VerComunidad } from "../VerComunidad/VerComunidad";
import { useState } from "react";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { useNavigate, useLocation } from "react-router-dom";

// Context y Hook
const SidebarProviderContext = React.createContext();

export const useSidebar = () => {
  const context = React.useContext(SidebarProviderContext);
  if (!context)
    throw new Error("useSidebar debe ser utilizado con SidebarProvider");
  return context;
};

export const SidebarProvider = ({ children, cerrarSesion }) => {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const location = useLocation();

  // Agregar listener para actualizaciones del perfil
  React.useEffect(() => {
    const handleUserProfileUpdate = (event) => {
      const updatedUser = event.detail?.user ?? null;
      setUser(updatedUser);
      setIsAdmin(!!(updatedUser && updatedUser.rol === "ADMIN_ROLE"));
    };

    window.addEventListener("userProfileUpdated", handleUserProfileUpdate);

    return () => {
      window.removeEventListener("userProfileUpdated", handleUserProfileUpdate);
    };
  }, []);

  const cargarUsuario = React.useCallback(async () => {
    try {
      const response = await usuariosService.getMiPerfil();

      if (response.ok && response.usuario) {
        setUser(response.usuario);
        setIsAdmin(response.usuario.rol === "ADMIN_ROLE");
      } else {
        console.warn(
          "Error al cargar usuario:",
          response.msg || "Datos inválidos"
        );
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error cargando usuario:", error);
      setUser(null);
      setIsAdmin(false);
    }
  }, []);

  React.useEffect(() => {
    cargarUsuario();
  }, [cargarUsuario]);

  // Cerrar automáticamente el sidebar al entrar a pantallas de auth
  React.useEffect(() => {
    const authPaths = ["/login", "/register", "/forgot-password"]; 
    if (open && (authPaths.includes(location.pathname) || location.pathname.startsWith("/reset-password"))) {
      setOpen(false);
    }
  }, [location.pathname, open]);

  return (
    <SidebarProviderContext.Provider
      value={{
        open,
        setOpen,
        user,
        isAdmin,
        refreshUser: cargarUsuario,
        cerrarSesion,
      }}
    >
      {children}
    </SidebarProviderContext.Provider>
  );
};

export const SidebarOpciones = () => {
  const { open, setOpen, user, isAdmin, cerrarSesion } = useSidebar();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    item: null,
  });

  const handleCerrarSesionClick = () => {
    setConfirmModal({
      isOpen: true,
      item: { tipo: "sesion" },
    });
  };

  const confirmarCerrarSesion = () => {
    // Cerrar sesión y cerrar el sidebar
    cerrarSesion();
    setOpen(false);
    setConfirmModal({ isOpen: false, item: null });
  };

  const cancelarCerrarSesion = () => {
    setConfirmModal({ isOpen: false, item: null });
  };

  if (!open) return null;

  // Si NO está autenticado, mostrar opciones de login/registro
  if (!user) {
    return (
      <>
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="items-center font-medium fixed min-h-screen top-0 left-0 w-[300px] bg-black p-6 z-[100] flex flex-col gap-4 shadow-lg justify-center"
        >
          <h2 className="text-2xl text-white text-center mb-6 font-bold">
            ¡Bienvenido!
          </h2>
          <p className="text-white text-center text-sm mb-4">
            Inicia sesión o crea una cuenta para acceder a todas las funcionalidades
          </p>
          
          <button
            onClick={() => {
              navigate("/login");
              setOpen(false);
            }}
            className="border border-[#FF7857] font-medium w-full h-11 rounded-full text-white bg-[#FF7857] hover:bg-[#FF7857]/60 transition-colors delay-100 duration-300"
          >
            Iniciar Sesión
          </button>
          
          <button
            onClick={() => {
              navigate("/register");
              setOpen(false);
            }}
            className="border border-white/20 font-medium w-full h-11 rounded-full text-white bg-white/20 hover:bg-white/60 transition-colors delay-100 duration-300"
          >
            Registrarse
          </button>

          <div className="mt-10 flex flex-col gap-2 w-full">
            <button
              onClick={() => setOpen(false)}
              className="border border-white/20 font-medium w-full h-11 rounded-full text-white bg-white/20 hover:bg-white/60 transition-colors delay-100 duration-300"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </>
    );
  }

  // Si está autenticado, mostrar sidebar normal
  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="items-center font-medium fixed min-h-screen top-0 left-0 w-[300px] bg-black p-6 z-[100] flex flex-col gap-2 shadow-lg"
      >
        <h2 className="text-xl text-white text-center mb-4">
          {user ? `Hola, ${user.nombre}` : "Opciones de Usuario"}
        </h2>
        <button
          onClick={() => EditarPerfil.openModal()}
          className="border border-white/20 font-medium w-full h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
        >
          Editar perfil
        </button>
        <button
          onClick={() => VerPublicaciones.openModal()}
          className="border border-white/20 font-medium w-full h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
        >
          Mis publicaciones
        </button>

        {/* Sección administrador */}
        {isAdmin && (
          <div className="border-t border-white/20 w-full flex flex-col pt-2 gap-2">
            <span className="font-medium text-[#FF7857] text-sm block text-center">
              Panel de Administrador
            </span>

            <button
              onClick={() => CrearComunidad.openModal()}
              className="border border-[#FF7857]/50 font-medium w-full h-11 rounded-full text-white bg-[#FF7857]/20 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
            >
              Crear caso para ayuda
            </button>
            <button
              onClick={() => AdminPublicaciones.openModal()}
              className="border border-[#FF7857]/50 font-medium w-full h-11 rounded-full text-white bg-[#FF7857]/20 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
            >
              Todas las publicaciones
            </button>

            <button
              onClick={() => AdminUsuarios.openModal()}
              className="border border-[#FF7857]/50 font-medium w-full h-11 rounded-full text-white bg-[#FF7857]/20 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
            >
              Todos los usuarios
            </button>
            <button
              onClick={() => VerComunidad.openModal()}
              className="border border-[#FF7857]/50 font-medium w-full h-11 rounded-full text-white bg-[#FF7857]/20 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
            >
              Todos los casos para ayuda
            </button>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-2 w-full">
          <button
            onClick={() => setOpen(false)}
            className="border border-white/20 font-medium w-full h-11 rounded-full text-white bg-white/20 hover:bg-white/60 transition-colors delay-100 duration-300"
          >
            Cerrar
          </button>

          <button
            onClick={handleCerrarSesionClick}
            className="font-medium w-full h-11 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors delay-100 duration-300"
          >
            Cerrar sesión
          </button>
        </div>
      </motion.div>

      {/* Modales */}
      <AdminPublicaciones.Component />
      <AdminUsuarios.Component />
      <CrearComunidad.Component />
      <VerComunidad.Component />

      <ConfirmModal
        confirmModal={confirmModal}
        onClose={cancelarCerrarSesion}
        onConfirm={confirmarCerrarSesion}
        type="sesion"
      />
    </>
  );
};
