import React from "react";
import { motion } from "framer-motion";
import ModalShell from "./ModalShell";

const toneByType = {
  perfil: {
    accent: "#D62828",
    eyebrow: "Acción permanente",
    confirmLabel: "Eliminar",
  },
  publicacion: {
    accent: "#D62828",
    eyebrow: "Acción permanente",
    confirmLabel: "Eliminar",
  },
  usuario: {
    accent: "#2f241d",
    eyebrow: "Gestión de cuenta",
    confirmLabel: "Confirmar",
  },
  sesion: {
    accent: "#2f241d",
    eyebrow: "Sesión",
    confirmLabel: "Cerrar sesión",
  },
  comunidad: {
    accent: "#D62828",
    eyebrow: "Acción permanente",
    confirmLabel: "Eliminar",
  },
  alerta: {
    accent: "#2f241d",
    eyebrow: "Confirmación",
    confirmLabel: "Continuar",
  },
};

export const ConfirmModal = React.memo(
  ({ confirmModal, onClose, onConfirm, type = "publicacion" }) => {
    const [isProcessing, setIsProcessing] = React.useState(false);

    React.useEffect(() => {
      if (!confirmModal.isOpen) {
        setIsProcessing(false);
      }
    }, [confirmModal.isOpen]);

    if (!confirmModal.isOpen) return null;

    const config = toneByType[type] || toneByType.publicacion;

    const handleConfirm = async () => {
      if (isProcessing) return;

      setIsProcessing(true);

      try {
        await onConfirm?.();
      } finally {
        onClose?.();
        setIsProcessing(false);
      }
    };

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
          return "Estás por eliminar tu perfil. Esta acción no se puede deshacer.";
        case "publicacion":
          return "Estás por eliminar esta publicación. Esta acción no se puede deshacer.";
        case "usuario":
          return `Estás por ${
            confirmModal.item?.estado ? "desactivar" : "activar"
          } al usuario "${confirmModal.item?.nombre}".`;
        case "sesion":
          return "Vas a cerrar tu sesión actual.";
        case "comunidad":
          return `Estás por eliminar el caso "${confirmModal.item?.titulo}". Esta acción no se puede deshacer.`;
        case "alerta":
          return "El inicio de sesión se cerrará si continuás.";
        default:
          return "Confirmá la acción para continuar.";
      }
    };

    return (
      <ModalShell>
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 10 }}
          className="w-full max-w-[28rem] overflow-hidden rounded-[1.05rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] shadow-[0_28px_70px_rgba(36,25,20,0.12)]"
        >
          <div className="p-5 sm:p-6">
            <span
              className="inline-flex rounded-[0.45rem] px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#241914]"
              style={{ backgroundColor: `${config.accent}20` }}
            >
              {config.eyebrow}
            </span>

            <h2
              className="mt-4 text-[1.45rem] font-semibold leading-tight"
              style={{ color: config.accent }}
            >
              {getTitle()}
            </h2>

            <p className="mt-3 text-[0.97rem] leading-relaxed text-[#5f4c41]">
              {getMessage()}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="cursor-pointer rounded-full border border-[#2f241d]/12 bg-white px-5 py-2.5 text-sm font-semibold text-[#241914] transition-colors duration-300 hover:bg-[#efe2d0]"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-92"
                style={{ backgroundColor: config.accent }}
              >
                {isProcessing ? "Procesando..." : config.confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </ModalShell>
    );
  },
);
