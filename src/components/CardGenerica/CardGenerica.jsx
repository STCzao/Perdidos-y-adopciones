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
  } = publicacion;

  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp}` : null;

  return (
    <div
      className="font-medium w-80 h-140 cursor-pointer cursor-pointer max-w-full"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Frente */}
        <div className="absolute w-80 h-140 p-3 [backface-visibility:hidden] sm:w-80 sm:h-140 flex flex-col bg-[#763A0D]/70 backdrop-blur border border-white/20 rounded-xl shadow-md p-3">
          {img && (
            <img
              src={img.toLowerCase()}
              alt={titulo}
              className="w-full h-60 object-cover rounded-lg mb-3"
            />
          )}
          <h3 className="font-bold text-white text-lg mb-1">
            {titulo || "Sin título"}
          </h3>
          <div className="flex-1">
            <div className="text-sm text-white/90 space-y-1 flex-1">
              {tipo && <p>Tipo: {tipo}</p>}
              {raza && <p>Raza: {raza}</p>}
              {sexo && <p>Sexo: {sexo}</p>}
              {tamaño && <p>Tamaño: {tamaño}</p>}
              {color && <p>Color: {color}</p>}
              {edad && <p>Edad: {edad}</p>}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <button className="border border-white/20 font-medium w-50 h-11 rounded-full text-white bg-white/20 hover:bg-[#FF7857] transition-opacity col-span-1">
              Ver más detalles
            </button>
          </div>
        </div>

        {/* Reverso */}
        <div className="absolute w-80 h-140 p-3 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between bg-[#763A0D]/70 backdrop-blur border border-white/20 rounded-xl shadow-md">
          <div className="text-sm text-white/90">
            {descripcion && <p>Descripción: {descripcion} </p>}
          </div>
          <div>
            {/* Campos PERDIDO/ENCONTRADO */}
            {(tipo === "PERDIDO" || tipo === "ENCONTRADO") && (
              <>
                {lugar && (
                  <p className="text-sm mt-8 text-white/90">Lugar: {lugar}</p>
                )}
                {fecha && (
                  <p className="text-sm mt-8 text-white/90">
                    Fecha: {formatFecha(fecha)}
                  </p>
                )}
              </>
            )}
            {/* Campos ADOPCION */}
            {tipo === "ADOPCION" && (
              <>
                {afinidad && <p>Afinidad: {afinidad}</p>}
                {energia && <p>Energía: {energia}</p>}
                <p>Castrado: {castrado ? "Sí" : "No"}</p>
              </>
            )}
          </div>
          <div className="text-sm text-white/90">
            {detalles && (
              <p className="text-sm mt-12 text-white/90">
                Detalles: {detalles}
              </p>
            )}
          </div>

          {whatsappLink && (
            <div className="flex flex-col items-center mt-30 text-white/90">
              <span className="text-sm ">
                Contactar con el dueño de la publicación:
              </span>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-40 rounded-full text-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardGenerica;
