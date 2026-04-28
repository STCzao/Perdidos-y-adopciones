import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardGenerica from "../../publicaciones/components/CardGenerica";
import RedirectCard from "../../../components/cards/RedirectCard";
import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/Navbar";
import Seo from "../../../components/seo/Seo";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { publicacionesService } from "../../../services/publicaciones";
import { getTipoColorMeta } from "../../../utils/publicacionColors";
import {
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "../../../components/seo/seoUtils";

const ESTADOS_EXITOSOS = ["YA APARECIO", "APARECIO SU FAMILIA", "ADOPTADO"];

const ACTION_PATHS = [
  {
    key: "perdidos",
    eyebrow: "Urgencia",
    title: "Perdí un animal",
    description: "Publica un aviso, revisa casos activos y difunde.",
    browsePath: "/publicaciones/perdidos",
    advicePath: "/consejos-perdi",
    accent: getTipoColorMeta("PERDIDO").accent,
    accentSoft: getTipoColorMeta("PERDIDO").accentSoft,
  },
  {
    key: "encontrados",
    eyebrow: "Resguardo",
    title: "Encontré un animal",
    description: "Deja registro y facilita el reencuentro con su familia.",
    browsePath: "/publicaciones/encontrados",
    advicePath: "/consejos-encontre",
    accent: getTipoColorMeta("ENCONTRADO").accent,
    accentSoft: getTipoColorMeta("ENCONTRADO").accentSoft,
  },
  {
    key: "adopciones",
    eyebrow: "Cuidado",
    title: "Quiero dar o encontrar hogar",
    description: "Explora adopciones activas y publica un nuevo caso.",
    browsePath: "/publicaciones/adopciones",
    advicePath: "/consejos-adopcion",
    accent: getTipoColorMeta("ADOPCION").accent,
    accentSoft: getTipoColorMeta("ADOPCION").accentSoft,
  },
];

const STATS_CONFIG = [
  {
    key: "perdidos",
    label: "¡SE BUSCAN!",
    countKey: "perdidosCount",
    actionLabel: "Explorar perdidos",
    path: "/publicaciones/perdidos",
    accent: getTipoColorMeta("PERDIDO").accent,
  },
  {
    key: "adopciones",
    label: "ESPERANDO UN HOGAR",
    countKey: "adopcionesCount",
    actionLabel: "Explorar adopciones",
    path: "/publicaciones/adopciones",
    accent: getTipoColorMeta("ADOPCION").accent,
  },
  {
    key: "encontrados",
    label: "BUSCANDO A SU FAMILIA",
    countKey: "encontradosCount",
    actionLabel: "Explorar encontrados",
    path: "/publicaciones/encontrados",
    accent: getTipoColorMeta("ENCONTRADO").accent,
  },
];

const HomeScreen = () => {
  const [perdidos, setPerdidos] = useState([]);
  const [encontrados, setEncontrados] = useState([]);
  const [perdidosCount, setPerdidosCount] = useState(0);
  const [encontradosCount, setEncontradosCount] = useState(0);
  const [adopcionesCount, setAdopcionesCount] = useState(0);
  const navigate = useNavigate();
  const withAuth = useRequireAuth();

  const isPublicacionExitosa = (publicacion) =>
    ESTADOS_EXITOSOS.includes(publicacion.estado);

  const openCreatePublication = () => {
    withAuth(() =>
      window.dispatchEvent(new CustomEvent("openCrearPublicacion")),
    );
  };

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [perdidosResp, encontradosResp, adopcionesResp] =
          await Promise.all([
            publicacionesService.getPublicaciones({
              tipo: "PERDIDO",
              limit: 4,
              page: 1,
            }),
            publicacionesService.getPublicaciones({
              tipo: "ENCONTRADO",
              limit: 4,
              page: 1,
            }),
            publicacionesService.getPublicaciones({
              tipo: "ADOPCION",
              limit: 1,
              page: 1,
            }),
          ]);

        if (perdidosResp?.publicaciones) {
          setPerdidos(perdidosResp.publicaciones);
          setPerdidosCount(
            typeof perdidosResp.total === "number"
              ? perdidosResp.total
              : perdidosResp.publicaciones.length,
          );
        }

        if (encontradosResp?.publicaciones) {
          setEncontrados(encontradosResp.publicaciones);
          setEncontradosCount(
            typeof encontradosResp.total === "number"
              ? encontradosResp.total
              : encontradosResp.publicaciones.length,
          );
        }

        if (adopcionesResp) {
          setAdopcionesCount(
            typeof adopcionesResp.total === "number"
              ? adopcionesResp.total
              : adopcionesResp.publicaciones?.length || 0,
          );
        }
      } catch (error) {
        console.error("Error cargando datos de la Home", error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bg-[#f6efe4] pb-[calc(6.5rem+env(safe-area-inset-bottom))] text-[#241914] md:pb-0">
      <Seo
        title="Inicio"
        description="Publica y encuentra animales perdidos, encontrados y en adopción en Tucumán. Una red comunitaria para difundir casos y conectar ayuda real."
        path="/"
        structuredData={[
          buildOrganizationSchema(),
          buildWebsiteSchema(),
          buildBreadcrumbSchema([{ name: "Inicio", path: "/" }]),
        ]}
      />
      <Navbar />

      <section
        className="relative isolate flex min-h-dvh items-center overflow-x-hidden"
        style={{
          background:
            "linear-gradient(180deg, #2c211d 0%, #43302a 58%, #5a3f35 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-55"
          style={{
            backgroundImage: `linear-gradient(125deg, rgba(25,20,17,0.68), rgba(25,20,17,0.12)), url(${import.meta.env.VITE_MEDIA_IMG_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="nature-overlay absolute inset-0" />
        <div className="pointer-events-none absolute left-[-10rem] top-36 h-72 w-72 rounded-full bg-[#D62828]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-[#2165FF]/12 blur-3xl" />

        <div className="relative w-full px-3 pb-3 pt-[1rem] sm:px-5 sm:pb-4 sm:pt-[6.5rem] lg:px-8 lg:pb-5 lg:pt-[7rem]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="relative min-h-[calc(100dvh-11rem-env(safe-area-inset-bottom))] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.24)] sm:min-h-[calc(100dvh-7.5rem)] sm:rounded-[2.4rem]"
            style={{
              backgroundImage: `linear-gradient(125deg, rgba(26,20,18,0.72), rgba(26,20,18,0.3)), url(${import.meta.env.VITE_MEDIA_IMG_URL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,200,158,0.18),transparent_26%),radial-gradient(circle_at_right,rgba(219,231,181,0.14),transparent_24%),linear-gradient(180deg,rgba(24,18,16,0.08),rgba(24,18,16,0.46))]" />

            <div className="relative grid min-h-[inherit] content-center gap-10 p-5 text-white sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:p-10">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <span className="inline-flex w-fit rounded-full border border-white/14 bg-white/8 px-3.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[#f5e7d9] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.28em]">
                  Base de datos comunitaria de Tucumán
                </span>

                <h1 className="font-editorial mt-3 text-[2rem] leading-[0.92] sm:mt-4 sm:text-[3rem] lg:mt-5 lg:text-[3.7rem]">
                  Animales
                  <span className="block text-[#f4c89e]">Perdidos y en Adopción</span>
                  <span className="block text-[#dbe7b5]">en un solo lugar.</span>
                </h1>

                <p className="mt-2 max-w-xl text-[0.88rem] leading-relaxed text-[#f2e8e0]/84 sm:mt-3 sm:text-[0.94rem]">
                  Una herramienta gratuita para registrar y mantener visibles los casos.
                </p>

                <div className="mt-5 hidden lg:flex">
                  <button
                    onClick={openCreatePublication}
                    className="cursor-pointer rounded-full bg-[#f4c89e] px-6 py-3 text-sm font-bold text-[#2a1f19] shadow-[0_16px_40px_rgba(244,200,158,0.24)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Publicar un caso
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <blockquote>
                  <p className="font-editorial text-[1.1rem] leading-[1.22] text-white/88 sm:text-[1.4rem] lg:text-[1.55rem]">
                    "Amar y ser amable con los animales nos acerca a nuestra verdadera naturaleza humana".
                  </p>
                  <footer className="mt-3 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#f4c89e]">
                    — Dalai Lama
                  </footer>
                </blockquote>

                <div className="mt-5 flex lg:hidden">
                  <button
                    onClick={openCreatePublication}
                    className="cursor-pointer rounded-full bg-[#f4c89e] px-6 py-3 text-sm font-bold text-[#2a1f19] shadow-[0_16px_40px_rgba(244,200,158,0.24)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Publicar un caso
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(90,63,53,0.14),transparent)]" />
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.94),rgba(246,239,228,0.9))] px-5 py-6 shadow-[0_22px_55px_rgba(47,36,29,0.06)] sm:px-6 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-8 lg:gap-9">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <span className="text-[0.66rem] font-bold uppercase tracking-[0.26em] text-[#816959]">
                    Casos registrados hasta hoy
                  </span>
                  <h2 className="font-editorial mt-3 text-[2.2rem] leading-[0.96] text-[#241914] sm:text-[2.8rem]">
                    Explora por tipo de caso.
                  </h2>
                  <p className="mt-3 max-w-xl text-[0.94rem] leading-relaxed text-[#5f4c41]">
                    Una lectura rápida del volumen activo en cada frente.
                  </p>
                </div>

                <div className="flex lg:justify-end">
                  <button
                    onClick={() => navigateTo("/casos-resueltos")}
                    className="cursor-pointer rounded-full border border-[#2f241d]/10 bg-[#fffaf4] px-6 py-3 text-sm font-bold text-[#241914] shadow-sm transition-colors duration-300 hover:bg-[#efe2d0]"
                  >
                    Ver casos resueltos
                  </button>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {STATS_CONFIG.map((stat) => (
                  <div
                    key={stat.key}
                    className="flex flex-col text-center transition-transform duration-300 hover:-translate-y-1"
                    style={{
                      borderRadius:
                        stat.key === "perdidos"
                          ? "30px 30px 86px 30px"
                          : stat.key === "adopciones"
                            ? "30px 84px 30px 30px"
                            : "84px 30px 30px 30px",
                    }}
                  >
                    <RedirectCard
                      accent={stat.accent}
                      badge={stat.label}
                      value={
                        stat.countKey === "perdidosCount"
                          ? perdidosCount
                          : stat.countKey === "encontradosCount"
                            ? encontradosCount
                            : adopcionesCount
                      }
                      description={stat.helper}
                      ctaLabel={stat.actionLabel}
                      onClick={() => navigateTo(stat.path)}
                      className="h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#816959]">
                Búsqueda activa
              </span>
              <h2 className="font-editorial mt-3 text-[2.25rem] leading-[0.97] text-[#241914] sm:text-[3rem]">
                Casos perdidos.
              </h2>
            </div>
            <button
              onClick={() => navigateTo("/publicaciones/perdidos")}
              className="cursor-pointer rounded-full border border-[#2f241d]/10 bg-[#fffaf4] px-5 py-3 text-sm font-bold text-[#241914] transition-colors duration-300 hover:bg-[#efe2d0]"
            >
              Ver más publicaciones
            </button>
          </div>

          {perdidos.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 2xl:grid-cols-4">
              {perdidos.map((pub) => (
                <CardGenerica
                  key={pub._id}
                  publicacion={pub}
                  isSuccessful={isPublicacionExitosa(pub)}
                />
              ))}
            </div>
          ) : (
            <div className="nature-card mt-8 bg-[#fbf6ef] px-6 py-10 text-center text-xl font-semibold text-[#4d3f35] shadow-[0_18px_55px_rgba(47,36,29,0.08)]">
              No hay publicaciones recientes
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#816959]">
                Resguardo activo
              </span>
              <h2 className="font-editorial mt-3 text-[2.25rem] leading-[0.97] text-[#241914] sm:text-[3rem]">
                Casos encontrados.
              </h2>
            </div>
            <button
              onClick={() => navigateTo("/publicaciones/encontrados")}
              className="cursor-pointer rounded-full border border-[#2f241d]/10 bg-[#fffaf4] px-5 py-3 text-sm font-bold text-[#241914] transition-colors duration-300 hover:bg-[#efe2d0]"
            >
              Ver más publicaciones
            </button>
          </div>

          {encontrados.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 2xl:grid-cols-4">
              {encontrados.map((pub) => (
                <CardGenerica
                  key={pub._id}
                  publicacion={pub}
                  isSuccessful={isPublicacionExitosa(pub)}
                />
              ))}
            </div>
          ) : (
            <div className="nature-card mt-8 bg-[#fbf6ef] px-6 py-10 text-center text-xl font-semibold text-[#4d3f35] shadow-[0_18px_55px_rgba(47,36,29,0.08)]">
              No hay publicaciones recientes
            </div>
          )}
        </div>
      </section>

      <section
        className="relative overflow-hidden px-4 pb-20 pt-12 text-white sm:px-6 lg:px-8"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(44,34,29,0.84), rgba(44,34,29,0.58)), url(${import.meta.env.VITE_HOME_COLAB_IMG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,200,158,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(219,231,181,0.14),transparent_26%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-5 rounded-[1.8rem] border border-white/10 bg-[rgba(20,15,13,0.38)] px-5 py-7 backdrop-blur-sm sm:rounded-[2.2rem] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#f4c89e]">
              Colaboraciones
            </span>
            <h2 className="font-editorial mt-3 text-[2.8rem] leading-[0.94] sm:text-[3.2rem]">
              Sumate a esta iniciativa.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/82 sm:text-base">
              Podés colaborar ofreciendo tránsito provisorio, ayudando con
              traslados, aportando insumos o difundiendo publicaciones.
            </p>
          </div>

          <button
            onClick={() => navigateTo("/contacto")}
            className="cursor-pointer rounded-full bg-[#f4c89e] px-6 py-3 text-sm font-bold text-[#2a1f19] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Quiero colaborar
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeScreen;
