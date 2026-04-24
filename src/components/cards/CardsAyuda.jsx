import { LazyLoadImage } from "react-lazy-load-image-component";

const CardsAyuda = ({ pub }) => {
  const { titulo, contenido, categoria, usuario, img } = pub;

  return (
    <div className="flex h-[480px] w-full max-w-[350px] flex-col gap-3 overflow-hidden rounded-lg border border-white/20 bg-white/20 p-4 text-center sm:p-5">
      <div className="flex h-full flex-col">
        <h3 className="line-clamp-2 text-[1.02rem] font-semibold leading-snug text-white">
          {titulo || "Sin titulo"}
        </h3>

        {categoria && (
          <span className="mt-2 rounded-full bg-red-500/20 px-3 py-1 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-red-200">
            {categoria}
          </span>
        )}

        {img && (
          <div className="mt-3 w-full">
            <LazyLoadImage
              src={img}
              alt={titulo || "imagen de caso"}
              effect="blur"
              className="h-50 w-full rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="mt-3 mb-2 flex-1 overflow-y-auto pr-1">
          <p className="whitespace-pre-wrap text-[0.86rem] leading-relaxed text-white/88">
            {contenido}
          </p>
        </div>

        {usuario && (
          <p className="mt-auto text-[0.76rem] text-white/66">
            Por {typeof usuario === "object" ? usuario.nombre : usuario}
          </p>
        )}
      </div>
    </div>
  );
};

export default CardsAyuda;
