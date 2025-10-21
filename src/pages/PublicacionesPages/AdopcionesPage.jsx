import {
  SidebarProvider,
  SidebarOpciones,
} from "../../components/SidebarOpciones/SidebarOpciones";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import CardGenerica from "../../components/CardGenerica/CardGenerica";
import { useEffect, useState } from "react";
import { publicacionesService } from "../../services/publicaciones";

const AdopcionesPage = (cerrarSesion) => {
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
      <div>
        <SidebarProvider>
          <Navbar cerrarSesion={cerrarSesion} />
          <SidebarOpciones />
        </SidebarProvider>
      </div>
      <div className="w-full min-h-screen bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(../src/assets/Img_publicaciones.jpeg)] bg-cover bg-center text-white flex flex-col items-center justify-center px-4 md:px-10">
        <div className="flex flex-col justify-center items-center text-white/90 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/20 font-medium mt-10 flex flex-col justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full text-base sm:text-lg md:text-xl rounded-lg bg-white/20 mb-8 text-center"
          >
            Aquí podrás consultar sobre todas las mascotas que se encuentran en
            ADOPCIÓN. Recuerda utilizar los filtros o el buscador para mayor
            precisión.
          </motion.p>
        </div>
      </div>

      <div className="min-h-screen bg-[#e6dac6]">
        <div className="flex flex-col p-2 sm:p-4 md:p-6 lg:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-center">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]"></div>
            </div>
          ) : (
            publicaciones.map((pub) => (
              <CardGenerica key={pub._id} publicacion={pub} />
            ))
          )}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default AdopcionesPage;
