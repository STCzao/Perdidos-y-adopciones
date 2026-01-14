import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook para proteger acciones específicas
 * Redirige a login si el usuario no está autenticado
 * 
 * @returns {Function} Función que envuelve la acción a proteger
 * 
 * Uso:
 * const withAuth = useRequireAuth();
 * onClick={() => withAuth(() => CrearPublicacion.openModal())}
 */
export const useRequireAuth = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  return (callback) => {
    // Si no hay contexto o no está autenticado, redirigir a login
    if (!context || !context.login) {
      navigate("/login");
      return;
    }
    // Si está autenticado, ejecutar la acción
    callback();
  };
};

export default useRequireAuth;
