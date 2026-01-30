import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    telefono: "",
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");
  const [show, setShow] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = {};

    // Validación de nombre
    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
      valid = false;
    } else if (form.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
      valid = false;
    } else if (form.nombre.trim().length > 41) {
      newErrors.nombre = "El nombre no puede tener más de 40 caracteres";
      valid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios";
      valid = false;
    }

    // Validación de teléfono
    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
      valid = false;
    } else if (!/^[0-9]{7,15}$/.test(form.telefono.trim())) {
      newErrors.telefono =
        "El teléfono debe contener entre 7 y 15 dígitos numéricos";
      valid = false;
    }

    // Validación de correo
    if (!form.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      newErrors.correo = "Debe ser un correo válido";
      valid = false;
    } else if (form.correo.trim().length > 36) {
      newErrors.correo = "El correo no puede tener más de 35 caracteres";
      valid = false;
    }

    // Validación de password
    if (!form.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
      valid = false;
    } else if (form.password.trim().length < 5) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    } else if (form.password.trim().length > 16) {
      newErrors.password = "La contraseña no puede tener más de 15 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      setResult("Registrando...");
      const resp = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          correo: form.correo.trim(),
          password: form.password.trim(),
          telefono: form.telefono.trim(),
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        if (data.errors) {
          // Los errores del backend van a los campos específicos
          setErrors(data.errors);
        } else {
          // Si no hay estructura errors, mostramos en result
          setResult(data.msg || "Error al registrarse");
        }
      } else {
        localStorage.setItem("token", data.accessToken);
        
        // Guardar refreshToken si viene
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        
        setResult("¡Registro exitoso!");
        setForm({ nombre: "", correo: "", password: "", telefono: "" });
        setErrors({});
        
        // Verificar si hay una URL de retorno guardada
        const returnUrl = localStorage.getItem("returnUrl");
        
        setTimeout(() => {
          if (returnUrl) {
            localStorage.removeItem("returnUrl");
            navigate(returnUrl);
          } else {
            navigate("/");
          }
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setResult("Error de conexión al servidor");
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
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center text-white/90 w-full"
      >
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-96 w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
        >
          <div className="flex flex-col items-center justify-center font-playfair">
            <h1 className="text-white text-3xl mt-2 font-medium">Registro</h1>
            <p className="text-white/80 text-sm mt-1">Complete sus datos</p>
          </div>

          {/* Nombre */}
          <div className="flex items-center w-full mt-8 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>
          {errors.nombre && (
            <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
              {errors.nombre}
            </p>
          )}

          {/* Telefono */}
          <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          {errors.telefono && (
            <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
              {errors.telefono}
            </p>
          )}

          {/* Correo */}
          <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={form.correo}
              onChange={handleChange}
            />
          </div>
          {errors.correo && (
            <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
              {errors.correo}
            </p>
          )}

          {/* Password */}
          <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={form.password}
              onChange={handleChange}
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

          {/* Result solo se muestra cuando NO hay errores en campos */}
          {result && !Object.keys(errors).length && (
            <p className="text-center mt-3 text-white">{result}</p>
          )}

          <button
            type="submit"
            className="mt-6 w-full h-11 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
          >
            Registrarse
          </button>

          <p className="text-white text-sm mt-5 mb-6">
            ¿Ya tienes cuenta?{" "}
            <a className="text-white underline" href="/login">
              Iniciar sesión
            </a>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
