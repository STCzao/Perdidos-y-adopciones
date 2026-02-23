import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, login }) => {
  return login ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
