import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Seo from "../components/seo/Seo";
import LoadingState from "../components/ui/LoadingState";
import { useComunidad } from "../hooks/useComunidad";
import { useFiltro } from "../hooks/useFiltro";
import CardsAyuda from "../components/cards/CardsAyuda";
import CasoAyudaFiltro from "../components/forms/CasoAyudaFiltro";
import { buildBreadcrumbSchema } from "../components/seo/seoUtils";

const ComunidadScreen = () => {
  const { casos, loading, error } = useComunidad();
  const { filtrados, query, setQuery } = useFiltro(casos);

  return (
    <div className="bg-[#f6efe4] pb-[calc(6.5rem+env(safe-area-inset-bottom))] text-[#241914] md:pb-0">
      <Seo
        title="Comunidad"
        description="Lee historias, consejos y casos de ayuda de la comunidad para acompañar mejor búsquedas, rescates y adopciones."
        path="/casos-ayuda"
        structuredData={[
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Comunidad", path: "/casos-ayuda" },
          ]),
        ]}
      />
      <Navbar />

      <section
        className="relative isolate flex min-h-dvh items-center overflow-x-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-30 lg:px-8 lg:pt-30"
        style={{
          background:
            "linear-gradient(180deg, #2c211d 0%, #43302a 58%, #5a3f35 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-52"
          style={{
            backgroundImage: `linear-gradient(125deg, rgba(25,20,17,0.74), rgba(25,20,17,0.28)), url(${import.meta.env.VITE_CASOS_IMG_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute left-[-8rem] top-36 h-72 w-72 rounded-full bg-[#c86d4b]/18 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-[#95a667]/12 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="rounded-[1.35rem] border border-white/10 bg-[rgba(22,17,15,0.5)] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:rounded-[2rem] sm:p-6 lg:p-8"
          >
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#f4c89e]">
                Comunidad
              </span>
              <h1 className="font-editorial mt-4 text-[1.95rem] leading-[0.95] text-white sm:text-[2.8rem]">
                Historias y consejos.
              </h1>
              <p className="mt-3 max-w-2xl text-[0.9rem] leading-relaxed text-white/78 sm:text-[0.98rem]">
                Casos reales y guías breves para usar mejor la base y compartir experiencias útiles.
              </p>
            </div>

            <div className="mt-6 max-w-3xl sm:mt-8">
              <CasoAyudaFiltro value={query} onChange={setQuery} />
            </div>
          </motion.div>

          <motion.div className="mt-8 grid grid-cols-1 place-items-center gap-5 sm:mt-10 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <LoadingState
                compact
                label="Cargando historias de la comunidad..."
                className="col-span-full"
              />
            )}

            {error && (
              <p className="col-span-full text-center text-red-300">
                Ocurrió un error al cargar los casos.
              </p>
            )}

            {!loading && !error && filtrados.length === 0 && (
              <div className="col-span-full rounded-[1rem] border border-white/10 bg-white/8 px-8 py-12 text-center text-white shadow-sm">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#f4c89e]">
                  Sin resultados
                </p>
                <p className="mt-3 text-lg font-semibold">No hay casos disponibles.</p>
              </div>
            )}

            {!loading &&
              !error &&
              filtrados.length > 0 &&
              filtrados.map((pub) => <CardsAyuda key={pub._id} pub={pub} />)}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComunidadScreen;
