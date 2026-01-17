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

const HomeScreen = () => {
  const [perdidos, setPerdidos] = useState([]);
  const [encontrados, setEncontrados] = useState([]);
  const [perdidosCount, setPerdidosCount] = useState(0);
  const [encontradosCount, setEncontradosCount] = useState(0);
  const [adopcionesCount, setAdopcionesCount] = useState(0);
  const navigate = useNavigate();

  const obtenerTotalPorTipo = async (tipo) => {
    const firstRes = await publicacionesService.getPublicaciones({
      page: 1,
      limit: 100,
      tipo,
    });

    const primeras = firstRes?.publicaciones || [];
    const totalPagesAll = firstRes?.totalPages || 1;

    if (totalPagesAll <= 1) {
      return primeras.length;
    }

    const requests = [];
    for (let p = 2; p <= totalPagesAll; p++) {
      requests.push(
        publicacionesService.getPublicaciones({
          page: p,
          limit: 100,
          tipo,
        })
      );
    }

    const results = await Promise.all(requests);
    const resto = results.flatMap((res) => res?.publicaciones || []);
    return primeras.length + resto.length;
  };

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
    const fetchContadores = async () => {
      try {
        const [totalPerdidos, totalEncontrados, totalAdopciones] =
          await Promise.all([
            obtenerTotalPorTipo("PERDIDO"),
            obtenerTotalPorTipo("ENCONTRADO"),
            obtenerTotalPorTipo("ADOPCION"),
          ]);

        setPerdidosCount((prev) =>
          typeof totalPerdidos === "number"
            ? Math.max(prev, totalPerdidos)
            : prev
        );
        setEncontradosCount((prev) =>
          typeof totalEncontrados === "number"
            ? Math.max(prev, totalEncontrados)
            : prev
        );
        setAdopcionesCount((prev) =>
          typeof totalAdopciones === "number"
            ? Math.max(prev, totalAdopciones)
            : prev
        );
      } catch (error) {
        // Si falla el conteo, simplemente dejamos los contadores en su valor actual
        console.error("Error obteniendo contadores de publicaciones", error);
      }
    };

    fetchContadores();
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
            className="border cursor-pointer border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-colors delay-100 duration-300 col-span-1"
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
            className="border cursor-pointer border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-colors delay-100 duration-300 col-span-1"
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
            className="border cursor-pointer border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-colors delay-100 duration-300 col-span-1"
            onClick={() => {
              navigate("/adopciones-informacion");
              window.scrollTo(0, 0);
            }}
          >
            Adopciones
          </motion.button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-10 font-medium py-20 bg-[#e6dac6]">
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <h1 className="text-3xl md:text-4xl text-blackrounded-full py-2 px-5 font-bold tracking-[0.05em]">
            Casos registrados hasta hoy
          </h1>
          <p className="text-sm md:text-base text-center max-w-xl mx-auto px-4 mt-2 text-black">
            Cada publicación es un acto de amor y esperanza. Gracias por ser
            parte.
          </p>
        </div>

        <motion.div
          className="w-full flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-center items-stretch gap-6 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            className="relative cursor-pointer bg-white rounded-2xl px-8 py-8 w-full sm:w-72 shadow-md hover:shadow-xl border border-white/60 text-center overflow-hidden group"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff]/10 via-transparent to-[#ff6f61]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-[#FF7857]">
                Casos de alerta
              </span>
              <h2 className="text-2xl font-medium text-black flex items-center gap-2">
                Perdidos
              </h2>
              <motion.p
                key={perdidosCount}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-extrabold mt-2 text-[#FF7857] drop-shadow-sm"
              >
                {perdidosCount}
              </motion.p>
              <p className="text-xs mt-1 text-black/70 max-w-[14rem]">
                Animales que aún están siendo buscados por su familia.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative cursor-pointer bg-white rounded-2xl px-8 py-8 w-full sm:w-72 shadow-md hover:shadow-xl border border-white/60 text-center overflow-hidden group"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF]/15 via-transparent to-[#FF7857]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-[#FF7857] font-semibold">
                Esperando hogar
              </span>
              <h2 className="text-2xl text-black flex items-center gap-2">
                Adopciones
              </h2>
              <motion.p
                key={adopcionesCount}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-extrabold mt-2 text-[#FF7857] drop-shadow-sm"
              >
                {adopcionesCount}
              </motion.p>
              <p className="text-xs mt-1 text-black/70 max-w-[14rem]">
                Publicaciones de animales que buscan una nueva familia.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative cursor-pointer bg-white rounded-2xl px-8 py-8 w-full sm:w-72 shadow-md hover:shadow-xl border border-white/60 text-center overflow-hidden group"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff]/12 via-transparent to-[#ff7857]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-[#FF7857] font-semibold">
                Buenas noticias
              </span>
              <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
                Encontrados
              </h2>
              <motion.p
                key={encontradosCount}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-extrabold mt-2 text-[#FF7857] drop-shadow-sm"
              >
                {encontradosCount}
              </motion.p>
              <p className="text-xs mt-1 text-black/70 max-w-[14rem]">
                Avisos de animales que fueron rescatados o encontrados.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-15 font-medium py-20 bg-[#e6dac6]">
        <h2 className="text-3xl text-black mt-10 font-bold tracking-[0.05em] ">
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
              className="mt-3 text-black border border-[#FF7857]/40 cursor-pointer font-medium w-50 h-11 rounded-full bg-white/90 shadow-sm hover:bg-[#FF7857] hover:text-black transition-colors delay-100 duration-300"
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
        <h2 className="text-3xl text-black mt-10 font-bold tracking-[0.05em] ">
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
              className="mt-3 text-black border border-[#FF7857]/40 cursor-pointer font-medium w-50 h-11 rounded-full bg-white/90 shadow-sm hover:bg-[#FF7857] hover:text-black transition-colors delay-100 duration-300"
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
            className="w-full sm:text-xl md:text-xl lg:text-3xl xl:text-5xl py-4 px-8 text-center border border-white/20 font-bold tracking-[0.05em] rounded-full text-white bg-white/20 flex items-center"
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
            className="border border-white/20 cursor-pointer font-medium w-52 h-11 rounded-full text-white bg-white/60 hover:bg-[#FF7857] transition-colors delay-100 duration-300"
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
