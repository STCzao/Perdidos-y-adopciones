const CardsAyuda = ({ pub }) => {
  const { titulo, contenido, categoria, usuario } = pub;

  return (
    <div className="text-sm border border-white/20 flex flex-col gap-3 text-left justify-center p-4 sm:p-5 w-full sm:w-11/12 md:w-full rounded-lg bg-white/20 text-center">
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-white text-lg">
          {titulo || "Sin titulo"}
        </h3>

        <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/80">
          {categoria && (
            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
              Categoria: {categoria}
            </span>
          )}
        </div>

        <div className="text-sm text-white/90 space-y-1 mt-2">
          {contenido && <p>Caso: {contenido}</p>}
          {usuario && (
            <p>
              Publicado por:{" "}
              {typeof usuario === "object" ? usuario.nombre : usuario}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardsAyuda;
