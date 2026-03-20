"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usuariosService } from "../../services/usuarios";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import ModalShell from "../../components/ui/ModalShell";

let modalControl;

export const EditarPerfil = {
  openModal: () => modalControl?.setOpen(true),

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState("");
    const [errors, setErrors] = useState({});
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      action: "",
    });
    const [editingField, setEditingField] = useState(null);

    const [form, setForm] = useState({ nombre: "", telefono: "" });

    modalControl = { setOpen };

    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        cargarDatosUsuario();
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [open]);

    const cargarDatosUsuario = useCallback(async () => {
      setLoading(true);
      setResult("");
      try {
        const response = await usuariosService.getMiPerfil();
        if (response.ok && response.usuario) {
          setUserData(response.usuario);
          setForm({
            nombre: response.usuario.nombre || "",
            telefono: response.usuario.telefono || "",
          });
        } else {
          setResult(response.msg || "Error al cargar perfil");
          if (
            response.msg?.includes("token") ||
            response.msg?.includes("sesión")
          ) {
            setTimeout(() => {
              setOpen(false);
              resetForm();
            }, 3000);
          }
        }
      } catch (error) {
        setResult("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    }, []);

    const resetForm = () => {
      if (userData) {
        setForm({
          nombre: userData.nombre || "",
          telefono: userData.telefono || "",
        });
      }
      setErrors({});
      setResult("");
      setEditingField(null);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validarCampo = (campo, valor) => {
      const valorTrimmed = valor.trim();
      if (!valorTrimmed) return `El ${campo} es obligatorio`;

      switch (campo) {
        case "nombre":
          if (valorTrimmed.length < 3)
            return "Debe tener al menos 3 caracteres";
          if (valorTrimmed.length > 40)
            return "No puede tener más de 40 caracteres";
          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valorTrimmed))
            return "Solo puede contener letras y espacios";
          break;
        case "telefono":
          if (!/^[0-9]{7,15}$/.test(valorTrimmed))
            return "Debe contener 7-15 dígitos";
          break;
        default:
          return "";
      }
      return "";
    };

    const startEditing = (fieldName) => setEditingField(fieldName);

    const cancelEditing = (fieldName) => {
      setEditingField(null);
      if (userData)
        setForm((prev) => ({
          ...prev,
          [fieldName]: userData[fieldName] || "",
        }));
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    };

    const saveField = async (fieldName) => {
      const value = form[fieldName].trim();
      const originalValue = userData[fieldName] || "";

      if (value === originalValue) {
        setEditingField(null);
        return;
      }

      const error = validarCampo(fieldName, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
        return;
      }

      try {
        setSubmitting(true);
        setResult(
          `Actualizando ${fieldName === "nombre" ? "nombre" : "teléfono"}...`
        );

        const response = await usuariosService.actualizarPerfil({
          [fieldName]: value,
        });

        if (response.ok && response.usuario) {
          setResult("¡Campo actualizado exitosamente!");
          setUserData(response.usuario);
          setEditingField(null);
          window.dispatchEvent(
            new CustomEvent("userProfileUpdated", {
              detail: { user: response.usuario },
            })
          );
          setTimeout(() => setResult(""), 3000);
        } else {
          setResult(response.msg || "Error al actualizar");
          if (
            response.msg?.includes("token") ||
            response.msg?.includes("sesión")
          ) {
            setTimeout(() => {
              setOpen(false);
              resetForm();
            }, 3000);
          }
        }
      } catch (error) {
        setResult("Error de conexión");
      } finally {
        setSubmitting(false);
      }
    };

    const handleEliminarCuenta = async () => {
      const userId = userData?.uid;
      if (!userId) {
        setResult("Error: No se pudo obtener el ID del usuario");
        setConfirmModal({ isOpen: false, action: "" });
        return;
      }

      setSubmitting(true);
      try {
        const res = await usuariosService.borrarUsuario(userId);
        if (res.ok) {
          setResult("Cuenta eliminada exitosamente. Redirigiendo...");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.dispatchEvent(new CustomEvent("forceLogout"));
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          setResult(res.msg || "Error al eliminar cuenta");
        }
      } catch (error) {
        setResult("Error de conexión al eliminar cuenta");
      } finally {
        setSubmitting(false);
        setConfirmModal({ isOpen: false, action: "" });
      }
    };

    const openConfirmModal = (action) =>
      setConfirmModal({ isOpen: true, action });
    const closeConfirmModal = () =>
      setConfirmModal({ isOpen: false, action: "" });
    const handleConfirm = () => {
      if (confirmModal.action === "delete") handleEliminarCuenta();
    };

    const handleKeyPress = (e, fieldName) => {
      if (e.key === "Enter") saveField(fieldName);
      else if (e.key === "Escape") cancelEditing(fieldName);
    };

    if (!open) return null;

    return (
      <AnimatePresence>
        <ModalShell className="p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center w-full max-w-md"
          >
            <div className="relative w-full text-center border border-white/70 rounded-2xl px-6 py-6 shadow-lg bg-white/10 backdrop-blur-sm">
              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="absolute top-4 right-4 text-white hover:text-[#FF7857] transition-colors cursor-pointer"
                disabled={submitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <h1 className="text-white text-2xl sm:text-3xl mt-2 font-medium">
                Mi perfil
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Gestiona tu información personal
              </p>

              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6"
                >
                  {!loading && !userData && (
                    <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
                      <p className="text-yellow-400 text-sm mb-2">
                        No se pudieron cargar los datos
                      </p>
                      <button
                        type="button"
                        onClick={cargarDatosUsuario}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors text-sm cursor-pointer"
                      >
                        Reintentar Carga
                      </button>
                    </div>
                  )}

                  {/* Campo Nombre */}
                  <div className="space-y-2">
                    <label className="text-white text-sm text-left block pl-4">
                      Nombre completo
                    </label>
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-4 sm:pl-6 pr-2">
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Ingresa tu nombre completo"
                        value={form.nombre}
                        onChange={handleChange}
                        onFocus={() => startEditing("nombre")}
                        onKeyDown={(e) => handleKeyPress(e, "nombre")}
                        disabled={
                          submitting ||
                          (editingField && editingField !== "nombre") ||
                          !userData
                        }
                        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full px-2 disabled:opacity-50"
                        maxLength={40}
                      />
                      {editingField === "nombre" && (
                        <div className="flex gap-1 ml-2">
                          <button
                            type="button"
                            onClick={() => saveField("nombre")}
                            disabled={submitting}
                            className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50 cursor-pointer"
                            title="Guardar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => cancelEditing("nombre")}
                            disabled={submitting}
                            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 cursor-pointer"
                            title="Cancelar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.nombre && (
                      <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                        {errors.nombre}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs text-left pl-4">
                      {form.nombre.length}/40 caracteres
                    </p>
                  </div>

                  {/* Campo Teléfono */}
                  <div className="space-y-2">
                    <label className="text-white text-sm text-left block pl-4">
                      Teléfono
                    </label>
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-4 sm:pl-6 pr-2">
                      <input
                        type="text"
                        name="telefono"
                        placeholder="Ingresa tu número de teléfono"
                        value={form.telefono}
                        onChange={handleChange}
                        onFocus={() => startEditing("telefono")}
                        onKeyDown={(e) => handleKeyPress(e, "telefono")}
                        disabled={
                          submitting ||
                          (editingField && editingField !== "telefono") ||
                          !userData
                        }
                        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full px-2 disabled:opacity-50"
                        maxLength={15}
                      />
                      {editingField === "telefono" && (
                        <div className="flex gap-1 ml-2">
                          <button
                            type="button"
                            onClick={() => saveField("telefono")}
                            disabled={submitting}
                            className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50 cursor-pointer"
                            title="Guardar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => cancelEditing("telefono")}
                            disabled={submitting}
                            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 cursor-pointer"
                            title="Cancelar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.telefono && (
                      <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                        {errors.telefono}
                      </p>
                    )}
                  </div>

                  {result && (
                    <p
                      className={`text-center mt-4 text-sm ${
                        result.includes("exitosamente")
                          ? "text-green-400"
                          : result.includes("token") ||
                            result.includes("sesión")
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {result}
                    </p>
                  )}

                  <div className="flex align-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => openConfirmModal("delete")}
                      disabled={submitting || !userData}
                      className="mt-4 w-50 py-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? "Eliminando..." : "Eliminar Cuenta"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <ConfirmModal
            confirmModal={confirmModal}
            onClose={closeConfirmModal}
            onConfirm={handleConfirm}
            type="perfil"
          />
        </ModalShell>
      </AnimatePresence>
    );
  }),
};
