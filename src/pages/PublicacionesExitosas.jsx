import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";
import CardExitosa from "../components/cards/CardExitosa";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { publicacionesService } from "../services/publicaciones";

const ESTADOS_EXITOSOS = ["YA APARECIO", "APARECIO SU FAMILIA", "ADOPTADO"];
const ITEMS_PER_PAGE = 12;

const fetchTodasLasPaginasDeEstado = async (estado) => {
  const primera = await publicacionesService.getPublicaciones({ page: 1, limit: 50, estado });
  const publicaciones = primera?.publicaciones || [];
  const totalPages = primera?.totalPages || 1;

  if (totalPages <= 1) return publicaciones;

  const requests = [];
  for (let p = 2; p <= totalPages; p += 1) {
    requests.push(publicacionesService.getPublicaciones({ page: p, limit: 50, estado }));
  }

  const resto = await Promise.all(requests);
  return [...publicaciones, ...resto.flatMap((r) => r?.publicaciones || [])];
};

const PublicacionesExitosas = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPublicacionesExitosas = async () => {
      setLoading(true);
      try {
        const resultados = await Promise.all(
          ESTADOS_EXITOSOS.map((estado) => fetchTodasLasPaginasDeEstado(estado)),
        );

        const todas = resultados.flat();
        todas.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
        setPublicaciones(todas);
      } catch (error) {
        console.error("Error al obtener publicaciones exitosas:", error);
        setPublicaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicacionesExitosas();
  }, []);

  const totalPages = Math.ceil(publicaciones.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayPublicaciones = publicaciones.slice(startIndex, endIndex);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#f6efe4] text-[#241914]">
      <Navbar />

      <div className="relative min-h-screen overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8">
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
                    : `Explora los ${publicaciones.length} casos resueltos.`}
                </p>
              </div>
            </div>
          </motion.section>

          <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {loading ? (
              <div className="col-span-full flex min-h-[16rem] items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-[#d46f49]" />
              </div>
            ) : displayPublicaciones.length > 0 ? (
              displayPublicaciones.map((pub) => (
                <motion.div
                  key={pub._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardExitosa publicacion={pub} cardId={pub._id} />
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

          {!loading && totalPages > 1 && (
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicacionesExitosas;
