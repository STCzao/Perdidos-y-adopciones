import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usuariosService } from "../../services/usuarios";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import ModalShell from "../../components/ui/ModalShell";
import LoadingState from "../../components/ui/LoadingState";
import PasswordInput from "../../components/forms/PasswordInput";
import { useImageUpload } from "../publicaciones/CrearPublicacion/useImageUpload";
import {
  validateChangePasswordForm,
  validateCloudinaryUrl,
  validateNombre,
  validateTelefono,
} from "../../utils/validators";

let modalControl;

const createProfileForm = (usuario) => ({
  nombre: usuario?.nombre || "",
  telefono: usuario?.telefono || "",
  img: usuario?.img || "",
});

const EMPTY_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const inputClassName =
  "mt-2 flex h-12 w-full items-center rounded-[1.1rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-4 text-sm text-[#3d332d] shadow-[0_12px_30px_rgba(59,43,34,0.06)] transition-colors duration-300 focus-within:border-[color:var(--shell-accent-strong)] focus-within:ring-2 focus-within:ring-[color:var(--shell-accent-strong)]/15";

const sectionClassName =
  "rounded-[1.35rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] p-5 shadow-[0_16px_45px_rgba(57,42,31,0.08)]";

const dispatchUserProfileUpdated = (user) => {
  window.dispatchEvent(new CustomEvent("userProfileUpdated", { detail: { user } }));
};

const getInitials = (nombre = "") =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "US";

const FieldError = ({ message }) =>
  message ? <p className="mt-2 text-xs text-[#a84632]">{message}</p> : null;

const StatusMessage = ({ message }) => {
  if (!message) return null;

  const isPositive =
    message.includes("correctamente") ||
    message.includes("lista") ||
    message.includes("actualizada");

  return (
    <p className={`mt-5 text-sm ${isPositive ? "text-[#4d6a2e]" : "text-[#9c4d3a]"}`}>
      {message}
    </p>
  );
};

export const EditarPerfil = {
  openModal: () => {
    if (!modalControl) return false;
    modalControl.setOpen(true);
    return true;
  },

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [profileResult, setProfileResult] = useState("");
    const [passwordResult, setPasswordResult] = useState("");
    const [profileErrors, setProfileErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      action: "",
    });
    const [profileForm, setProfileForm] = useState(createProfileForm(null));
    const [passwordForm, setPasswordForm] = useState(EMPTY_PASSWORD_FORM);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    modalControl = { setOpen };

    const { handleImageUpload } = useImageUpload(
      (url) => {
        setProfileForm((current) => ({ ...current, img: url }));
        setProfileResult("Imagen lista para guardar.");
      },
      setProfileErrors,
    );

    const avatarContent = useMemo(() => {
      if (profileForm.img) {
        return (
          <img
            src={profileForm.img}
            alt={`Foto de perfil de ${userData?.nombre || "usuario"}`}
            className="h-full w-full object-cover"
          />
        );
      }

      return (
        <span className="text-lg font-bold tracking-[0.08em] text-[#fff7ef]">
          {getInitials(profileForm.nombre || userData?.nombre)}
        </span>
      );
    }, [profileForm.img, profileForm.nombre, userData?.nombre]);

    const resetStates = useCallback(
      (usuario = userData) => {
        setProfileForm(createProfileForm(usuario));
        setPasswordForm(EMPTY_PASSWORD_FORM);
        setProfileErrors({});
        setPasswordErrors({});
        setProfileResult("");
        setPasswordResult("");
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      },
      [userData],
    );

    const cargarDatosUsuario = useCallback(async () => {
      setLoading(true);
      setProfileResult("");
      setPasswordResult("");

      try {
        const response = await usuariosService.getMiPerfil();

        if (!response.success || !response.usuario) {
          setProfileResult(response.msg || "No se pudo cargar el perfil");
          return;
        }

        setUserData(response.usuario);
        setProfileForm(createProfileForm(response.usuario));
        setPasswordForm(EMPTY_PASSWORD_FORM);
        setProfileErrors({});
        setPasswordErrors({});
      } catch (error) {
        console.error(error);
        setProfileResult("Error de conexión al cargar el perfil");
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      if (!open) {
        document.body.style.overflow = "unset";
        return undefined;
      }

      document.body.style.overflow = "hidden";
      cargarDatosUsuario();

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [open, cargarDatosUsuario]);

    const handleClose = () => {
      setOpen(false);
      resetStates();
    };

    const handleProfileFieldChange = (event) => {
      const { name, value } = event.target;
      setProfileForm((current) => ({ ...current, [name]: value }));

      if (profileErrors[name]) {
        setProfileErrors((current) => ({ ...current, [name]: "" }));
      }
    };

    const handlePasswordFieldChange = (event) => {
      const { name, value } = event.target;
      setPasswordForm((current) => ({ ...current, [name]: value }));

      if (passwordErrors[name]) {
        setPasswordErrors((current) => ({ ...current, [name]: "" }));
      }
    };

    const handleUploadProfileImage = async (event) => {
      setUploadingImage(true);
      setProfileResult("");

      try {
        const result = await handleImageUpload(event);
        if (result?.success) {
          setProfileResult("Imagen lista para guardar.");
        }
      } finally {
        setUploadingImage(false);
        event.target.value = "";
      }
    };

    const validateProfileForm = () => {
      const nextErrors = {};

      const nombreError = validateNombre(profileForm.nombre);
      if (nombreError) nextErrors.nombre = nombreError;

      const telefonoError = validateTelefono(profileForm.telefono);
      if (telefonoError) nextErrors.telefono = telefonoError;

      if (profileForm.img?.trim()) {
        const imageError = validateCloudinaryUrl(profileForm.img);
        if (imageError) nextErrors.img = imageError;
      }

      return nextErrors;
    };

    const handleSaveProfile = async (event) => {
      event.preventDefault();

      const nextErrors = validateProfileForm();
      setProfileErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;

      setSavingProfile(true);
      setProfileResult("Guardando cambios...");

      try {
        const response = await usuariosService.actualizarPerfil({
          nombre: profileForm.nombre,
          telefono: profileForm.telefono,
          img: profileForm.img,
        });

        if (!response.success || !response.usuario) {
          setProfileErrors(response.errors || {});
          setProfileResult(response.msg || "No se pudo actualizar el perfil");
          return;
        }

        setUserData(response.usuario);
        setProfileForm(createProfileForm(response.usuario));
        setProfileResult("Perfil actualizado correctamente.");
        dispatchUserProfileUpdated(response.usuario);
      } catch (error) {
        console.error(error);
        setProfileResult("Error de conexión al guardar el perfil");
      } finally {
        setSavingProfile(false);
      }
    };

    const handleChangePassword = async () => {
      const nextErrors = validateChangePasswordForm(passwordForm);
      setPasswordErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;

      setChangingPassword(true);
      setPasswordResult("Actualizando contraseña...");

      try {
        const response = await usuariosService.cambiarPassword({
          currentPassword: passwordForm.currentPassword.trim(),
          newPassword: passwordForm.newPassword.trim(),
          confirmPassword: passwordForm.confirmPassword.trim(),
        });

        if (!response.success) {
          setPasswordErrors(response.errors || {});
          setPasswordResult(response.msg || "No se pudo cambiar la contraseña");
          return;
        }

        setPasswordForm(EMPTY_PASSWORD_FORM);
        setPasswordErrors({});
        setPasswordResult(
          "Contraseña actualizada. Si tu sesión se cierra, vuelve a ingresar.",
        );
      } catch (error) {
        console.error(error);
        setPasswordResult("Error de conexión al cambiar la contraseña");
      } finally {
        setChangingPassword(false);
      }
    };

    const handleEliminarCuenta = async () => {
      const userId = userData?._id || userData?.id || userData?.uid;

      if (!userId) {
        setProfileResult("No se pudo identificar la cuenta a eliminar");
        setConfirmModal({ isOpen: false, action: "" });
        return;
      }

      setSavingProfile(true);

      try {
        const response = await usuariosService.borrarUsuario(userId);

        if (!response.success) {
          setProfileResult(response.msg || "No se pudo eliminar la cuenta");
          return;
        }

        setProfileResult("Cuenta eliminada correctamente.");
        dispatchUserProfileUpdated(null);
        window.dispatchEvent(new CustomEvent("forceLogout"));

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {
        console.error(error);
        setProfileResult("Error de conexión al eliminar la cuenta");
      } finally {
        setSavingProfile(false);
        setConfirmModal({ isOpen: false, action: "" });
      }
    };

    if (!open) return null;

    return (
      <AnimatePresence>
        <ModalShell className="p-3 sm:p-5">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-5xl"
          >
            <div className="relative max-h-[92vh] overflow-y-auto rounded-[1.7rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] p-4 shadow-[0_30px_90px_rgba(31,20,14,0.24)] sm:p-6">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 cursor-pointer rounded-full border border-[#d1c2b5] bg-white/70 p-2 text-[#5c4b42] transition-colors duration-200 hover:bg-white"
                aria-label="Cerrar perfil"
                disabled={savingProfile || changingPassword}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="pr-12">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#8d6e5c]">
                  Gestión de perfil
                </span>
                <h1 className="font-editorial mt-3 text-[2rem] leading-[0.96] text-[#231a15] sm:text-[2.35rem]">
                  Mi perfil
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b4d43]">
                  Actualiza tus datos, gestiona tu foto y administra lo esencial de
                  tu cuenta.
                </p>
              </div>

              {loading ? (
                <LoadingState label="Cargando tu perfil..." />
              ) : !userData ? (
                <div className="mt-6 rounded-[1.35rem] border border-[#d7c6b4] bg-[#fffaf4] p-6 text-center">
                  <p className="text-sm text-[#5b4d43]">No se pudo cargar la información.</p>
                  {profileResult && <p className="mt-3 text-sm text-[#9c4d3a]">{profileResult}</p>}
                  <button
                    type="button"
                    onClick={cargarDatosUsuario}
                    className="mt-5 cursor-pointer rounded-full bg-[#2a1f19] px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#3b2c23]"
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.9fr]">
                  <form className="space-y-5" onSubmit={handleSaveProfile}>
                    <section className={sectionClassName}>
                      <div className="flex flex-col gap-5 md:flex-row md:items-start">
                        <div className="flex flex-col items-center md:w-[180px] md:items-start">
                          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.1rem] bg-[#443128]">
                            {avatarContent}
                          </div>

                          <label className="mt-4 w-full cursor-pointer rounded-full border border-[#c97b57]/25 bg-[#fff7ee] px-4 py-2 text-center text-sm font-semibold text-[#5d4437] transition-colors duration-200 hover:bg-[#fff2e4]">
                            {uploadingImage ? "Subiendo..." : "Cambiar foto"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleUploadProfileImage}
                              disabled={uploadingImage || savingProfile}
                            />
                          </label>

                          <p className="mt-3 text-center text-xs leading-relaxed text-[#7a695d] md:text-left">
                            Si no cargas foto, mostraremos tus iniciales.
                          </p>
                          <FieldError message={profileErrors.img} />
                        </div>

                        <div className="grid flex-1 gap-4 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                              Datos de la cuenta
                            </p>
                          </div>

                          <label className="text-sm font-semibold text-[#352820] sm:col-span-2">
                            Nombre completo
                            <div className={inputClassName}>
                              <input
                                type="text"
                                name="nombre"
                                value={profileForm.nombre}
                                onChange={handleProfileFieldChange}
                                className="h-full w-full bg-transparent outline-none"
                                maxLength={40}
                                autoComplete="name"
                              />
                            </div>
                            <FieldError message={profileErrors.nombre} />
                          </label>

                          <label className="text-sm font-semibold text-[#352820]">
                            Teléfono
                            <div className={inputClassName}>
                              <input
                                type="text"
                                name="telefono"
                                value={profileForm.telefono}
                                onChange={handleProfileFieldChange}
                                className="h-full w-full bg-transparent outline-none"
                                maxLength={15}
                                autoComplete="tel"
                              />
                            </div>
                            <FieldError message={profileErrors.telefono} />
                          </label>

                          <div className="text-sm font-semibold text-[#352820]">
                            Correo
                            <div className={`${inputClassName} bg-[#f4eee7] text-[#7c6d62]`}>
                              <input
                                type="email"
                                value={userData.correo || ""}
                                disabled
                                className="h-full w-full cursor-not-allowed bg-transparent outline-none"
                              />
                            </div>
                            <p className="mt-2 text-xs text-[#7f6c5f]">
                              El correo no puede modificarse­.
                            </p>
                          </div>
                        </div>
                      </div>

                      <StatusMessage message={profileResult} />

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          className="cursor-pointer rounded-full bg-[#2a1f19] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#3a2c24] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={savingProfile || uploadingImage}
                        >
                          {savingProfile ? "Guardando..." : "Guardar perfil"}
                        </button>
                        <button
                          type="button"
                          onClick={() => resetStates()}
                          className="cursor-pointer rounded-full border border-[#cbb9aa] bg-[#fff8f0] px-5 py-2.5 text-sm font-semibold text-[#4e3c31] transition-colors duration-200 hover:bg-white"
                          disabled={savingProfile || uploadingImage}
                        >
                          Descartar cambios
                        </button>
                      </div>
                    </section>

                    <section className={sectionClassName}>
                      <div className="flex flex-col gap-1">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8d7a6d]">
                          Contraseña
                        </p>
                        <h2 className="text-lg font-semibold text-[#271d17]">
                          Cambiar contraseña
                        </h2>
                      </div>

                      <div className="mt-5 grid gap-4">
                        <label className="text-sm font-semibold text-[#352820]">
                          Contraseña actual
                          <PasswordInput
                            className="mt-2 !rounded-[1.1rem] !border-[#d4c6b7] !bg-[#fffdf9] !shadow-[0_12px_30px_rgba(59,43,34,0.06)]"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordFieldChange}
                            show={showCurrentPassword}
                            onToggle={() => setShowCurrentPassword((value) => !value)}
                            name="currentPassword"
                            placeholder="Escribe tu contraseña actual"
                          />
                          <FieldError message={passwordErrors.currentPassword} />
                        </label>

                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="text-sm font-semibold text-[#352820]">
                            Nueva contraseña
                            <PasswordInput
                              className="mt-2 !rounded-[1.1rem] !border-[#d4c6b7] !bg-[#fffdf9] !shadow-[0_12px_30px_rgba(59,43,34,0.06)]"
                              value={passwordForm.newPassword}
                              onChange={handlePasswordFieldChange}
                              show={showNewPassword}
                              onToggle={() => setShowNewPassword((value) => !value)}
                              name="newPassword"
                              placeholder="Entre 8 y 64 caracteres"
                            />
                            <FieldError message={passwordErrors.newPassword} />
                          </label>

                          <label className="text-sm font-semibold text-[#352820]">
                            Confirmar nueva contraseña
                            <PasswordInput
                              className="mt-2 !rounded-[1.1rem] !border-[#d4c6b7] !bg-[#fffdf9] !shadow-[0_12px_30px_rgba(59,43,34,0.06)]"
                              value={passwordForm.confirmPassword}
                              onChange={handlePasswordFieldChange}
                              show={showConfirmPassword}
                              onToggle={() => setShowConfirmPassword((value) => !value)}
                              name="confirmPassword"
                              placeholder="Repite la nueva contraseña"
                            />
                            <FieldError message={passwordErrors.confirmPassword} />
                          </label>
                        </div>
                      </div>

                      <StatusMessage message={passwordResult} />

                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={handleChangePassword}
                          className="cursor-pointer rounded-full bg-[#c97b57] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#b86a47] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={changingPassword}
                        >
                          {changingPassword ? "Actualizando..." : "Actualizar contraseña"}
                        </button>
                      </div>
                    </section>
                  </form>

                  <div className="space-y-5">
                    <section className="rounded-[1.35rem] border border-[#d8b8ac] bg-[linear-gradient(180deg,rgba(255,247,244,0.98),rgba(249,235,231,0.94))] p-5 shadow-[0_16px_45px_rgba(57,42,31,0.08)]">
                      <div className="flex flex-col gap-1">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#a06b5d]">
                          Zona sensible
                        </p>
                        <h2 className="text-lg font-semibold text-[#3b231d]">
                          Eliminar cuenta
                        </h2>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-[#6d5148]">
                        Esta acción elimina tu cuenta y no se puede deshacer.
                      </p>

                      <div className="mt-4 rounded-[1rem] border border-[#d8b8ac] bg-white/55 px-4 py-3">
                        <p className="text-xs leading-relaxed text-[#7b5d54]">
                          Si continuás, se cerrará tu sesión y no podrás recuperar esta
                          cuenta.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setConfirmModal({ isOpen: true, action: "delete" })}
                        className="mt-5 w-full cursor-pointer rounded-full bg-[#b84e3c] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#a54232] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={savingProfile}
                      >
                        Eliminar cuenta
                      </button>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <ConfirmModal
            confirmModal={confirmModal}
            onClose={() => setConfirmModal({ isOpen: false, action: "" })}
            onConfirm={handleEliminarCuenta}
            type="perfil"
          />
        </ModalShell>
      </AnimatePresence>
    );
  }),
};
