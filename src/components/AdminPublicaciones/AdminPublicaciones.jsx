import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { adminService } from "../../services/admin";
import { publicacionesService } from "../../services/publicaciones";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";

let modalControl;

export const AdminPublicaciones = {
  openModal: () => modalControl?.setOpen(true),

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      item: null,
      action: "",
    });

    modalControl = { setOpen };

    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        cargarPublicaciones();
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      };
    }, [open]);

    const cargarPublicaciones = useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        const result = await adminService.getTodasPublicaciones();

        if (result.success) {
          setPublicaciones(result.publicaciones || []);
        } else {
          setError(result.msg || "Error al cargar publicaciones");
        }
      } catch (err) {
        setError("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    }, []);

    const handleEliminar = useCallback(async (publicacion) => {
      try {
        const result = await publicacionesService.borrarPublicacion(
          publicacion._id
        );
        if (result.success) {
          setPublicaciones((prev) =>
            prev.filter((p) => p._id !== publicacion._id)
          );
          return true;
        } else {
          setError(result.msg || "Error al eliminar publicación");
          return false;
        }
      } catch (err) {
        setError("Error de conexión al eliminar");
        return false;
      }
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
      setPublicaciones([]);
    }, []);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          <div className="max-w-6xl w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg bg-white/10 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-white text-3xl mt-2 font-medium">
                Administrar Publicaciones
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Gestiona todas las publicaciones del sitio
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-300">{error}</p>
                <button
                  onClick={cargarPublicaciones}
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
                {publicaciones.map((publicacion) => (
                  <PublicacionItem
                    key={publicacion._id}
                    publicacion={publicacion}
                    onEliminar={openConfirmModal}
                    loading={loading}
                  />
                ))}

                {publicaciones.length === 0 && !loading && (
                  <div className="text-center py-8 text-white/60">
                    No hay publicaciones para mostrar
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Cerrar
              </button>
            </div>
          </div>

          <ConfirmModal
            confirmModal={confirmModal}
            onClose={closeConfirmModal}
            onConfirm={handleConfirm}
            type="publicacion"
          />
        </motion.div>
      </div>
    );
  }),
};

// Componente memoizado para items individuales - ✅ CORREGIDO CON KEYS
const PublicacionItem = React.memo(({ publicacion, onEliminar, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/10 border border-white/20 rounded-lg p-4 flex justify-between items-start backdrop-blur-sm"
  >
    <div className="flex-1 text-left">
      <h3 className="font-semibold text-white text-lg">{publicacion.titulo}</h3>

      {/* ✅ CORREGIDO - Elementos hermanos con keys únicas */}
      <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/80">
        <span
          key={`${publicacion._id}-tipo`}
          className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded"
        >
          {publicacion.tipo}
        </span>
        <span
          key={`${publicacion._id}-estado`}
          className={`px-2 py-1 rounded ${
            publicacion.estado === "ACTIVO"
              ? "bg-green-500/20 text-green-300"
              : publicacion.estado === "INACTIVO"
              ? "bg-red-500/20 text-red-300"
              : "bg-yellow-500/20 text-yellow-300"
          }`}
        >
          {publicacion.estado}
        </span>
        <span key={`${publicacion._id}-raza`} className="text-white/70">
          Raza: {publicacion.raza}
        </span>
        <span key={`${publicacion._id}-color`} className="text-white/70">
          Color: {publicacion.color}
        </span>
      </div>

      <p className="text-white/60 text-sm mt-2">
        Por: {publicacion.usuario?.nombre} •
        {publicacion.fechaCreacion
          ? new Date(publicacion.fechaCreacion).toLocaleDateString()
          : "Sin fecha"}
      </p>
    </div>

    <div className="flex gap-2 ml-4">
      <button
        onClick={() => {
          /* Implementar edición */
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        disabled={loading}
      >
        Editar
      </button>
      <button
        onClick={() => onEliminar(publicacion, "delete")}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
        disabled={loading}
      >
        Eliminar
      </button>
    </div>
  </motion.div>
));
