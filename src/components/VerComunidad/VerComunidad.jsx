"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { comunidadService } from "../../services/comunidad";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { CrearComunidad } from "../../components/CrearComunidad/CrearComunidad";
import { useSidebar } from "../SidebarOpciones/SidebarOpciones";

let modalControl;

export const VerComunidad = {
  openModal: () => modalControl?.setOpen(true),

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      item: null,
      action: "",
    });

    const { user } = useSidebar();

    modalControl = { setOpen };

    useEffect(() => {
      if (open && user?.rol !== "ADMIN_ROLE") {
        setOpen(false);
        return;
      }

      if (open) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        cargarItems();
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      };
    }, [open, user]);

    const cargarItems = useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        const resp = await comunidadService.obtenerComunidad();
        if (resp?.success) setItems(resp.comunidades || []);
        else setError(resp?.msg || "Error al obtener comunidad");
      } catch {
        setError("Error de conexion al servidor");
      } finally {
        setLoading(false);
      }
    }, []);

    const handleEliminar = useCallback(async (item) => {
      try {
        const result = await comunidadService.borrarComunidad(item._id);
        if (result.success) {
          setItems((prev) => prev.filter((p) => p._id !== item._id));
          return true;
        } else {
          setError(result.msg || "Error al eliminar item");
          return false;
        }
      } catch {
        setError("Error de conexion al eliminar");
        return false;
      }
    }, []);

    const handleEditar = useCallback((item) => {
      CrearComunidad.openModal(item);
      setOpen(false);
    }, []);

    const openConfirmModal = useCallback((item, action) => {
      setConfirmModal({ isOpen: true, item, action });
    }, []);

    const closeConfirmModal = useCallback(() => {
      setConfirmModal({ isOpen: false, item: null, action: "" });
    }, []);

    const handleConfirm = useCallback(async () => {
      if (confirmModal.action === "delete" && confirmModal.item) {
        await handleEliminar(confirmModal.item);
      }
      closeConfirmModal();
    }, [confirmModal, handleEliminar, closeConfirmModal]);

    const handleClose = useCallback(() => {
      setOpen(false);
      setError("");
      setItems([]);
    }, []);

    if (!open) return null;

    return (
      <div className="font-medium fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          <div className="max-w-6xl w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg bg-white/10 backdrop-blur-sm relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-[#FF7857] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-white text-3xl mt-2 font-medium">
                Administrar Comunidad
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Gestiona todos los casos de la comunidad
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-300">{error}</p>
                <button
                  onClick={cargarItems}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reintentar
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]"></div>
              </div>
            ) : (
              <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {items.map((item) => (
                  <ComunidadItem
                    key={item._id}
                    item={item}
                    onEliminar={openConfirmModal}
                    onEditar={handleEditar}
                    loading={loading}
                  />
                ))}
                {items.length === 0 && !loading && (
                  <div className="text-center py-8 text-white/60">
                    No hay publicaciones de comunidad
                  </div>
                )}
              </div>
            )}
          </div>

          <ConfirmModal
            confirmModal={confirmModal}
            onClose={closeConfirmModal}
            onConfirm={handleConfirm}
            type="comunidad"
          />
        </motion.div>
      </div>
    );
  }),
};

const ComunidadItem = React.memo(({ item, onEliminar, onEditar, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 border border-white/20 rounded-lg p-4 flex justify-between items-start backdrop-blur-sm"
    >
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-white text-lg">{item.titulo}</h3>

        <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/80">
          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded">
            {item.categoria}
          </span>
          <span className="text-white/70">
            {item.contenido?.slice(0, 80)}...
          </span>
        </div>

        <p className="text-white/60 text-sm mt-2">
          Por: {item.usuario?.nombre || "Administrador"} •{" "}
          {item.fechaCreacion
            ? new Date(item.fechaCreacion).toLocaleDateString()
            : "Sin fecha"}
        </p>
      </div>

      <div className="flex gap-2 ml-4">
        <button
          onClick={() => onEditar(item)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm"
          disabled={loading}
        >
          Editar
        </button>
        <button
          onClick={() => onEliminar(item, "delete")}
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
          disabled={loading}
        >
          Eliminar
        </button>
      </div>
    </motion.div>
  );
});
