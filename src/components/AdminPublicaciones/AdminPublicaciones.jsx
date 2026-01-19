import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { adminService } from "../../services/admin";
import { publicacionesService } from "../../services/publicaciones";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { getEstadosPermitidos } from "../../constants/estadosPublicacion";

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

        if (result.success) setPublicaciones(result.publicaciones || []);
        else setError(result.msg || "Error al cargar publicaciones");
      } catch {
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
      } catch {
        setError("Error de conexión al eliminar");
        return false;
      }
    }, []);

    const handleEditarEstado = useCallback(async (id, nuevoEstado) => {
      try {
        const result = await publicacionesService.actualizarEstado(
          id,
          nuevoEstado
        );
        if (result.success) {
          setPublicaciones((prev) =>
            prev.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p))
          );
          return true;
        } else {
          setError(result.msg || "Error al actualizar estado");
          return false;
        }
      } catch {
        setError("Error de conexión al actualizar estado");
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
      <div className="font-medium fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          <div className="max-w-6xl w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg bg-white/10 backdrop-blur-sm">
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
                    onEditarEstado={handleEditarEstado}
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

const PublicacionItem = React.memo(
  ({ publicacion, onEliminar, onEditarEstado, loading }) => {
    const estados = getEstadosPermitidos(publicacion.tipo);

    const handleEstadoChange = (e) => {
      const nuevoEstado = e.target.value;
      onEditarEstado(publicacion._id, nuevoEstado);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 border border-white/20 rounded-lg p-4 flex justify-between items-start backdrop-blur-sm"
      >
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-white text-lg">
            {publicacion.titulo}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/80">
            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
              {publicacion.tipo}
            </span>
            <select
              value={publicacion.estado}
              onChange={handleEstadoChange}
              disabled={loading}
              className="bg-white/10 border border-white/20 text-white/80 px-2 py-1 rounded"
            >
              {estados.map((estado) => (
                <option className="text-black" key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            <span className="text-white/70">Raza: {publicacion.raza}</span>
            <span className="text-white/70">Color: {publicacion.color}</span>

            {publicacion.tipo === "PERDIDO" && (
              <span className="text-white/70">
                Título: Se busca a {publicacion.nombreanimal}
              </span>
            )}
            {publicacion.tipo === "ENCONTRADO" && (
              <span className="text-white/70">
                Título: {publicacion.especie} encontrado en {publicacion.lugar}{" "}
              </span>
            )}
            {publicacion.tipo === "ADOPCION" && (
              <span className="text-white/70">
                Título: {publicacion.nombreanimal} se encuentra en busca de un
                hogar
              </span>
            )}
          </div>

          <p className="text-white/60 text-sm mt-2">
            Por: {publicacion.usuario?.nombre} •{" "}
            {publicacion.fechaCreacion
              ? new Date(publicacion.fechaCreacion).toLocaleDateString()
              : "Sin fecha"}
          </p>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEliminar(publicacion, "delete")}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
            disabled={loading}
          >
            Eliminar
          </button>
        </div>
      </motion.div>
    );
  }
);
