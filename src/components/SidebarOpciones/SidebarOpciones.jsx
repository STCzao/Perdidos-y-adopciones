"use client";
import React from "react";
import { motion } from "motion/react";
import { CrearPublicacion } from "../CrearPublicacion/CrearPublicacion";
import { EditarPerfil } from "../EditarPerfil/EditarPerfil";
import { VerPublicaciones } from "../VerPublicaciones/VerPublicaciones";
import { EditarPublicacion } from "../EditarPublicacion/EditarPublicacion";

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
  return (
    <SidebarProviderContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarProviderContext.Provider>
  );
};

// Componente SidebarOpciones con Cerrar Sesión como botón más
export const SidebarOpciones = ({ cerrarSesion }) => {
  const { open, setOpen } = useSidebar();

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
        Opciones de Usuario
      </h2>

      <button
        onClick={() => CrearPublicacion.openModal()}
        className="font-medium w-45 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity flex items-center justify-center px-4"
      >
        Crear Publicación
      </button>

      <button
        onClick={() => EditarPerfil.openModal()}
        className="font-medium w-45 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity flex items-center justify-center px-4"
      >
        Editar Perfil
      </button>

      <button
        onClick={() => VerPublicaciones.openModal()}
        className="font-medium w-45 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity flex items-center justify-center px-4"
      >
        Ver Mis Publicaciones
      </button>

      <button
        onClick={() => EditarPublicacion.openModal()}
        className="font-medium w-45 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity flex items-center justify-center px-4"
      >
        Editar Publicación
      </button>

      {/* Botón Cerrar Sidebar */}
      <button
        onClick={() => setOpen(false)}
        className="font-medium mt-60 md:mt-100 lg:mt-80 w-45 h-11 rounded-full text-white bg-white/20 hover:bg-white/60 transition-opacity flex items-center justify-center px-4"
      >
        Cerrar
      </button>

      <button
        onClick={cerrarSesion}
        className="font-medium w-45 h-11 rounded-full text-white bg-red-500 hover:bg-red-600 transition-opacity flex items-center justify-center px-4"
      >
        Cerrar Sesión
      </button>
    </motion.div>
  );
};
