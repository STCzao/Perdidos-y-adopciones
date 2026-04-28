import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/ui/LoadingState";

const Home = lazy(() => import("../features/home/pages/Home"));
const PublicacionDetalle = lazy(() =>
  import("../features/publicaciones/pages/PublicacionDetalle"),
);
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Publicaciones = lazy(() => import("../features/publicaciones/pages/Publicaciones"));
const PublicacionesExitosas = lazy(() =>
  import("../features/publicaciones/pages/PublicacionesExitosas"),
);
const Comunidad = lazy(() => import("../pages/Comunidad"));
const Contact = lazy(() => import("../pages/Contact"));
const TerminosCondiciones = lazy(() => import("../pages/TerminosCondiciones"));
const QuienesSomos = lazy(() => import("../pages/QuienesSomos"));
const Perdi = lazy(() => import("../pages/consejos/Perdi"));
const Encontre = lazy(() => import("../pages/consejos/Encontre"));
const Adoptar = lazy(() => import("../pages/consejos/Adoptar"));

const RouteFallback = () => <LoadingState fullScreen label="Cargando contenido..." />;

const AppRouter = () => {
  const { login, user, iniciarSesion, guardarUsuario } = useAuth();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/publicaciones/:tipo" element={<Publicaciones user={user} />} />
        <Route path="/publicaciones/:tipo/:id" element={<PublicacionDetalle user={user} />} />
        <Route path="/casos-resueltos" element={<PublicacionesExitosas user={user} />} />
        <Route path="/consejos-perdi" element={<Perdi user={user} />} />
        <Route path="/consejos-encontre" element={<Encontre user={user} />} />
        <Route path="/consejos-adopcion" element={<Adoptar user={user} />} />
        <Route path="/casos-ayuda" element={<Comunidad user={user} />} />
        <Route path="/contacto" element={<Contact user={user} />} />
        <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />

        <Route
          path="/login"
          element={
            login ? (
              <Navigate to="/" />
            ) : (
              <Login iniciarSesion={iniciarSesion} guardarUsuario={guardarUsuario} />
            )
          }
        />
        <Route path="/register" element={login ? <Navigate to="/" /> : <Register />} />
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
    </Suspense>
  );
};

export default AppRouter;
