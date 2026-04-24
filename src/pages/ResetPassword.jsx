import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/auth";
import { validateResetPasswordForm } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";
import PasswordInput from "../components/forms/PasswordInput";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateResetPasswordForm({ password, confirmPassword });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setIsLoading(true);
    setResult("Actualizando contraseña...");

    try {
      const data = await resetPassword(token, {
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      });

      if (!data?.success) {
        setErrors(data?.errors || {});
        setResult(data?.msg || "No se pudo actualizar la contraseña");
        return;
      }

      setErrors({});
      setResult("Contraseña actualizada correctamente.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      console.error(error);
      setResult("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout onSubmit={handleSubmit}>
      <div className="flex flex-col items-start">
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#dbe7b5]">
          Nueva contraseña
        </span>
        <h1 className="font-editorial mt-3 text-[2.3rem] leading-[0.96] text-white sm:text-[2.45rem]">
          Crea una clave nueva.
        </h1>
        <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-white/74">
          Escribe una contraseña nueva para volver a entrar.
        </p>
      </div>

      <label className="mt-8 block w-full text-left text-sm font-semibold text-white/84">
        Contraseña nueva
        <PasswordInput
          className="mt-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          show={showPassword}
          onToggle={() => setShowPassword((value) => !value)}
          name="password"
          placeholder="Escribe una contraseña segura"
        />
      </label>
      {errors.password && <p className="mt-2 text-left text-xs text-red-300">{errors.password}</p>}

      <label className="mt-6 block w-full text-left text-sm font-semibold text-white/84">
        Confirmar contraseña
        <PasswordInput
          className="mt-2"
          placeholder="Vuelve a escribir la contraseña"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          show={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((value) => !value)}
          name="confirmPassword"
        />
      </label>
      {errors.confirmPassword && (
        <p className="mt-2 text-left text-xs text-red-300">{errors.confirmPassword}</p>
      )}

      {result && (
        <p
          className={`mt-4 text-center text-sm ${
            result.includes("correctamente") ? "text-[#dbe7b5]" : "text-white/84"
          }`}
        >
          {result}
        </p>
      )}

      <button
        type="submit"
        className="mt-8 h-12 w-full cursor-pointer rounded-full bg-[#f4c89e] text-sm font-bold text-[#2a1f19] shadow-[0_14px_35px_rgba(244,200,158,0.18)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Actualizando..." : "Actualizar contraseña"}
      </button>

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
