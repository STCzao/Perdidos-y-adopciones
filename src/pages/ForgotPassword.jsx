import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/auth";
import { validateForgotPasswordForm } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";

export default function ForgotPasswordScreen() {
  const [correo, setCorreo] = useState("");
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const genericMessage =
    "Si el correo existe, te enviaremos instrucciones para restablecer tu contraseña.";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateForgotPasswordForm({ correo });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setIsLoading(true);
    setResult("Enviando correo...");

    try {
      const response = await forgotPassword(correo.trim().toLowerCase());

      if (response?.success) {
        setResult(genericMessage);
        setErrors({});
      } else {
        setErrors(response?.errors || {});
        setResult(
          response?.status === 429
            ? response.msg || "Demasiadas solicitudes. Intentá nuevamente más tarde."
            : genericMessage,
        );
      }
    } catch (error) {
      console.error(error);
      setResult(genericMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout onSubmit={handleSubmit}>
      <div className="flex flex-col items-start">
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#dbe7b5]">
          Recuperar acceso
        </span>
        <h1 className="font-editorial mt-3 text-[2.3rem] leading-[0.96] text-white sm:text-[2.45rem]">
          Restablecé tu contraseña.
        </h1>
        <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-white/74">
          Escribí tu correo y te enviaremos un enlace para continuar.
        </p>
      </div>

      <label className="mt-8 block w-full text-left text-sm font-semibold text-white/84">
        Correo
        <div className="mt-2 flex h-13 w-full items-center rounded-[1.4rem] border border-white/12 bg-white/92 px-5 shadow-sm transition-colors duration-300 focus-within:border-[#f4c89e] focus-within:ring-2 focus-within:ring-[#f4c89e]/45">
          <input
            type="email"
            placeholder="tuemail@email.com"
            className="h-full w-full bg-transparent text-sm text-[#3d332d] outline-none placeholder:text-[#7e7066]"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            autoComplete="email"
          />
        </div>
      </label>
      {errors.correo && <p className="mt-2 text-left text-xs text-red-300">{errors.correo}</p>}

      <button
        type="submit"
        className="mt-8 h-12 w-full cursor-pointer rounded-full bg-[#f4c89e] text-sm font-bold text-[#2a1f19] shadow-[0_14px_35px_rgba(244,200,158,0.18)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Enviar correo"}
      </button>

      {result && <p className="mt-4 text-center text-sm text-white/84">{result}</p>}

      <div className="mt-6 flex flex-col gap-3 text-sm text-white/80">
        <p>
          <Link className="font-semibold text-[#f4c89e] hover:underline" to="/login">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
