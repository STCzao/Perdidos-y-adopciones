import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { adminService } from "../../services/admin";
import { usuariosService } from "../../services/usuarios";
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
        document.documentElement.style.overflow = "hidden";
        cargarUsuarios();
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      };
    }, [open]);

    const cargarUsuarios = useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        const result = await adminService.getTodosUsuarios();

        console.log("Resultado getTodosUsuarios:", result);

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

    const handleEliminar = useCallback(async (usuario) => {
      if (!usuario?._id && !usuario?.id && !usuario?.uid) {
        setError("Usuario no válido para eliminar");
        return false;
      }

      try {
        const id = usuario._id || usuario.id || usuario.uid;
        const result = await usuariosService.borrarUsuario(id);
        if (result.usuario) {
          setUsuarios((prev) =>
            prev.map((u) =>
              (u._id || u.id || u.uid) === id ? { ...u, estado: false } : u
            )
          );
          return true;
        } else {
          setError(result.msg || "Error al eliminar usuario");
          return false;
        }
      } catch {
        setError("Error de conexión al eliminar");
        return false;
      }
    }, []);

    const handleCambiarRol = useCallback(async (usuario, nuevoRol) => {
      if (!usuario?._id && !usuario?.id && !usuario?.uid) {
        setError("Usuario no válido para cambiar rol");
        return false;
      }

      try {
        const id = usuario._id || usuario.id || usuario.uid;
        const result = await usuariosService.actualizarUsuario(id, {
          rol: nuevoRol,
        });

        if (result._id || result.id || result.uid) {
          setUsuarios((prev) =>
            prev.map((u) =>
              (u._id || u.id || u.uid) === id ? { ...u, rol: nuevoRol } : u
            )
          );
          return true;
        } else {
          setError(result.msg || "Error al cambiar rol");
          return false;
        }
      } catch {
        setError("Error de conexión al cambiar rol");
        return false;
      }
    }, []);

    const openConfirmModal = useCallback((item, action) => {
      if (!item) {
        setError("Elemento no válido");
        return;
      }
      setConfirmModal({ isOpen: true, item, action });
    }, []);

    const closeConfirmModal = useCallback(() => {
      setConfirmModal({ isOpen: false, item: null, action: "" });
    }, []);

    const handleConfirm = useCallback(async () => {
      if (!confirmModal.item) {
        setError("Elemento no válido para la acción");
        closeConfirmModal();
        return;
      }

      try {
        if (confirmModal.action === "delete") {
          await handleEliminar(confirmModal.item);
        } else if (confirmModal.action === "changeRole") {
          const nuevoRol =
            confirmModal.item.rol === "ADMIN_ROLE"
              ? "USER_ROLE"
              : "ADMIN_ROLE";
          await handleCambiarRol(confirmModal.item, nuevoRol);
        }
      } catch {
        setError("Error inesperado al procesar la acción");
      } finally {
        closeConfirmModal();
      }
    }, [confirmModal, handleEliminar, handleCambiarRol, closeConfirmModal]);

    const handleClose = useCallback(() => {
      setOpen(false);
      setError("");
      setUsuarios([]);
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
                Administrar Usuarios
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Gestiona todos los usuarios del sitio
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-300">{error}</p>
                <button
                  onClick={cargarUsuarios}
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
                {usuarios.map((usuario, index) => {
                  const id = usuario._id || usuario.id || usuario.uid;
                  console.log("Usuario:", id, usuario.correo);
                  return (
                    <UsuarioItem
                      key={`${id || "user"}-${index}`}
                      usuario={usuario}
                      onChangeRole={openConfirmModal}
                      onEliminar={openConfirmModal}
                      loading={loading}
                    />
                  );
                })}
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
            type="usuario"
          />
        </motion.div>
      </div>
    );
  }),
};

// Componente memoizado para items de usuario
const UsuarioItem = React.memo(
  ({ usuario, onChangeRole, onEliminar, loading }) => (
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

        {usuario.telefono && (
          <p className="text-white/60 text-sm mt-2">
            Teléfono: {usuario.telefono}
          </p>
        )}
      </div>

      <div className="flex gap-2 ml-4">
        <button
          onClick={() => onChangeRole(usuario, "changeRole")}
          className={`px-4 py-2 rounded-lg transition-colors text-sm ${
            usuario.rol === "ADMIN_ROLE"
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
          disabled={loading}
        >
          {usuario.rol === "ADMIN_ROLE" ? "Quitar Admin" : "Hacer Admin"}
        </button>
        <button
          onClick={() => onEliminar(usuario, "delete")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          disabled={loading || !usuario.estado}
        >
          {usuario.estado ? "Desactivar" : "Activar"}
        </button>
      </div>
    </motion.div>
  )
);
