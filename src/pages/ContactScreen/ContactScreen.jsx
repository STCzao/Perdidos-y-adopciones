import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useState } from "react";

const ContactScreen = () => {
  const [result, setResult] = useState("");
  const [capturarNombre, setCapturarNombre] = useState("");
  const [capturarTelefono, setCapturarTelefono] = useState("");
  const [capturarEmail, setCapturarEmail] = useState("");
  const [capturarMensaje, setCapturarMensaje] = useState("");

  const [errors, setErrors] = useState({});

  const onSubmit = async (event) => {
    event.preventDefault();

    let newErrors = {};
    let isValid = true;

    if (capturarNombre.trim() === "") {
      newErrors.nombre = "El nombre es obligatorio.";
      isValid = false;
    } else if (form.nombre.trim().length <= 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
      isValid = false;
    } else if (form.nombre.trim().length >= 40) {
      newErrors.nombre = "El nombre no puede tener más de 40 caracteres";
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios";
      isValid = false;
    }

    if (capturarTelefono.trim() === "") {
      newErrors.telefono = "El teléfono es obligatorio.";
      isValid = false;
    } else if (!/^\d{10,15}$/.test(capturarTelefono)) {
      newErrors.telefono = "Ingrese un número de teléfono válido.";
      isValid = false;
    }

    if (capturarEmail.trim() === "") {
      newErrors.email = "El email es obligatorio.";
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(capturarEmail)
    ) {
      newErrors.email = "Ingrese un email válido.";
      isValid = false;
    }

    if (capturarMensaje.trim() === "") {
      newErrors.mensaje = "El mensaje es obligatorio.";
      isValid = false;
    } else if (capturarMensaje.trim().length <= 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres";
      isValid = false;
    } else if (capturarMensaje.trim().length >= 200) {
      newErrors.mensaje = "El mensaje tiene un límite de 200 caracteres";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setResult("Por favor, completá todos los campos.");
      return;
    }

    setResult("Sending....");
    const formData = new FormData(event.target);

    const WEB3 = import.meta.env.VITE_ACCESS_KEY;
    formData.append("access_key", WEB3);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("¡Formulario enviado correctamente!");
      event.target.reset();
      setCapturarNombre("");
      setCapturarTelefono("");
      setCapturarEmail("");
      setCapturarMensaje("");
      setErrors({});
    } else {
      console.log("Error", data);
      setResult(
        "Ocurrió un errror al enviar el formulario. Por favor, intenta de nuevo."
      );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-full font-medium min-h-screen bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(../src/assets/Img_contact.jpg)] bg-cover bg-center text-white flex flex-col items-center justify-center px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0.0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex flex-col text-center gap-4 mt-30"
        >
          <span className="text-3xl">
            ¿Ocurrió algo? Comunícanos tus inquietudes
          </span>
          <span className="text-sm">
            Si querés sumarte a esta iniciativa, acá podés contarnos de qué
            manera te gustaría colaborar. Hay distintas formas de ayudar, según
            tu tiempo y tus posibilidades.
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0.0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center mt-10 mb-15 justify-center w-full px-4 sm:px-6 md:px-10"
        >
          <form
            onSubmit={onSubmit}
            className="flex flex-col items-center text-sm text-slate-800 w-full max-w-xl"
          >
            <div className="w-full px-4">
              <div className="mt-4">
                <label className="font-medium text-white ml-4">Nombre</label>
                <div className="flex items-center mt-2 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-white transition-all overflow-hidden">
                  <input
                    type="text"
                    name="Nombre"
                    className="h-full text-white px-2 w-full outline-none bg-transparent autofill:bg-transparent"
                    placeholder="Ingrese su nombre completo"
                    value={capturarNombre}
                    onChange={(e) => setCapturarNombre(e.target.value)}
                  />
                </div>
                {errors.nombre && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.nombre}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <label className="font-medium text-white ml-4">Teléfono</label>
                <div className="flex items-center mt-2 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-white transition-all overflow-hidden">
                  <input
                    type="tel"
                    name="Teléfono"
                    className="h-full text-white px-2 w-full outline-none bg-transparent autofill:bg-transparent"
                    placeholder="Ingrese un teléfono"
                    value={capturarTelefono}
                    onChange={(e) => setCapturarTelefono(e.target.value)}
                  />
                </div>
                {errors.telefono && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.telefono}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <label className="font-medium text-white ml-4">Email</label>
                <div className="flex items-center mt-2 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-white transition-all overflow-hidden">
                  <input
                    type="mail"
                    name="Email"
                    className="h-full text-white px-2 w-full outline-none bg-transparent autofill:bg-transparent"
                    placeholder="Ingrese su email"
                    value={capturarEmail}
                    onChange={(e) => setCapturarEmail(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <label className="font-medium text-white ml-4">Quiero colaborar</label>
                <textarea
                  rows="6"
                  name="Mensaje"
                  className="text-white w-full mt-2 p-2 bg-transparent border border-slate-300 rounded-lg resize-none outline-none focus:ring-2 focus-within:ring-white transition-all"
                  placeholder="Indique de qué manera quiere colaborar"
                  value={capturarMensaje}
                  onChange={(e) => setCapturarMensaje(e.target.value)}
                ></textarea>
                {errors.mensaje && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.mensaje}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="bg-white/80 flex items-center justify-center text-black gap-1 mt-10 border hover:border-slate-400/70 text-black/80 py-2 px-6 w-full rounded-full"
              >
                Enviar
              </button>
            </div>
          </form>

          {result && (
            <span
              className={`text-sm mt-4 block text-center ${
                result.includes("correctamente")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {result}
            </span>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactScreen;
