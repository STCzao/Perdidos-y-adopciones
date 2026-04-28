import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import Seo from "../../../components/seo/Seo";
import { publicacionesService } from "../../../services/publicaciones";
import CardExitosa from "../components/CardExitosa";
import { buildBreadcrumbSchema } from "../../../components/seo/seoUtils";
import LoadingState from "../../../components/ui/LoadingState";

const ESTADOS_EXITOSOS = ["YA APARECIO", "APARECIO SU FAMILIA", "ADOPTADO"];
const ITEMS_PER_PAGE = 12;
const PAGE_FETCH_SIZE = 50;

const publicacionesExitosasCache = {
  items: null,
  promise: null,
};

const ordenarPorFechaCreacionDesc = (publicaciones = []) =>
  [...publicaciones].sort(
    (a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0),
  );

const fetchTodasLasPaginasDeEstado = async (estado) => {
  const primera = await publicacionesService.getPublicaciones({
    page: 1,
    limit: PAGE_FETCH_SIZE,
    estado,
  });
  const publicaciones = primera?.publicaciones || [];
  const totalPages = primera?.totalPages || 1;

  if (totalPages <= 1) return publicaciones;

  const requests = [];
  for (let p = 2; p <= totalPages; p += 1) {
    requests.push(
      publicacionesService.getPublicaciones({
        page: p,
        limit: PAGE_FETCH_SIZE,
        estado,
      }),
    );
  }

  const resto = await Promise.all(requests);
  return [...publicaciones, ...resto.flatMap((response) => response?.publicaciones || [])];
};

const cargarTodasLasPublicacionesExitosas = async () => {
  if (publicacionesExitosasCache.items) {
    return publicacionesExitosasCache.items;
  }

  if (publicacionesExitosasCache.promise) {
    return publicacionesExitosasCache.promise;
  }

  publicacionesExitosasCache.promise = Promise.all(
    ESTADOS_EXITOSOS.map((estado) => fetchTodasLasPaginasDeEstado(estado)),
  )
    .then((resultados) => {
      const ordenadas = ordenarPorFechaCreacionDesc(resultados.flat());
      publicacionesExitosasCache.items = ordenadas;
      return ordenadas;
    })
    .finally(() => {
      publicacionesExitosasCache.promise = null;
    });

  return publicacionesExitosasCache.promise;
};

const PublicacionesExitosasPage = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchPublicacionesExitosas = async () => {
      if (publicacionesExitosasCache.items) {
        setPublicaciones(publicacionesExitosasCache.items);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      setLoading(true);
      setLoadingMore(false);

      try {
        const primerasRespuestas = await Promise.all(
          ESTADOS_EXITOSOS.map((estado) =>
            publicacionesService.getPublicaciones({
              page: 1,
              limit: PAGE_FETCH_SIZE,
              estado,
            }),
          ),
        );

        if (cancelled) return;

        const primerasPublicaciones = ordenarPorFechaCreacionDesc(
          primerasRespuestas.flatMap((response) => response?.publicaciones || []),
        );

        setPublicaciones(primerasPublicaciones);
        setLoading(false);

        const hayMasPaginas = primerasRespuestas.some(
          (response) => (response?.totalPages || 1) > 1,
        );

        if (!hayMasPaginas) {
          publicacionesExitosasCache.items = primerasPublicaciones;
          return;
        }

        setLoadingMore(true);
        const todas = await cargarTodasLasPublicacionesExitosas();

        if (!cancelled) {
          setPublicaciones(todas);
        }
      } catch (error) {
        console.error("Error al obtener publicaciones exitosas:", error);
        if (!cancelled) {
          setPublicaciones([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchPublicacionesExitosas();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.ceil(publicaciones.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayPublicaciones = useMemo(
    () => publicaciones.slice(startIndex, endIndex),
    [endIndex, publicaciones, startIndex],
  );

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#f6efe4] text-[#241914]">
      <Seo
        title="Casos resueltos"
        description="Consulta reencuentros y adopciones concretadas en la base comunitaria de Perdidos y Adopciones."
        path="/casos-resueltos"
        structuredData={[
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Casos resueltos", path: "/casos-resueltos" },
          ]),
        ]}
      />
      <Navbar />

      <div className="relative min-h-screen overflow-x-hidden px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-[-10rem] top-36 h-80 w-80 rounded-full bg-[#d46f49]/12 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-[#95a667]/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(90,63,53,0.12),transparent)]" />

        <div className="relative w-full">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[1.1rem] border border-[#2f241d]/10 bg-[linear-gradient(135deg,rgba(255,250,244,0.96),rgba(239,226,208,0.92))] shadow-[0_28px_70px_rgba(36,25,20,0.08)]"
          >
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-7">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-[0.45rem] bg-[#E7ECD7] px-4 py-2 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[#241914]">
                  Casos resueltos
                </span>
                <h1 className="font-editorial mt-4 text-[2.6rem] leading-[0.92] text-[#241914] sm:text-[3.2rem] lg:text-[3.7rem]">
                  Archivo de casos cerrados
                </h1>
                <p className="mt-4 max-w-2xl text-[0.96rem] leading-relaxed text-[#5f4c41]">
                  Reencuentros, adopciones concretadas y animales que encontraron amor por primera vez.
                </p>
              </div>

              <div className="self-start rounded-[0.8rem] border border-[#2f241d]/10 bg-white/70 p-4 shadow-sm">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#816959]">
                  Estado del archivo
                </p>
                <p className="mt-3 text-[0.95rem] font-medium leading-relaxed text-[#5f4c41]">
                  {loading
                    ? "Cargando casos resueltos..."
                    : loadingMore
                      ? `Mostrando ${Math.min(
                          publicaciones.length,
                          ITEMS_PER_PAGE,
                        )} casos mientras completamos el archivo histórico.`
                      : `Explora los ${publicaciones.length} casos resueltos.`}
                </p>
              </div>
            </div>
          </motion.section>

          <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {loading ? (
              <div className="col-span-full">
                <LoadingState label="Cargando casos resueltos..." />
              </div>
            ) : displayPublicaciones.length > 0 ? (
              displayPublicaciones.map((publicacion) => (
                <motion.div
                  key={publicacion._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardExitosa publicacion={publicacion} cardId={publicacion._id} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full rounded-[1rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(239,226,208,0.9))] px-8 py-14 text-center shadow-sm">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#816959]">
                  Sin resultados
                </p>
                <p className="mt-3 text-[1.1rem] font-semibold text-[#241914]">
                  No hay casos resueltos todavía.
                </p>
              </div>
            )}
          </div>

          {!loading && !loadingMore && totalPages > 1 && (
            <ReactPaginate
              previousLabel="Anterior"
              nextLabel="Siguiente"
              breakLabel="..."
              pageCount={totalPages}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              forcePage={page - 1}
              containerClassName="mt-8 flex flex-wrap justify-center gap-3 py-2"
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

          {!loading && loadingMore && (
            <div className="mt-8 rounded-[0.85rem] border border-[#2f241d]/10 bg-white/72 px-4 py-3 text-center text-sm text-[#5f4c41] shadow-sm">
              Cargando más casos para completar el archivo histórico.
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicacionesExitosasPage;
