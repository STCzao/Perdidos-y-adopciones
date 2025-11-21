const CardsAyuda = ({ pub }) => {
  const { titulo, contenido, categoria, usuario, img } = pub;

  return (
    <div
      className="
        text-sm border border-white/20 flex flex-col gap-3
        p-4 sm:p-5 w-full max-w-[350px]
        h-[420px]                  /* altura uniforme */
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
            Categoria: {categoria}
          </span>
        )}

        {/* IMAGEN */}
        {img && (
          <div className="w-full mt-3">
            <img
              src={img}
              alt={titulo || "imagen de caso"}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* CONTENIDO (recortado para mantener altura) */}
        <p className="text-xs text-white/90 mt-3 line-clamp-4">
          Caso: {contenido}
        </p>

        {/* USUARIO (siempre abajo) */}
        {usuario && (
          <p className="text-white/70 text-xs mt-auto">
            Publicado por:{" "}
            {typeof usuario === "object" ? usuario.nombre : usuario}
          </p>
        )}
      </div>
    </div>
  );
};

export default CardsAyuda;
