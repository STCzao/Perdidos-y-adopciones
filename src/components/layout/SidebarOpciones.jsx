"use client";
import React from "react";
import { motion } from "motion/react";
import { EditarPerfil } from "../../features/usuarios/EditarPerfil";
import { VerPublicaciones } from "../../features/publicaciones/VerPublicaciones";
import { AdminPublicaciones } from "../../features/publicaciones/AdminPublicaciones";
import { AdminUsuarios } from "../../features/usuarios/AdminUsuarios";
import { CrearComunidad } from "../../features/comunidad/CrearComunidad";
import { VerComunidad } from "../../features/comunidad/VerComunidad";
import { useState } from "react";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SidebarProviderContext = React.createContext();

export const useSidebar = () => {
  const context = React.useContext(SidebarProviderContext);
  if (!context) {
    throw new Error("useSidebar debe ser utilizado con SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children, cerrarSesion }) => {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = !!(user && user.rol === "ADMIN_ROLE");

  React.useEffect(() => {
    const authPaths = ["/login", "/register", "/forgot-password"];
    if (open && (authPaths.includes(location.pathname) || location.pathname.startsWith("/reset-password"))) {
      setOpen(false);
    }
  }, [location.pathname, open]);

  React.useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      const restoreScroll = () => {
        window.scrollTo(scrollX, scrollY);
      };

      restoreScroll();

      return () => {
        window.scrollTo(scrollX, scrollY);
      };
    }
    return undefined;
  }, [open]);

  return (
    <SidebarProviderContext.Provider
      value={{
        open,
        setOpen,
        user,
        isAdmin,
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
  const location = useLocation();
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
    cerrarSesion();
    setOpen(false);
    setConfirmModal({ isOpen: false, item: null });
  };

  const cancelarCerrarSesion = () => {
    setConfirmModal({ isOpen: false, item: null });
  };

  if (!open) return null;

  if (!user) {
    return (
      <>
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed left-0 top-0 z-[100] flex min-h-screen w-[300px] flex-col justify-center gap-4 bg-black p-6 font-medium shadow-lg"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            ¡Bienvenido!
          </h2>
          <p className="mb-4 text-center text-sm text-white">
            Inicia sesión o crea una cuenta para acceder a todas las funcionalidades
          </p>

          <button
            onClick={() => {
              const currentPath = location.pathname + location.search + location.hash;
              localStorage.setItem("returnUrl", currentPath);
              navigate("/login");
              setOpen(false);
            }}
            className="h-11 w-full cursor-pointer rounded-full border border-[#FF7857] bg-[#FF7857] font-medium text-white transition-colors delay-100 duration-300 hover:bg-[#FF7857]/60"
          >
            Iniciar sesión
          </button>

          <button
            onClick={() => {
              const currentPath = location.pathname + location.search + location.hash;
              localStorage.setItem("returnUrl", currentPath);
              navigate("/register");
              setOpen(false);
            }}
            className="h-11 w-full cursor-pointer rounded-full border border-white/20 bg-white/20 font-medium text-white transition-colors delay-100 duration-300 hover:bg-white/60"
          >
            Registrarse
          </button>

          <div className="mt-10 flex w-full flex-col gap-2">
            <button
              onClick={() => setOpen(false)}
              className="h-11 w-full cursor-pointer rounded-full border border-white/20 bg-white/20 font-medium text-white transition-colors delay-100 duration-300 hover:bg-white/60"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-[100] flex min-h-screen w-[300px] flex-col gap-2 bg-black p-6 font-medium shadow-lg"
      >
        <h2 className="mb-4 text-center text-xl text-white">
          {`Hola, ${user.nombre}`}
        </h2>
        <button
          onClick={() => EditarPerfil.openModal()}
          className="h-11 w-full cursor-pointer rounded-full border border-white/20 bg-white/20 font-medium text-white transition-colors delay-100 duration-300 hover:bg-[#FF7857]"
        >
          Editar perfil
        </button>
        <button
          onClick={() => VerPublicaciones.openModal()}
          className="h-11 w-full cursor-pointer rounded-full border border-white/20 bg-white/20 font-medium text-white transition-colors delay-100 duration-300 hover:bg-[#FF7857]"
        >
          Mis publicaciones
        </button>

        {isAdmin && (
          <div className="flex w-full flex-col gap-2 border-t border-white/20 pt-2">
            <span className="block text-center text-sm font-medium text-[#FF7857]">
              Panel de Administrador
            </span>

            <button
              onClick={() => CrearComunidad.openModal()}
              className="h-11 w-full cursor-pointer rounded-full border border-[#FF7857]/50 bg-[#FF7857]/20 font-medium text-white transition-colors delay-100 duration-300 hover:bg-[#FF7857]"
            >
              Crear caso para ayuda
            </button>
            <button
              onClick={() => AdminPublicaciones.openModal()}
              className="h-11 w-full cursor-pointer rounded-full border border-[#FF7857]/50 bg-[#FF7857]/20 font-medium text-white transition-colors delay-100 duration-300 hover:bg-[#FF7857]"
            >
              Todas las publicaciones
            </button>

            <button
              onClick={() => AdminUsuarios.openModal()}
              className="h-11 w-full cursor-pointer rounded-full border border-[#FF7857]/50 bg-[#FF7857]/20 font-medium text-white transition-colors delay-100 duration-300 hover:bg-[#FF7857]"
            >
              Todos los usuarios
            </button>
            <button
              onClick={() => VerComunidad.openModal()}
              className="h-11 w-full cursor-pointer rounded-full border border-[#FF7857]/50 bg-[#FF7857]/20 font-medium text-white transition-colors delay-100 duration-300 hover:bg-[#FF7857]"
            >
              Todos los casos para ayuda
            </button>
          </div>
        )}

        <div className="mt-10 flex w-full flex-col gap-2">
          <button
            onClick={() => setOpen(false)}
            className="h-11 w-full cursor-pointer rounded-full border border-white/20 bg-white/20 font-medium text-white transition-colors delay-100 duration-300 hover:bg-white/60"
          >
            Cerrar menú
          </button>

          <button
            onClick={handleCerrarSesionClick}
            className="h-11 w-full cursor-pointer rounded-full bg-red-500 font-medium text-white transition-colors delay-100 duration-300 hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </motion.div>

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
