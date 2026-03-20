import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearUsuario } from "../services/auth";
import { validateRegisterForm } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";
import PasswordInput from "../components/forms/PasswordInput";

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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateRegisterForm({
      nombre: form.nombre,
      telefono: form.telefono,
      correo: form.correo,
      password: form.password,
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setIsLoading(true);
      setResult("Registrando...");
      const data = await crearUsuario({
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        password: form.password.trim(),
        telefono: form.telefono.trim(),
      });

      if (!data.usuario) {
        if (data.errors) setErrors(data.errors);
        else setResult(data.msg || "Error al registrarse");
      } else {
        setResult("¡Registro exitoso! Redirigiendo al login...");
        setForm({ nombre: "", correo: "", password: "", telefono: "" });
        setErrors({});

        localStorage.setItem("lastRegisteredEmail", form.correo.trim());

        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error(error);
      setResult("Error de conexión al servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout onSubmit={handleSubmit}>
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
          <PasswordInput
            className="mt-4"
            value={form.password}
            onChange={handleChange}
            show={show}
            onToggle={() => setShow(!show)}
          />
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
            className="mt-6 w-full h-11 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors delay-100 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Registrarse
          </button>

          <p className="text-white text-sm mt-5 mb-6">
            ¿Ya tienes cuenta?{" "}
            <a className="text-white underline" href="/login">
              Iniciar sesión
            </a>
          </p>
    </AuthLayout>
  );
}
