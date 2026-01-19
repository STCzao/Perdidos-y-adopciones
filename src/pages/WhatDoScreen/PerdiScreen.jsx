import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const PerdiScreen = () => {
  return (
    <div>
      <Navbar />
      <div>
        <div
          className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${import.meta.env.VITE_WHATDO_IMG_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col justify-center items-center text-white/90 max-w-4xl mt-35 mb-15">
            <motion.p className="text-3xl mb-10 text-center">
              ¿Qué hacer si perdí un animal?
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">1-</span>
              <span className="text-xl">Buscalo en la zona inmediata</span>
              <span>
                Recorré el lugar donde se perdió, llamándolo por su nombre.
                Preguntá a vecinos, comerciantes y personas que estén en la
                calle.
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm mt-5 border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">2-</span>
              <span className="text-xl">Revisá si alguien ya lo encontró</span>
              <span>
                Antes de publicar, mirá los avisos de ENCONTRADOS en esta página
                y en grupos barriales.
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">3-</span>
              <span className="text-xl">Publicá el aviso cuanto antes</span>
              <span>
                Creá una publicación como PERDIDO, con fotos claras y la zona
                exacta donde se perdió. Las primeras horas son clave.
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">4-</span>
              <span className="text-xl">Difundí de forma organizada</span>
              <span>
                Compartí la publicación en redes y grupos, siempre usando el
                mismo aviso para evitar confusiones.
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">5-</span>
              <span className="text-xl">Volvé a recorrer la zona</span>
              <span>
                Hacelo en distintos horarios. Muchos animales se esconden y
                aparecen después.
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">6-</span>
              <span className="text-xl">Pedí ayuda</span>
              <span>
                Contactá rescatistas, veterinarias cercanas o personas del
                barrio. Buscar en red siempre es más efectivo.
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">7-</span>
              <span className="text-xl">Mantené el aviso actualizado</span>
              <span>
                Agregá nuevos datos si hay avistamientos y marcá el aviso como
                RESUELTO cuando aparezca.
              </span>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PerdiScreen;
