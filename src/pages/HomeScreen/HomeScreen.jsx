"use client";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const HomeScreen = ({ cerrarSesion, user }) => {
  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(../src/assets/Img_home.png)] bg-cover bg-center text-white flex items-center justify-center px-4 md:px-10">
        <div className="flex flex-col items-center text-white/90 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-medium mt-4 sm:mt-6 flex flex-col justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full text-base sm:text-lg md:text-xl rounded-lg bg-white/20 mb-8 text-center"
          >
            Miles de perritos caminan sin rumbo o abandonados. En Perdidos y
            Adopciones buscamos devolverles lo que más necesitan: un hogar lleno
            de amor.
          </motion.p>

          <div className="mt-10 mb-10 flex flex-col sm:flex-row items-center gap-8">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-medium w-40 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
            >
              Casos de éxito
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-medium w-40 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
            >
              Perros perdidos
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className=" font-medium w-40 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
            >
              Adopción
            </motion.button>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cerrarSesion}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-md"
            >
              Cerrar sesión
            </motion.button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeScreen;
