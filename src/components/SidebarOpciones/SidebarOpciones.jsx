"use client";
import React from "react";
import { motion } from "motion/react";
import { CrearPublicacion } from "../CrearPublicacion/CrearPublicacion";
import { EditarPerfil } from "../EditarPerfil/EditarPerfil";
import { VerPublicaciones } from "../VerPublicaciones/VerPublicaciones";
import { AdminPublicaciones } from "../AdminPublicaciones/AdminPublicaciones";
import { AdminUsuarios } from "../AdminUsuarios/AdminUsuarios";
import { usuariosService } from "../../services/usuarios";

// Context y Hook
const SidebarProviderContext = React.createContext();

export const useSidebar = () => {
  const context = React.useContext(SidebarProviderContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      cargarUsuario();
    }
  }, [open]);

  const cargarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No hay token disponible");
        return;
      }

      const userData = await usuariosService.getMiPerfil();

      if (userData && !userData.msg && !userData.errors) {
        setUser(userData);
        setIsAdmin(userData.rol === "ADMIN_ROLE");
      } else {
        console.warn(
          "Error al cargar usuario:",
          userData.msg || userData.errors
        );
      }
    } catch (error) {
      console.error("Error cargando usuario:", error);
    }
  };

  return (
    <SidebarProviderContext.Provider
      value={{
        open,
        setOpen,
        user,
        isAdmin,
        refreshUser: cargarUsuario,
      }}
    >
      {children}
    </SidebarProviderContext.Provider>
  );
};

export const SidebarOpciones = ({ cerrarSesion }) => {
  const { open, setOpen, user, isAdmin } = useSidebar();

  if (!open) return null;

  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="items-center fixed min-h-screen top-0 left-0 w-[300px] bg-black p-6 z-[100] flex flex-col gap-4 shadow-lg"
      >
        <h2 className="text-xl text-white text-center font-bold mb-4">
          {user ? `Hola, ${user.nombre}` : "Opciones de Usuario"}
        </h2>

        <button
          onClick={() => CrearPublicacion.openModal()}
          className="border border-white/20 font-medium w-full h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
        >
          Crear publicacion
        </button>

        <button
          onClick={() => EditarPerfil.openModal(user)}
          className="border border-white/20 font-medium w-full h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
        >
          Editar perfil
        </button>

        <button
          onClick={() => VerPublicaciones.openModal()}
          className="border border-white/20 font-medium w-full h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
        >
          Mis publicaciones
        </button>

        {/* Sección administrador */}
        {isAdmin && (
          <div className="border-t border-white/20 pt-4 mt-4 w-full flex flex-col gap-3">
            <span className="font-medium text-[#FF7857] text-sm block text-center">
              Panel de Administrador
            </span>

            <button
              onClick={() => AdminPublicaciones.openModal()}
              className="border border-[#FF7857]/50 font-medium w-full h-11 rounded-full text-white bg-[#FF7857]/20 hover:bg-[#FF7857] transition-opacity"
            >
              Todas las publicaciones
            </button>

            <button
              onClick={() => AdminUsuarios.openModal()}
              className="border border-[#FF7857]/50 font-medium w-full h-11 rounded-full text-white bg-[#FF7857]/20 hover:bg-[#FF7857] transition-opacity"
            >
              Todos los usuarios
            </button>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 w-full">
          <button
            onClick={() => setOpen(false)}
            className="border border-white/20 font-medium w-full h-11 rounded-full text-white bg-white/20 hover:bg-white/60 transition-opacity"
          >
            Cerrar
          </button>

          <button
            onClick={cerrarSesion}
            className="font-medium w-full h-11 rounded-full text-white bg-red-500 hover:bg-red-600 transition-opacity"
          >
            Cerrar Sesion
          </button>
        </div>
      </motion.div>

      {/* Modales */}
      <AdminPublicaciones.Component />
      <AdminUsuarios.Component />
    </>
  );
};
