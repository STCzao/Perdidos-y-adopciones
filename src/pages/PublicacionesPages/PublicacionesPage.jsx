import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import CardGenerica from "../../components/CardGenerica/CardGenerica";
import CardFiltro from "../../components/CardFiltro/CardFiltro";
import { useEffect, useState } from "react";
import { publicacionesService } from "../../services/publicaciones";
import { CrearPublicacion } from "../../components/CrearPublicacion/CrearPublicacion";
import { useParams } from "react-router-dom";

const PublicacionesPage = () => {
  const { tipo } = useParams();

  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    raza: "",
    edad: "",
    sexo: "",
    tamaño: "",
    color: "",
    especie: "",
    detalles: "",
    lugar: "",
  });

  const mapTipos = {
    perdidos: "PERDIDO",
    adopciones: "ADOPCION",
    encontrados: "ENCONTRADO",
  };

  const titulos = {
    perdidos: "Animales Perdidos",
    adopciones: "Animales en Adopción",
    encontrados: "Animales Encontrados",
  };

  useEffect(() => {
    const cargar = async () => {
      const data = await publicacionesService.getPublicaciones();

      if (data.success && Array.isArray(data.publicaciones)) {
        setPublicaciones(
          data.publicaciones.filter(
            (p) =>
              p.tipo?.toUpperCase() === "PERDIDO" ||
              p.tipo?.toUpperCase() === "ADOPCION" ||
              p.tipo?.toUpperCase() === "ENCONTRADO"
          )
        );
      }

      setLoading(false);
    };

    cargar();
  }, []);

  const publicacionesTipo = publicaciones.filter(
    (p) => p.tipo?.toUpperCase() === mapTipos[tipo]
  );

  const publicacionesFiltradas = publicacionesTipo.filter((pub) => {
    return (
      (!filtros.raza ||
        pub.raza?.toLowerCase().includes(filtros.raza.toLowerCase())) &&
      (!filtros.edad || pub.edad === filtros.edad) &&
      (!filtros.sexo || pub.sexo === filtros.sexo) &&
      (!filtros.tamaño || pub.tamaño === filtros.tamaño) &&
      (!filtros.lugar ||
        pub.lugar?.toLowerCase().includes(filtros.lugar.toLowerCase())) &&
      (!filtros.color ||
        pub.color?.toLowerCase().includes(filtros.color.toLowerCase())) &&
      (!filtros.detalles ||
        pub.detalles?.toLowerCase().includes(filtros.detalles.toLowerCase()))
    );
  });

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#e6dac6] pt-35 px-4">
        <div className="flex flex-col items-center gap-5 font-medium">
          <h2 className="text-3xl text-black border border-white bg-white/60 rounded-full py-2 px-4">
            {titulos[tipo]}
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* FILTROS */}
            <div className="w-full lg:w-72 flex flex-col items-center lg:mb-0">
              <CardFiltro filtros={filtros} setFiltros={setFiltros} />

              <p className="text-black font-medium text-sm mt-2">
                Número de coincidencias: {publicacionesFiltradas.length}
              </p>

              <motion.button
                onClick={() => CrearPublicacion.openModal()}
                className="mt-3 text-black border border-black font-medium w-48 h-11 rounded-full bg-white hover:bg-[#FF7857] transition-opacity"
              >
                Crear publicación
              </motion.button>
            </div>

            {/* PUBLICACIONES */}
            <div className="flex-1 grid grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-15">
              {loading ? (
                <div className="flex justify-center items-center col-span-full p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7857]"></div>
                </div>
              ) : publicacionesFiltradas.length > 0 ? (
                publicacionesFiltradas.map((pub) => (
                  <CardGenerica key={pub._id} publicacion={pub} />
                ))
              ) : (
                <div className="col-span-full text-black text-2xl font-medium mt-10 text-center">
                  No se encontraron resultados
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicacionesPage;
