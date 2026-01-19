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
import { useRequireAuth } from "../../hooks/useRequireAuth";

const PublicacionesPage = () => {
  const { tipo } = useParams();
  const withAuth = useRequireAuth();

  const [publicaciones, setPublicaciones] = useState([]);
  const [publicacionesTodas, setPublicacionesTodas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTotal, setLoadingTotal] = useState(false);
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

      const res = await publicacionesService.getPublicaciones({
        page,
        limit: 12,
        tipo: mapTipos[tipo],
      });

      setPublicaciones(res?.publicaciones || []);
      setTotalPages(res?.totalPages || 1);

      setLoading(false);
    };

    fetchData();
  }, [page, tipo]);

  useEffect(() => {
    setPage(1);
  }, [tipo]);

  useEffect(() => {
    const fetchAllPublicaciones = async () => {
      setLoadingTotal(true);
      try {
        const firstRes = await publicacionesService.getPublicaciones({
          page: 1,
          limit: 100,
          tipo: mapTipos[tipo],
        });

        const primeras = firstRes?.publicaciones || [];
        const totalPagesAll = firstRes?.totalPages || 1;

        if (totalPagesAll <= 1) {
          setPublicacionesTodas(primeras);
          return;
        }

        const requests = [];
        for (let p = 2; p <= totalPagesAll; p++) {
          requests.push(
            publicacionesService.getPublicaciones({
              page: p,
              limit: 100,
              tipo: mapTipos[tipo],
            })
          );
        }

        const results = await Promise.all(requests);
        const resto = results.flatMap((res) => res?.publicaciones || []);
        setPublicacionesTodas([...primeras, ...resto]);
      } finally {
        setLoadingTotal(false);
      }
    };

    fetchAllPublicaciones();
  }, [tipo]);

  const filtrarPublicaciones = (lista) => {
    return lista.filter((pub) => {
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
  };

  const publicacionesFiltradasPagina = filtrarPublicaciones(publicaciones);
  const publicacionesFiltradasTotales = filtrarPublicaciones(publicacionesTodas);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#e6dac6] pt-35 px-4">
          <h2 className="text-3xl text-black text-center mb-10 font-bold tracking-[0.05em]">
            {titulos[tipo]}
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* FILTROS */}
            <div className="w-full lg:w-72 flex flex-col items-center lg:mb-0">
              <CardFiltro filtros={filtros} setFiltros={setFiltros} />

              <p className="text-black font-medium text-sm mt-2">
                Número de coincidencias: {" "}
                {loadingTotal
                  ? "Calculando..."
                  : publicacionesFiltradasTotales.length}
              </p>

                      <motion.button
                        onClick={() => withAuth(() => CrearPublicacion.openModal())}
                        className="mt-3 text-black border border-[#FF7857]/40 cursor-pointer font-medium w-50 h-11 rounded-full bg-white/90 shadow-sm hover:bg-[#FF7857] hover:text-black transition-colors delay-100 duration-300"
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
              ) : publicacionesFiltradasPagina.length > 0 ? (
                [...publicacionesFiltradasPagina]
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
            containerClassName="flex justify-center gap-3 py-6 cursor-pointer"
                    pageClassName="border border-[#FF7857]/30 rounded-full px-3 py-1 bg-white/90 text-black text-sm shadow-sm hover:bg-[#FF7857]/10 transition-colors delay-100 duration-300"
                    previousClassName="border border-[#FF7857]/30 rounded-full px-3 py-1 bg-white/90 text-black text-sm shadow-sm hover:bg-[#FF7857]/10 transition-colors delay-100 duration-300"
                    nextClassName="border border-[#FF7857]/30 rounded-full px-3 py-1 bg-white/90 text-black text-sm shadow-sm hover:bg-[#FF7857]/10 transition-colors delay-100 duration-300"
                    activeClassName="bg-[#FF7857] text-black border-[#FF7857]"
            disabledClassName="opacity-40 pointer-events-none"
          />
          </div>
      <Footer />
    </div>
  );
};

export default PublicacionesPage;
