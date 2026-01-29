import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/*
 * Hook para proteger acciones específicas. Redirige a login si el usuario no está autenticado 
 */
export const useRequireAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthContext);

  return (callback) => {
    // Si no hay contexto o no está autenticado, redirigir a login
    if (!context || !context.login) {
      // Guardar la URL actual (pathname + hash) para redirigir después del login
      const returnUrl = location.pathname + location.hash;
      localStorage.setItem("returnUrl", returnUrl);
      navigate("/login");
      return;
    }
    // Si está autenticado, ejecutar la acción
    callback();
  };
};

export default useRequireAuth;
