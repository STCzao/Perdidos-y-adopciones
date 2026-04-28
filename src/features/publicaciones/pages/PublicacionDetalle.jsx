import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import Seo from "../../../components/seo/Seo";
import { publicacionesService } from "../../../services/publicaciones";
import { formatFecha } from "../../../utils/dateHelpers";
import { getTipoColorMeta } from "../../../utils/publicacionColors";
import { getPublicacionSlug } from "../utils/publicacionPaths";
import { formatBooleanish, getPublicacionTamano } from "../utils/publicacionFields";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { buildAnimalPostingSchema, buildBreadcrumbSchema } from "../../../components/seo/seoUtils";
import { getCloudinaryUrl } from "../../../utils/cloudinaryUtils";
import LoadingState from "../../../components/ui/LoadingState";

const tipoMeta = {
  PERDIDO: {
    accent: getTipoColorMeta("PERDIDO").accent,
    badge: "PERDIDO",
    locationLabel: "Se extravió en",
    section: "Sector: perdido",
    family: "Búsqueda activa",
  },
  ENCONTRADO: {
    accent: getTipoColorMeta("ENCONTRADO").accent,
    badge: "ENCONTRADO",
    locationLabel: "Se encontró en",
    section: "Sector: encontrado",
    family: "Resguardo activo",
  },
  ADOPCION: {
    accent: getTipoColorMeta("ADOPCION").accent,
    badge: "ADOPCIÓN",
    locationLabel: "Zona de referencia",
    section: "Sector: adopción",
    family: "Nuevo hogar",
  },
};

const panelClass =
  "rounded-[0.9rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] p-3.5 shadow-sm";
const itemClass =
  "min-w-0 rounded-[0.72rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-3.5 py-3 shadow-sm";

const Field = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className={itemClass}>
      <p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[color:var(--shell-muted)]">
        {label}
      </p>
      <p className="mt-1 break-words text-[0.85rem] font-semibold leading-snug text-[color:var(--shell-ink)]">
        {value}
      </p>
    </div>
  );
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
  const navigate = useNavigate();
  const withAuth = useRequireAuth();
  const statePublicacion = getLocationStatePublicacion(location, id);
  const [publicacion, setPublicacion] = useState(statePublicacion);
  const [contactoWhatsapp, setContactoWhatsapp] = useState("");
  const [loading, setLoading] = useState(!statePublicacion);
  const [copied, setCopied] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");

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

  const handleExportPDF = async () => {
    if (!publicacion) return;

    try {
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
      alert("No se pudo generar el PDF.");
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
          window.open(`https://wa.me/549${whatsappDigits}`, "_blank", "noopener,noreferrer");
        }
        return;
      }

      try {
        setContactLoading(true);
        const response = await publicacionesService.getContactoPublicacion(publicacion._id);

        if (!response.success || !response.whatsapp) {
          setContactError(response.msg || "No se pudo obtener el contacto");
          return;
        }

        setContactoWhatsapp(response.whatsapp);
        const whatsappDigits = String(response.whatsapp).replace(/\D/g, "");
        if (whatsappDigits) {
          window.open(`https://wa.me/549${whatsappDigits}`, "_blank", "noopener,noreferrer");
        }
      } finally {
        setContactLoading(false);
      }
    });
  };

  const meta = tipoMeta[publicacion?.tipo] || tipoMeta.PERDIDO;
  const backPath = publicacion ? `/publicaciones/${getPublicacionSlug(publicacion.tipo)}` : "/";

  const handleBackToList = () => {
    navigate(backPath);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  };

  const tamano = getPublicacionTamano(publicacion);
  const whatsappRaw = contactoWhatsapp || "";
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

  const identityFields = [
    { label: "Raza", value: publicacion?.raza },
    { label: "Color", value: publicacion?.color },
    { label: "Sexo", value: publicacion?.sexo },
    { label: "Edad", value: publicacion?.edad },
    { label: "Tamaño", value: tamano },
    { label: "Castrado", value: formatBooleanish(publicacion?.castrado) },
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
    <div className="bg-[color:var(--nature-sand)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] text-[color:var(--shell-ink)] md:pb-0">
      {publicacion && (
        <Seo
          title={publicacion.nombreanimal || publicacion.especie || "Detalle de publicación"}
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
                name: publicacion.nombreanimal || publicacion.especie || "Detalle",
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
              <div className="mb-4 flex min-w-0">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="inline-flex min-h-11 items-center gap-2 rounded-[0.72rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--shell-ink)] shadow-sm transition-colors hover:bg-[color:var(--shell-surface-alt)]"
                >
                  <span aria-hidden="true">&larr;</span>
                  Volver al listado
                </button>
              </div>

              <article className="w-full min-w-0 overflow-hidden rounded-[1rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,var(--shell-surface),var(--nature-paper))] shadow-xl">
                <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
                  <section className="min-w-0 border-b border-[color:var(--shell-line)] bg-[color:var(--shell-surface-soft)] p-3.5 sm:p-5 lg:border-b-0 lg:border-r">
                    <div className="min-w-0 space-y-3">
                      <figure className="relative min-w-0 overflow-hidden rounded-[0.9rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface-alt)] shadow-sm">
                        <div className="absolute left-2.5 right-2.5 top-2.5 z-10 flex min-w-0 flex-wrap items-start gap-2">
                          <span
                            className="max-w-full rounded-[0.48rem] px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[color:var(--shell-surface)] shadow-sm"
                            style={{ backgroundColor: meta.accent }}
                          >
                            {publicacion.estado || meta.badge}
                          </span>

                          <span className="ml-auto max-w-full rounded-[0.48rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[color:var(--shell-muted)] shadow-sm">
                            {meta.family}
                          </span>
                        </div>

                        {publicacion.img ? (
                          <img
                            src={imageSrc}
                            srcSet={imageSrcSet}
                            sizes="(max-width: 640px) calc(100vw - 3.5rem), (max-width: 1024px) 42rem, 34rem"
                            alt={imageAlt}
                            className="block aspect-[4/3] h-auto w-full object-cover"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            width="720"
                            height="540"
                          />
                        ) : (
                          <div className="flex aspect-[4/3] w-full items-center justify-center text-sm font-semibold text-[color:var(--shell-muted)]">
                            Sin imagen
                          </div>
                        )}
                      </figure>

                      <div className={panelClass}>
                        <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[color:var(--shell-muted)]">
                          Acciones
                        </h2>
                        <div className="mt-2.5 grid min-w-0 gap-2">
                          <button
                            type="button"
                            onClick={handleShare}
                            className={`min-h-11 rounded-[0.72rem] border px-4 py-2.5 text-sm font-semibold transition-colors ${
                              copied
                                ? "border-[color:var(--shell-danger)] bg-[color:var(--shell-danger)] text-[color:var(--shell-surface)]"
                                : "border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] text-[color:var(--shell-ink)] hover:bg-[color:var(--shell-danger-soft)]"
                            }`}
                          >
                            {copied ? "Enlace copiado" : "Compartir publicación"}
                          </button>

                          <button
                            type="button"
                            onClick={handleContact}
                            disabled={contactLoading}
                            className="min-h-11 rounded-[0.72rem] border px-4 py-2.5 text-center text-sm font-semibold text-[color:var(--shell-surface)] transition-opacity hover:opacity-92 disabled:cursor-wait disabled:opacity-60"
                            style={{
                              backgroundColor: meta.accent,
                              borderColor: meta.accent,
                            }}
                          >
                            {contactLoading ? "Obteniendo contacto..." : "Contactar por WhatsApp"}
                          </button>

                          <button
                            type="button"
                            onClick={handleExportPDF}
                            disabled={generatingPDF}
                            className="min-h-11 rounded-[0.72rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-4 py-2.5 text-sm font-semibold text-[color:var(--shell-ink)] transition-colors hover:bg-[color:var(--shell-surface-alt)] disabled:cursor-wait disabled:opacity-60"
                          >
                            {generatingPDF ? "Generando PDF..." : "Descargar cartel en PDF"}
                          </button>
                        </div>
                      </div>

                      {contactError && (
                        <p className="text-[0.78rem] font-medium text-[color:var(--shell-danger)]">
                          {contactError}
                        </p>
                      )}
                    </div>
                  </section>

                  <section className="min-w-0 p-4 sm:p-5 lg:p-6">
                    <div className="flex min-w-0 flex-col gap-3">
                      <div className="min-w-0">
                        <span className="inline-flex max-w-full rounded-[0.48rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[color:var(--shell-muted)]">
                          {meta.section}
                        </span>
                        <h1 className="mt-3 break-words text-[clamp(2rem,10vw,3.25rem)] font-extrabold leading-[0.95] text-[color:var(--shell-ink)]">
                          {publicacion.nombreanimal || publicacion.especie}
                        </h1>
                        <div className="mt-2 flex min-w-0 flex-wrap gap-x-2 gap-y-1 text-[0.86rem] font-semibold uppercase tracking-[0.03em] text-[color:var(--shell-muted)]">
                          {publicacion.especie && <span>{publicacion.especie}</span>}
                          {publicacion.raza && (
                            <span>
                              {publicacion.especie ? "/ " : ""}
                              {publicacion.raza}
                            </span>
                          )}
                          {tamano && (
                            <span>
                              {publicacion.especie || publicacion.raza ? "/ " : ""}
                              {tamano}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={`${panelClass} grid min-w-0 gap-2.5 sm:grid-cols-2`}>
                        <div className={itemClass}>
                          <p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[color:var(--shell-muted)]">
                            {meta.locationLabel}
                          </p>
                          <p className="mt-1 break-words text-[0.95rem] font-semibold leading-snug text-[color:var(--shell-ink)]">
                            {primaryLocation || "Sin ubicación informada"}
                          </p>
                          {secondaryLocation && (
                            <p className="mt-1 break-words text-[0.8rem] leading-snug text-[color:var(--shell-muted)]">
                              {secondaryLocation}
                            </p>
                          )}
                        </div>

                        {publicacion.fecha && (
                          <div className={itemClass}>
                            <p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[color:var(--shell-muted)]">
                              Fecha
                            </p>
                            <p className="mt-1 break-words text-[0.95rem] font-semibold leading-snug text-[color:var(--shell-ink)]">
                              {formatFecha(publicacion.fecha)}
                            </p>
                          </div>
                        )}
                      </div>

                      {identityFields.length > 0 && (
                        <div className={panelClass}>
                          <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[color:var(--shell-muted)]">
                            Ficha del animal
                          </h2>
                          <div className="mt-2.5 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {identityFields.map((field) => (
                              <Field key={field.label} label={field.label} value={field.value} />
                            ))}
                          </div>
                        </div>
                      )}

                      {adoptionFields.length > 0 && (
                        <div className={panelClass}>
                          <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[color:var(--shell-muted)]">
                            Perfil de adopción
                          </h2>
                          <div className="mt-2.5 grid min-w-0 gap-2 sm:grid-cols-2">
                            {adoptionFields.map((field) => (
                              <Field key={field.label} label={field.label} value={field.value} />
                            ))}
                          </div>
                        </div>
                      )}

                      {publicacion.detalles && (
                        <div className={panelClass}>
                          <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[color:var(--shell-muted)]">
                            Detalles
                          </h2>
                          <p className="mt-2 break-words text-[0.95rem] leading-relaxed text-[color:var(--shell-ink)]">
                            {publicacion.detalles}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
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
