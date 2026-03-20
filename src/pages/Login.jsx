import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authLogin } from "../services/auth";
import { validateLoginForm } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";
import PasswordInput from "../components/forms/PasswordInput";

const LoginScreen = ({ iniciarSesion, guardarUsuario }) => {
  const [correo, setCorreo] = useState(
    () => localStorage.getItem("lastRegisteredEmail") || ""
  );
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateLoginForm({ correo, password });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setIsLoading(true);
      setResult("Ingresando...");
      const data = await authLogin({
        correo: correo.trim(),
        password: password.trim(),
      });

      if (!data.accessToken) {
        if (data.errors) setErrors(data.errors);
        else setResult(data.msg || "Error al iniciar sesión");
      } else {
        // authLogin ya guarda token y refreshToken en localStorage
        guardarUsuario(data.usuario); // también guarda user en localStorage y notifica el Sidebar
        iniciarSesion();
        localStorage.removeItem("lastRegisteredEmail");

        const returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) localStorage.removeItem("returnUrl");

        setTimeout(() => {
          if (returnUrl) navigate(returnUrl, { replace: true });
          else navigate("/", { replace: true });
        }, 100);
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
          <div className="flex flex-col items-center justify-center">
            <h5 className="text-white text-3xl mt-2">¡Hola!</h5>
            <p className="text-sm mt-4">
              Las publicaciones en esta base de datos son gratuitas. Mantenlas
              actualizadas desde tu perfil.
            </p>
          </div>

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

          <button
            type="submit"
            className="mt-6 w-full h-11 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors delay-100 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Ingresar
          </button>

          {result && !Object.keys(errors).length && (
            <p className="text-center mt-3 text-white">{result}</p>
          )}

          <p className="text-white text-sm mt-5 mb-6">
            ¿No tienes cuenta?{" "}
            <a className="text-white underline" href="/register">
              Registrarse
            </a>
          </p>
          <p className="text-white text-sm mt-3 mb-6">
            <a className="text-white underline" href="/forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
    </AuthLayout>
  );
};

export default LoginScreen;
