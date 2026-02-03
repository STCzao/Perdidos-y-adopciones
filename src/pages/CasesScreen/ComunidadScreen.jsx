import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useComunidad } from "../../services/Hooks/useComunidad";
import { useFiltro } from "../../services/Hooks/useFiltro";
import CardsAyuda from "../../components/CardsAyuda/CardsAyuda";
import CasoAyudaFiltro from "../../components/CasoAyudaFiltro/CasoAyudaFiltro";

const ComunidadScreen = () => {
  const { casos, loading, error } = useComunidad();
  const { filtrados, query, setQuery } = useFiltro(casos);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div
        className="w-full font-medium min-h-screen text-white flex flex-col items-center justify-start px-4 md:px-10 py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${import.meta.env.VITE_CASOS_IMG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col w-full max-w-5xl text-center text-white/90 mt-20">
          <motion.p className="text-3xl mb-6">Historias & consejos</motion.p>

          <motion.p className="text-lg mb-12">
            Casos reales, tips para usar la base y claves para un cuidado responsable
          </motion.p>

          {/* Filtro completamente desacoplado */}
          <div className="mb-10">
            <CasoAyudaFiltro value={query} onChange={setQuery} />
          </div>
        </div>

        {/* Resultado */}
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
          {loading && (
            <div className="flex justify-center items-center col-span-full p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]"></div>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-center col-span-full">
              Ocurrio un error al cargar los casos.
            </p>
          )}

          {!loading && !error && filtrados.length === 0 && (
            <p className="text-white text-center text-2xl col-span-full mt-10">
              No hay casos disponibles
            </p>
          )}

          {!loading &&
            !error &&
            filtrados.length > 0 &&
            filtrados.map((pub) => <CardsAyuda key={pub._id} pub={pub} />)}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ComunidadScreen;
