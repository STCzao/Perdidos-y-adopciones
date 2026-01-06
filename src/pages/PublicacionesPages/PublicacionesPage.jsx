import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import CardGenerica from "../../components/CardGenerica/CardGenerica";
import CardFiltro from "../../components/CardFiltro/CardFiltro";
import { useEffect, useState } from "react";
import { publicacionesService } from "../../services/publicaciones";
import { CrearPublicacion } from "../../components/CrearPublicacion/CrearPublicacion";
import { useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

const PublicacionesPage = () => {
  const { tipo } = useParams();

  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    perdidos: "Animales perdidos",
    adopciones: "Animales en adopción",
    encontrados: "Animales encontrados",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res = await publicacionesService.getPublicaciones(page, 12);

      const lista = res?.data || res?.publicaciones || [];

      const filtradas = lista.filter(
        (p) => p.tipo?.toUpperCase() === mapTipos[tipo]
      );

      setPublicaciones(filtradas);
      setTotalPages(res?.totalPages || 1);

      setLoading(false);
    };

    fetchData();
  }, [page, tipo]);

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

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                [...publicacionesFiltradas]
                  .sort(
                    (a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0)
                  )
                  .map((pub) => (
                    <CardGenerica key={pub._id} publicacion={pub} />
                  ))
              ) : (
                <div className="col-span-full text-black text-2xl font-medium mt-10 text-center">
                  No se encontraron resultados
                </div>
              )}
            </div>
          </div>
          <ReactPaginate
            previousLabel={"Anterior"}
            nextLabel={"Siguiente"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            forcePage={page - 1}
            containerClassName="flex justify-center gap-3 py-6"
            pageClassName="border rounded px-3 py-1 bg-white"
            previousClassName="border rounded px-3 py-1 bg-white"
            nextClassName="border rounded px-3 py-1 bg-white"
            activeClassName="bg-[#FF7857] text-black"
            disabledClassName="opacity-40 pointer-events-none"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicacionesPage;
