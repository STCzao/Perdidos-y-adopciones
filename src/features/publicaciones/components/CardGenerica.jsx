import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatFecha } from "../../../utils/dateHelpers.js";
import { getTipoColorMeta } from "../../../utils/publicacionColors.js";
import { getPublicacionDetailPath } from "../utils/publicacionPaths";
import { formatBooleanish, getPublicacionTamano } from "../utils/publicacionFields";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { publicacionesService } from "../../../services/publicaciones";
import { getCloudinaryUrl } from "../../../utils/cloudinaryUtils";

const cardMeta = {
  ADOPCION: {
    label: "Cuidado",
    locationLabel: "Zona de referencia",
  },
  PERDIDO: {
    label: "Búsqueda activa",
    locationLabel: "Se extravió en",
  },
  ENCONTRADO: {
    label: "Resguardo activo",
    locationLabel: "Se encontró en",
  },
};

const CardGenerica = ({ publicacion, cardId, isSuccessful = false }) => {
  const withAuth = useRequireAuth();
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");
  const {
    nombreanimal,
    especie,
    tipo,
    raza,
    localidad,
    lugar,
    fecha,
    edad,
    sexo,
    color,
    afinidad,
    afinidadanimales,
    energia,
    castrado,
    img,
    estado,
  } = publicacion;

  const tamano = getPublicacionTamano(publicacion);
  const meta = {
    ...getTipoColorMeta(tipo),
    ...(cardMeta[tipo] || cardMeta.PERDIDO),
  };
  const detailPath = getPublicacionDetailPath(publicacion);
  const primaryLocation = localidad || lugar;
  const locationSummary =
    localidad && lugar ? `${localidad} / ${lugar}` : primaryLocation;
  const isAdoption = tipo === "ADOPCION";
  const adoptionFields = [
    { label: "Sexo", value: sexo },
    { label: "Color", value: color },
    { label: "Convivencia con niños", value: formatBooleanish(afinidad) },
    {
      label: "Convivencia con animales",
      value: formatBooleanish(afinidadanimales),
    },
    { label: "Nivel de energía", value: energia },
    { label: "Castrado", value: formatBooleanish(castrado) },
  ]
    .filter((field) => field.value)
    .slice(0, 4);

  const handleWhatsappClick = () => {
    withAuth(async () => {
      if (contactLoading || !publicacion?._id) return;

      setContactError("");
      setContactLoading(true);

      try {
        const response = await publicacionesService.getContactoPublicacion(publicacion._id);

        if (!response.success || !response.whatsapp) {
          setContactError(response.msg || "No hay contacto disponible");
          return;
        }

        const digits = String(response.whatsapp).replace(/\D/g, "");
        if (digits) {
          window.open(`https://wa.me/549${digits}`, "_blank", "noopener,noreferrer");
        }
      } finally {
        setContactLoading(false);
      }
    });
  };

  return (
    <article
      id={cardId}
      className="group flex h-[30.6rem] w-full max-w-[21rem] flex-col overflow-hidden rounded-[0.95rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.92))] shadow-[0_22px_48px_rgba(36,25,20,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:rounded-[1rem]"
    >
      <div className="relative p-2.5">
        {img ? (
          <div className="relative h-[13.1rem] overflow-hidden rounded-[0.42rem] bg-[#e6dac6]">
            <div className="absolute left-3 top-3 z-20">
              <span
                className="rounded-[0.4rem] px-2.5 py-1 text-[0.54rem] font-bold uppercase tracking-[0.14em] text-white shadow-sm"
                style={{ backgroundColor: meta.accent }}
              >
                {estado}
              </span>
            </div>
            <div className="absolute right-3 top-3 z-20">
              <span className="rounded-[0.4rem] border border-white/45 bg-white/80 px-2.5 py-1 text-[0.53rem] font-bold uppercase tracking-[0.14em] text-[#5f4c41] backdrop-blur-sm">
                {meta.label}
              </span>
            </div>
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background: `linear-gradient(180deg, rgba(36,25,20,0.04), rgba(36,25,20,0.18)), radial-gradient(circle at top, ${meta.accentSoft}55, transparent 58%)`,
              }}
            />
            <LazyLoadImage
              src={getCloudinaryUrl(img, { width: 40, quality: 10 })}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-105 object-cover blur-lg opacity-35"
              loading="lazy"
            />
            <LazyLoadImage
              src={getCloudinaryUrl(img, { width: 420 })}
              alt={nombreanimal || especie || "Imagen de publicación"}
              className="relative z-10 block h-full w-full scale-[1.08] object-contain px-1.5 py-1.5"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex h-[13.1rem] items-center justify-center rounded-[0.42rem] bg-[#e6dac6] text-sm font-medium text-[#6f5546]">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3.5 pb-3.5">
        <div className="flex items-start justify-between gap-2 border-b border-[#2f241d]/8 pb-1.5">
          <div className="min-w-0">
            <p className="text-[0.56rem] font-bold uppercase tracking-[0.22em] text-[#7b6557]">
              {tipo}
            </p>
            <h3
              className="font-editorial mt-1 line-clamp-2 text-[1.38rem] leading-[0.94]"
              style={{ color: meta.accent }}
            >
              {nombreanimal || especie}
            </h3>
          </div>

          {fecha && (
            <p className="shrink-0 pt-0.5 text-right text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#8a7365]">
              {formatFecha(fecha)}
            </p>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[0.74rem] font-medium text-[#5f4c41]">
          {raza && <span>{raza}</span>}
          {edad && <span>{raza ? "/ " : ""}{edad}</span>}
          {tamano && <span>{raza || edad ? "/ " : ""}{tamano}</span>}
          {!raza && !edad && !tamano && especie && <span>{especie}</span>}
        </div>

        {isAdoption ? (
          <div className="mt-2 rounded-[0.7rem] border border-[#2f241d]/8 bg-white/70 px-3 py-2.5">
            <p className="text-[0.56rem] font-bold uppercase tracking-[0.2em] text-[#7b6557]">
              Perfil de adopción
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 text-[0.76rem] leading-snug text-[#241914]">
              {adoptionFields.map((field) => (
                <p
                  key={field.label}
                  className={`min-w-0 ${
                    field.label.startsWith("Convive con") ? "col-span-2" : ""
                  }`}
                >
                  <span className="font-semibold text-[#6a574b]">{field.label}:</span>{" "}
                  <span className="break-words">{field.value}</span>
                </p>
              ))}
              {adoptionFields.length === 0 && (
                <p className="text-[#6a574b]">Sin detalles adicionales.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-2 rounded-[0.7rem] border border-[#2f241d]/8 bg-white/70 px-3 py-2.5">
            <p className="text-[0.56rem] font-bold uppercase tracking-[0.2em] text-[#7b6557]">
              {meta.locationLabel}
            </p>
            <p className="mt-1 line-clamp-3 min-h-[3.4rem] text-[0.88rem] font-semibold leading-snug text-[#241914]">
              {locationSummary || "Sin ubicación informada"}
            </p>
          </div>
        )}

        <div className="mt-auto pt-2">
          <div
            className={`grid gap-2 ${
              !isSuccessful ? "grid-cols-[1.1fr_0.9fr]" : "grid-cols-1"
            }`}
          >
            <Link
              to={detailPath}
              state={{ publicacion }}
              className="rounded-[0.6rem] border border-[#2f241d]/10 bg-white px-3 py-2.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#241914] transition-colors hover:bg-[#efe2d0]"
            >
              Ver detalle
            </Link>

            {!isSuccessful && (
              <button
                type="button"
                onClick={handleWhatsappClick}
                disabled={contactLoading}
                className="rounded-[0.6rem] px-3 py-2.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-92 disabled:cursor-wait disabled:opacity-60"
                style={{ backgroundColor: meta.accent }}
              >
                {contactLoading ? "..." : "WhatsApp"}
              </button>
            )}
          </div>

          {contactError && (
            <p className="mt-1.5 text-center text-[0.65rem] font-medium text-[#a44939]">
              {contactError}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default memo(CardGenerica);
