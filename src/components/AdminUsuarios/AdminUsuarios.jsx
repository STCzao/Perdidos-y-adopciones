import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { adminService } from "../../services/admin";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";

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

        if (result.usuarios && Array.isArray(result.usuarios)) {
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

        if (result.ok) {
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

            <h1 className="text-white text-3xl mt-2 font-medium">
              Administrar usuarios
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Gestiona todos los usuarios del sitio
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]"></div>
              </div>
            ) : (
              <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
      </div>
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
      className="bg-white/10 border border-white/20 rounded-lg p-4 flex justify-between items-start backdrop-blur-sm"
    >
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-white text-lg">{usuario.nombre}</h3>

        <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/80">
          <span className="text-white/70">{usuario.correo}</span>
          <span
            className={`px-2 py-1 rounded ${
              usuario.rol === "ADMIN_ROLE"
                ? "bg-purple-500/20 text-purple-300"
                : "bg-gray-500/20 text-gray-300"
            }`}
          >
            {usuario.rol}
          </span>
          <span
            className={`px-2 py-1 rounded ${
              usuario.estado
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {usuario.estado ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Boton deshabilitado si es admin */}
      <div className="flex gap-2 ml-4">
        <button
          onClick={() => onToggleState(usuario, "toggleState")}
          className={`px-4 py-2 mr-1 rounded-full transition-colors text-sm ${
            usuario.rol === "ADMIN_ROLE"
              ? "bg-gray-600 cursor-not-allowed text-white/40"
              : usuario.estado
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
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
