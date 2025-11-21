import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import { comunidadService } from "../../services/comunidad";
import CardsAyuda from "../../components/CardsAyuda/CardsAyuda";
import Img_Casos from "../../assets/Img_Casos.jpg";

const ComunidadScreen = () => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const resp = await comunidadService.obtenerComunidad();

      if (resp?.success && Array.isArray(resp.comunidades)) {
        setCasos(resp.comunidades);
      }

      setLoading(false);
    };

    cargar();
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <div
        className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-start px-4 md:px-10 py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${Img_Casos})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col w-full max-w-5xl text-center text-white/90 mt-20">
          <motion.p className="text-3xl mb-6">Comunidad</motion.p>

          <motion.p className="text-lg mb-12">
            Aqui podras encontrar historias, consejos y experiencias compartidas
            por nuestra comunidad.
          </motion.p>
        </div>
        <motion.div
          className="
            w-full 
            max-w-5xl 
            grid 
            gap-8 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            place-items-center
          "
        >
          {loading ? (
            <div className="flex justify-center items-center col-span-full p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]"></div>
            </div>
          ) : casos.length > 0 ? (
            casos.map((pub) => <CardsAyuda key={pub._id} pub={pub} />)
          ) : (
            <p className="text-white text-center text-2xl col-span-full mt-10">
              No hay casos disponibles
            </p>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ComunidadScreen;
