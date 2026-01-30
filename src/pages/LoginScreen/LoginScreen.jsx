import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginScreen = ({ iniciarSesion, guardarUsuario }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = {};

    if (!correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      newErrors.correo = "Debe ser un correo válido";
      valid = false;
    }

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

    setErrors(newErrors);
    if (!valid) return;

    try {
      setResult("Ingresando...");
      const resp = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: correo.trim(),
          password: password.trim(),
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        if (data.errors) setErrors(data.errors);
        else setResult(data.msg || "Error al iniciar sesión");
      } else {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.usuario));
        
        // Guardar refreshToken si viene
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        
        guardarUsuario(data.usuario);
        iniciarSesion();
        
        // Verificar si hay una URL de retorno guardada
        const returnUrl = localStorage.getItem("returnUrl");
        
        // Limpiar returnUrl inmediatamente
        if (returnUrl) {
          localStorage.removeItem("returnUrl");
        }
        
        // Pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
          if (returnUrl) {
            navigate(returnUrl, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 100);
      }
    } catch (error) {
      console.error(error);
      setResult("Error en la conexión al servidor");
    }
  };

  return (
    <div
      className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-10"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${import.meta.env.VITE_ACCESS_IMG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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

          <div className="flex items-center w-full mt-8 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type={show ? "text" : "password"}
              placeholder="Contraseña"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="pr-4"
            >
              {show ? (
                // Ojo tachado
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.224-3.592m3.1-2.448A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.043 5.04M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3l18 18"
                  />
                </svg>
              ) : (
                // Ojo abierto
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
              {errors.password}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full h-11 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
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
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
