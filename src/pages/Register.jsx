import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { crearUsuario } from "../services/auth";
import { validateRegisterForm } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";
import PasswordInput from "../components/forms/PasswordInput";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmPassword: "",
    telefono: "",
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateRegisterForm(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setIsLoading(true);
    setResult("Registrando...");

    try {
      const data = await crearUsuario({
        nombre: form.nombre.trim(),
        correo: form.correo.trim().toLowerCase(),
        password: form.password.trim(),
        confirmPassword: form.confirmPassword.trim(),
        telefono: form.telefono.trim(),
      });

      if (!data?.success) {
        setErrors(data?.errors || {});
        setResult(data?.msg || "No se pudo crear la cuenta");
        return;
      }

      setResult("Cuenta creada correctamente. Te llevamos al inicio de sesión...");
      localStorage.setItem("lastRegisteredEmail", form.correo.trim().toLowerCase());
      setForm({
        nombre: "",
        correo: "",
        password: "",
        confirmPassword: "",
        telefono: "",
      });
      setErrors({});

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
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#f4c89e]">
          Crear cuenta
        </span>
        <h1 className="font-editorial mt-3 text-[2.3rem] leading-[0.96] text-white sm:text-[2.45rem]">
          Crea tu cuenta.
        </h1>
        <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-white/74">
          Regístrate para publicar y editar avisos.
        </p>
      </div>

      <label className="mt-8 block w-full text-left text-sm font-semibold text-white/84">
        Nombre completo
        <div className="mt-2 flex h-13 w-full items-center rounded-[1.4rem] border border-white/12 bg-white/92 px-5 shadow-sm transition-colors duration-300 focus-within:border-[#f4c89e] focus-within:ring-2 focus-within:ring-[#f4c89e]/45">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre y apellido"
            className="h-full w-full bg-transparent text-sm text-[#3d332d] placeholder:text-[#7e7066] outline-none"
            value={form.nombre}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>
      </label>
      {errors.nombre && <p className="mt-2 text-left text-xs text-red-300">{errors.nombre}</p>}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="block text-left text-sm font-semibold text-white/84">
          Teléfono
          <div className="mt-2 flex h-13 w-full items-center rounded-[1.4rem] border border-white/12 bg-white/92 px-5 shadow-sm transition-colors duration-300 focus-within:border-[#f4c89e] focus-within:ring-2 focus-within:ring-[#f4c89e]/45">
            <input
              type="text"
              name="telefono"
              placeholder="3812345678"
              className="h-full w-full bg-transparent text-sm text-[#3d332d] placeholder:text-[#7e7066] outline-none"
              value={form.telefono}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>
          {errors.telefono && <p className="mt-2 text-left text-xs text-red-300">{errors.telefono}</p>}
        </label>

        <label className="block text-left text-sm font-semibold text-white/84">
          Correo
          <div className="mt-2 flex h-13 w-full items-center rounded-[1.4rem] border border-white/12 bg-white/92 px-5 shadow-sm transition-colors duration-300 focus-within:border-[#f4c89e] focus-within:ring-2 focus-within:ring-[#f4c89e]/45">
            <input
              type="email"
              name="correo"
              placeholder="tuemail@email.com"
              className="h-full w-full bg-transparent text-sm text-[#3d332d] placeholder:text-[#7e7066] outline-none"
              value={form.correo}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {errors.correo && <p className="mt-2 text-left text-xs text-red-300">{errors.correo}</p>}
        </label>
      </div>

      <label className="mt-6 block w-full text-left text-sm font-semibold text-white/84">
        Contraseña
        <PasswordInput
          className="mt-2"
          value={form.password}
          onChange={handleChange}
          show={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          name="password"
        />
      </label>
      {errors.password && <p className="mt-2 text-left text-xs text-red-300">{errors.password}</p>}

      <label className="mt-6 block w-full text-left text-sm font-semibold text-white/84">
        Confirmar contraseña
        <PasswordInput
          className="mt-2"
          value={form.confirmPassword}
          onChange={handleChange}
          show={showConfirmPassword}
          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          name="confirmPassword"
          placeholder="Repite la contraseña"
        />
      </label>
      {errors.confirmPassword && (
        <p className="mt-2 text-left text-xs text-red-300">{errors.confirmPassword}</p>
      )}

      <button
        type="submit"
        className="mt-8 h-12 w-full cursor-pointer rounded-full bg-[#f4c89e] text-sm font-bold text-[#2a1f19] shadow-[0_14px_35px_rgba(244,200,158,0.18)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      {result && !Object.keys(errors).length && (
        <p className="mt-4 text-center text-sm text-white/84">{result}</p>
      )}

      <div className="mt-6 flex flex-col gap-3 text-sm text-white/80">
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link className="font-semibold text-[#f4c89e] hover:underline" to="/login">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
