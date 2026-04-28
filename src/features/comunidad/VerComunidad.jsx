import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../components/ui/ModalShell";
import { comunidadService } from "../../services/comunidad";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import LoadingState from "../../components/ui/LoadingState";
import { CrearComunidad } from "./CrearComunidad";
import { useAuth } from "../../context/AuthContext";
import { withRequestIdMessage } from "../../services/serviceUtils";

let modalControl;

export const VerComunidad = {
  openModal: () => {
    if (!modalControl) return false;
    modalControl.setOpen(true);
    return true;
  },

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

    const { user } = useAuth();

    useLayoutEffect(() => {
      modalControl = { setOpen };
      return () => { modalControl = null; };
    }, []);

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

        if (resp?.success) {
          setItems(resp.comunidades || []);
        } else {
          setError(withRequestIdMessage(resp?.msg || "Error al obtener comunidad", resp?.requestId));
        }
      } catch {
        setError("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    }, []);

    const handleEliminar = useCallback(async (item) => {
      try {
        const result = await comunidadService.borrarComunidad(item._id);

        if (result.success) {
          setItems((prev) => prev.filter((post) => post._id !== item._id));
          return true;
        }

        setError(withRequestIdMessage(result.msg || "Error al eliminar item", result.requestId));
        return false;
      } catch {
        setError("Error de conexión al eliminar");
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
      <ModalShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex max-h-[90vh] w-full max-w-6xl flex-col items-center overflow-y-auto"
        >
          <div className="relative w-full max-w-6xl rounded-[1.5rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] px-6 py-6 text-center shadow-[0_28px_70px_rgba(36,25,20,0.12)] sm:px-8">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 cursor-pointer text-[color:var(--shell-muted)] transition-colors hover:text-[color:var(--shell-accent-strong)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col items-center justify-center">
              <h1 className="mt-2 text-3xl font-medium text-[color:var(--shell-ink)]">
                Administrar comunidad
              </h1>
              <p className="mt-1 text-sm text-[color:var(--shell-muted)]">
                Gestiona todos los casos de la comunidad
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-[1rem] border border-[#d62828]/18 bg-[color:var(--shell-danger-soft)] p-3">
                <p className="text-[#a44939]">{error}</p>
                <button
                  onClick={cargarItems}
                  className="mt-2 cursor-pointer rounded-full bg-[color:var(--shell-danger)] px-4 py-2 text-white transition-colors hover:bg-[#b91f1f]"
                >
                  Reintentar
                </button>
              </div>
            )}

            {loading ? (
              <LoadingState compact label="Cargando publicaciones de la comunidad..." />
            ) : (
              <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto">
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
                  <div className="py-8 text-center text-[color:var(--shell-muted)]/80">
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
      </ModalShell>
    );
  }),
};

const ComunidadItem = React.memo(({ item, onEliminar, onEditar, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between rounded-[1.1rem] border border-[color:var(--shell-line)] bg-white/72 p-4"
    >
      <div className="flex-1 text-left">
        <h3 className="text-lg font-semibold text-[color:var(--shell-ink)]">{item.titulo}</h3>

        <div className="mt-2 flex flex-wrap gap-2 text-sm text-[color:var(--shell-muted)]">
          <span className="rounded bg-[color:var(--shell-danger-soft)] px-2 py-1 text-[#a44939]">
            {item.categoria}
          </span>
          <span className="text-[color:var(--shell-muted)]">{item.contenido?.slice(0, 80)}...</span>
        </div>

        <p className="mt-2 text-sm text-[#7b685c]">
          Por: {item.usuario?.nombre || "Administrador"} •{" "}
          {item.fechaCreacion
            ? new Date(item.fechaCreacion).toLocaleDateString()
            : "Sin fecha"}
        </p>
      </div>

      <div className="ml-4 flex gap-2">
        <button
          onClick={() => onEditar(item)}
          className="cursor-pointer rounded-full bg-[color:var(--shell-bark)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#45362d]"
          disabled={loading}
        >
          Editar
        </button>
        <button
          onClick={() => onEliminar(item, "delete")}
          className="cursor-pointer rounded-full bg-[color:var(--shell-danger)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#b91f1f]"
          disabled={loading}
        >
          Eliminar
        </button>
      </div>
    </motion.div>
  );
});
