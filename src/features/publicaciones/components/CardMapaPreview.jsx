import { formatFecha } from "../../../utils/dateHelpers.js";
import { getTipoColorMeta } from "../../../utils/publicacionColors.js";
import { getCloudinaryUrl } from "../../../utils/cloudinaryUtils";
import { getPublicacionTamano } from "../utils/publicacionFields";
import { tipoDateLabel, tipoHeaderLabel, tipoLocationLabel } from "../utils/publicacionLabels";

// Versión compacta de CardGenerica para mostrar sobre un pin del mapa.
// Mismo lenguaje visual (franja de color, foto, título en color de acento,
// recuadro de ubicación) pero sin acciones: el pin/la tarjeta llevan al detalle.
// `compacto`: foto más baja y sin la segunda línea de ubicación, para que el popup
// entre en el mapa de la portada en celular (~58dvh).
const CardMapaPreview = ({ publicacion, footer = null, compacto = false }) => {
  const { nombreanimal, especie, tipo, raza, sexo, localidad, lugar, fecha } = publicacion;
  const meta = getTipoColorMeta(tipo);
  const img = publicacion.imgs?.[0] || publicacion.img;
  const tamano = getPublicacionTamano(publicacion);
  const title = tipo === "ENCONTRADO" ? especie : nombreanimal || especie;
  const subtitleParts =
    tipo === "ENCONTRADO"
      ? [sexo, raza, tamano].filter(Boolean)
      : [especie, raza, tamano].filter(Boolean);
  const primaryLocation = localidad || lugar;
  const secondaryLocation = localidad && lugar ? lugar : null;

  return (
    <article className="w-[15.5rem] overflow-hidden rounded-[0.9rem] border border-black/8 bg-white text-left shadow-[0_18px_40px_rgba(20,20,20,0.22)]">
      <header
        className="px-3 py-0.5 text-center text-[0.8rem] font-extrabold uppercase tracking-wide text-white"
        style={{ backgroundColor: meta.accent }}
      >
        {tipoHeaderLabel[tipo] || tipoHeaderLabel.PERDIDO}
      </header>

      <div
        className={`relative mx-1.5 mt-1.5 ${compacto ? "h-[6.5rem]" : "h-[8.5rem]"} overflow-hidden rounded-[0.5rem] bg-[#ece8e2]`}
      >
        {img ? (
          <>
            <img
              src={getCloudinaryUrl(img, { width: 80, quality: 20 })}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-xl"
            />
            <img
              src={getCloudinaryUrl(img, { width: 320 })}
              alt={nombreanimal || especie || "Imagen de publicacion"}
              className="relative z-10 block h-full w-full object-contain"
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium text-[#999]">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 px-3 pb-3 pt-2">
        <div>
          <h3
            className="line-clamp-1 text-[1.15rem] font-extrabold leading-tight"
            style={{ color: meta.accent }}
          >
            {title}
          </h3>
          {subtitleParts.length > 0 && (
            <p className="mt-0.5 line-clamp-1 text-[0.7rem] text-[#555]">
              {subtitleParts.join(" · ")}
            </p>
          )}
        </div>

        <div className="rounded-[0.5rem] border border-[#e2e2e2] px-2.5 py-1.5">
          <p className="text-[0.5rem] uppercase tracking-[0.18em] text-[#aaa]">
            {tipoLocationLabel[tipo] || tipoLocationLabel.PERDIDO}
          </p>
          <p className="line-clamp-1 text-[0.76rem] font-bold text-[#1a1a1a]">
            {primaryLocation || "Sin ubicacion informada"}
          </p>
          {secondaryLocation && !compacto && (
            <p className="line-clamp-1 text-[0.68rem] text-[#777]">{secondaryLocation}</p>
          )}
        </div>

        {fecha && (
          <p className="text-[0.66rem] text-[#999]">
            {tipoDateLabel[tipo] || tipoDateLabel.PERDIDO}: {formatFecha(fecha)}
          </p>
        )}

        {footer}
      </div>
    </article>
  );
};

export default CardMapaPreview;
