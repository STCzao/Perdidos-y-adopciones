import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatFecha } from "../../utils/dateHelpers.js";
import { getPublicacionDetailPath } from "../../features/publicaciones/utils/publicacionPaths";
import { getTipoColorMeta } from "../../utils/publicacionColors.js";

const cardMeta = {
  ADOPCION: {
    label: "Cuidado",
    locationLabel: "Zona de referencia",
  },
  PERDIDO: {
    label: "Busqueda activa",
    locationLabel: "Se extravio en",
  },
  ENCONTRADO: {
    label: "Resguardo activo",
    locationLabel: "Se encontro en",
  },
};

const formatBooleanish = (value) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "boolean") return value ? "Si" : "No";

  const normalized = String(value).trim().toLowerCase();
  if (["si", "sí", "yes", "true", "apto", "compatible"].includes(normalized)) return "Si";
  if (["no", "false", "no apto", "no compatible"].includes(normalized)) return "No";

  return String(value).trim();
};

const CardGenerica = ({ publicacion, cardId, isSuccessful = false }) => {
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
    whatsapp,
    img,
    estado,
  } = publicacion;

  const tamano =
    publicacion["tamaño"] ||
    publicacion["tamaÃ±o"] ||
    publicacion["tamaÃƒÂ±o"] ||
    publicacion["tamaÃƒÆ’Ã‚Â±o"] ||
    publicacion["tamaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±o"] ||
    publicacion["tamaÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±o"];
  const meta = {
    ...getTipoColorMeta(tipo),
    ...(cardMeta[tipo] || cardMeta.PERDIDO),
  };
  const detailPath = getPublicacionDetailPath(publicacion);
  const whatsappLink = whatsapp
    ? `https://wa.me/549${String(whatsapp).replace(/\D/g, "")}`
    : null;
  const primaryLocation = localidad || lugar;
  const locationSummary =
    localidad && lugar ? `${localidad} / ${lugar}` : primaryLocation;
  const isAdoption = tipo === "ADOPCION";
  const adoptionFields = [
    { label: "Sexo", value: sexo },
    { label: "Color", value: color },
    { label: "Convivencia con ninos", value: formatBooleanish(afinidad) },
    {
      label: "Convivencia con animales",
      value: formatBooleanish(afinidadanimales),
    },
    { label: "Nivel de energia", value: energia },
    { label: "Castrado", value: formatBooleanish(castrado) },
  ]
    .filter((field) => field.value)
    .slice(0, 4);

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
              src={img}
              alt="background"
              className="absolute inset-0 h-full w-full scale-105 object-cover blur-lg opacity-35"
              loading="lazy"
            />
            <LazyLoadImage
              src={img}
              alt={nombreanimal || especie || "Imagen de publicacion"}
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
              Perfil de adopcion
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
              {locationSummary || "Sin ubicacion informada"}
            </p>
          </div>
        )}

        <div className="mt-auto pt-2">
          <div
            className={`grid gap-2 ${
              whatsappLink && !isSuccessful ? "grid-cols-[1.1fr_0.9fr]" : "grid-cols-1"
            }`}
          >
            <Link
              to={detailPath}
              state={{ publicacion }}
              className="rounded-[0.6rem] border border-[#2f241d]/10 bg-white px-3 py-2.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#241914] transition-colors hover:bg-[#efe2d0]"
            >
              Ver detalle
            </Link>

            {!isSuccessful && whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[0.6rem] px-3 py-2.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-92"
                style={{ backgroundColor: meta.accent }}
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardGenerica;
