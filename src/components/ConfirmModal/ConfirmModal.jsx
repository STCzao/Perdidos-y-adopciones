import React from "react";
import { motion } from "motion/react";

export const ConfirmModal = React.memo(
  ({ confirmModal, onClose, onConfirm, type = "publicacion" }) => {
    if (!confirmModal.isOpen) return null;

    const getTitle = () => {
      if (type === "publicacion") {
        return "Eliminar Publicación";
      }
      return confirmModal.action === "delete"
        ? confirmModal.item?.estado
          ? "Desactivar Usuario"
          : "Activar Usuario"
        : "Cambiar Rol de Usuario";
    };

    const getMessage = () => {
      if (type === "publicacion") {
        return `¿Estás seguro de que quieres eliminar "${confirmModal.item?.titulo}"? Esta acción no se puede deshacer.`;
      }

      return confirmModal.action === "delete"
        ? `¿Estás seguro de que quieres ${
            confirmModal.item?.estado ? "desactivar" : "activar"
          } a "${confirmModal.item?.nombre}"?`
        : `¿Estás seguro de que quieres ${
            confirmModal.item?.rol === "ADMIN_ROLE"
              ? "quitar permisos de administrador a"
              : "convertir en administrador a"
          } "${confirmModal.item?.nombre}"?`;
    };

    const getConfirmText = () => {
      if (type === "publicacion") return "Eliminar";
      return confirmModal.action === "delete"
        ? confirmModal.item?.estado
          ? "Desactivar"
          : "Activar"
        : "Confirmar";
    };

    const getConfirmColor = () => {
      if (type === "publicacion" || confirmModal.action === "delete") {
        return "bg-red-500 hover:bg-red-600";
      }
      return "bg-purple-500 hover:bg-purple-600";
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[201] p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-6 max-w-md w-full"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {getTitle()}
          </h3>
          <p className="text-gray-600 mb-6">{getMessage()}</p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${getConfirmColor()}`}
            >
              {getConfirmText()}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
);
