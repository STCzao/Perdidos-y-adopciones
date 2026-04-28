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

const panelShellClassName =
  "fixed left-0 top-0 z-[100] flex min-h-screen w-[320px] flex-col border-r border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] p-6 font-medium text-[color:var(--shell-ink)] shadow-[0_24px_70px_rgba(31,20,14,0.18)]";

const sectionCardClassName =
  "rounded-[1.1rem] border border-[color:var(--shell-line)] bg-white/72 p-3";

const primaryButtonClassName =
  "h-11 w-full cursor-pointer rounded-full bg-[color:var(--shell-bark)] font-medium text-white transition-colors duration-300 hover:bg-[#45362d]";

const secondaryButtonClassName =
  "h-11 w-full cursor-pointer rounded-full border border-[color:var(--shell-line)] bg-white font-medium text-[color:var(--shell-ink)] transition-colors duration-300 hover:bg-[color:var(--shell-surface-alt)]";

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
          className={`${panelShellClassName} justify-center gap-4`}
        >
          <h2 className="mb-2 text-center text-2xl font-bold text-[color:var(--shell-bark)]">
            Bienvenido
          </h2>
          <p className="mb-4 text-center text-sm text-[color:var(--shell-muted)]">
            Inicia sesion o crea una cuenta para acceder a todas las funcionalidades.
          </p>

          <button
            onClick={() => {
              const currentPath = location.pathname + location.search + location.hash;
              localStorage.setItem("returnUrl", currentPath);
              navigate("/login");
              setOpen(false);
            }}
            className={primaryButtonClassName}
          >
            Iniciar sesion
          </button>

          <button
            onClick={() => {
              const currentPath = location.pathname + location.search + location.hash;
              localStorage.setItem("returnUrl", currentPath);
              navigate("/register");
              setOpen(false);
            }}
            className={secondaryButtonClassName}
          >
            Registrarse
          </button>

          <div className="mt-6 flex w-full flex-col gap-2">
            <button onClick={() => setOpen(false)} className={secondaryButtonClassName}>
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
        className={`${panelShellClassName} gap-4`}
      >
        <div>
          <h2 className="mb-1 text-center text-xl text-[color:var(--shell-bark)]">
            {`Hola, ${user.nombre}`}
          </h2>
          <p className="text-center text-sm text-[color:var(--shell-muted)]">
            Gestiona tu cuenta y tus accesos desde un solo lugar.
          </p>
        </div>

        <div className={sectionCardClassName}>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
            Cuenta
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <button onClick={() => EditarPerfil.openModal()} className={secondaryButtonClassName}>
              Editar perfil
            </button>
            <button
              onClick={() => VerPublicaciones.openModal()}
              className={secondaryButtonClassName}
            >
              Mis publicaciones
            </button>
          </div>
        </div>

        {isAdmin && (
          <div className={sectionCardClassName}>
            <span className="block text-center text-sm font-medium text-[color:var(--shell-bark)]">
              Panel de Administrador
            </span>

            <div className="mt-3 flex flex-col gap-2">
              <button onClick={() => CrearComunidad.openModal()} className={secondaryButtonClassName}>
                Crear caso para ayuda
              </button>
              <button
                onClick={() => AdminPublicaciones.openModal()}
                className={secondaryButtonClassName}
              >
                Todas las publicaciones
              </button>
              <button onClick={() => AdminUsuarios.openModal()} className={secondaryButtonClassName}>
                Todos los usuarios
              </button>
              <button onClick={() => VerComunidad.openModal()} className={secondaryButtonClassName}>
                Todos los casos para ayuda
              </button>
            </div>
          </div>
        )}

        <div className="mt-auto flex w-full flex-col gap-2 pt-4">
          <button onClick={() => setOpen(false)} className={secondaryButtonClassName}>
            Cerrar menu
          </button>

          <button onClick={handleCerrarSesionClick} className={primaryButtonClassName}>
            Cerrar sesion
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
