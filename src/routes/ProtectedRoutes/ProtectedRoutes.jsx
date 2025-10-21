import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoutes = ({ children, login }) => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setChecking(false), 200);
    return () => clearTimeout(timer);
  }, []);

  return login ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
