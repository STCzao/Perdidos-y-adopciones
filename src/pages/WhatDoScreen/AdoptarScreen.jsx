import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Img_quehacer from "../../assets/Img_quehacer.png";

const AdoptarScreen = () => {
  return (
    <div>
      <Navbar />
      <div
        className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${Img_quehacer})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col justify-center items-center text-white/90 max-w-4xl mt-35 mb-15">
          <motion.p className="text-3xl mb-10 text-center">
            ¿Qué hacer si quiero adoptar o dar en adopción un animal?
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">1-</span>
            <span className="text-xl">
              ¿Qué hacer si quiero dar en adopción un animal?
            </span>
            <span>
              Antes de decidir:
              <br />
              <ul>
                <li>
                  • Asegurate de que la persona adoptante cuente con un espacio
                  adecuado (casa cerrada o condiciones seguras).
                </li>
                <li>
                  • Verificá que pueda cubrir sus necesidades básicas:
                  alimentación, higiene, atención veterinaria y tiempo.
                </li>
                <li>
                  • Conversá sobre la rutina del hogar, convivencia con otros
                  animales y compromiso a largo plazo.
                </li>
              </ul>
            </span>
            <span>
              Es importante consultar:
              <br />
              <ul>
                <li>
                  • Ser claro y honesto sobre el estado de salud y el carácter
                  del animal.
                </li>
                <li>• Priorizar hogares responsables por sobre la rapidez.</li>
                <li>
                  • Entender que dar en adopción no es “entregar”, sino buscar
                  el mejor hogar posible.
                </li>
              </ul>
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm mt-5 border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">2-</span>
            <span className="text-xl">
              ¿Qué hacer si quiero adoptar un animal?
            </span>
            <span>
              Antes de decidir:
              <br />
              <ul>
                <li>
                  •	Evaluá si tu espacio, tu tiempo y tu situación actual son adecuados.
                </li>
                <li>
                  •	Tené en cuenta los costos y cuidados que implica.
                </li>
                <li>
                  •	Preguntá todo lo necesario antes de adoptar.
                </li>
              </ul>
            </span>
            <span>
              Es importante consultar:
              <br />
              <ul>
                <li>
                  •	Si el animal tiene alguna condición de salud.
                </li>
                <li>•	Si presenta conductas especiales o necesita cuidados particulares.</li>
                <li>
                  •	Cómo es su carácter y nivel de actividad.
                </li>
                <br />
                <li>Adoptar es sumar un integrante a la familia. Es un compromiso para toda la vida del animal. No es un impulso: es una decisión consciente que cambia dos vidas.</li>
              </ul>
            </span>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdoptarScreen;
