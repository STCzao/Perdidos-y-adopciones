import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- importar

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
  const navigate = useNavigate(); // <-- hook

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = {};

    if (!form.nombre || !form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
      valid = false;
    }
    if (!form.telefono || !form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
      valid = false;
    }
    if (!form.correo || !form.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      newErrors.correo = "Correo inválido";
      valid = false;
    }
    if (!form.password || !form.password.trim()) {
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
        // Si el backend responde con código 400 por correo duplicado
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 py-16 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Registro</h1>
        <p className="text-gray-500 text-sm mt-2">Complete sus datos</p>

        {/* Nombre */}
        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
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
          <p className="text-red-500 text-xs text-left mt-1">{errors.nombre}</p>
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
          <p className="text-red-500 text-xs text-left mt-1">
            {errors.telefono}
          </p>
        )}

        {/* Correo */}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="email"
            name="correo"
            placeholder="Email"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={form.correo}
            onChange={handleChange}
          />
        </div>
        {errors.correo && (
          <p className="text-red-500 text-xs text-left mt-1">{errors.correo}</p>
        )}

        {/* Password */}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs text-left mt-1">
            {errors.password}
          </p>
        )}

        <button className="mt-5 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity">
          Registrarse
        </button>

        {result && <p className="text-center mt-3 text-gray-500">{result}</p>}

        <p className="text-gray-500 text-sm mt-8 mb-5">
          ¿Ya tenés cuenta?{" "}
          <a className="text-indigo-500" href="/login">
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
}
