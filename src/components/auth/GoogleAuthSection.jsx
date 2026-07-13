import { useState } from "react";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { validateTelefono } from "../../utils/validators";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

export default function GoogleAuthSection({ onSuccess }) {
  const google = useGoogleAuth({ onSuccess });
  const [telefono, setTelefono] = useState("");
  const [telefonoValidationError, setTelefonoValidationError] = useState("");

  if (!google.isEnabled) return null;

  const handleTelefonoSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateTelefono(telefono);
    if (validationError) {
      setTelefonoValidationError(validationError);
      return;
    }
    setTelefonoValidationError("");
    await google.confirmTelefono(telefono.trim());
  };

  return (
    <>
      <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
        <span className="h-px flex-1 bg-white/12" />o
        <span className="h-px flex-1 bg-white/12" />
      </div>

      {google.pendingIdToken ? (
        <div className="mt-4 rounded-[1.4rem] border border-white/12 bg-white/8 p-5 text-left">
          <p className="text-sm text-white/84">
            Necesitamos tu teléfono para terminar de crear tu cuenta.
          </p>
          <label className="mt-3 block text-left text-sm font-semibold text-white/84">
            Teléfono / WhatsApp
            <div className="mt-2 flex h-11 w-full items-center rounded-[1.4rem] border border-white/12 bg-white/92 px-5 shadow-sm transition-colors duration-300 focus-within:border-[#f4c89e] focus-within:ring-2 focus-within:ring-[#f4c89e]/45">
              <input
                type="tel"
                placeholder="3812345678"
                className="h-full w-full bg-transparent text-sm text-[#3d332d] placeholder:text-[#7e7066] outline-none"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                autoComplete="tel"
              />
            </div>
          </label>
          {(telefonoValidationError || google.telefonoError) && (
            <p className="mt-2 text-left text-xs text-red-300">
              {telefonoValidationError || google.telefonoError}
            </p>
          )}
          <button
            type="button"
            onClick={handleTelefonoSubmit}
            disabled={google.isLoading}
            className="mt-4 h-11 w-full cursor-pointer rounded-full bg-[#f4c89e] text-sm font-bold text-[#2a1f19] shadow-[0_14px_35px_rgba(244,200,158,0.18)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {google.isLoading ? "Verificando..." : "Continuar"}
          </button>
        </div>
      ) : (
        <div
          ref={google.containerRef}
          className={`relative mt-4 h-11 w-full ${google.isLoading ? "pointer-events-none" : ""}`}
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-3 rounded-full border border-white/12 bg-white/8 text-sm font-semibold text-white/90 transition-colors duration-300 ${
              google.isLoading ? "opacity-50" : ""
            }`}
          >
            <GoogleIcon />
            {google.isLoading ? "Verificando..." : "Continuar con Google"}
          </div>
          <div
            ref={google.buttonRef}
            className="absolute inset-0 overflow-hidden rounded-full opacity-0"
          />
        </div>
      )}

      {google.message && (
        <p className="mt-4 text-center text-sm text-white/84">{google.message}</p>
      )}
    </>
  );
}
