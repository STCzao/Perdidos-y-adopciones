import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import CardGenerica from "../../components/CardGenerica/CardGenerica";
import CardFiltro from "../../components/CardFiltro/CardFiltro";
import { useEffect, useState } from "react";
import { publicacionesService } from "../../services/publicaciones";
import { CrearPublicacion } from "../../components/CrearPublicacion/CrearPublicacion";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { compareFechas } from "../../utils/dateHelpers";

const PublicacionesPage = () => {
  const { tipo } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const withAuth = useRequireAuth();

  const [todasLasPublicaciones, setTodasLasPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hashProcessed, setHashProcessed] = useState(false);

  const ITEMS_PER_PAGE = 12;

  const [filtros, setFiltros] = useState({
    raza: "",
    edad: "",
    sexo: "",
    tamaño: "",
    color: "",
    especie: "",
    detalles: "",
    localidad: "",
    lugar: "",
  });

  const mapTipos = {
    perdidos: "PERDIDO",
    adopciones: "ADOPCION",
    encontrados: "ENCONTRADO",
  };

  // Estados que son casos exitosos y no deben aparecer en PublicacionesPage
  const estadosExcluidos = ["YA APARECIO", "APARECIO SU FAMILIA", "ADOPTADO"];

  const titulos = {
    perdidos: "Animales perdidos",
    adopciones: "Animales en adopción",
    encontrados: "Animales encontrados",
  };

  // Cargar TODAS las publicaciones sin filtrar estados exitosos desde el backend
  useEffect(() => {
    const fetchAllPublicaciones = async () => {
      setLoading(true);
      try {
        const firstRes = await publicacionesService.getPublicaciones({
          page: 1,
          limit: 100,
          tipo: mapTipos[tipo],
        });

        const primeras = firstRes?.publicaciones || [];
        const totalPagesAll = firstRes?.totalPages || 1;

        if (totalPagesAll <= 1) {
          // Filtrar estados exitosos
          const filtradas = primeras.filter(
            (pub) => !estadosExcluidos.includes(pub.estado),
          );
          setTodasLasPublicaciones(filtradas);
          setLoading(false);
          return;
        }

        // Cargar todas las páginas
        const requests = [];
        for (let p = 2; p <= totalPagesAll; p++) {
          requests.push(
            publicacionesService.getPublicaciones({
              page: p,
              limit: 100,
              tipo: mapTipos[tipo],
            }),
          );
        }

        const results = await Promise.all(requests);
        const resto = results.flatMap((res) => res?.publicaciones || []);

        // Combinar y filtrar estados exitosos
        const todas = [...primeras, ...resto];
        const filtradas = todas.filter(
          (pub) => !estadosExcluidos.includes(pub.estado),
        );

        setTodasLasPublicaciones(filtradas);
      } catch (error) {
        console.error("Error cargando publicaciones:", error);
        setTodasLasPublicaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPublicaciones();
  }, [tipo]);

  useEffect(() => {
    setPage(1);
    setHashProcessed(false); // Resetear bandera cuando cambia el tipo
  }, [tipo]);

  const filtrarPublicaciones = (lista) => {
    return lista.filter((pub) => {
      return (
        (!filtros.raza ||
          pub.raza?.toLowerCase().includes(filtros.raza.toLowerCase())) &&
        (!filtros.edad || pub.edad === filtros.edad) &&
        (!filtros.sexo || pub.sexo === filtros.sexo) &&
        (!filtros.especie || pub.especie === filtros.especie) &&
        (!filtros.tamaño || pub.tamaño === filtros.tamaño) &&
        (!filtros.localidad || pub.localidad === filtros.localidad) &&
        (!filtros.lugar ||
          pub.lugar?.toLowerCase().includes(filtros.lugar.toLowerCase())) &&
        (!filtros.color ||
          pub.color?.toLowerCase().includes(filtros.color.toLowerCase())) &&
        (!filtros.detalles ||
          pub.detalles?.toLowerCase().includes(filtros.detalles.toLowerCase()))
      );
    });
  };

  // Aplicar filtros
  const publicacionesFiltradas = filtrarPublicaciones(todasLasPublicaciones);

  // Ordenar globalmente por fecha ANTES de paginar
  const publicacionesOrdenadas = [...publicacionesFiltradas].sort((a, b) =>
    compareFechas(a.fecha || "", b.fecha || ""),
  );

  // Determina si hay algún filtro activo
  const isFiltering = Object.values(filtros).some(
    (v) => v !== undefined && v !== null && String(v).trim() !== "",
  );

  // Paginación del lado del cliente
  const totalPages = Math.ceil(publicacionesOrdenadas.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Si hay filtros, mostrar todas; sino, mostrar solo la página actual
  const displayPublicaciones = isFiltering
    ? publicacionesOrdenadas
    : publicacionesOrdenadas.slice(startIndex, endIndex);

  // Si se activa un filtro, asegurarse de mostrar desde la primera "página"
  // (evita ver coincidencias divididas entre páginas). También scrollear arriba.
  useEffect(() => {
    if (isFiltering) {
      setPage(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isFiltering]);

  // Scroll a la tarjeta si viene con hash (solo una vez al cargar)
  useEffect(() => {
    const id = location.hash.slice(1); // Elimina el #
    if (id && !loading && !hashProcessed && publicacionesOrdenadas.length > 0) {
      // Busca en qué página está la tarjeta
      const tarjetaIndex = publicacionesOrdenadas.findIndex(
        (pub) => pub._id === id,
      );

      if (tarjetaIndex !== -1) {
        const tarjetaPagina = Math.floor(tarjetaIndex / ITEMS_PER_PAGE) + 1;

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
      } else {
        // Si no encuentra la publicación, verifica si está en las exitosas
        checkIfInSuccessfulPublications(id);
      }
    }
  }, [location.hash, loading, publicacionesOrdenadas]);

  // Función para verificar si la publicación está en las exitosas
  const checkIfInSuccessfulPublications = async (publicacionId) => {
    try {
      // Buscar en cada estado exitoso
      const estadosExitosos = [
        "YA APARECIO",
        "APARECIO SU FAMILIA",
        "ADOPTADO",
      ];

      for (const estado of estadosExitosos) {
        const res = await publicacionesService.getPublicaciones({
          page: 1,
          limit: 100,
          estado: estado,
        });

        const encontrada = (res?.publicaciones || []).find(
          (pub) => pub._id === publicacionId,
        );

        if (encontrada) {
          // Redirigir a PublicacionesExitosas con el hash
          navigate(`/casos-exito#${publicacionId}`);
          setHashProcessed(true);
          return;
        }
      }

      // Si no la encontró en ningún lado, marcar como procesado
      setHashProcessed(true);
    } catch (error) {
      console.error("Error buscando publicación exitosa:", error);
      setHashProcessed(true);
    }
  };

  // Scroll después de cambiar de página
  useEffect(() => {
    const id = location.hash.slice(1);
    if (id && !loading) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
    }
  }, [page, loading]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
    // Limpiar el hash para evitar conflictos con los useEffects de scroll
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
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
            <CardFiltro
              filtros={filtros}
              setFiltros={setFiltros}
              tipo={mapTipos[tipo]}
            />

            <p className="text-black font-medium text-sm mt-2 border border-[#FF7857]/30 px-3 py-2 rounded-xl bg-white/90 shadow-sm">
              Número de coincidencias:{" "}
              {loading ? "Calculando..." : publicacionesOrdenadas.length}
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
            ) : displayPublicaciones.length > 0 ? (
              displayPublicaciones.map((pub) => (
                <CardGenerica
                  key={pub._id}
                  publicacion={pub}
                  cardId={pub._id}
                />
              ))
            ) : (
              <div className="col-span-full text-black text-2xl font-medium mt-10 text-center">
                No se encontraron resultados
              </div>
            )}
          </div>
        </div>
        {!isFiltering && (
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
            pageClassName="cursor-pointer"
            pageLinkClassName="block border border-[#FF7857]/30 rounded-full px-3 py-1 bg-white/90 text-black text-sm shadow-sm hover:bg-[#FF7857]/10 transition-colors delay-100 duration-300"
            previousClassName="cursor-pointer"
            previousLinkClassName="block border border-[#FF7857]/30 rounded-full px-3 py-1 bg-white/90 text-black text-sm shadow-sm hover:bg-[#FF7857]/10 transition-colors delay-100 duration-300"
            nextClassName="cursor-pointer"
            nextLinkClassName="block border border-[#FF7857]/30 rounded-full px-3 py-1 bg-white/90 text-black text-sm shadow-sm hover:bg-[#FF7857]/10 transition-colors delay-100 duration-300"
            activeLinkClassName="!bg-[#FF7857] !text-white border-[#FF7857]"
            disabledClassName="opacity-40 pointer-events-none"
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PublicacionesPage;
