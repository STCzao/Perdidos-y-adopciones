import { LazyLoadImage } from "react-lazy-load-image-component";

const CardsAyuda = ({ pub }) => {
  const { titulo, contenido, categoria, usuario, img } = pub;

  return (
    <div
      className="
        text-sm border border-white/20 flex flex-col gap-3
        p-4 sm:p-5 w-full max-w-[350px]
        h-[480px]                  
        rounded-lg bg-white/20 text-center
        overflow-hidden
      "
    >
      <div className="flex flex-col h-full">
        {/* TITULO */}
        <h3 className="font-semibold text-white text-l line-clamp-1">
          {titulo || "Sin titulo"}
        </h3>

        {/* CATEGORIA */}
        {categoria && (
          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-sm mt-2">
            Categoría: {categoria}
          </span>
        )}

        {/* IMAGEN */}
        {img && (
          <div className="w-full mt-3">
            <LazyLoadImage
              src={img}
              alt={titulo || "imagen de caso"}
              effect="blur"
              className="w-full h-50 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        )}

        {/* CONTENIDO SCROLLEABLE */}
        <div className="flex-1 overflow-y-auto mt-3 mb-2 pr-1">
          <p className="text-xs text-white/90 whitespace-pre-wrap">
            {contenido}
          </p>
        </div>

        {/* USUARIO */}
        {usuario && (
          <p className="text-white/70 text-xs mt-auto">
            Creado por:{" "}
            {typeof usuario === "object" ? usuario.nombre : usuario}
          </p>
        )}
      </div>
    </div>
  );
};

export default CardsAyuda;
