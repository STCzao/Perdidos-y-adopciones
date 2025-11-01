import { motion } from "framer-motion";
import {
  SidebarProvider,
  SidebarOpciones,
} from "../../components/SidebarOpciones/SidebarOpciones";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const PerdiScreen = ({ cerrarSesion }) => {
  return (
    <div>
      <div>
        <SidebarProvider>
          <Navbar cerrarSesion={cerrarSesion} />
          <SidebarOpciones />
        </SidebarProvider>
        <div className="w-full font-medium min-h-screen bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(../src/assets/Img_quehacer.png)] bg-cover bg-center text-white flex flex-col items-center justify-center px-4 md:px-10">
          <div className="flex flex-col justify-center items-center text-white/90 max-w-4xl mt-35 mb-15">
            <motion.p className="text-3xl mb-10">
              ¿Qué hacer si perdí un animal?
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">1-</span>
              <span className="text-xl">Mantén la calma y actúa rápido</span>
              <span>
                Respira profundo y comienza la búsqueda de inmediato. Revisa los
                lugares donde suele estar: tu casa, patio, parque cercano o
                zonas donde acostumbra pasear. Pregunta a vecinos, comerciantes
                o personas que puedan haberlo visto.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm mt-5 border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">2-</span>
              <span className="text-xl">Publica su desaparición</span>

              <ul>
                <li>
                  -Sube una publicación con su foto y datos en esta página.
                </li>
                <li>
                  -Describe claramente su apariencia, nombre, y zona donde se
                  perdió.
                </li>
                <li>
                  -Incluye un número de contacto y asegúrate de revisar los
                  mensajes con frecuencia.
                </li>
                <li>
                  -Difunde también en redes sociales, grupos locales y
                  veterinarias.
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">3-</span>
              <span className="text-xl">Contacta lugares clave</span>
              <ul>
                <li>
                  -Llama o visita veterinarias, protectoras y refugios cercanos.
                </li>
                <li>
                  -Pregunta si alguien entregó un animal con las características
                  de tu mascota.
                </li>
                <li>
                  -En caso de tener chip, notifica al veterinario o a la base de
                  datos donde fue registrado.
                </li>
              </ul>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
            >
              <span className="text-3xl">4-</span>
              <span className="text-xl">No te rindas</span>
              <span>
                A veces los animales regresan después de varios días. Mantén tus
                publicaciones activas, repite los recorridos y sigue consultando
                en refugios. Cada acción cuenta para aumentar las posibilidades
                de reencuentro.
              </span>
            </motion.p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PerdiScreen;
