import React, { useState, useEffect, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../components/ui/ModalShell";
import { publicacionesService } from "../../services/publicaciones";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import LoadingState from "../../components/ui/LoadingState";
import { getEstadosPermitidos } from "../../utils/estadosPublicacion";
import { AuthContext } from "../../context/AuthContext";
import { getTipoColorMeta } from "../../utils/publicacionColors";
import { getPublicacionTitulo } from "./utils/publicacionFields";

let modalControl;

const getTipoBadgeStyle = (tipo) => {
  const meta = getTipoColorMeta(tipo);

  return {
    backgroundColor: `${meta.accent}33`,
    color: meta.accent,
  };
};

export const VerPublicaciones = {
  openModal: () => {
    if (!modalControl) return false;
    modalControl.setOpen(true);
    return true;
  },

  Component: React.memo(() => {
    const { user } = useContext(AuthContext);
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
        const userId = user?._id || user?.id || user?.uid;

        if (!userId) {
          setError("Usuario no autenticado");
          return;
        }

        const response = await publicacionesService.getPublicacionesUsuario(userId);
        if (response?.success) {
          setPublicaciones(response.publicaciones || []);
        } else {
          setError(response?.msg || "Error al obtener publicaciones");
        }
      } catch {
        setError("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    }, [user]);

    const handleEliminar = useCallback(async (publicacion) => {
      try {
        const result = await publicacionesService.borrarPublicacion(publicacion._id);
        if (result.success) {
          setPublicaciones((prev) => prev.filter((p) => p._id !== publicacion._id));
          return true;
        }

        setError(result.msg || "Error al eliminar publicación");
        return false;
      } catch {
        setError("Error de conexión al eliminar");
        return false;
      }
    }, []);

    const handleEditarEstado = useCallback(async (id, nuevoEstado) => {
      try {
        const result = await publicacionesService.actualizarEstado(id, nuevoEstado);
        if (result.success) {
          setPublicaciones((prev) =>
            prev.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p)),
          );
          return true;
        }

        setError(result.msg || "Error al actualizar estado");
        return false;
      } catch {
        setError("Error de conexión al actualizar estado");
        return false;
      }
    }, []);

    const handleEditar = useCallback((publicacion) => {
      setOpen(false);
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("openCrearPublicacion", { detail: publicacion }));
      }, 48);
    }, []);

    const actualizarPublicacionEnLista = useCallback((updated) => {
      setPublicaciones((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    }, []);

    useEffect(() => {
      const handleCreated = (e) => {
        const nueva = e.detail;
        setPublicaciones((prev) => [nueva, ...prev]);
      };

      const handleUpdated = (e) => {
        actualizarPublicacionEnLista(e.detail);
      };

      window.addEventListener("publicacionCreada", handleCreated);
      window.addEventListener("publicacionActualizada", handleUpdated);

      return () => {
        window.removeEventListener("publicacionCreada", handleCreated);
        window.removeEventListener("publicacionActualizada", handleUpdated);
      };
    }, [actualizarPublicacionEnLista]);

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
                Mis publicaciones
              </h1>
              <p className="mt-1 text-sm text-[color:var(--shell-muted)]">
                Gestiona tus publicaciones creadas
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-[1rem] border border-[#d62828]/18 bg-[color:var(--shell-danger-soft)] p-3">
                <p className="text-[#a44939]">{error}</p>
                <button
                  onClick={cargarPublicaciones}
                  className="mt-2 cursor-pointer rounded-full bg-[color:var(--shell-danger)] px-4 py-2 text-white transition-colors hover:bg-[#b91f1f]"
                >
                  Reintentar
                </button>
              </div>
            )}

            {loading ? (
              <LoadingState compact label="Cargando tus publicaciones..." />
            ) : (
              <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto">
                {publicaciones.map((publicacion) => (
                  <PublicacionItem
                    key={publicacion._id}
                    publicacion={publicacion}
                    onEliminar={openConfirmModal}
                    onEditar={handleEditar}
                    onEditarEstado={handleEditarEstado}
                    loading={loading}
                  />
                ))}

                {publicaciones.length === 0 && !loading && (
                  <div className="py-8 text-center text-[color:var(--shell-muted)]/80">
                    No tienes publicaciones para mostrar
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
      </ModalShell>
    );
  }),
};

const PublicacionItem = React.memo(
  ({ publicacion, onEliminar, onEditar, onEditarEstado, loading }) => {
    const estados = getEstadosPermitidos(publicacion.tipo);

    const handleEstadoChange = (e) => {
      const nuevoEstado = e.target.value;
      onEditarEstado(publicacion._id, nuevoEstado);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between rounded-[1.1rem] border border-[color:var(--shell-line)] bg-white/72 p-4"
      >
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-[color:var(--shell-ink)]">
            {getPublicacionTitulo(publicacion)}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2 text-sm text-[color:var(--shell-muted)]">
            <span className="rounded px-2 py-1" style={getTipoBadgeStyle(publicacion.tipo)}>
              {publicacion.tipo}
            </span>

            <select
              value={publicacion.estado}
              onChange={handleEstadoChange}
              disabled={loading}
              className="cursor-pointer rounded-[0.6rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-2 py-1 text-[color:var(--shell-muted)]"
            >
              {estados.map((estado) => (
                <option className="text-black" key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>

            <span className="text-[color:var(--shell-muted)]">Raza: {publicacion.raza}</span>
            <span className="text-[color:var(--shell-muted)]">Color: {publicacion.color}</span>
          </div>

          <p className="mt-2 text-sm text-[#7b685c]">
            Por: {publicacion.usuario?.nombre} •{" "}
            {publicacion.fechaCreacion
              ? new Date(publicacion.fechaCreacion).toLocaleDateString()
              : "Sin fecha"}
          </p>
        </div>

        <div className="ml-4 flex gap-2">
          <button
            onClick={() => onEditar(publicacion)}
            className="cursor-pointer rounded-full bg-[color:var(--shell-bark)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#45362d]"
            disabled={loading}
          >
            Editar
          </button>
          <button
            onClick={() => onEliminar(publicacion, "delete")}
            className="cursor-pointer rounded-full bg-[color:var(--shell-danger)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#b91f1f]"
            disabled={loading}
          >
            Eliminar
          </button>
        </div>
      </motion.div>
    );
  },
);
