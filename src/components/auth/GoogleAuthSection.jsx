import { useState } from "react";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { validateTelefono } from "../../utils/validators";

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
          ref={google.buttonRef}
          className={`mt-4 flex h-11 w-full items-center justify-center overflow-hidden rounded-full ${
            google.isLoading ? "pointer-events-none opacity-50" : ""
          }`}
        />
      )}

      {google.message && (
        <p className="mt-4 text-center text-sm text-white/84">{google.message}</p>
      )}
    </>
  );
}
