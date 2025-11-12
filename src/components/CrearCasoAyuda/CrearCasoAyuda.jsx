"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { casosAyudaService } from "../../services/casosayuda";

export const CrearCasoAyuda = {
  openModal: () => {
    const event = new CustomEvent("openCrearCasoAyudaModal");
    window.dispatchEvent(event);
  },
  Component: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [categoria, setCategoria] = useState("OTRO");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [errores, setErrores] = useState({
      titulo: "",
      contenido: "",
    });

    useEffect(() => {
      if (isOpen) {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 800);
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        return () => clearTimeout(timer);
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }
    }, [isOpen]);

    useEffect(() => {
      const handleOpen = () => setIsOpen(true);
      window.addEventListener("openCrearCasoAyudaModal", handleOpen);
      return () =>
        window.removeEventListener("openCrearCasoAyudaModal", handleOpen);
    }, []);

    const handleCerrar = () => {
      setIsOpen(false);
      setTitulo("");
      setContenido("");
      setCategoria("TIPO");
      setMensaje("");
      setErrores({
        titulo: "",
        contenido: "",
      });
    };

    const validarCampoTexto = (valor, nombre, minLen, maxLen) => {
      if (!valor.trim()) return `${nombre} es obligatorio.`;
      if (valor.length < minLen)
        return `${nombre} debe tener al menos ${minLen} caracteres.`;
      if (valor.length > maxLen)
        return `${nombre} no puede superar ${maxLen} caracteres.`;
      const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!?()-]+$/;
      if (!regex.test(valor))
        return `${nombre} contiene caracteres no válidos.`;
      return null;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const errorTitulo = validarCampoTexto(titulo, "El título", 5, 80);
      const errorContenido = validarCampoTexto(
        contenido,
        "El contenido",
        20,
        2000
      );

      setErrores({
        titulo: errorTitulo || "",
        contenido: errorContenido || "",
      });

      setLoading(true);
      setMensaje("");

      const datos = {
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        categoria,
      };
      const resp = await casosAyudaService.crearCasoAyuda(datos);

      if (resp.ok) {
        setMensaje("Caso creado correctamente.");
        setTimeout(() => handleCerrar(), 1200);
      } else {
        setMensaje(resp.msg || "");
      }

      setLoading(false);
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="font-medium fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-white/90 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <motion.form
                onSubmit={handleSubmit}
                className="relative max-w-md w-full text-center border border-white/70 rounded-2xl px-8 py-6 shadow-lg bg-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Botón de cerrar */}
                <button
                  onClick={handleCerrar}
                  className="absolute top-4 right-4 text-white hover:text-[#FF7857] transition-colors"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Título */}
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-white text-3xl mt-2 font-medium">
                    Crear Caso de Ayuda
                  </h1>
                  <p className="text-white/80 text-sm mt-1">
                    Comparte tu consejo, pregunta o experiencia
                  </p>
                </div>

                {/* Campos del formulario */}
                <div className="mt-4">
                  <label className="flex items-left text-sm mb-1 ml-2">
                    Ingrese el título del caso
                  </label>
                  <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Título del caso *"
                      maxLength={80}
                      disabled={loading}
                      className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                    />
                  </div>
                  {errores.titulo && (
                    <p className="text-red-400 text-xs mt-1 ml-2 text-left">
                      {errores.titulo}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="flex items-left text-sm mb-1 ml-2">
                    Describe tu consejo, pregunta o experiencia
                  </label>
                  <div className="flex items-center w-full bg-white border border-gray-300/80 min-h-12 rounded-2xl overflow-hidden p-4 gap-2">
                    <textarea
                      value={contenido}
                      onChange={(e) => setContenido(e.target.value)}
                      placeholder="Descripción *"
                      maxLength={2000}
                      rows={6}
                      disabled={loading}
                      className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full resize-none"
                    />
                  </div>
                  {errores.contenido && (
                    <p className="text-red-400 text-xs mt-1 ml-2 text-left">
                      {errores.contenido}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="flex items-left text-sm mb-1 ml-2">
                    Seleccione la categoría
                  </label>
                  <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      disabled={loading}
                      className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
                    >
                      <option value="CONSEJO">Consejo</option>
                      <option value="EXPERIENCIA">Experiencia</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  </div>
                  {errores.categoria && (
                    <p className="text-red-400 text-xs mt-1 ml-2 text-left">
                      {errores.categoria}
                    </p>
                  )}
                </div>

                {/* Mensaje */}
                {mensaje && (
                  <p className="text-center text-sm text-white/80 mt-2">
                    {mensaje}
                  </p>
                )}

                {/* Botones */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-full text-white bg-white/20 border border-white/70 hover:bg-[#FF7857] transition-colors"
                  >
                    Crear caso
                  </button>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
};
