import React from "react";
import { motion } from "motion/react";
import ModalShell from "./ModalShell";

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
          return "Eliminar caso comunitario";
        case "alerta":
          return "Cerrar";
        default:
          return "Confirmar acción";
      }
    };

    const getMessage = () => {
      switch (type) {
        case "perfil":
          return "¿Estás seguro de que quieres eliminar tu perfil? Esta acción no puede deshacerse.";
        case "publicacion":
          return "¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.";
        case "usuario":
          return `¿Estás seguro de que quieres ${
            confirmModal.item?.estado ? "desactivar" : "activar"
          } al usuario "${confirmModal.item?.nombre}"?`;
        case "sesion":
          return "¿Estás seguro de que quieres cerrar sesión?";
        case "comunidad":
          return `¿Estás seguro de que quieres eliminar el caso "${confirmModal.item?.titulo}"? Esta acción no se puede deshacer.`;
        case "alerta":
          return "El inicio de sesión se cerrará. ¿Estás seguro de esta acción?";
        default:
          return "Confirma la acción para continuar.";
      }
    };

    return (
      <ModalShell>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg"
        >
          <h2 className="mb-4 text-lg font-semibold text-red-500">
            {getTitle()}
          </h2>

          <p className="mb-6 text-black">{getMessage()}</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full bg-black px-4 py-2 text-white transition hover:bg-black/80"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              className="cursor-pointer rounded-full bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </ModalShell>
    );
  },
);
