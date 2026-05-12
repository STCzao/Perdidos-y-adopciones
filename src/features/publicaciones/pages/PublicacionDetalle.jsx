import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import {
  IconSearch,
  IconBrandWhatsapp,
  IconShare,
  IconDownload,
  IconMapPin,
  IconPaw,
  IconCalendar,
  IconShieldCheck,
  IconWorld,
  IconChevronRight,
  IconDog,
  IconPalette,
  IconGenderBigender,
  IconRuler,
} from "@tabler/icons-react";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import Seo from "../../../components/seo/Seo";
import { publicacionesService } from "../../../services/publicaciones";
import { formatFecha } from "../../../utils/dateHelpers";
import { ESTADOS_RESUELTOS } from "../../../utils/estadosPublicacion";
import { getTipoColorMeta } from "../../../utils/publicacionColors";
import { getPublicacionSlug } from "../utils/publicacionPaths";
import {
  formatBooleanish,
  getPublicacionTamano,
} from "../utils/publicacionFields";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import {
  buildAnimalPostingSchema,
  buildBreadcrumbSchema,
} from "../../../components/seo/seoUtils";
import { getCloudinaryUrl } from "../../../utils/cloudinaryUtils";
import LoadingState from "../../../components/ui/LoadingState";

const tipoMeta = {
  PERDIDO: {
    accent: getTipoColorMeta("PERDIDO").accent,
    locationLabel: "Se extravió en",
  },
  ENCONTRADO: {
    accent: getTipoColorMeta("ENCONTRADO").accent,
    locationLabel: "Encontrado en",
  },
  ADOPCION: {
    accent: getTipoColorMeta("ADOPCION").accent,
    locationLabel: "Zona de referencia",
  },
};

const tipoBreadcrumbLabel = {
  PERDIDO: "Perdidos",
  ENCONTRADO: "Encontrados",
  ADOPCION: "Adopciones",
};

const tipoBadgeLabel = {
  PERDIDO: "SE BUSCA",
  ENCONTRADO: "SE ENCONTRÓ",
  ADOPCION: "EN ADOPCIÓN",
};

const tipoDateLabel = {
  PERDIDO: "Perdido desde",
  ENCONTRADO: "Encontrado el",
  ADOPCION: "Publicado el",
};

const getLocationStatePublicacion = (location, id) => {
  const statePublicacion = location.state?.publicacion;

  if (!statePublicacion) return null;

  const stateId = statePublicacion._id || statePublicacion.id;
  return stateId === id ? statePublicacion : null;
};

export default function PublicacionDetalle() {
  const { tipo, id } = useParams();
  const location = useLocation();
  const withAuth = useRequireAuth();
  const statePublicacion = getLocationStatePublicacion(location, id);
  const [publicacion, setPublicacion] = useState(statePublicacion);
  const [contactoWhatsapp, setContactoWhatsapp] = useState("");
  const [loading, setLoading] = useState(!statePublicacion);
  const [copied, setCopied] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchPublicacion = async () => {
      if (!statePublicacion) {
        setLoading(true);
      }

      setContactoWhatsapp("");

      try {
        const response = await publicacionesService.getPublicacionById(id);

        if (!cancelled) {
          setPublicacion(response?.publicacion || null);
        }
      } catch (error) {
        console.error("Error cargando publicación:", error);
        if (!cancelled) {
          setPublicacion(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (statePublicacion) {
      setPublicacion(statePublicacion);
      setLoading(false);
    }

    fetchPublicacion();

    return () => {
      cancelled = true;
    };
  }, [id, statePublicacion]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Error al copiar enlace:", error);
    }
  };

  const whatsappRaw = contactoWhatsapp || "";

  const handleExportPDF = async () => {
    if (!publicacion) return;

    try {
      setPdfError("");
      setGeneratingPDF(true);
      const fileName = `${publicacion.tipo}_${publicacion.nombreanimal || publicacion.especie}_${Date.now()}.pdf`;
      const { generarPDFPublicacion } = await import("../components/CardPdf");

      await generarPDFPublicacion(
        {
          ...publicacion,
          whatsapp: whatsappRaw || publicacion.whatsapp,
        },
        fileName,
      );
    } catch (error) {
      console.error("Error al generar PDF:", error);
      setPdfError("No se pudo generar el PDF. Intentá de nuevo.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleContact = () => {
    withAuth(async () => {
      if (contactLoading || !publicacion?._id) return;

      setContactError("");

      if (contactoWhatsapp) {
        const whatsappDigits = String(contactoWhatsapp).replace(/\D/g, "");
        if (whatsappDigits) {
          window.open(
            `https://wa.me/549${whatsappDigits}`,
            "_blank",
            "noopener,noreferrer",
          );
        }
        return;
      }

      try {
        setContactLoading(true);
        const response = await publicacionesService.getContactoPublicacion(
          publicacion._id,
        );

        if (!response.success || !response.whatsapp) {
          setContactError(response.msg || "No se pudo obtener el contacto");
          return;
        }

        setContactoWhatsapp(response.whatsapp);
        const whatsappDigits = String(response.whatsapp).replace(/\D/g, "");
        if (whatsappDigits) {
          window.open(
            `https://wa.me/549${whatsappDigits}`,
            "_blank",
            "noopener,noreferrer",
          );
        }
      } finally {
        setContactLoading(false);
      }
    });
  };

  const meta = tipoMeta[publicacion?.tipo] || tipoMeta.PERDIDO;
  const isResuelto = ESTADOS_RESUELTOS.includes(publicacion?.estado);
  const backSearch = location.state?.backSearch || "";
  const backPath = publicacion
    ? `/publicaciones/${getPublicacionSlug(publicacion.tipo)}${backSearch}`
    : "/";
  const tamano = getPublicacionTamano(publicacion);
  const primaryLocation = publicacion?.localidad || publicacion?.lugar;
  const secondaryLocation =
    publicacion?.localidad && publicacion?.lugar ? publicacion.lugar : null;
  const imageAlt = publicacion?.nombreanimal
    ? `Foto de ${publicacion.nombreanimal}`
    : `Foto de ${publicacion?.especie?.toLowerCase() || "animal"}`;
  const imageSrc = publicacion?.img
    ? getCloudinaryUrl(publicacion.img, { width: 720, quality: "auto:eco" })
    : "";
  const imageSrcSet = publicacion?.img
    ? [
        `${getCloudinaryUrl(publicacion.img, { width: 420, quality: "auto:eco" })} 420w`,
        `${getCloudinaryUrl(publicacion.img, { width: 720, quality: "auto:eco" })} 720w`,
        `${getCloudinaryUrl(publicacion.img, { width: 960, quality: "auto:good" })} 960w`,
      ].join(", ")
    : "";
  const subtitleParts = [
    publicacion?.especie,
    publicacion?.raza,
    tamano,
  ].filter(Boolean);
  const fichaFields = [
    { label: "Raza", value: publicacion?.raza, icon: <IconDog size={14} /> },
    {
      label: "Color",
      value: publicacion?.color,
      icon: <IconPalette size={14} />,
    },
    {
      label: "Sexo",
      value: publicacion?.sexo,
      icon: <IconGenderBigender size={14} />,
    },
    {
      label: "Edad",
      value: publicacion?.edad,
      icon: <IconCalendar size={14} />,
    },
    { label: "Tamaño", value: tamano, icon: <IconRuler size={14} /> },
  ].filter((field) => field.value);
  const adoptionFields =
    publicacion?.tipo === "ADOPCION"
      ? [
          {
            label: "Convive con niños",
            value: formatBooleanish(publicacion?.afinidad),
          },
          {
            label: "Convive con otros animales",
            value: formatBooleanish(publicacion?.afinidadanimales),
          },
          { label: "Nivel de energía", value: publicacion?.energia },
          { label: "Castrado", value: formatBooleanish(publicacion?.castrado) },
        ].filter((field) => field.value)
      : [];

  if (publicacion && getPublicacionSlug(publicacion.tipo) !== tipo) {
    return (
      <Navigate
        to={`/publicaciones/${getPublicacionSlug(publicacion.tipo)}/${publicacion._id}`}
        replace
      />
    );
  }

  return (
    <div className="bg-[color:var(--nature-sand)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] text-[color:var(--shell-ink)] lg:pb-0">
      {publicacion && (
        <Seo
          title={
            publicacion.nombreanimal ||
            publicacion.especie ||
            "Detalle de publicación"
          }
          description={
            publicacion.detalles ||
            `Consulta el detalle de este caso de ${publicacion.tipo?.toLowerCase() || "publicación"} en Perdidos y Adopciones.`
          }
          path={`/publicaciones/${tipo}/${id}`}
          type="article"
          image={publicacion.img}
          structuredData={[
            buildBreadcrumbSchema([
              { name: "Inicio", path: "/" },
              { name: "Listado", path: backPath },
              {
                name:
                  publicacion.nombreanimal || publicacion.especie || "Detalle",
                path: `/publicaciones/${tipo}/${id}`,
              },
            ]),
            buildAnimalPostingSchema(publicacion),
          ]}
        />
      )}
      <Navbar />

      <div className="relative min-h-screen overflow-x-hidden px-0 pb-[calc(9.5rem+env(safe-area-inset-bottom))] pt-26 sm:px-6 sm:pb-16 sm:pt-30 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute left-[-7rem] top-40 h-72 w-72 rounded-full bg-[color:var(--shell-danger-soft)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-7rem] top-64 h-72 w-72 rounded-full bg-[color:var(--shell-accent)] opacity-30 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[88rem]">
          {loading ? (
            <LoadingState label="Cargando la publicación..." />
          ) : !publicacion ? (
            <div className="mx-auto max-w-3xl rounded-[0.95rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] p-8 text-center shadow-sm">
              <h1 className="text-2xl font-semibold text-[color:var(--shell-ink)]">
                No encontramos esta publicación
              </h1>
              <Link
                to="/"
                className="mt-5 inline-flex rounded-[0.6rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-5 py-2 text-sm font-semibold text-[color:var(--shell-ink)] transition-colors hover:bg-[color:var(--shell-danger-soft)]"
              >
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-0">
              <nav
                aria-label="breadcrumb"
                className="mb-5 flex flex-wrap items-center gap-1.5 text-[0.8rem]"
              >
                <Link
                  to="/"
                  className="text-[#999] transition-colors hover:text-[#444]"
                >
                  Inicio
                </Link>
                <IconChevronRight size={12} className="text-[#ccc]" />
                <Link
                  to={backPath}
                  className="font-semibold transition-opacity hover:opacity-80"
                  style={{ color: meta.accent }}
                >
                  {tipoBreadcrumbLabel[publicacion.tipo] ||
                    tipoBreadcrumbLabel.PERDIDO}
                </Link>
                <IconChevronRight size={12} className="text-[#ccc]" />
                <span className="max-w-[12rem] truncate text-[#444]">
                  {publicacion.nombreanimal || publicacion.especie}
                </span>
              </nav>

              <article className="overflow-hidden rounded-[1.1rem] border border-[#e8e8e8] bg-white shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
                  <section className="border-b border-[#eee] bg-[#f5f3f0] p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
                    <figure className="relative overflow-hidden rounded-[0.9rem] bg-[#e8e4de]">
                      {publicacion.img ? (
                        <>
                          <img
                            src={getCloudinaryUrl(publicacion.img, {
                              width: 80,
                              quality: 20,
                            })}
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-60"
                          />
                          <img
                            src={imageSrc}
                            srcSet={imageSrcSet}
                            sizes="(max-width: 640px) calc(100vw - 3.5rem), (max-width: 1024px) 42rem, 34rem"
                            alt={imageAlt}
                            className="relative z-10 block aspect-[4/3] h-auto w-full object-contain"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            width="720"
                            height="540"
                          />
                        </>
                      ) : (
                        <div className="flex aspect-[4/3] w-full items-center justify-center text-sm font-semibold text-[#999]">
                          Sin imagen
                        </div>
                      )}
                    </figure>
                  </section>

                  <section className="flex flex-col gap-4 p-5 sm:p-6 lg:p-7">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className="flex items-center gap-1.5 rounded-[0.45rem] px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-wide text-white"
                            style={{ backgroundColor: meta.accent }}
                          >
                            <IconSearch size={13} />
                            {tipoBadgeLabel[publicacion.tipo] ||
                              tipoBadgeLabel.PERDIDO}
                          </span>

                          
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-right text-[0.7rem] text-[#aaa]">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee] bg-[#fafafa]">
                            <IconDog size={18} style={{ color: meta.accent }} />
                          </div>
                          <p className="max-w-[6rem] leading-snug">
                            Tu ayuda puede hacer la diferencia
                          </p>
                        </div>
                      </div>

                      <h1 className="mt-3 break-words text-[clamp(2rem,10vw,3.25rem)] font-extrabold leading-[0.92] text-[#111]">
                        {publicacion.nombreanimal || publicacion.especie}
                      </h1>

                      {subtitleParts.length > 0 && (
                        <p className="mt-2 text-[0.9rem] font-semibold text-[#666]">
                          {subtitleParts.join(" · ")}
                        </p>
                      )}

                      {publicacion.fecha && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <IconCalendar
                            size={15}
                            style={{ color: meta.accent }}
                          />
                          <p className="text-[0.85rem] text-[#666]">
                            {tipoDateLabel[publicacion.tipo] ||
                              tipoDateLabel.PERDIDO}
                            :{" "}
                            <span
                              className="font-bold"
                              style={{ color: meta.accent }}
                            >
                              {formatFecha(publicacion.fecha)}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={handleContact}
                        disabled={contactLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-[0.7rem] py-3 text-[0.95rem] font-bold text-white transition-opacity hover:opacity-95 disabled:cursor-wait disabled:opacity-60"
                        style={{ backgroundColor: meta.accent }}
                      >
                        <IconBrandWhatsapp size={20} />
                        {contactLoading
                          ? "Obteniendo contacto..."
                          : "Contactar por WhatsApp"}
                      </button>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={handleShare}
                          className={`flex items-center justify-center gap-1.5 rounded-[0.7rem] border py-2.5 text-[0.8rem] font-semibold transition-colors ${
                            copied
                              ? "text-white"
                              : "border-[#ddd] bg-white text-[#333] hover:bg-[#f7f7f7]"
                          }`}
                          style={
                            copied
                              ? {
                                  backgroundColor: meta.accent,
                                  borderColor: meta.accent,
                                }
                              : undefined
                          }
                        >
                          <IconShare size={16} />
                          {copied ? "Enlace copiado" : "Compartir publicación"}
                        </button>

                        <button
                          type="button"
                          onClick={handleExportPDF}
                          disabled={generatingPDF}
                          className="flex items-center justify-center gap-1.5 rounded-[0.7rem] border border-[#ddd] bg-white py-2.5 text-[0.8rem] font-semibold text-[#333] transition-colors hover:bg-[#f7f7f7] disabled:cursor-wait disabled:opacity-60"
                        >
                          <IconDownload size={16} />
                          {generatingPDF ? "Generando..." : "Descargar cartel"}
                        </button>
                      </div>

                      {pdfError && (
                        <p className="text-[0.78rem] text-red-600">
                          {pdfError}
                        </p>
                      )}
                      {contactError && (
                        <p className="text-[0.78rem] text-red-600">
                          {contactError}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-[0.8rem] border border-[#eee] bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <IconMapPin
                            size={16}
                            style={{ color: meta.accent }}
                          />
                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#aaa]">
                            {meta.locationLabel}
                          </p>
                        </div>
                        <p className="text-[0.92rem] font-bold text-[#111]">
                          {primaryLocation || "Sin ubicación informada"}
                        </p>
                        {secondaryLocation && (
                          <p className="mt-0.5 text-[0.8rem] text-[#666]">
                            {secondaryLocation}
                          </p>
                        )}
                        <div className="mt-3 flex h-[5.5rem] items-center justify-center overflow-hidden rounded-[0.55rem] bg-[#f0f0f0]">
                          <IconMapPin size={28} color="#ccc" />
                        </div>
                      </div>

                      <div className="rounded-[0.8rem] border border-[#eee] bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <IconPaw size={16} style={{ color: meta.accent }} />
                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#aaa]">
                            FICHA DEL ANIMAL
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {fichaFields.map((field) => (
                            <div
                              key={field.label}
                              className="grid grid-cols-2 items-center gap-2"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-[#bbb]">
                                  {field.icon}
                                </span>
                                <span className="text-[0.78rem] text-[#888]">
                                  {field.label}
                                </span>
                              </div>
                              <span className="text-[0.82rem] font-semibold text-[#222]">
                                {field.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {publicacion.detalles && (
                      <div className="rounded-[0.8rem] border border-[#eee] bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-[#bbb]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="h-4 w-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 3.5h6l4 4V20a1 1 0 0 1-1 1H8a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 3.5V8h4"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h6M9 16h6"
                              />
                            </svg>
                          </span>
                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#aaa]">
                            DETALLES
                          </p>
                        </div>
                        <p className="break-words text-[0.9rem] leading-relaxed text-[#333]">
                          {publicacion.detalles}
                        </p>
                      </div>
                    )}

                    {adoptionFields.length > 0 && (
                      <div className="rounded-[0.8rem] border border-[#eee] bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <IconPaw size={16} style={{ color: meta.accent }} />
                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#aaa]">
                            PERFIL DE ADOPCIÓN
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {adoptionFields.map((field) => (
                            <div
                              key={field.label}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="text-[0.78rem] text-[#888]">
                                {field.label}
                              </span>
                              <span className="text-[0.82rem] font-semibold text-[#222]">
                                {field.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                </div>

                <div className="flex flex-col justify-between gap-3 border-t border-[#f0f0f0] px-5 py-4 sm:flex-row">
                  <div className="flex max-w-[28rem] items-start gap-2">
                    <IconShieldCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-[#bbb]"
                    />
                    <p className="text-[0.75rem] leading-snug text-[#999]">
                      Consejo de seguridad: No intentes perseguirla. Si la ves,
                      mantenela a la vista y contacta al número de WhatsApp.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
