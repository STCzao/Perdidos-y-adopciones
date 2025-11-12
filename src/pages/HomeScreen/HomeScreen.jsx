"use client";
import {
  SidebarProvider,
  SidebarOpciones,
} from "../../components/SidebarOpciones/SidebarOpciones";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import CardGenerica from "../../components/CardGenerica/CardGenerica";
import { publicacionesService } from "../../services/publicaciones";
import { useEffect, useState } from "react";
import Img_home from "../../assets/Img_home.png";

const HomeScreen = ({ cerrarSesion }) => {
  const [perdidos, setPerdidos] = useState([]);
  const [encontrados, setEncontrados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicaciones = async () => {
      const data = await publicacionesService.getPublicaciones();
      if (data && data.publicaciones) {
        const publicaciones = data.publicaciones;

        //Filtramos y ordenamos por fecha descendente
        const perdidosFiltrados = publicaciones
          .filter((p) => p.tipo === "PERDIDO")
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 4);

        const encontradosFiltrados = publicaciones
          .filter((p) => p.tipo === "ENCONTRADO")
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 4);
        setPerdidos(perdidosFiltrados);
        setEncontrados(encontradosFiltrados);
      }
    };

    fetchPublicaciones();
  }, []);

  return (
    <div>
      <SidebarProvider>
        <Navbar cerrarSesion={cerrarSesion} />
        <SidebarOpciones />
      </SidebarProvider>
      <div
        className="w-full min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${Img_home})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
            onClick={() => {
              navigate("/perdidos");
              window.scrollTo(0, 0);
            }}
          >
            Ver animales perdidos
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity col-span-1"
            onClick={() => {
              navigate("/encontrados");
              window.scrollTo(0, 0);
            }}
          >
            Ver animales encontrados
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity col-span-1"
            onClick={() => {
              navigate("/adopciones");
              window.scrollTo(0, 0);
            }}
          >
            Ver animales en adopción
          </motion.button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-15 font-medium py-20 bg-[#e6dac6]">
        <h2 className="text-3xl text-black border border-white mt-10 bg-white/60 rounded-full py-2 px-3">
          Animales perdidos
        </h2>

        {perdidos.length > 0 ? (
          <>
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 px-4">
              {perdidos.map((pub) => (
                <CardGenerica key={pub._id} publicacion={pub} />
              ))}
            </div>

            <button
              onClick={() => {
                navigate("/perdidos");
                window.scrollTo(0, 0);
              }}
              className="mt-10 text-black border border-black font-medium w-50 h-11 rounded-full bg-white hover:bg-[#FF7857] transition-opacity"
            >
              Ver más publicaciones
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center mt-10">
            <p className="text-black text-2xl">
              No hay publicaciones recientes
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-15 font-medium py-20 bg-[#e6dac6]">
        <h2 className="text-3xl text-black border border-white mt-15 mb-8 bg-white/60 rounded-full py-2 px-3">
          Animales encontrados
        </h2>

        {encontrados.length > 0 ? (
          <>
            <div className=" grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 px-4">
              {encontrados.map((pub) => (
                <CardGenerica key={pub._id} publicacion={pub} />
              ))}
            </div>
            <button
              onClick={() => {
                navigate("/encontrados");
                window.scrollTo(0, 0);
              }}
              className="mt-10 text-black border border-black font-medium w-50 h-11 rounded-full bg-white hover:bg-[#FF7857] transition-opacity"
            >
              Ver más publicaciones
            </button>
          </>
        ) : (
          <div className="mb-15 flex flex-col items-center text-center mt-10">
            <p className="text-black text-2xl">
              No hay publicaciones recientes
            </p>
          </div>
        )}
      </div>
      <div className="w-full min-h-screen bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(../src/assets/Img_colab.png)] bg-cover bg-center text-white flex flex-col md:flex-row items-center justify-between px-4 md:px-16 py-40">
        <div className="mt-15 flex flex-col items-center gap-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full sm:text-xl md:text-xl lg:text-3xl xl:text-5xl py-4 px-8 text-center border border-white/20 font-medium rounded-full text-white bg-white/20 flex items-center"
          >
            Sumate a esta iniciativa
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => {
              navigate("/contacto");
              window.scrollTo(0, 0);
            }}
            className="border border-white/20 font-medium w-52 h-11 rounded-full text-white bg-white/60 hover:bg-[#FF7857] transition-opacity"
          >
            Quiero ser colaborador
          </motion.button>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border border-white/20 font-medium rounded-lg bg-white/20 p-4 sm:p-5 text-base sm:text-lg md:text-xl text-left max-w-lg md:max-w-2xl leading-relaxed md:ml-8"
        >
          Algunos cachorros nacieron sin un hogar y otros se perdieron en el
          camino, pero todos esperan lo mismo: volver a sentir amor. Dales la
          oportunidad de reencontrarse con una familia, de llenar tu vida de
          alegría y la suya de esperanza.
        </motion.p>
      </div>

      <Footer />
    </div>
  );
};

export default HomeScreen;
