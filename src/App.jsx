import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "../src/pages/LoginScreen/LoginScreen";
import RegisterScreen from "../src/pages/RegisterScreen/RegisterScreen";
import ProtectedRoutes from "../src/routes/ProtectedRoutes/ProtectedRoutes";
import HomeScreen from "../src/pages/HomeScreen/HomeScreen";

function App() {
  // Estados para manejar login y datos de usuario
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);

  // Función para guardar datos del usuario autenticado
  const guardarUsuario = (datos) => {
    setUser(datos);
  };

  // Función cuando inicia sesión
  const iniciarSesion = () => {
    setLogin(true);
  };

  // Función cuando cierra sesión
  const cerrarSesion = () => {
    setLogin(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Login */}
        <Route
          path="/login"
          element={
            <LoginScreen
              iniciarSesion={iniciarSesion}
              guardarUsuario={guardarUsuario}
            />
          }
        />

        {/* Ruta Register */}
        <Route path="/register" element={<RegisterScreen />} />

        {/* Rutas protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoutes login={login}>
              <HomeScreen cerrarSesion={cerrarSesion} user={user} />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
