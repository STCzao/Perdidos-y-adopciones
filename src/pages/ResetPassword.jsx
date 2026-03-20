import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateResetPasswordForm } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";
import PasswordInput from "../components/forms/PasswordInput";

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateResetPasswordForm({ password, confirmPassword });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setIsLoading(true);
      setResult("Actualizando contraseña...");
      const resp = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        // Solo para errores de servidor, token inválido o expirado
        if (
          data.msg &&
          (data.msg.includes("Token") ||
            data.msg.includes("servidor") ||
            data.msg.includes("conexión"))
        ) {
          setResult(data.msg);
        } else if (data.errors) {
          // Errores de validación van a los campos
          setErrors(data.errors);
        }
      } else {
        // Mensaje de éxito
        setResult("Contraseña actualizada correctamente!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error(error);
      setResult("Error en la conexión al servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout onSubmit={handleSubmit}>
          <h1 className="text-white text-3xl mt-2 font-medium">
            Restablecer contraseña
          </h1>
          <p className="text-white text-sm mt-2 font-medium">
            Ingresa la nueva contraseña
          </p>

          <PasswordInput
            className="mt-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={show}
            onToggle={() => setShow(!show)}
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
              {errors.password}
            </p>
          )}

          <PasswordInput
            className="mt-8"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            show={show}
            onToggle={() => setShow(!show)}
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
              {errors.confirmPassword}
            </p>
          )}

          {/* Result solo para errores de servidor/token y mensajes de éxito */}
          {result && (
            <p
              className={`text-center mt-3 ${
                result.includes("correctamente")
                  ? "text-green-400"
                  : "text-white"
              }`}
            >
              {result}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full h-11 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors delay-100 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Actualizar contraseña
          </button>

          <p className="text-white text-sm mt-5 mb-6">
            <a className="text-white underline" href="/login">
              Volver al inicio de sesión
            </a>
          </p>
    </AuthLayout>
  );
};

export default ResetPasswordScreen;
