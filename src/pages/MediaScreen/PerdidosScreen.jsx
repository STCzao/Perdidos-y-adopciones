import Navbar from "../../components/Navbar/Navbar";
import Img_publicaciones from "../../assets/Img_publicaciones.jpeg";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CrearPublicacion } from "../../components/CrearPublicacion/CrearPublicacion";

const PerdidosScreen = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div
        className="w-full font-medium min-h-screen text-white px-4 md:px-10"
        style={{
          backgroundImage: `url(${Img_publicaciones})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-center gap-10 pt-60 ">
          <motion.p
            className="text-3xl"
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              ease: "easeInOut",
            }}
          >
            ¡Bienvenido a la sección de animales PERDIDOS!
          </motion.p>
          <motion.div
            className="flex items-center justify-center w-full gap-5"
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
            <div className="bg-white/20 rounded-lg p-10 w-100 h-70 border border-white/20 text-center">
              <p>
                Este apartado fue creado para quienes deseen visualizar todos
                los animales PERDIDOS de la comunidad.
              </p>
              <button
                onClick={() => {
                  navigate("/encontrados");
                  window.scrollTo(0, 0);
                }}
                className="mt-10 items-end text-white border border-white/40 w-50 h-11 rounded-full bg-white/60 hover:bg-[#FF7857] transition-opacity"
              >
                Ver todos los anuncios
              </button>
            </div>
            <div className="bg-white/20 rounded-lg p-10 w-100 h-70 border border-white/20 text-center">
              <p>
                Aquí podrás crear los anuncios de los animales que perdiste y
                poder obtener una ayuda de la comunidad.
              </p>
              <button
                onClick={() => CrearPublicacion.openModal()}
                className="mt-10 text-white border border-white/40 font-medium w-50 h-11 rounded-full bg-white/60 hover:bg-[#FF7857] transition-opacity"
              >
                Crear publicación
              </button>
            </div>
            <div className="bg-white/20 rounded-lg p-10 w-100 h-70 border border-white/20 text-center">
              <p>
                En esta sección podrás consultar información útil sobre qué
                hacer en caso de perder un animal.
              </p>
              <button
                onClick={() => navigate("/consejos-perdi")}
                className="mt-10 text-white border border-white/40 font-medium w-50 h-11 rounded-full bg-white/60 hover:bg-[#FF7857] transition-opacity"
              >
                ¿Qué hacer?
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PerdidosScreen;
