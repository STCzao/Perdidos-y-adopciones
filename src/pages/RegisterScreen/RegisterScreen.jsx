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

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
      valid = false;
    }
    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
      valid = false;
    }
    if (!form.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      newErrors.correo = "Correo inválido";
      valid = false;
    }
    if (!form.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      setResult("Registrando...");
      const resp = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await resp.json();

      if (!resp.ok) {
        if (data.msg && data.msg.includes("ya está registrado")) {
          setErrors((prev) => ({ ...prev, correo: data.msg }));
        }
        setResult(data.msg || "Error al registrarse");
      } else {
        localStorage.setItem("token", data.token);
        setResult("¡Registro exitoso!");
        setForm({ nombre: "", correo: "", password: "", telefono: "" });
        setErrors({});
        navigate("/"); // redirige a HomeScreen
      }
    } catch (error) {
      console.error(error);
      setResult("Error de conexión al servidor");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(../src/assets/img_login1.png)] bg-cover bg-center text-white flex flex-col items-center justify-center">
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
              placeholder="Nombre"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>
          {errors.nombre && (
            <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>
          )}

          {/* Telefono */}
          <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="text"
              name="telefono"
              placeholder="Telefono"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          {errors.telefono && (
            <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>
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
            <p className="text-red-400 text-xs mt-1">{errors.correo}</p>
          )}

          {/* Password */}
          <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}

          <button
            type="submit"
            className="mt-6 w-full h-11 rounded-full text-white bg-black border border-white/70 hover:bg-[#FF7857] transition-opacity"
          >
            Registrarse
          </button>

          <p className="text-white text-sm mt-3 mb-6">
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
