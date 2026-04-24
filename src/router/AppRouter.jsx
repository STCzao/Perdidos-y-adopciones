import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../features/home/pages/Home";
import PublicacionDetalle from "../features/publicaciones/pages/PublicacionDetalle";
import { AdminPublicaciones } from "../features/publicaciones/AdminPublicaciones";
import { AdminUsuarios } from "../features/usuarios/AdminUsuarios";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Publicaciones from "../pages/Publicaciones";
import PublicacionesExitosas from "../pages/PublicacionesExitosas";
import Comunidad from "../pages/Comunidad";
import Contact from "../pages/Contact";
import MediaInfo from "../pages/MediaInfo";
import Perdi from "../pages/consejos/Perdi";
import Encontre from "../pages/consejos/Encontre";
import Adoptar from "../pages/consejos/Adoptar";

const AppRouter = () => {
  const { login, user, iniciarSesion, guardarUsuario } = useAuth();

  return (
    <>
      <Routes>
        {/* Rutas públicas - accesibles sin autenticación */}
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/publicaciones/:tipo"
          element={<Publicaciones user={user} />}
        />
        <Route
          path="/publicaciones/:tipo/:id"
          element={<PublicacionDetalle user={user} />}
        />
        <Route
          path="/casos-resueltos"
          element={<PublicacionesExitosas user={user} />}
        />
        <Route
          path="/consejos-perdi"
          element={<Perdi user={user} />}
        />
        <Route
          path="/consejos-encontre"
          element={<Encontre user={user} />}
        />
        <Route
          path="/consejos-adopcion"
          element={<Adoptar user={user} />}
        />
        <Route
          path="/perdidos-informacion"
          element={<MediaInfo type="perdidos" />}
        />
        <Route
          path="/encontrados-informacion"
          element={<MediaInfo type="encontrados" />}
        />
        <Route
          path="/adopciones-informacion"
          element={<MediaInfo type="adopciones" />}
        />
        <Route
          path="/casos-ayuda"
          element={<Comunidad user={user} />}
        />
        <Route path="/contacto" element={<Contact user={user} />} />

        {/* Rutas de autenticación */}
        <Route
          path="/login"
          element={
            login ? (
              <Navigate to="/" />
            ) : (
              <Login
                iniciarSesion={iniciarSesion}
                guardarUsuario={guardarUsuario}
              />
            )
          }
        />
        <Route
          path="/register"
          element={login ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={login ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={login ? <Navigate to="/" /> : <ResetPassword />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Modales Admin accesibles siempre */}
      <AdminPublicaciones.Component />
      <AdminUsuarios.Component />
    </>
  );
};

export default AppRouter;
