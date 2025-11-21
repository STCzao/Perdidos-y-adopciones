import React from "react";
import { motion } from "motion/react";

export const ConfirmModal = React.memo(
  ({ confirmModal, onClose, onConfirm, type = "publicacion" }) => {
    if (!confirmModal.isOpen) return null;

    const getTitle = () => {
      switch (type) {
        case "perfil":
          return "Eliminar perfil";
        case "publicacion":
          return "Eliminar publicación";
        case "usuario":
          return confirmModal.item?.estado
            ? "Desactivar usuario"
            : "Activar usuario";
        case "sesion":
          return "Cerrar sesión";
        case "comunidad":
          return "Eliminar caso comunitario"; // <-- agregado
        default:
          return "Confirmar acción";
      }
    };

    const getMessage = () => {
      switch (type) {
        case "perfil":
          return "¿Estas seguro de que quieres eliminar tu perfil? Esta acción no puede deshacerse.";
        case "publicacion":
          return `¿Estas seguro de que quieres eliminar "${confirmModal.item?.titulo}"? Esta acción no se puede deshacer.`;
        case "usuario":
          return `¿Estas seguro de que quieres ${
            confirmModal.item?.estado ? "desactivar" : "activar"
          } al usuario "${confirmModal.item?.nombre}"?`;
        case "sesion":
          return "¿Estás seguro de que quieres cerrar sesión?";
        case "comunidad":
          return `¿Estas seguro de que quieres eliminar el caso "${confirmModal.item?.titulo}"? Esta acción no se puede deshacer.`; // <-- agregado
        default:
          return "Confirma la acción para continuar.";
      }
    };

    return (
      <div className="fixed font-medium inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 z-[200]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center"
        >
          <h2 className="text-red-500 text-lg font-semibold mb-4">
            {getTitle()}
          </h2>

          <p className="text-black mb-6">{getMessage()}</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-black text-white hover:bg-black-400 transition"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
);
