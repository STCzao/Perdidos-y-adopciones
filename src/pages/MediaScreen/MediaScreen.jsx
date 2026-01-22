import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CrearPublicacion } from "../../components/CrearPublicacion/CrearPublicacion";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { mediaScreenConfig } from "./mediaScreenConfig";

const MediaScreen = ({ type = "adopciones" }) => {
  const navigate = useNavigate();
  const withAuth = useRequireAuth();

  const config = mediaScreenConfig[type];

  if (!config) {
    return <div>Tipo no válido</div>;
  }

  const handleAction = (action) => {
    if (action.type === "navigate") {
      navigate(action.path);
      window.scrollTo(0, 0);
    } else if (action.type === "createPost") {
      withAuth(() => CrearPublicacion.openModal());
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="w-full font-medium min-h-screen text-white px-4 md:px-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${import.meta.env.VITE_MEDIA_IMG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-center pt-40 lg:pt-60">
          <motion.p
            className="text-3xl text-center"
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              ease: "easeInOut",
            }}
          >
            {config.title}
          </motion.p>
          <p className="text-red-600 text-center sm:text-6xl text-5xl font-semibold">
            {config.tipo}
          </p>
          <motion.div
            className="mt-20 w-full flex flex-col justify-center items-center gap-5 px-4 mb-15"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
          >
            {config.cards.map((card) => (
              card.id === "advice" ? (
                <button
                  onClick={() => handleAction(card.action)}
                  className="text-red-600 font-medium hover:underline transition-all duration-300"
                >
                  {card.buttonText}
                </button>
              ) : (
                <button
                  onClick={() => handleAction(card.action)}
                  className={`text-white border border-white/40 font-medium w-50 h-11 rounded-full bg-white/60 hover:bg-[#FF7857] transition-colors delay-100 duration-300 ${
                    card.id === "view" ? "items-end" : ""
                  }`}
                >
                  {card.buttonText}
                </button>
              )
            ))}
          </motion.div>
          <motion.div
            className="w-full flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-center items-center gap-10 px-4 mb-15"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
          >
            <div className="rounded-lg p-6 w-full italic text-left mb-15">
              Esta página solicita únicamente tu nombre y un número de contacto
              telefónico, los cuales se incorporan al perfil y a las
              publicaciones con el solo fin de poder contactarte para informarte
              sobre animales perdidos, encontrados o en adopción, y para todas
              las acciones vinculadas al objeto de este sitio.
              <br />
              Al enviar una publicación, declarás y aceptás que: Los datos
              personales ingresados son propios, reales y veraces, y que los
              brindás de manera voluntaria y consciente, sin existir
              impedimentos legales o de capacidad para hacerlo.
              <br />
              Autorizás expresamente el tratamiento de dichos datos con la única
              finalidad de colaborar en la búsqueda, denuncia, difusión o
              adopción responsable de animales domésticos, conforme al objeto de
              esta página. Tenés conocimiento de que los datos serán tratados de
              forma confidencial, no serán divulgados ni utilizados para fines
              distintos a los aquí indicados, y que su acceso se encuentra
              limitado al administrador del sitio, sin perjuicio de los riesgos
              propios de cualquier entorno digital.
              <br />
              Declarás conocer que podés solicitar en cualquier momento la
              actualización o eliminación de tus datos personales, de acuerdo
              con la normativa vigente en materia de protección de datos
              personales (Ley Nº 25.326).
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MediaScreen;
