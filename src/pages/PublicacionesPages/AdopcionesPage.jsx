import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import CardGenerica from "../../components/CardGenerica/CardGenerica";
import { useEffect, useState } from "react";
import { publicacionesService } from "../../services/publicaciones";
import { CrearPublicacion } from "../../components/CrearPublicacion/CrearPublicacion";

const AdopcionesPage = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const data = await publicacionesService.getPublicaciones();
      if (data.success && Array.isArray(data.publicaciones)) {
        setPublicaciones(
          data.publicaciones.filter((p) => p.tipo?.toUpperCase() === "ADOPCION")
        );
      }
      setLoading(false);
    };
    cargar();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#e6dac6]">
        <div className="flex flex-col items-center gap-5 font-medium pt-30">
          <h2 className="text-3xl text-black border border-white mt-15 mb-10 bg-white/60 rounded-full py-2 px-4">
            Animales en adopción
          </h2>
          <motion.button
            onClick={() => CrearPublicacion.openModal()}
            className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity"
          >
            Crear publicación
          </motion.button>
          <div className="mb-15 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-10 px-4">
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
      </div>
      <Footer />
    </div>
  );
};

export default AdopcionesPage;
