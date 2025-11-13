import { motion } from "framer-motion";
import {
  SidebarProvider,
  SidebarOpciones,
} from "../../components/SidebarOpciones/SidebarOpciones";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import { casosAyudaService } from "../../services/casosayuda";
import CardsAyuda from "../../components/CardsAyuda/CardsAyuda";
import Img_Casos from "../../assets/Img_Casos.jpg";

const CasosAyudaScreen = ({ cerrarSesion }) => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const data = await casosAyudaService.getCasosAyuda();
      console.log("Respuesta del backend:", data);
      if (data.ok && Array.isArray(data.casos)) {
        setCasos(data.casos);
      }
      setLoading(false);
    };
    cargar();
  }, []);

  return (
    <div>
      <SidebarProvider>
        <Navbar cerrarSesion={cerrarSesion} />
        <SidebarOpciones />
      </SidebarProvider>
      <div
        className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${Img_Casos})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col w-full justify-center items-center text-white/90 max-w-4xl mt-35 mb-15">
          <motion.p className="text-3xl mb-10">
            Casos de Ayuda Comunitaria
          </motion.p>
          <div>
            <motion.div className="flex flex-col gap-6 mt-10 w-full">
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CasosAyudaScreen;
