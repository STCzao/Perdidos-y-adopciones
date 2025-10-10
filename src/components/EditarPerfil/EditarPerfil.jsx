"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { usuariosService } from "../../services/usuarios";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";

let modalControl;

export const EditarPerfil = {
  openModal: () => modalControl?.setOpen(true),

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState("");
    const [errors, setErrors] = useState({});
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      action: "",
    });

    const [form, setForm] = useState({
      nombre: "",
      correo: "",
      telefono: "",
      direccion: "",
    });

    modalControl = { setOpen };

    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        cargarDatosUsuario();
      } else {
        document.body.style.overflow = "unset";
        setEditMode(false);
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [open]);

    const cargarDatosUsuario = useCallback(async () => {
      setLoading(true);
      try {
        const usuario = await usuariosService.getMiPerfil();
        if (usuario) {
          setUserData(usuario);
          setForm({
            nombre: usuario.nombre || "",
            correo: usuario.correo || "",
            telefono: usuario.telefono || "",
            direccion: usuario.direccion || "",
          });
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    }, []);

    const resetForm = () => {
      if (userData) setForm({ ...userData });
      setErrors({});
      setResult("");
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name])
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[name];
          return copy;
        });
    };

    const validarFormulario = () => {
      let valid = true;
      const newErrors = {};

      if (!form.nombre.trim()) {
        newErrors.nombre = "El nombre es obligatorio";
        valid = false;
      } else if (form.nombre.length < 3) {
        newErrors.nombre = "Debe tener al menos 3 caracteres";
        valid = false;
      }

      if (!form.correo.trim()) {
        newErrors.correo = "El correo es obligatorio";
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
        newErrors.correo = "Correo inválido";
        valid = false;
      }

      if (!form.telefono.trim()) {
        newErrors.telefono = "Teléfono obligatorio";
        valid = false;
      } else if (!/^[0-9]{7,15}$/.test(form.telefono.trim())) {
        newErrors.telefono = "Debe contener 7-15 dígitos";
        valid = false;
      }

      setErrors(newErrors);
      return valid;
    };

    const handleSubmit = async (e) => {
      e?.preventDefault();
      if (submitting || !validarFormulario()) return;

      try {
        setSubmitting(true);
        setResult("Actualizando perfil...");
        const updated = await usuariosService.actualizarPerfil(form);
        if (updated && updated._id) {
          setResult("Perfil actualizado exitosamente");
          setUserData(updated);
          setEditMode(false);
          setTimeout(() => setResult(""), 2000);
        } else {
          setResult(updated.msg || "Error al actualizar perfil");
        }
      } catch {
        setResult("Error de conexión");
      } finally {
        setSubmitting(false);
      }
    };

    const handleEliminarCuenta = async () => {
      if (!userData?._id) return;
      setSubmitting(true);
      try {
        const res = await usuariosService.borrarUsuario(userData._id);
        if (res.msg) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      } catch {
        setResult("Error al eliminar cuenta");
      } finally {
        setSubmitting(false);
        setConfirmModal({ isOpen: false, action: "" });
      }
    };

    const openConfirmModal = useCallback(
      (action) => setConfirmModal({ isOpen: true, action }),
      []
    );
    const closeConfirmModal = useCallback(
      () => setConfirmModal({ isOpen: false, action: "" }),
      []
    );
    const handleConfirm = useCallback(() => {
      if (confirmModal.action === "delete") handleEliminarCuenta();
    }, [confirmModal]);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full max-w-md"
        >
          <div className="w-full text-center border border-white/70 rounded-2xl px-6 py-6 shadow-lg bg-white/10 backdrop-blur-sm">
            <h1 className="text-white text-2xl sm:text-3xl mt-2 font-medium">
              Mi Perfil
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Gestiona tu información personal
            </p>

            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]" />
              </div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 mt-6"
              >
                {["nombre", "correo", "telefono", "direccion"].map((campo) => (
                  <div key={campo}>
                    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-4 sm:pl-6">
                      <input
                        type={campo === "correo" ? "email" : "text"}
                        name={campo}
                        placeholder={`${
                          campo.charAt(0).toUpperCase() + campo.slice(1)
                        }`}
                        value={form[campo] || ""}
                        onChange={handleChange}
                        disabled={submitting}
                        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full px-2"
                      />
                    </div>
                    {errors[campo] && (
                      <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
                        {errors[campo]}
                      </p>
                    )}
                  </div>
                ))}

                {result && (
                  <p
                    className={`text-center mt-4 ${
                      result.includes("exitosamente")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {result}
                  </p>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      resetForm();
                    }}
                    disabled={submitting}
                    className="flex-1 px-6 py-2 rounded-full text-white bg-gray-500 hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-2 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Guardando..." : "Guardar"}
                  </button>
                </div>

                {!editMode && (
                  <button
                    type="button"
                    onClick={() => openConfirmModal("delete")}
                    className="mt-4 w-full px-6 py-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Eliminar Cuenta
                  </button>
                )}
              </motion.form>
            )}
          </div>
        </motion.div>

        <ConfirmModal
          confirmModal={confirmModal}
          onClose={closeConfirmModal}
          onConfirm={handleConfirm}
          type="cuenta"
        />
      </div>
    );
  }),
};
