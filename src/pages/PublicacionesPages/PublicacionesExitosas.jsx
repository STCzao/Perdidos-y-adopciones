import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import CardGenerica from "../../components/CardGenerica/CardGenerica";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { publicacionesService } from "../../services/publicaciones";

const PublicacionesExitosas = () => {
  const location = useLocation();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hashProcessed, setHashProcessed] = useState(false);

  // Estados que representan casos exitosos
  const estadosExitosos = ["YA APARECIO", "APARECIO SU FAMILIA", "ADOPTADO"];

  useEffect(() => {
    const fetchPublicacionesExitosas = async () => {
      setLoading(true);
      try {
        // Traer publicaciones con cada estado de éxito
        const requests = estadosExitosos.map((estado) =>
          publicacionesService.getPublicaciones({
            page: 1,
            limit: 100,
            estado: estado,
          }),
        );

        const results = await Promise.all(requests);

        // Combinar todos los resultados
        const todasLasPublicaciones = results.flatMap(
          (res) => res?.publicaciones || [],
        );

        // Ordenar por fecha de creación (descendente - más recientes primero)
        const publicacionesOrdenadas = todasLasPublicaciones.sort(
          (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion), // fechaCreacion es Date, está bien
        );

        setPublicaciones(publicacionesOrdenadas);
      } catch (error) {
        console.error("Error al obtener publicaciones exitosas:", error);
        setPublicaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicacionesExitosas();
  }, []);

  useEffect(() => {
    const id = location.hash.slice(1); // Elimina el #
    if (
      id &&
      !loading &&
      !hashProcessed &&
      publicacionesFiltradasTotales.length > 0
    ) {
      // Busca en qué página está la tarjeta
      const tarjetaIndex = publicacionesFiltradasTotales.findIndex(
        (pub) => pub._id === id,
      );

      if (tarjetaIndex !== -1) {
        const tarjetaPagina = Math.floor(tarjetaIndex / 12) + 1;

        // Si está en otra página, navega a esa página
        if (tarjetaPagina !== page) {
          setPage(tarjetaPagina);
        } else {
          // Si ya está en la página actual, haz scroll
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 200);
        }
        setHashProcessed(true); // Marcar como procesado
      }
    }
  }, [location.hash, hashProcessed]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#e6dac6] pt-35 px-4">
        <div className="flex flex-col items-center gap-2 px-4 text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-blackrounded-full py-2 px-5 font-bold tracking-[0.05em]">
            Casos resueltos
          </h2>
          <p className="text-sm font-semibold md:text-base text-center max-w-xl mx-auto px-4 text-black">
            Estas no son solo historias de animales. Son historias de familias
            reunidas, de segundas oportunidades, y de la fé restaurada en la
            bondad.
          </p>
        </div>

        <div className="flex flex-col items-center w-full">
          {/* PUBLICACIONES */}
          <div className="w-full grid grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-15">
            {loading ? (
              <div className="flex justify-center items-center col-span-full p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]"></div>
              </div>
            ) : publicaciones.length > 0 ? (
              publicaciones.map((pub) => {
                try {
                  return (
                    <motion.div
                      key={pub._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-[36rem] flex justify-center"
                    >
                      <CardGenerica
                        publicacion={pub}
                        cardId={pub._id}
                        isSuccessful={true}
                      />
                    </motion.div>
                  );
                } catch (error) {
                  console.error("Error renderizando tarjeta:", pub._id, error);
                  return null;
                }
              })
            ) : (
              <div className="col-span-full text-black text-2xl font-medium mt-10 text-center">
                No hay casos exitosos aún
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicacionesExitosas;
