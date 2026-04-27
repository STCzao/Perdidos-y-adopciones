import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../components/ui/ModalShell";
import { adminService } from "../../services/admin";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

let modalControl;

export const AdminUsuarios = {
  openModal: () => modalControl?.setOpen(true),

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
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
        cargarUsuarios();
      } else {
        document.body.style.overflow = "unset";
      }

      return () => (document.body.style.overflow = "unset");
    }, [open]);

    const cargarUsuarios = useCallback(async () => {
      try {
        setLoading(true);
        const result = await adminService.getTodosUsuarios();

        if (result.success && Array.isArray(result.usuarios)) {
          setUsuarios(result.usuarios);
        } else {
          setError(result.msg || "Error al cargar usuarios");
        }
      } catch (err) {
        setError("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    }, []);

    const handleCambiarEstado = useCallback(async (usuario) => {
      try {
        const id = usuario._id || usuario.id || usuario.uid;
        const nuevoEstado = !usuario.estado;

        if (usuario.rol === "ADMIN_ROLE") {
          setError("No se puede modificar el estado de un administrador");
          return false;
        }

        const result = await adminService.cambiarEstadoUsuario(id, nuevoEstado);

        if (result.success) {
          setUsuarios((prev) =>
            prev.map((u) =>
              (u._id || u.id || u.uid) === id
                ? { ...u, estado: nuevoEstado }
                : u
            )
          );
          return true;
        } else {
          setError(result.msg || "Error al cambiar estado");
          return false;
        }
      } catch (err) {
        setError("Error de conexión al servidor");
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
      const { item, action } = confirmModal;

      if (!item) {
        closeConfirmModal();
        return;
      }

      switch (action) {
        case "toggleState":
          await handleCambiarEstado(item);
          break;

        default:
          setError("Acción desconocida");
          break;
      }

      closeConfirmModal();
    }, [confirmModal, handleCambiarEstado, closeConfirmModal]);

    const handleClose = useCallback(() => {
      setOpen(false);
      setError("");
      setUsuarios([]);
    }, []);

    if (!open) return null;

    return (
      <ModalShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full max-w-6xl max-h-[90vh] flex-col items-center overflow-y-auto"
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
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h1 className="mt-2 text-3xl font-medium text-[color:var(--shell-ink)]">
              Administrar usuarios
            </h1>
            <p className="mt-1 text-sm text-[color:var(--shell-muted)]">
              Gestiona todos los usuarios del sitio
            </p>

            {error && (
              <div className="mt-4 rounded-[1rem] border border-[#d62828]/18 bg-[color:var(--shell-danger-soft)] p-3">
                <p className="text-[#a44939]">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[color:var(--shell-accent-strong)]"></div>
              </div>
            ) : (
              <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto">
                {usuarios.map((usuario, index) => (
                  <UsuarioItem
                    key={usuario._id || index}
                    usuario={usuario}
                    onToggleState={openConfirmModal}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>

          <ConfirmModal
            confirmModal={confirmModal}
            onClose={closeConfirmModal}
            onConfirm={handleConfirm}
            type="usuario"
          />
        </motion.div>
      </ModalShell>
    );
  }),
};

// Componente de usuario individual
const UsuarioItem = React.memo(({ usuario, onToggleState, loading }) => {
  const id = usuario._id || usuario.id || usuario.uid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between rounded-[1.1rem] border border-[color:var(--shell-line)] bg-white/72 p-3 sm:p-4"
      >
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-[color:var(--shell-ink)]">{usuario.nombre}</h3>

        <div className="mt-2 flex flex-wrap gap-2 text-sm text-[color:var(--shell-muted)]">
          <span className="text-[color:var(--shell-muted)]">{usuario.correo}</span>
          <span
            className={`px-2 py-1 rounded ${
              usuario.rol === "ADMIN_ROLE"
                ? "bg-[color:var(--shell-accent)]/35 text-[color:var(--shell-bark)]"
                : "bg-[#ece3d8] text-[color:var(--shell-muted)]"
            }`}
          >
            {usuario.rol}
          </span>
          <span
            className={`px-2 py-1 rounded ${
              usuario.estado
                ? "bg-[#dbe7b5] text-[#4d6a2e]"
                : "bg-[color:var(--shell-danger-soft)] text-[#a44939]"
            }`}
          >
            {usuario.estado ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Boton deshabilitado si es admin */}
      <div className="flex gap-2">
        <button
          onClick={() => onToggleState(usuario, "toggleState")}
          className={`px-2 py-2 mr-1 rounded-full transition-colors text-sm ${
            usuario.rol === "ADMIN_ROLE"
              ? "bg-[#d8d0c6] cursor-not-allowed text-[#8f7f74]"
              : usuario.estado
              ? "bg-[color:var(--shell-danger)] hover:bg-[#b91f1f] text-white cursor-pointer"
              : "bg-[color:var(--shell-bark)] hover:bg-[#45362d] text-white cursor-pointer"
          }`}
          disabled={loading || usuario.rol === "ADMIN_ROLE"}
        >
          {usuario.rol === "ADMIN_ROLE"
            ? "Bloqueado"
            : usuario.estado
            ? "Desactivar"
            : "Activar"}
        </button>
      </div>
    </motion.div>
  );
});
