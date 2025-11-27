import { useState } from "react";

const formatFecha = (fecha) => {
  if (!fecha) return "-";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CardGenerica = ({ publicacion }) => {
  const [flipped, setFlipped] = useState(false);

  const {
    titulo,
    descripcion,
    tipo,
    raza,
    lugar,
    fecha,
    sexo,
    tamaño,
    color,
    edad,
    detalles,
    afinidad,
    energia,
    castrado,
    whatsapp,
    img,
    estado,
  } = publicacion;

  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp}` : null;

  return (
    <div
      className="font-medium w-full max-w-sm h-[43rem] cursor-pointer flex flex-col overflow-hidden"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Frente */}
        <div className="absolute w-full h-full [backface-visibility:hidden] flex flex-col bg-[#000000] backdrop-blur border border-white/20 rounded-xl shadow-md p-3">
          <div>
            {tipo && (
              <span className="flex flex-col italic text-center bg-green-500/20 text-green-300 mb-2 px-2 py-1 rounded text-sm mt-2">
                Tipo: {tipo}
              </span>
            )}
          </div>
          {img && (
            <img
              src={img}
              alt={titulo}
              className="w-full h-70 object-cover rounded-lg mb-1"
            />
          )}
          <h3 className="font-bold text-white text-l mb-1 text-center">
            {titulo || "Sin título"}
          </h3>
          <div className="flex flex-col text-center text-white mb-2 rounded text-sm">
            {(tipo === "PERDIDO" || tipo === "ENCONTRADO") && (
              <>{lugar && <p className="mt-2">Lugar: {lugar}</p>}</>
            )}
          </div>
          <div className="text-xs text-white/90 space-y-1 flex-1 overflow-y-auto will-change-transform [transform:translateZ(0)]">
            {estado && <p>Estado: {estado}</p>}
            {raza && <p>Raza: {raza}</p>}
            {sexo && <p>Sexo: {sexo}</p>}
            {tamaño && <p>Tamaño: {tamaño}</p>}
            {color && <p>Color: {color}</p>}
            {edad && <p>Edad: {edad}</p>}
          </div>
          <p className="text-center bg-white/20 text-white px-2 py-1 rounded text-l mt-2">
            Ver más detalles (click para girar)
          </p>
        </div>

        {/* Reverso */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between bg-[#000000] backdrop-blur border border-white/20 rounded-xl shadow-md p-3">
          <div className="text-sm text-white/90 overflow-auto flex-1">
            {descripcion && <p>Descripción: {descripcion}</p>}
            {(tipo === "PERDIDO" || tipo === "ENCONTRADO") && (
              <>
                {fecha && <p className="mt-2">Fecha: {formatFecha(fecha)}</p>}
              </>
            )}
            {tipo === "ADOPCION" && (
              <>
                {afinidad && <p>Afinidad: {afinidad}</p>}
                {energia && <p>Energía: {energia}</p>}
                <p>Castrado: {castrado ? "Sí" : "No"}</p>
              </>
            )}
            {detalles && <p className="mt-2">Detalles: {detalles}</p>}
          </div>
          <div>
            <p className="text-center bg-white/20 text-white px-2 py-1 rounded text-l mt-2">
              Click para volver
            </p>
          </div>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full text-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
            >
              Contactar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardGenerica;
