import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useState } from "react";
import { validateContactForm } from "../utils/validators";

const ContactScreen = () => {
  const [result, setResult] = useState("");
  const [capturarNombre, setCapturarNombre] = useState("");
  const [capturarTelefono, setCapturarTelefono] = useState("");
  const [capturarEmail, setCapturarEmail] = useState("");
  const [capturarMensaje, setCapturarMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateContactForm({
      nombre: capturarNombre,
      telefono: capturarTelefono,
      email: capturarEmail,
      mensaje: capturarMensaje,
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      setResult("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);
    setResult("Enviando...");
    const formData = new FormData(event.target);

    formData.append("access_key", import.meta.env.VITE_ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Formulario enviado correctamente.");
        event.target.reset();
        setCapturarNombre("");
        setCapturarTelefono("");
        setCapturarEmail("");
        setCapturarMensaje("");
        setErrors({});
      } else {
        setResult("Ocurrió un error al enviar el formulario. Intenta de nuevo.");
      }
    } catch {
      setResult("Error de conexión al servidor. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f6efe4] text-[#241914]">
      <Navbar />

      <section
        className="relative isolate flex min-h-dvh items-center overflow-hidden px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-30 lg:px-8 lg:pt-30"
        style={{
          background:
            "linear-gradient(180deg, #2c211d 0%, #43302a 58%, #5a3f35 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-55"
          style={{
            backgroundImage: `linear-gradient(125deg, rgba(25,20,17,0.74), rgba(25,20,17,0.26)), url(${import.meta.env.VITE_CONTACT_IMG_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute left-[-8rem] top-36 h-72 w-72 rounded-full bg-[#c86d4b]/18 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8rem] top-28 h-80 w-80 rounded-full bg-[#95a667]/12 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl">
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[1.35rem] border border-white/10 bg-[rgba(22,17,15,0.52)] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:rounded-[2rem] sm:p-6 lg:p-8"
            >
              <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.26em] text-[#f5e7d9]">
                Colaborar
              </span>
              <h1 className="font-editorial mt-4 text-[2rem] leading-[0.94] text-white sm:mt-5 sm:text-[3rem]">
                Formulario para colaboradores.
              </h1>
              <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-white/82 sm:mt-4 sm:text-[0.98rem]">
                Si quieres sumarte a esta iniciativa, aquí puedes contarnos cómo te
                gustaría ayudar.
              </p>
              <p className="mt-3 max-w-xl text-[0.86rem] leading-relaxed text-white/68 sm:text-[0.92rem]">
                Hay distintas formas de colaborar según tu tiempo, recursos y nivel
                de participación.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="rounded-[1.35rem] border border-white/10 bg-[rgba(255,250,244,0.94)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:rounded-[2rem] sm:p-5 lg:p-6"
            >
              <form onSubmit={onSubmit} className="grid gap-4 text-[#241914]">
                <div>
                  <label className="text-sm font-semibold text-[#5f4c41]">Nombre</label>
                  <input
                    type="text"
                    name="Nombre"
                    className="mt-2 w-full rounded-[0.9rem] border border-[#2f241d]/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d46f49]/45 focus:ring-2 focus:ring-[#d46f49]/15"
                    placeholder="Ingresa tu nombre completo"
                    value={capturarNombre}
                    onChange={(e) => setCapturarNombre(e.target.value)}
                  />
                  {errors.nombre && <span className="mt-1 block text-xs text-[#d9623f]">{errors.nombre}</span>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-[#5f4c41]">Teléfono</label>
                    <input
                      type="tel"
                      name="Teléfono"
                      className="mt-2 w-full rounded-[0.9rem] border border-[#2f241d]/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d46f49]/45 focus:ring-2 focus:ring-[#d46f49]/15"
                      placeholder="Ingresa un teléfono"
                      value={capturarTelefono}
                      onChange={(e) => setCapturarTelefono(e.target.value)}
                    />
                    {errors.telefono && <span className="mt-1 block text-xs text-[#d9623f]">{errors.telefono}</span>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#5f4c41]">Email</label>
                    <input
                      type="email"
                      name="Email"
                      className="mt-2 w-full rounded-[0.9rem] border border-[#2f241d]/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d46f49]/45 focus:ring-2 focus:ring-[#d46f49]/15"
                      placeholder="Ingresa tu email"
                      value={capturarEmail}
                      onChange={(e) => setCapturarEmail(e.target.value)}
                    />
                    {errors.email && <span className="mt-1 block text-xs text-[#d9623f]">{errors.email}</span>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#5f4c41]">Quiero colaborar</label>
                  <textarea
                    rows="6"
                    name="Mensaje"
                    className="mt-2 w-full resize-none rounded-[1rem] border border-[#2f241d]/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d46f49]/45 focus:ring-2 focus:ring-[#d46f49]/15"
                    placeholder="Indica de qué manera te gustaría colaborar"
                    value={capturarMensaje}
                    onChange={(e) => setCapturarMensaje(e.target.value)}
                  />
                  {errors.mensaje && <span className="mt-1 block text-xs text-[#d9623f]">{errors.mensaje}</span>}
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-full bg-[#241914] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3a2b23] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar"}
                </button>
              </form>

              {result && (
                <p
                  className={`mt-4 text-sm font-medium ${
                    result.includes("correctamente") ? "text-[#547a5a]" : "text-[#d9623f]"
                  }`}
                >
                  {result}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactScreen;
