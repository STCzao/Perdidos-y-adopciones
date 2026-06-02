import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/ui/LoadingState";
import PageTransition from "../components/ui/PageTransition";

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

const wrap = (Component, props = {}) => (
  <PageTransition>
    <Suspense fallback={<RouteFallback />}>
      <Component {...props} />
    </Suspense>
  </PageTransition>
);

const AppRouter = () => {
  const { login, user, guardarUsuario } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={wrap(Home, { user })} />
        <Route path="/publicaciones/:tipo" element={wrap(Publicaciones, { user })} />
        <Route
          path="/publicaciones/:tipo/:id"
          element={wrap(PublicacionDetalle, { user })}
        />
        <Route
          path="/casos-resueltos"
          element={wrap(PublicacionesExitosas, { user })}
        />
        <Route path="/consejos-perdi" element={wrap(Perdi, { user })} />
        <Route path="/consejos-encontre" element={wrap(Encontre, { user })} />
        <Route path="/consejos-adopcion" element={wrap(Adoptar, { user })} />
        <Route path="/casos-ayuda" element={wrap(Comunidad, { user })} />
        <Route path="/contacto" element={wrap(Contact, { user })} />
        <Route
          path="/terminos-y-condiciones"
          element={wrap(TerminosCondiciones)}
        />
        <Route path="/quienes-somos" element={wrap(QuienesSomos)} />

        <Route
          path="/login"
          element={
            login ? (
              <Navigate to="/" />
            ) : (
              <Login guardarUsuario={guardarUsuario} />
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
    </AnimatePresence>
  );
};

export default AppRouter;
