"use client";
import React from "react";
import { motion } from "motion/react";
import { CrearPublicacion } from "../CrearPublicacion/CrearPublicacion";
import { EditarPerfil } from "../EditarPerfil/EditarPerfil";
import { VerPublicaciones } from "../VerPublicaciones/VerPublicaciones";
import { usuariosService } from "../../services";

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
      const userData = await usuariosService.getMiPerfil();
      if (userData && !userData.msg) {
        setUser(userData);
        setIsAdmin(userData.rol === "ADMIN_ROLE");
      }
    } catch (error) {
      console.error("Error cargando usuario:", error);
    }
  };

  return (
    <SidebarProviderContext.Provider value={{ open, setOpen, user, isAdmin }}>
      {children}
    </SidebarProviderContext.Provider>
  );
};

export const SidebarOpciones = ({ cerrarSesion }) => {
  const { open, setOpen, user, isAdmin } = useSidebar();

  if (!open) return null;

  return (
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
        className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
      >
        Crear Publicación
      </button>

      <button
        onClick={() => EditarPerfil.openModal(user)}
        className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
      >
        Editar Perfil
      </button>

      <button
        onClick={() => VerPublicaciones.openModal()}
        className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
      >
        Mis Publicaciones
      </button>

      {isAdmin && (
        <div className="border-t border-white/20 pt-4 mt-4 w-full text-center">
          <span className="font-medium text-[#FF7857] text-sm">
            Administrador
          </span>
        </div>
      )}

      <button
        onClick={() => setOpen(false)}
        className="border border-white/20 font-medium mt-60 md:mt-100 lg:mt-80 w-50 h-11 rounded-full text-white bg-white/20 hover:bg-white/60 transition-opacity flex items-center justify-center px-4"
      >
        Cerrar
      </button>

      <button
        onClick={cerrarSesion}
        className="font-medium w-50 h-11 rounded-full text-white bg-red-500 hover:bg-red-600 transition-opacity flex items-center justify-center px-4"
      >
        Cerrar Sesión
      </button>
    </motion.div>
  );
};
