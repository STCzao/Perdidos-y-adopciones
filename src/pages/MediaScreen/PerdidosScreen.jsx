import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CrearPublicacion } from "../../components/CrearPublicacion/CrearPublicacion";
import { useRequireAuth } from "../../hooks/useRequireAuth";

const PerdidosScreen = () => {
  const navigate = useNavigate();
  const withAuth = useRequireAuth();
  return (
    <div>
      <Navbar />
      <div
        className="w-full font-medium min-h-screen text-white px-4 md:px-10"
        style={{
          backgroundImage: `url(${import.meta.env.VITE_MEDIA_IMG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-center gap-10 pt-40 lg:pt-60">
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
            Sección de animales PERDIDOS
          </motion.p>
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
            <div className="bg-white/20 rounded-lg p-10 w-80 border border-white/20 text-center">
              <p>
                Este apartado fue creado para quienes deseen visualizar todos
                los animales PERDIDOS de la comunidad.
              </p>
              <button
                onClick={() => {
                  navigate("/publicaciones/perdidos");
                  window.scrollTo(0, 0);
                }}
                className="mt-10 items-end text-white border border-white/40 w-50 h-11 rounded-full bg-white/60 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
              >
                Ver todos los anuncios
              </button>
            </div>
            <div className="bg-white/20 rounded-lg p-10 w-80 border border-white/20 text-center">
              <p>
                Aquí podrás crear los anuncios de los animales que perdiste y
                poder obtener una ayuda de la comunidad.
              </p>
              <button
                onClick={() => withAuth(() => CrearPublicacion.openModal())}
                className="mt-10 text-white border border-white/40 font-medium w-50 h-11 rounded-full bg-white/60 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
              >
                Crear publicación
              </button>
            </div>
            <div className="bg-white/20 rounded-lg p-10 w-80 border border-white/20 text-center">
              <p>
                En esta sección podrás consultar información útil sobre qué
                hacer en caso de que hayas perdido un animal.
              </p>
              <button
                onClick={() => {
                  navigate("/consejos-perdi");
                  window.scrollTo(0, 0);
                }}
                className="mt-10 text-white border border-white/40 font-medium w-50 h-11 rounded-full bg-white/60 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
              >
                ¿Qué hacer?
              </button>
            </div>
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
            <div className="bg-white/20 rounded-lg p-6 w-full border border-white/20 text-left mb-15">
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

export default PerdidosScreen;
