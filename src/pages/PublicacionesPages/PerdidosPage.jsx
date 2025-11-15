import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import CardGenerica from "../../components/CardGenerica/CardGenerica";
import { useEffect, useState } from "react";
import { publicacionesService } from "../../services/publicaciones";
import Img_publicaciones from "../../assets/Img_publicaciones.jpeg";

const PerdidosPage = ({ cerrarSesion }) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const data = await publicacionesService.getPublicaciones();
      if (data.success && Array.isArray(data.publicaciones)) {
        setPublicaciones(
          data.publicaciones.filter((p) => p.tipo?.toUpperCase() === "PERDIDO")
        );
      }
      setLoading(false);
    };
    cargar();
  }, []);

  return (
    <div>
      <Navbar />

      <div
        className="w-full font-medium min-h-screen text-white flex flex-col md:flex-row items-center justify-center px-4 md:px-16 py-40"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${Img_publicaciones})`,
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
            Aquí podrás consultar sobre todas las mascotas que se encuentran
            PERDIDAS. Recuerda utilizar los filtros o el buscador para mayor
            precisión.
          </motion.p>
        </div>
      </div>
      <div className="bg-[#e6dac6] flex flex-col items-center gap-5 font-medium">
        <h2 className="text-3xl text-black border border-white mt-15 mb-10 bg-white/60 rounded-full py-2 px-4">
          Animales perdidos
        </h2>
        <div className="mb-15 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 px-4">
          {loading ? (
            <div className="flex justify-center items-center col-span-full p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]"></div>
            </div>
          ) : publicaciones.length > 0 ? (
            publicaciones.map((pub) => (
              <CardGenerica key={pub._id} publicacion={pub} />
            ))
          ) : (
            <p className="text-black text-center text-2xl col-span-full mt-10">
              No hay publicaciones disponibles
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PerdidosPage;
