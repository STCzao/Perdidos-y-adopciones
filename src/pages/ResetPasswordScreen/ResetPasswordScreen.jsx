import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let valid = true;

    // Validaciones frontend
    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
      valid = false;
    } else if (password.trim().length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    } else if (password.trim().length > 15) {
      newErrors.password = "La contraseña no puede tener más de 15 caracteres";
      valid = false;
    }

    if (password.trim() !== confirmPassword.trim()) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
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
    }
  };

  return (
    <div className="font-medium w-full min-h-screen bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(../src/assets/img_login1.png)] bg-cover bg-center text-white flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="flex flex-col items-center text-white/90 w-full"
      >
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-96 w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
        >
          <h1 className="text-white text-3xl mt-2 font-medium">
            Restablecer contraseña
          </h1>

          <div className="flex items-center w-full mt-8 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
              {errors.password}
            </p>
          )}

          <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
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
            className="mt-6 w-full h-11 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-opacity"
          >
            Actualizar contraseña
          </button>

          <p className="text-white text-sm mt-5 mb-6">
            <a className="text-white underline" href="/login">
              Volver al inicio de sesión
            </a>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordScreen;
