import { LazyLoadImage } from "react-lazy-load-image-component";

const CardsAyuda = ({ pub }) => {
  const { titulo, contenido, categoria, usuario, img } = pub;

  return (
    <div className="flex min-h-[25rem] w-full max-w-[350px] flex-col gap-3 overflow-hidden rounded-[1rem] border border-white/20 bg-white/20 p-4 text-center sm:min-h-[30rem] sm:p-5">
      <div className="flex h-full flex-col">
        <h3 className="line-clamp-2 text-[0.96rem] font-semibold leading-snug text-white sm:text-[1.02rem]">
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
              className="h-44 w-full rounded-[0.9rem] object-cover sm:h-50"
              loading="lazy"
            />
          </div>
        )}

        <div className="mb-2 mt-3 flex-1 overflow-y-auto pr-1">
          <p className="whitespace-pre-wrap text-[0.82rem] leading-relaxed text-white/88 sm:text-[0.86rem]">
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
