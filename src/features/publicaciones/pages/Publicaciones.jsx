import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import CardFiltro from "../../../components/forms/CardFiltro";
import { publicacionesService } from "../../../services/publicaciones";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { compareFechas } from "../../../utils/dateHelpers";
import { getTipoColorMeta } from "../../../utils/publicacionColors";
import CardGenerica from "../components/CardGenerica";
import { getPublicacionTamano } from "../utils/publicacionFields";

const ITEMS_PER_PAGE = 12;

const mapTipos = {
  perdidos: "PERDIDO",
  adopciones: "ADOPCION",
  encontrados: "ENCONTRADO",
};

const estadosExcluidos = ["YA APARECIO", "APARECIO SU FAMILIA", "ADOPTADO"];

const pageMeta = {
  perdidos: {
    eyebrow: "Búsqueda activa",
    title: "Animales perdidos",
    description: "Casos visibles para acelerar el reencuentro con su familia.",
    accent: getTipoColorMeta("PERDIDO").accent,
    accentSoft: getTipoColorMeta("PERDIDO").accentSoft,
  },
  adopciones: {
    eyebrow: "Nuevo hogar",
    title: "Animales en adopción",
    description: "Publicaciones activas para dar o encontrar un hogar responsable.",
    accent: getTipoColorMeta("ADOPCION").accent,
    accentSoft: getTipoColorMeta("ADOPCION").accentSoft,
  },
  encontrados: {
    eyebrow: "Resguardo activo",
    title: "Animales encontrados",
    description: "Animales resguardados mientras se localiza a su familia.",
    accent: getTipoColorMeta("ENCONTRADO").accent,
    accentSoft: getTipoColorMeta("ENCONTRADO").accentSoft,
  },
};

const PublicacionesPage = () => {
  const { tipo } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const withAuth = useRequireAuth();
  const meta = pageMeta[tipo] || pageMeta.perdidos;

  const [todasLasPublicaciones, setTodasLasPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hashProcessed, setHashProcessed] = useState(false);
  const [razasPorEspecie, setRazasPorEspecie] = useState({});

  useEffect(() => {
    publicacionesService.getRazas().then((response) => {
      if (response.razasPorEspecie) {
        setRazasPorEspecie(response.razasPorEspecie);
      }
    });
  }, []);

  const [filtros, setFiltros] = useState({
    raza: "",
    edad: "",
    sexo: "",
    tamano: "",
    color: "",
    especie: "",
    detalles: "",
    localidad: "",
    lugar: "",
  });

  useEffect(() => {
    const fetchAllPublicaciones = async () => {
      setLoading(true);

      try {
        const firstResponse = await publicacionesService.getPublicaciones({
          page: 1,
          limit: 50,
          tipo: mapTipos[tipo],
        });

        const primeras = firstResponse?.publicaciones || [];
        const totalPagesAll = firstResponse?.totalPages || 1;

        if (totalPagesAll <= 1) {
          const filtradas = primeras.filter(
            (publicacion) => !estadosExcluidos.includes(publicacion.estado),
          );
          setTodasLasPublicaciones(filtradas);
          setLoading(false);
          return;
        }

        const requests = [];
        for (let currentPage = 2; currentPage <= totalPagesAll; currentPage += 1) {
          requests.push(
            publicacionesService.getPublicaciones({
              page: currentPage,
              limit: 50,
              tipo: mapTipos[tipo],
            }),
          );
        }

        const results = await Promise.all(requests);
        const resto = results.flatMap((response) => response?.publicaciones || []);
        const filtradas = [...primeras, ...resto].filter(
          (publicacion) => !estadosExcluidos.includes(publicacion.estado),
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
    setHashProcessed(false);
  }, [tipo]);

  const filtrarPublicaciones = (lista) =>
    lista.filter((publicacion) => {
      const tamanoPublicacion = getPublicacionTamano(publicacion);

      return (
        (!filtros.raza || publicacion.raza === filtros.raza) &&
        (!filtros.edad || publicacion.edad === filtros.edad) &&
        (!filtros.sexo || publicacion.sexo === filtros.sexo) &&
        (!filtros.especie || publicacion.especie === filtros.especie) &&
        (!filtros.tamano || tamanoPublicacion === filtros.tamano) &&
        (!filtros.localidad || publicacion.localidad === filtros.localidad) &&
        (!filtros.lugar ||
          publicacion.lugar?.toLowerCase().includes(filtros.lugar.toLowerCase())) &&
        (!filtros.color ||
          publicacion.color?.toLowerCase().includes(filtros.color.toLowerCase())) &&
        (!filtros.detalles ||
          publicacion.detalles
            ?.toLowerCase()
            .includes(filtros.detalles.toLowerCase()))
      );
    });

  const publicacionesFiltradas = filtrarPublicaciones(todasLasPublicaciones);
  const publicacionesOrdenadas = [...publicacionesFiltradas].sort((a, b) =>
    compareFechas(a.fecha || "", b.fecha || ""),
  );

  const isFiltering = Object.values(filtros).some(
    (value) => value !== undefined && value !== null && String(value).trim() !== "",
  );

  const totalPages = Math.ceil(publicacionesOrdenadas.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const displayPublicaciones = isFiltering
    ? publicacionesOrdenadas
    : publicacionesOrdenadas.slice(startIndex, endIndex);

  useEffect(() => {
    if (isFiltering) {
      setPage(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isFiltering]);

  useEffect(() => {
    const id = location.hash.slice(1);

    if (id && !loading && !hashProcessed && publicacionesOrdenadas.length > 0) {
      const cardIndex = publicacionesOrdenadas.findIndex(
        (publicacion) => publicacion._id === id,
      );

      if (cardIndex !== -1) {
        const targetPage = Math.floor(cardIndex / ITEMS_PER_PAGE) + 1;

        if (targetPage !== page) {
          setPage(targetPage);
        } else {
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 200);
        }

        setHashProcessed(true);
      } else {
        checkIfInSuccessfulPublications(id);
      }
    }
  }, [location.hash, loading, hashProcessed, publicacionesOrdenadas, page]);

  const checkIfInSuccessfulPublications = async (publicacionId) => {
    try {
      const response = await publicacionesService.getPublicacionById(publicacionId);

      if (
        response?.publicacion &&
        estadosExcluidos.includes(response.publicacion.estado)
      ) {
        navigate(`/casos-exito#${publicacionId}`);
      }
    } catch (error) {
      console.error("Error buscando publicación exitosa:", error);
    } finally {
      setHashProcessed(true);
    }
  };

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
  }, [page, loading, location.hash]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#f6efe4] pb-24 text-[#241914] md:pb-0">
      <Navbar />

      <div className="relative min-h-screen overflow-hidden px-4 pb-16 pt-26 sm:px-6 sm:pt-30 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute left-[-10rem] top-40 h-80 w-80 rounded-full bg-[#D62828]/12 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-[#2165FF]/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(90,63,53,0.12),transparent)]" />

        <div className="relative w-full">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[0.95rem] border border-[#2f241d]/10 bg-[linear-gradient(135deg,rgba(255,250,244,0.96),rgba(239,226,208,0.92))] shadow-[0_28px_70px_rgba(36,25,20,0.08)] sm:rounded-[1.1rem]"
          >
            <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-7">
              <div className="max-w-3xl">
                <span
                  className="inline-flex rounded-[0.45rem] px-4 py-2 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[#241914]"
                  style={{ backgroundColor: meta.accentSoft }}
                >
                  {meta.eyebrow}
                </span>
                <h1 className="font-editorial mt-4 text-[2.1rem] leading-[0.96] text-[#241914] sm:text-[2.8rem] lg:text-[3.4rem]">
                  {meta.title}
                </h1>
                <p className="mt-4 max-w-2xl text-[0.96rem] leading-relaxed text-[#5f4c41]">
                  {meta.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="self-start rounded-[0.8rem] border border-[#2f241d]/10 bg-white/70 px-4 py-3 shadow-sm">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#816959]">
                    Estado de la búsqueda
                  </p>
                  <p className="mt-1.5 text-[0.86rem] font-medium leading-relaxed text-[#5f4c41]">
                    {loading
                      ? "Cargando publicaciones activas..."
                      : isFiltering
                        ? `Mostrando ${publicacionesOrdenadas.length} coincidencias según tus filtros.`
                        : `Explora ${publicacionesOrdenadas.length} publicaciones activas.`}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[10rem_minmax(0,1fr)] xl:grid-cols-[19.5rem_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <CardFiltro
                filtros={filtros}
                setFiltros={setFiltros}
                tipo={mapTipos[tipo]}
                razasPorEspecie={razasPorEspecie}
              />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {loading ? (
                  <div className="col-span-full flex min-h-[16rem] items-center justify-center">
                    <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-[#D62828]" />
                  </div>
                ) : displayPublicaciones.length > 0 ? (
                  displayPublicaciones.map((publicacion) => (
                    <CardGenerica
                      key={publicacion._id}
                      publicacion={publicacion}
                      cardId={publicacion._id}
                    />
                  ))
                ) : (
                  <div className="col-span-full rounded-[1rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(239,226,208,0.9))] px-8 py-14 text-center shadow-sm">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#816959]">
                      Sin resultados
                    </p>
                    <p className="mt-3 text-[1.1rem] font-semibold text-[#241914]">
                      No encontramos publicaciones con esos criterios.
                    </p>
                  </div>
                )}
              </div>

              {!isFiltering && totalPages > 1 && (
                <ReactPaginate
                  previousLabel="Anterior"
                  nextLabel="Siguiente"
                  breakLabel="..."
                  pageCount={totalPages}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  forcePage={page - 1}
                  containerClassName="flex flex-wrap justify-center gap-3 py-2"
                  pageClassName="cursor-pointer"
                  pageLinkClassName="block rounded-[0.6rem] border border-[#2f241d]/10 bg-[#fffaf4] px-4 py-2 text-sm text-[#241914] shadow-sm transition-colors duration-300 hover:bg-[#efe2d0]"
                  previousClassName="cursor-pointer"
                  previousLinkClassName="block rounded-[0.6rem] border border-[#2f241d]/10 bg-[#fffaf4] px-4 py-2 text-sm text-[#241914] shadow-sm transition-colors duration-300 hover:bg-[#efe2d0]"
                  nextClassName="cursor-pointer"
                  nextLinkClassName="block rounded-[0.6rem] border border-[#2f241d]/10 bg-[#fffaf4] px-4 py-2 text-sm text-[#241914] shadow-sm transition-colors duration-300 hover:bg-[#efe2d0]"
                  activeLinkClassName="!border-[#241914] !bg-[#241914] !text-white"
                  disabledClassName="pointer-events-none opacity-40"
                  breakLinkClassName="block rounded-full px-2 py-2 text-sm text-[#816959]"
                  renderOnZeroPageCount={null}
                />
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicacionesPage;
