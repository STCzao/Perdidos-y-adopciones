import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatFecha } from "../../../utils/dateHelpers.js";
import { getTipoColorMeta } from "../../../utils/publicacionColors.js";

const cardMeta = {
  ADOPCION: {
    label: "Cuidado",
  },
  PERDIDO: {
    label: "Busqueda activa",
  },
  ENCONTRADO: {
    label: "Resguardo activo",
  },
};

const CardExitosa = ({ publicacion, cardId }) => {
  const { nombreanimal, especie, tipo, fecha, img, estado } = publicacion;

  const meta = {
    ...getTipoColorMeta(tipo),
    ...(cardMeta[tipo] || cardMeta.PERDIDO),
  };

  return (
    <article
      id={cardId}
      className="group flex w-full max-w-[21rem] flex-col overflow-hidden rounded-[0.95rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.92))] shadow-[0_22px_48px_rgba(36,25,20,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:w-[21rem] sm:rounded-[1rem]"
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

      <div className="flex flex-col px-3.5 pb-3.5">
        <div className="flex items-start justify-between gap-2 border-b border-[#2f241d]/8 pb-1.5">
          <div className="min-w-0">
            <p className="text-[0.56rem] font-bold uppercase tracking-[0.22em] text-[#7b6557]">
              {tipo}
            </p>
            <h3
              className="font-editorial mt-1 line-clamp-3 text-[1.38rem] leading-[0.94]"
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
      </div>
    </article>
  );
};

export default CardExitosa;
