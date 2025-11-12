"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { casosAyudaService } from "../../services/casosayuda";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { CrearCasoAyuda } from "../CrearCasoAyuda/CrearCasoAyuda";

let modalControl;

export const VerCasosAyuda = {
  openModal: () => modalControl?.setOpen(true),

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [casos, setCasos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      item: null,
      action: "",
    });
    const [editarData, setEditarData] = useState(null);

    modalControl = { setOpen };

    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        cargarCasos();
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      };
    }, [open]);

    const cargarCasos = useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        const userData = localStorage.getItem("user");
        if (!userData) return setError("Usuario no loggeado");
        const user = JSON.parse(userData);
        const userId = user._id || user.id || user.uid;
        if (!userId) return setError("ID de usuario no encontrado");

        const resp = await casosAyudaService.getCasoAyudaUsuario(userId);
        if (resp?.success || resp?.ok) {
          setCasos(resp.casos || []);
        } else {
          setError(resp?.msg || "Error al obtener casos de ayuda");
        }
      } catch {
        setError("Error de conexion al servidor");
      } finally {
        setLoading(false);
      }
    }, []);

    const handleEliminar = useCallback(async (caso) => {
      try {
        const result = await casosAyudaService.borrarCasoAyuda(caso._id);
        if (result.success || result.ok) {
          setCasos((prev) => prev.filter((p) => p._id !== caso._id));
          return true;
        } else {
          setError(result.msg || "Error al eliminar el caso");
          return false;
        }
      } catch {
        setError("Error de conexion al eliminar");
        return false;
      }
    }, []);

    const handleEditar = useCallback((caso) => {
      setEditarData(caso);
      CrearCasoAyuda.openModal(caso);
      setOpen(false);
    }, []);

    const actualizarCasoEnLista = useCallback((updated) => {
      setCasos((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
    }, []);

    useEffect(() => {
      const handleCreated = (e) => {
        const nuevo = e.detail;
        setCasos((prev) => [nuevo, ...prev]);
      };

      const handleUpdated = (e) => {
        actualizarCasoEnLista(e.detail);
      };

      window.addEventListener("casoCreado", handleCreated);
      window.addEventListener("casoActualizado", handleUpdated);

      return () => {
        window.removeEventListener("casoCreado", handleCreated);
        window.removeEventListener("casoActualizado", handleUpdated);
      };
    }, [actualizarCasoEnLista]);

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
      setCasos([]);
    }, []);

    if (!open) return null;

    return (
      <div className="font-medium fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          <div className="max-w-6xl w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg bg-white/10 backdrop-blur-sm relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-[#FF7857] transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-white text-3xl mt-2 font-medium">
                Mis casos de ayuda
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Gestiona tus casos creados o en progreso
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-300">{error}</p>
                <button
                  onClick={cargarCasos}
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
                {casos.map((caso) => (
                  <CasoItem
                    key={caso._id}
                    caso={caso}
                    onEliminar={openConfirmModal}
                    onEditar={handleEditar}
                    loading={loading}
                  />
                ))}
                {casos.length === 0 && !loading && (
                  <div className="text-center py-8 text-white/60">
                    No tienes casos de ayuda para mostrar
                  </div>
                )}
              </div>
            )}
          </div>

          <ConfirmModal
            confirmModal={confirmModal}
            onClose={closeConfirmModal}
            onConfirm={handleConfirm}
            type="caso"
          />
        </motion.div>
      </div>
    );
  }),
};

const CasoItem = React.memo(({ caso, onEliminar, onEditar, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 border border-white/20 rounded-lg p-4 flex justify-between items-start backdrop-blur-sm"
    >
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-white text-lg">{caso.titulo}</h3>
        <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/80">
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
            {caso.categoria || "Sin categoria"}
          </span>
          <span className="text-white/70">
            Estado: {caso.estado || "Desconocido"}
          </span>
          <span className="text-white/70">
            Descripcion: {caso.descripcion || "Sin descripcion"}
          </span>
        </div>

        <p className="text-white/60 text-sm mt-2">
          Por: {caso.usuario?.nombre || "Anonimo"} •{" "}
          {caso.fechaCreacion
            ? new Date(caso.fechaCreacion).toLocaleDateString()
            : "Sin fecha"}
        </p>
      </div>

      <div className="flex gap-2 ml-4">
        <button
          onClick={() => onEditar(caso)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm"
          disabled={loading}
        >
          Editar
        </button>
        <button
          onClick={() => onEliminar(caso, "delete")}
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
          disabled={loading}
        >
          Eliminar
        </button>
      </div>
    </motion.div>
  );
});
