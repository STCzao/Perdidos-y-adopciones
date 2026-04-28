import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
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
  "rounded-[0.8rem] border border-[#2f241d]/10 bg-[#fffaf4]/94 p-3.5 shadow-[0_12px_28px_rgba(36,25,20,0.05)]";
const itemClass =
  "rounded-[0.68rem] border border-[#2f241d]/10 bg-white/88 px-3.5 py-3 shadow-sm";

const Field = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className={itemClass}>
      <p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[#7b6557]">
        {label}
      </p>
      <p className="mt-1 text-[0.85rem] font-semibold leading-snug text-[#241914]">
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
  const tamano = getPublicacionTamano(publicacion);
  const whatsappRaw = contactoWhatsapp || "";
  const primaryLocation = publicacion?.localidad || publicacion?.lugar;
  const secondaryLocation =
    publicacion?.localidad && publicacion?.lugar ? publicacion.lugar : null;

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
    <div className="bg-[#f6efe4] pb-24 text-[#241914] md:pb-0">
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

      <div className="relative min-h-screen overflow-hidden px-4 pb-16 pt-26 sm:px-6 sm:pt-30 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute left-[-7rem] top-40 h-72 w-72 rounded-full bg-[#D62828]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[-7rem] top-64 h-72 w-72 rounded-full bg-[#2165FF]/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[88rem]">
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#D62828]" />
            </div>
          ) : !publicacion ? (
            <div className="mx-auto max-w-3xl rounded-[0.95rem] border border-[#2f241d]/10 bg-white/80 p-8 text-center shadow-sm">
              <h1 className="text-2xl font-semibold text-[#241914]">
                No encontramos esta publicación
              </h1>
              <Link
                to="/"
                className="mt-5 inline-flex rounded-[0.6rem] border border-[#D62828]/35 bg-white px-5 py-2 text-sm font-semibold text-[#241914] transition-colors hover:bg-[#D62828]/10"
              >
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="mx-auto max-w-[76rem] space-y-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to={backPath}
                  className="inline-flex items-center gap-2 rounded-[0.6rem] border border-[#2f241d]/10 bg-white/85 px-4 py-2 text-sm font-semibold text-[#241914] shadow-sm transition-colors hover:bg-white"
                >
                  <span aria-hidden="true">←</span>
                  Volver al listado
                </Link>
              </div>

              <section className="overflow-hidden rounded-[0.9rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.94),rgba(255,255,255,0.9))] shadow-[0_22px_50px_rgba(36,25,20,0.08)] sm:rounded-[1rem]">
                <div className="grid gap-0 xl:grid-cols-[minmax(19rem,24rem)_minmax(0,1fr)]">
                  <aside className="border-b border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(239,226,208,0.48),rgba(239,226,208,0.16))] p-4 sm:p-5 lg:p-6 xl:border-b-0 xl:border-r">
                    <div className="flex h-full flex-col gap-3">
                      <div className="relative overflow-hidden rounded-[0.82rem] border border-[#2f241d]/10 bg-[#ddd1bc] shadow-[0_18px_36px_rgba(36,25,20,0.08)]">
                        <div className="absolute left-3 right-3 top-3 z-20 flex items-start justify-between gap-2">
                          <span
                            className="rounded-[0.42rem] px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white shadow-sm"
                            style={{ backgroundColor: meta.accent }}
                          >
                            {publicacion.estado || meta.badge}
                          </span>

                          <span className="rounded-[0.42rem] border border-white/45 bg-white/82 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#6f5546] shadow-sm backdrop-blur-sm">
                            {meta.family}
                          </span>
                        </div>

                        {publicacion.img ? (
                          <div className="grid aspect-[4/3] min-h-[17rem] place-items-center overflow-hidden bg-[#e6dac6] sm:min-h-[20rem] xl:min-h-[23rem]">
                            <LazyLoadImage
                              src={getCloudinaryUrl(publicacion.img, { width: 900 })}
                              alt={publicacion.nombreanimal || publicacion.especie}
                              className="block h-full w-full object-contain p-3 sm:p-4"
                              loading="eager"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-[4/3] min-h-[17rem] items-center justify-center text-sm font-medium text-[#6f5546] sm:min-h-[20rem] xl:min-h-[23rem]">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      <div className={panelClass}>
                        <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#7b6557]">
                          Acciones
                        </h2>
                        <div className="mt-2.5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                          <button
                            type="button"
                            onClick={handleShare}
                            className={`rounded-[0.6rem] border px-4 py-2.5 text-[0.76rem] font-semibold transition-colors ${
                              copied
                                ? "border-[#D62828] bg-[#D62828] text-white"
                                : "border-[#D62828]/35 bg-white text-[#241914] hover:bg-[#D62828]/10"
                            }`}
                          >
                            {copied ? "Enlace copiado" : "Compartir publicación"}
                          </button>

                          <button
                            type="button"
                            onClick={handleContact}
                            disabled={contactLoading}
                            className="rounded-[0.6rem] border px-4 py-2.5 text-center text-[0.76rem] font-semibold text-white transition-opacity hover:opacity-92 disabled:cursor-wait disabled:opacity-60"
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
                            className="rounded-[0.6rem] border border-[#D62828]/35 bg-white px-4 py-2.5 text-[0.76rem] font-semibold text-[#241914] transition-colors hover:bg-[#efe2d0] disabled:cursor-wait disabled:opacity-60"
                          >
                            {generatingPDF ? "Generando PDF..." : "Descargar cartel en PDF"}
                          </button>
                        </div>
                      </div>

                      {contactError && (
                        <p className="text-[0.78rem] font-medium text-[#a44939]">{contactError}</p>
                      )}
                    </div>
                  </aside>

                  <div className="p-4 sm:p-5 lg:p-6">
                    <div className="flex h-full flex-col gap-3">
                      <div>
                        <span className="inline-flex rounded-[0.42rem] border border-[#2f241d]/10 bg-white/76 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[#6f5546]">
                          {meta.section}
                        </span>
                        <h1 className="font-extrabold mt-3 text-[1.8rem] leading-[0.95] text-[#241914] sm:text-[2.15rem]">
                          {publicacion.nombreanimal || publicacion.especie}
                        </h1>
                        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[0.8rem] font-medium text-[#5e463d]">
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

                      <div className={`${panelClass} grid gap-2.5 sm:grid-cols-2`}>
                        <div className={itemClass}>
                          <p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[#7b6557]">
                            {meta.locationLabel}
                          </p>
                          <p className="mt-1 text-[0.9rem] font-semibold leading-snug text-[#241914]">
                            {primaryLocation || "Sin ubicación informada"}
                          </p>
                          {secondaryLocation && (
                            <p className="mt-1 text-[0.78rem] leading-snug text-[#5e463d]">
                              {secondaryLocation}
                            </p>
                          )}
                        </div>

                        {publicacion.fecha && (
                          <div className={itemClass}>
                            <p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[#7b6557]">
                              Fecha
                            </p>
                            <p className="mt-1 text-[0.9rem] font-semibold leading-snug text-[#241914]">
                              {formatFecha(publicacion.fecha)}
                            </p>
                          </div>
                        )}
                      </div>

                      {identityFields.length > 0 && (
                        <div className={panelClass}>
                          <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#7b6557]">
                            Ficha del animal
                          </h2>
                          <div className="mt-2.5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {identityFields.map((field) => (
                              <Field key={field.label} label={field.label} value={field.value} />
                            ))}
                          </div>
                        </div>
                      )}

                      {adoptionFields.length > 0 && (
                        <div className={panelClass}>
                          <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#7b6557]">
                            Perfil de adopción
                          </h2>
                          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                            {adoptionFields.map((field) => (
                              <Field key={field.label} label={field.label} value={field.value} />
                            ))}
                          </div>
                        </div>
                      )}

                      {publicacion.detalles && (
                        <div className={panelClass}>
                          <h2 className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#7b6557]">
                            Detalles
                          </h2>
                          <p className="mt-2 text-[0.9rem] leading-relaxed text-[#241914]">
                            {publicacion.detalles}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
