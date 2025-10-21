"use client";
import {
  SidebarProvider,
  SidebarOpciones,
} from "../../components/SidebarOpciones/SidebarOpciones";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const HomeScreen = ({ cerrarSesion }) => {

  const navigate = useNavigate();

  return (
    <div>
      <SidebarProvider>
        <Navbar cerrarSesion={cerrarSesion} />
        <SidebarOpciones />
      </SidebarProvider>
      <div className="w-full min-h-screen bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(../src/assets/Img_home.png)] bg-cover bg-center text-white flex flex-col items-center justify-center px-4 md:px-10">
        <div className="flex flex-col justify-center items-center text-white/90 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/20 font-medium mt-10 flex flex-col justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full text-base sm:text-lg md:text-xl rounded-lg bg-white/20 mb-8 text-center"
          >
            Miles de perritos caminan sin rumbo o abandonados. En Perdidos y
            Adopciones buscamos devolverles lo que más necesitan: un hogar lleno
            de amor.
          </motion.p>
        </div>
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {/* Primera fila - 3 botones */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity col-span-1"
            onClick={() => navigate("/perdidos")}
          >
            Perdí una mascota
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity col-span-1"
            onClick={() => navigate("/encontrados")}
          >
            Encontré una mascota
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity col-span-1"
            onClick={() => navigate("/adopciones")}
          >
            Me gustaría adoptar
          </motion.button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeScreen;
