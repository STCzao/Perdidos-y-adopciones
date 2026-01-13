"use client";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import CardGenerica from "../../components/CardGenerica/CardGenerica";
import { publicacionesService } from "../../services/publicaciones";
import { useEffect, useState } from "react";
import Img_home from "../../assets/Img_home.png";
import Img_colab from "../../assets/Img_colab.png";
import { div } from "framer-motion/client";

const HomeScreen = () => {
  const [perdidos, setPerdidos] = useState([]);
  const [encontrados, setEncontrados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicaciones = async () => {
      const [perdidosResp, encontradosResp] = await Promise.all([
        publicacionesService.getPublicaciones({
          tipo: "PERDIDO",
          limit: 4,
          page: 1,
        }),
        publicacionesService.getPublicaciones({
          tipo: "ENCONTRADO",
          limit: 4,
          page: 1,
        }),
      ]);

      if (perdidosResp?.publicaciones) {
        setPerdidos(perdidosResp.publicaciones);
      }

      if (encontradosResp?.publicaciones) {
        setEncontrados(encontradosResp.publicaciones);
      }
    };

    fetchPublicaciones();
  }, []);

  return (
    <div>
      <Navbar />
      <div
        className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-10"
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
            className="border italic border-white/20 gap-10 text-center font-medium mt-15 flex flex-col p-4 sm:p-5 w-full sm:w-11/12 md:w-full text-base sm:text-lg md:text-xl rounded-lg bg-white/20 mb-8 text-center"
          >
            “Amar y ser amable con los animales nos acerca a nuestra verdadera
            naturaleza humana.”
            <span className="text-sm">Dalai Lama</span>
          </motion.p>
        </div>
        <div className="flex flex-col justify-center items-center text-center text-white/90 max-w-4xl mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Desde acá podés elegir qué tipo de consulta o aviso querés hacer:
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
              navigate("/perdidos-informacion");
              window.scrollTo(0, 0);
            }}
          >
            Perdidos
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity col-span-1"
            onClick={() => {
              navigate("/encontrados-informacion");
              window.scrollTo(0, 0);
            }}
          >
            Encontrados
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity col-span-1"
            onClick={() => {
              navigate("/adopciones-informacion");
              window.scrollTo(0, 0);
            }}
          >
            Adopciones
          </motion.button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-15 font-medium py-20 bg-[#e6dac6]">
        <h2 className="text-3xl text-black border border-white mt-10 bg-white/60 rounded-full py-2 px-3">
          Animales perdidos
        </h2>

        {perdidos.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 flex items-center 2xl:grid-cols-4 px-4 w-full mx-auto">
              {perdidos.map((pub) => (
                <CardGenerica key={pub._id} publicacion={pub} />
              ))}
            </div>

            <button
              onClick={() => {
                navigate("/publicaciones/perdidos");
                window.scrollTo(0, 0);
              }}
              className="mt-10 text-black border border-black cursor-pointer font-medium w-50 h-11 rounded-full bg-white/70 hover:bg-[#FF7857] transition-opacity"
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
        <h2 className="text-3xl text-black border border-white mb-8 bg-white/60 rounded-full py-2 px-3">
          Animales encontrados
        </h2>

        {encontrados.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 flex items-center 2xl:grid-cols-4 px-4 w-full mx-auto">
              {encontrados.map((pub) => (
                <CardGenerica key={pub._id} publicacion={pub} />
              ))}
            </div>
            <button
              onClick={() => {
                navigate("/publicaciones/encontrados");
                window.scrollTo(0, 0);
              }}
              className="mt-10 text-black border border-black cursor-pointer font-medium w-50 h-11 rounded-full bg-white/70 hover:bg-[#FF7857] transition-opacity"
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
      <div
        className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-between px-4 md:px-10 py-40 md:flex-row "
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${Img_colab})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
            className="border border-white/20 cursor-pointer font-medium w-52 h-11 rounded-full text-white bg-white/60 hover:bg-[#FF7857] transition-opacity"
          >
            Quiero ser colaborador
          </motion.button>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border border-white/20 font-medium rounded-lg mt-5 bg-white/20 p-4 sm:p-5 text-base sm:text-lg md:text-xl text-left max-w-lg md:max-w-2xl leading-relaxed md:ml-8"
        >
          Sumarse a esta iniciativa puede tomar muchas formas. Podés colaborar
          ofreciendo tránsito provisorio, ayudando con traslados, aportando para
          tratamientos veterinarios, o medicamentos e insumos, o simplemente
          difundiendo publicaciones y avisando cuando haya cambios para mantener
          la información actualizada en la base de datos. Al completar el
          formulario, vas a poder contarnos de qué manera te gustaría colaborar,
          según tu tiempo y tus posibilidades.
        </motion.p>
      </div>
      <Footer />
    </div>
  );
};

export default HomeScreen;
