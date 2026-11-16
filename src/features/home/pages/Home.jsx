import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconArrowRight,
  IconHeart,
  IconHeartHandshake,
  IconPaw,
  IconSearch,
} from "@tabler/icons-react";
import CardGenerica from "../../publicaciones/components/CardGenerica";
import MapaCasos from "../../publicaciones/components/MapaCasos";
import DonacionSection from "../../../components/cards/DonacionSection";
import RedirectCard from "../../../components/cards/RedirectCard";
import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/Navbar";
import Seo from "../../../components/seo/Seo";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { publicacionesService } from "../../../services/publicaciones";
import { getCloudinaryBgUrl } from "../../../utils/cloudinaryUtils";
import { getTipoColorMeta } from "../../../utils/publicacionColors";
import { ESTADOS_RESUELTOS } from "../../../utils/estadosPublicacion";
import {
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "../../../components/seo/seoUtils";

// Acciones directas de la portada: cada tipo de caso abre el formulario con el
// tipo ya elegido, y ofrece un segundo paso según lo que la persona necesita.
const HERO_ACTIONS = [
  {
    key: "perdido",
    tipo: "PERDIDO",
    Icon: IconSearch,
    title: "Perdí un animal",
    description: "Publicá el aviso para que aparezca en el mapa.",
    primaryLabel: "Publicar perdido",
    secondary: { label: "Qué hacer", path: "/consejos-perdi" },
    meta: getTipoColorMeta("PERDIDO"),
  },
  {
    key: "encontrado",
    tipo: "ENCONTRADO",
    Icon: IconPaw,
    title: "Encontré un animal",
    description: "Registralo y ayudá a que su familia lo encuentre.",
    primaryLabel: "Publicar encontrado",
    secondary: { label: "Qué hacer", path: "/consejos-encontre" },
    meta: getTipoColorMeta("ENCONTRADO"),
  },
  {
    key: "adopcion",
    tipo: "ADOPCION",
    Icon: IconHeart,
    title: "Adopción",
    description: "Dale un hogar a quien lo espera, o buscale uno.",
    primaryLabel: "Dar en adopción",
    secondary: { label: "Quiero adoptar", path: "/publicaciones/adopciones" },
    meta: getTipoColorMeta("ADOPCION"),
  },
];

// `resueltoLabel` = [singular, plural] para la línea "N ya aparecieron · M publicados en total".
const STATS_CONFIG = [
  {
    key: "perdidos",
    tipo: "PERDIDO",
    label: "¡SE BUSCAN!",
    resueltoLabel: ["ya apareció", "ya aparecieron"],
    actionLabel: "Explorar perdidos",
    path: "/publicaciones/perdidos",
    accent: getTipoColorMeta("PERDIDO").accent,
  },
  {
    key: "adopciones",
    tipo: "ADOPCION",
    label: "ESPERANDO UN HOGAR",
    resueltoLabel: ["ya fue adoptado", "ya fueron adoptados"],
    actionLabel: "Explorar adopciones",
    path: "/publicaciones/adopciones",
    accent: getTipoColorMeta("ADOPCION").accent,
  },
  {
    key: "encontrados",
    tipo: "ENCONTRADO",
    label: "BUSCANDO A SU FAMILIA",
    resueltoLabel: ["ya tiene familia", "ya tienen familia"],
    actionLabel: "Explorar encontrados",
    path: "/publicaciones/encontrados",
    accent: getTipoColorMeta("ENCONTRADO").accent,
  },
];

const ESTADISTICA_VACIA = { total: 0, activos: 0, resueltos: 0 };

const buildStatDescription = ({ resueltos, total }, [singular, plural]) =>
  `${resueltos} ${resueltos === 1 ? singular : plural} · ${total} ${
    total === 1 ? "publicado" : "publicados"
  } en total`;

const HomeScreen = () => {
  const [perdidos, setPerdidos] = useState([]);
  const [encontrados, setEncontrados] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [homeDataReady, setHomeDataReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const withAuth = useRequireAuth();
  const collabBgUrl = getCloudinaryBgUrl(import.meta.env.VITE_HOME_COLAB_IMG_URL, {
    width: 1200,
  });

  const isPublicacionExitosa = (publicacion) =>
    ESTADOS_RESUELTOS.includes(publicacion.estado);

  const openCreatePublication = (tipoInicial) => {
    withAuth(() =>
      window.dispatchEvent(
        new CustomEvent("openCrearPublicacion", {
          detail: tipoInicial ? { tipoInicial } : null,
        }),
      ),
    );
  };

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const scrollToDonar = () =>
    document.getElementById("donar")?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Links "/#donar" (navbar, menú de perfil, footer) llegan acá: bajamos a la sección.
  // Espera a que carguen las cards de perdidos/encontrados, que están arriba de
  // "Donar": si no, al aparecer empujan la sección y el scroll queda corto.
  // Depende de location.key para que funcione aun si ya estábamos en "/#donar".
  useEffect(() => {
    if (location.hash !== "#donar" || !homeDataReady) return;
    const id = window.setTimeout(scrollToDonar, 80);
    return () => window.clearTimeout(id);
  }, [location.key, location.hash, homeDataReady]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [perdidosResp, encontradosResp, estadisticasResp] =
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
            publicacionesService.getEstadisticas(),
          ]);

        if (perdidosResp?.publicaciones) {
          setPerdidos(perdidosResp.publicaciones);
        }

        if (encontradosResp?.publicaciones) {
          setEncontrados(encontradosResp.publicaciones);
        }

        // Si el endpoint falla, estadisticas queda vacío y las tarjetas muestran 0.
        setEstadisticas(estadisticasResp?.estadisticas || {});
      } catch (error) {
        console.error("Error cargando datos de la Home", error);
      } finally {
        setHomeDataReady(true);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bg-[#f6efe4] pb-[calc(6.5rem+env(safe-area-inset-bottom))] text-[#241914] lg:pb-0">
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
        className="relative isolate overflow-x-hidden"
        style={{
          background:
            "linear-gradient(180deg, #2c211d 0%, #43302a 58%, #5a3f35 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,200,158,0.16),transparent_36%),linear-gradient(180deg,rgba(24,18,16,0.06),rgba(24,18,16,0.28))]" />
        <div className="nature-overlay absolute inset-0" />

        <div className="relative w-full px-3 pb-4 pt-[5.4rem] sm:px-5 sm:pt-[6.5rem] lg:px-8 lg:pb-5 lg:pt-[7rem]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 lg:grid-cols-[minmax(320px,380px)_1fr] lg:gap-5"
          >
            {/* Mapa: primero en mobile, a la derecha en escritorio */}
            <MapaCasos
              zoom={12}
              scrollWheelZoom={false}
              className="order-1 h-[58dvh] min-h-[340px] overflow-hidden rounded-[1.6rem] border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.28)] lg:order-2 lg:h-[calc(100dvh-8.5rem)] lg:min-h-[520px] lg:rounded-[2rem]"
            >
              <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] max-w-[16rem] rounded-[0.9rem] bg-[rgba(36,25,20,0.78)] px-3 py-2 text-[0.68rem] leading-snug text-white/90 backdrop-blur-sm">
                Pasá el mouse o tocá un pin para ver el caso. Las ubicaciones son aproximadas
                por privacidad.
              </div>
            </MapaCasos>

            {/* Panel de acciones */}
            <div className="order-2 flex flex-col gap-3 text-white lg:order-1 lg:max-h-[calc(100dvh-8.5rem)] lg:min-h-[520px] lg:overflow-y-auto">
              <div className="px-1">
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#f4c89e]">
                  Base de datos comunitaria de Tucumán
                </span>
                <h1 className="font-editorial mt-2 text-[2rem] leading-[0.92] sm:text-[2.4rem]">
                  Animales
                  <span className="block text-[#f4c89e]">Perdidos y en Adopción</span>
                  <span className="block text-[#dbe7b5]">en un solo lugar.</span>
                </h1>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-[#f2e8e0]/84">
                  Una herramienta gratuita para registrar y mantener visibles los casos.
                </p>
              </div>

              {HERO_ACTIONS.map(({ key, tipo, Icon, title, description, primaryLabel, secondary, meta }) => (
                <div
                  key={key}
                  className="rounded-[1.2rem] border border-white/10 bg-[rgba(255,250,244,0.96)] p-3.5 text-[#241914] shadow-[0_14px_36px_rgba(0,0,0,0.18)]"
                  style={{ borderLeft: `5px solid ${meta.accent}` }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: meta.accentSoft, color: meta.accent }}
                    >
                      <Icon size={20} stroke={2} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-[1.02rem] font-extrabold leading-tight">{title}</h2>
                      <p className="mt-0.5 text-[0.8rem] leading-snug text-[#5f4c41]">
                        {description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openCreatePublication(tipo)}
                      className="cursor-pointer rounded-[0.7rem] px-3 py-2 text-[0.8rem] font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: meta.accent }}
                    >
                      {primaryLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo(secondary.path)}
                      className="flex cursor-pointer items-center justify-center gap-1 rounded-[0.7rem] border border-[#2f241d]/12 bg-white px-3 py-2 text-[0.8rem] font-bold text-[#241914] transition-colors hover:bg-[#f3ebe1]"
                    >
                      {secondary.label}
                      <IconArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={scrollToDonar}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-[1.2rem] border border-[#f4c89e]/40 bg-[#f4c89e] px-4 py-3 text-sm font-bold text-[#2a1f19] shadow-[0_14px_36px_rgba(244,200,158,0.2)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <IconHeartHandshake size={18} aria-hidden="true" />
                Quiero donar
              </button>

              <blockquote className="px-1 pt-1">
                <p className="font-editorial text-[1.1rem] leading-[1.22] text-white/88">
                  "Amar y ser amable con los animales nos acerca a nuestra verdadera naturaleza humana".
                </p>
                <footer className="mt-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#f4c89e]">
                  — Dalai Lama
                </footer>
              </blockquote>
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
                {STATS_CONFIG.map((stat) => {
                  const stats = { ...ESTADISTICA_VACIA, ...estadisticas[stat.tipo] };

                  return (
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
                        value={stats.activos}
                        description={buildStatDescription(stats, stat.resueltoLabel)}
                        ctaLabel={stat.actionLabel}
                        onClick={() => navigateTo(stat.path)}
                        className="h-full"
                      />
                    </div>
                  );
                })}
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
                Casos: perdidos.
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
                Casos: encontrados.
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

      <DonacionSection />

      <section
        className="relative overflow-hidden px-4 pb-20 pt-12 text-white sm:px-6 lg:px-8"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(44,34,29,0.84), rgba(44,34,29,0.58)), url(${collabBgUrl})`,
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
