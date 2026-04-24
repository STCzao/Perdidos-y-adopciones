import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authLogin } from "../services/auth";
import { validateLoginForm } from "../utils/validators";
import AuthLayout from "../components/layout/AuthLayout";
import PasswordInput from "../components/forms/PasswordInput";

const LoginScreen = ({ iniciarSesion, guardarUsuario }) => {
  const [correo, setCorreo] = useState(
    () => localStorage.getItem("lastRegisteredEmail") || "",
  );
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateLoginForm({ correo, password });
    setErrors(newErrors);

    if (Object.keys(newErrors).length) return;

    setIsLoading(true);
    setResult("Ingresando...");

    try {
      const data = await authLogin({
        correo: correo.trim().toLowerCase(),
        password: password.trim(),
      });

      if (!data?.success || !data?.accessToken || !data?.usuario) {
        setErrors(data?.errors || {});
        setResult(data?.msg || "No se pudo iniciar sesión");
        return;
      }

      guardarUsuario(data.usuario);
      iniciarSesion();
      localStorage.removeItem("lastRegisteredEmail");

      const returnUrl = localStorage.getItem("returnUrl");
      if (returnUrl) localStorage.removeItem("returnUrl");

      navigate(returnUrl || "/", { replace: true });
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
          Iniciar sesión
        </span>
        <h1 className="font-editorial mt-3 text-[2.3rem] leading-[0.96] text-white sm:text-[2.45rem]">
          Vuelve a tu perfil.
        </h1>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-white/74">
          Ingresa para gestionar tus publicaciones.
        </p>
      </div>

      <label className="mt-8 block w-full text-left text-sm font-semibold text-white/84">
        Correo
        <div className="mt-2 flex h-13 w-full items-center rounded-[1.4rem] border border-white/12 bg-white/92 px-5 shadow-sm transition-colors duration-300 focus-within:border-[#f4c89e] focus-within:ring-2 focus-within:ring-[#f4c89e]/45">
          <input
            type="email"
            placeholder="tuemail@email.com"
            className="h-full w-full bg-transparent text-sm text-[#3d332d] placeholder:text-[#7e7066] outline-none"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            autoComplete="email"
          />
        </div>
      </label>
      {errors.correo && <p className="mt-2 text-left text-xs text-red-300">{errors.correo}</p>}

      <label className="mt-6 block w-full text-left text-sm font-semibold text-white/84">
        Contraseña
        <PasswordInput
          className="mt-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          show={show}
          onToggle={() => setShow(!show)}
        />
      </label>
      {errors.password && (
        <p className="mt-2 text-left text-xs text-red-300">{errors.password}</p>
      )}

      <button
        type="submit"
        className="mt-8 h-12 w-full cursor-pointer rounded-full bg-[#f4c89e] text-sm font-bold text-[#2a1f19] shadow-[0_14px_35px_rgba(244,200,158,0.18)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>

      {result && !Object.keys(errors).length && (
        <p className="mt-4 text-center text-sm text-white/84">{result}</p>
      )}

      <div className="mt-6 flex flex-col gap-3 text-sm text-white/80">
        <p>
          ¿No tienes cuenta?{" "}
          <Link className="font-semibold text-[#f4c89e] hover:underline" to="/register">
            Registrarse
          </Link>
        </p>
        <p>
          <Link
            className="font-semibold text-[#dbe7b5] hover:underline"
            to="/forgot-password"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginScreen;
