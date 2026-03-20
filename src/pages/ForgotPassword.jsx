import { useState } from "react";
import { validateForgotPasswordForm } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";

const ForgotPasswordScreen = () => {
  const [correo, setCorreo] = useState("");
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForgotPasswordForm({ correo });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setIsLoading(true);
      setResult("Enviando correo...");
      const resp = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo.trim() }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        // Solo para errores de servidor
        if (
          data.msg &&
          (data.msg.includes("servidor") || data.msg.includes("conexión"))
        ) {
          setResult(data.msg);
        } else if (data.errors) {
          // Errores de validación van a los campos
          setErrors(data.errors);
        }
      } else {
        // Mensaje de éxito
        setResult(
          "Se envió un correo a Spam con instrucciones para restablecer tu contraseña"
        );
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
            Recuperar contraseña
          </h1>
          <p className="text-white text-sm mt-2 font-medium">
            Ingresa tu correo
          </p>

          <div className="flex items-center w-full mt-8 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="email"
              placeholder="Correo"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          {errors.correo && (
            <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
              {errors.correo}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full h-11 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors delay-100 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Enviar correo
          </button>

          {/* Result solo para errores de servidor y mensajes de éxito */}
          {result && (
            <p
              className={`text-center mt-3 ${
                result.includes("envió") ? "text-green-400" : "text-white"
              }`}
            >
              {result}
            </p>
          )}

          <p className="text-white text-sm mt-5 mb-6">
            <a className="text-white underline" href="/login">
              Volver al inicio de sesión
            </a>
          </p>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;
