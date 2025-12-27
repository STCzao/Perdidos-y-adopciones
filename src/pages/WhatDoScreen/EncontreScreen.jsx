import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Img_quehacer from "../../assets/Img_quehacer.png";

const EncontreScreen = () => {
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
            ¿Qué hacer si encontré un animal?
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">1-</span>
            <span className="text-xl">Publicá el aviso cuanto antes</span>
            <span>
              Este es uno de los pasos más importantes:
              <br />
              <ul>
                <li>• Sacale una o varias fotos claras.</li>
                <li>• Publicá el caso como ENCONTRADO en esta página.</li>
                <li>• Indicá bien la zona donde lo viste o lo levantaste.</li>
                <li>• Sumá cualquier detalle que ayude a identificarlo.</li>
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
            <span className="text-xl">Difundí la publicación</span>
            <span>
              Una vez publicado:
              <br />
              <ul>
                <li>
                  • Compartí el link en grupos barriales y redes sociales.
                </li>
                <li>
                  • Pedí que lo compartan, siempre usando la misma publicación.
                </li>
                <li>
                  • Cuanta más visibilidad tenga el caso, más chances hay de
                  resolverlo.
                </li>
              </ul>
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">3-</span>
            <span className="text-xl">
              Observá al animal antes de intentar atraparlo
            </span>
            <span>
              Antes de acercarte:
              <br />
              <ul>
                <li>• Mirá si está asustado, herido o tranquilo.</li>
                <li>• Observá si cruza calles sin mirar o busca personas.</li>
                <li>• Evaluá si podés acercarte sin riesgo.</li>
                <br />
                <li>
                  No todos los animales se dejan agarrar. Forzar la situación
                  puede empeorarla.
                </li>
              </ul>
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">4-</span>
            <span className="text-xl">Acercate con calma</span>
            <span>
              Si decidís intentar retenerlo:
              <br />
              <ul>
                <li>• Hablale suave y despacio.</li>
                <li>• Evitá movimientos bruscos.</li>
                <li>• Ofrecé agua o comida si tenés.</li>
                <li>• No lo mires fijo ni lo rodees.</li>
              </ul>
            </span>

            <span>
              Si se deja acercar:
              <br />
              <ul>
                <li>• Hablale suave y despacio.</li>
                <li>• Evitá movimientos bruscos.</li>
                <li>• Ofrecé agua o comida si tenés.</li>
                <li>• No lo mires fijo ni lo rodees.</li>
              </ul>
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">5-</span>
            <span className="text-xl">
              Resguardalo si te es posible, aunque sea de forma provisoria
            </span>
            <span>
              En Tucumán no hay lugares oficiales de resguardo, por eso el
              tránsito solidario es clave:
              <br />
              <ul>
                <li>
                  • Si podés, ofrecé tránsito provisorio (unas horas o días).
                </li>
                <li>
                  • No es adopción, es solo darle un lugar seguro mientras se
                  busca ayuda.
                </li>
                <li>
                  • Agua, algo de comida y un espacio tranquilo ya hacen una
                  gran diferencia.
                </li>
              </ul>
            </span>

            <span>
              Si no podés llevarlo a tu casa:
              <br />
              <ul>
                <li>• Intentá retenerlo momentáneamente.</li>
                <li>• Pedí ayuda a vecinos o personas cercanas.</li>
              </ul>
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-3xl">6-</span>
            <span className="text-xl">
              Pedí ayuda para tránsito o resguardo
            </span>
            <span>
              Si no podés sostener el tránsito:
              <br />
              <ul>
                <li>• Pedí ayuda en la misma publicación.</li>
                <li>• Contactá rescatistas independientes.</li>
                <li>
                  • Pedí colaboración a la comunidad para conseguir un tránsito.
                </li>
              </ul>
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
              Si no podés sostener el tránsito:
              <br />
              <ul>
                <li>
                  • Si cambia la zona donde se lo ve, actualizá la publicación.
                </li>
                <li>• Si aparece alguien que puede ayudar, avisalo.</li>
                <li>
                  • Cuando el caso se resuelva, marcá el aviso como RESUELTO.
                </li>
              </ul>
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm border mt-5 border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center"
          >
            <span className="text-xl">
              No hace falta hacerlo todo solo ni hacerlo perfecto. Cada gesto
              suma: publicar, difundir, resguardar un rato o pedir ayuda. Esta
              página existe para ordenar esa ayuda comunitaria y hacer que
              llegue más lejos.
            </span>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EncontreScreen;
