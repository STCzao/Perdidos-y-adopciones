import { motion } from "framer-motion";

/**
 * Shared layout wrapper for authentication pages (Login, Register, ForgotPassword, ResetPassword).
 * Renders the full-screen background image, centred motion container, and animated form card.
 */
export default function AuthLayout({ onSubmit, children }) {
  return (
    <div
      className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-10"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${import.meta.env.VITE_ACCESS_IMG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="flex flex-col items-center text-white/90 w-full"
      >
        <motion.form
          onSubmit={onSubmit}
          className="max-w-96 w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
        >
          {children}
        </motion.form>
      </motion.div>
    </div>
  );
}
