import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Shared layout wrapper for authentication pages.
 * Keeps the auth flow readable and visually aligned with the rest of the app.
 */
export default function AuthLayout({ onSubmit, children }) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24 text-white sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(125deg, rgba(23,17,15,0.84), rgba(23,17,15,0.56)), url(${import.meta.env.VITE_ACCESS_IMG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,200,158,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(219,231,181,0.12),transparent_24%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative grid w-full max-w-6xl overflow-hidden rounded-[2.6rem] border border-white/10 bg-[rgba(22,17,15,0.48)] shadow-[0_30px_90px_rgba(20,15,13,0.24)] backdrop-blur-xl lg:grid-cols-[0.95fr_0.9fr]"
      >
        <div className="hidden border-r border-white/10 p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#f4c89e]">
              Comunidad
            </span>
            <h1 className="font-editorial mt-5 max-w-md text-[2.85rem] leading-[0.92] text-[#fff6eb]">
              Cada caso necesita volver a encontrarse.
            </h1>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/72">
              Accede a tu cuenta para publicar, editar y seguir tus avisos.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-5 text-[0.95rem] leading-relaxed text-white/72">
            Publica, actualiza y mantén visible la información importante.
          </div>
        </div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          className="w-full px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
        >
          <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.06)] p-6 shadow-[0_20px_55px_rgba(20,15,13,0.12)] backdrop-blur-sm sm:p-8">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[0.92rem] font-semibold text-white/88 transition-colors duration-300 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e]/70"
            >
              <span aria-hidden="true" className="text-base leading-none">
                ←
              </span>
              Volver al inicio
            </Link>

            {children}
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
