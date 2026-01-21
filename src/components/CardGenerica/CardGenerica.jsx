import { useState } from "react";
import { useRequireAuth } from "../../hooks/useRequireAuth";

const formatFecha = (fecha) => {
  if (!fecha) return "-";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const CardGenerica = ({ publicacion, cardId }) => {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const withAuth = useRequireAuth();

  const {
    nombreanimal,
    especie,
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
    afinidadanimales,
    energia,
    castrado,
    whatsapp,
    img,
    estado,
  } = publicacion;

  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp}` : null;

  const mapTipos = {
    ADOPCION: "adopciones",
    PERDIDO: "perdidos",
    ENCONTRADO: "encontrados",
  };

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    const tipoUrl = mapTipos[tipo];
    const url = `${window.location.origin}/publicaciones/${tipoUrl}#${publicacion._id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
    <div
      id={cardId}
      className="font-medium w-full max-w-sm h-[36rem] rounded-2xl cursor-pointer flex flex-col overflow-hidden"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Frente */}
        <div
          className={`absolute w-full h-full [backface-visibility:hidden] flex flex-col bg-white border border-[#FF7857]/20 ${
            flipped ? "invisible" : ""
          }`}
        >
          {tipo === "ADOPCION" && (
            <span className="text-xl text-white flex justify-center items-center bg-[#4dac00] font-extrabold">
              {estado}
            </span>
          )}
          {tipo === "PERDIDO" && (
            <span className="text-xl text-white flex justify-center items-center bg-[#FF0000] font-extrabold">
              {estado}
            </span>
          )}
          {tipo === "ENCONTRADO" && (
            <span className="text-xl text-white flex justify-center items-center bg-[#2165FF] font-extrabold">
              {estado}
            </span>
          )}

          <div className="flex flex-col pb-3 pl-3 pr-3 pt-2 flex-1 overflow-y-auto will-change-transform [transform:translateZ(0)]">
            {img && (
              <div className="relative w-full h-70 rounded-xl overflow-hidden mb-2 bg-[#e6dac6]">
                {/* Fondo relleno blur */}
                <img
                  src={img}
                  alt="background"
                  className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-60"
                />

                {/* Imagen real */}
                <img
                  src={img}
                  alt="Imagen"
                  className="relative z-10 max-h-full max-w-full mx-auto object-contain drop-shadow-sm"
                />
              </div>
            )}

            <div className="text-xs text-black space-y-1 flex-1 overflow-y-auto will-change-transform [transform:translateZ(0)]">
              {tipo === "ADOPCION" && (
                <span className="text-xl text-[#4dac00] flex justify-center items-center font-extrabold">
                  {nombreanimal}
                </span>
              )}
              {tipo === "PERDIDO" && (
                <span className="text-xl text-[#FF0000] flex justify-center items-center font-extrabold">
                  {nombreanimal}
                </span>
              )}
              <div className="flex flex-wrap gap-1 mt-1 text-sm justify-center">
                {especie && <p>{especie}</p>}|{sexo && <p>{sexo}</p>}|
                {tamaño && <p>{tamaño}</p>}
              </div>
              <div className="flex flex-col justify-center items-center font-light">
                {raza && (
                  <p>
                    <span>Raza:</span> {raza.toUpperCase()}
                  </p>
                )}

                {color && (
                  <p>
                    <span>Color:</span> {color.toUpperCase()}
                  </p>
                )}
                {tipo === "ADOPCION" && castrado !== undefined && (
                  <p>
                    <span>Castrado:</span> {castrado ? "Sí" : "No"}
                  </p>
                )}
              </div>
              <div className="flex flex-col justify-center text-center text-sm">
                {tipo === "PERDIDO" && lugar && (
                  <>
                    <p className="font-light ">Se extravió en:</p>
                    <p className="font-extrabold ">{lugar}</p>
                  </>
                )}
                {tipo === "ENCONTRADO" && lugar && (
                  <>
                    <p className="font-light ">Se encontró en:</p>
                    <p className="font-extrabold ">{lugar}</p>
                  </>
                )}
                {fecha && (
                  <>
                    <p className="font-extrabold ">{formatFecha(fecha)}</p>
                  </>
                )}
              </div>
              <div className="flex flex-col justify-center text-center text-sm">
                {tipo === "ADOPCION" && edad && (
                  <>
                    <p className="font-light">Edad:</p>
                    {edad && <p className="font-extrabold">{edad}</p>}
                  </>
                )}
              </div>
            </div>
            <p className="text-center font-bold text-black/60 text-[0.8rem]">
              (Click para VER MÁS DETALLES)
            </p>
          </div>
          {tipo === "ENCONTRADO" && (
            <p className="text-xl text-white flex justify-center items-center bg-[#2165FF] font-medium tracking-[0.11em]">
              SECTOR: ENCONTRADO
            </p>
          )}
          {tipo === "PERDIDO" && (
            <p className="text-xl text-white flex justify-center items-center bg-[#FF0000] font-medium tracking-[0.11em]">
              SECTOR: PERDIDO
            </p>
          )}
          {tipo === "ADOPCION" && (
            <p className="text-xl text-white flex justify-center items-center bg-[#4dac00] font-medium tracking-[0.11em]">
              SECTOR: ADOPCION
            </p>
          )}
        </div>

        {/* Reverso */}
        <div
          className={`absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between bg-white border border-[#FF7857]/20 p-3 ${
            !flipped ? "invisible" : ""
          }`}
        >
          <div className="text-sm text-black/85 overflow-auto flex-1">

          {tipo === "PERDIDO" && (
                  <span className="text-xl mb-2 text-[#FF0000] flex justify-center items-center font-extrabold">
                    {nombreanimal}
                  </span>
                )}
            {tipo === "ADOPCION" && (
              <>
                {nombreanimal && (
                  <span className="text-xl mb-2 text-[#4dac00] flex justify-center items-center font-extrabold">
                    {nombreanimal}
                  </span>
                )}
                
                {afinidad && (
                  <p className="font-light">
                    <span className="font-semibold">Afinidad con niños:</span>{" "}
                    {afinidad}
                  </p>
                )}
                {afinidadanimales && (
                  <p className="font-light">
                    <span className="font-semibold">
                      Afinidad con otros animales:
                    </span>{" "}
                    {afinidadanimales}
                  </p>
                )}
                {energia && (
                  <p className="font-light">
                    <span className="font-semibold">Energía:</span> {energia}
                  </p>
                )}
              </>
            )}

            {tipo === "PERDIDO" && edad && (
              <p className="font-light">
                <span className="font-semibold">Edad:</span> {edad}
              </p>
            )}
            {detalles && (
              <p className="mt-2 leading-relaxed font-light">
                <span className="font-semibold">
                  Señas particulares y estado del animal:
                </span>{" "}
                {detalles}
              </p>
            )}

            <div className="flex flex-col mt-5 justify-center text-center text-sm">
              {tipo === "PERDIDO" && lugar && (
                <>
                  <p className="font-light ">Se extravió en:</p>
                  <p className="font-extrabold ">{lugar}</p>
                </>
              )}
              {tipo === "ENCONTRADO" && lugar && (
                <>
                  <p className="font-light ">Se encontró en:</p>
                  <p className="font-extrabold ">{lugar}</p>
                </>
              )}
              {fecha && (
                <>
                  <p className="font-extrabold ">{formatFecha(fecha)}</p>
                </>
              )}
            </div>
          </div>
          <div>
            <p className="text-center font-bold text-black/60 text-[0.8rem]">
              (Click para VOLVER ATRÁS)
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className={`mt-3 w-full text-sm border border-[#FF7857]/40 cursor-pointer font-medium px-4 py-2 rounded-full transition-colors delay-100 duration-300 ${
              copied
                ? "bg-[#FF7857] text-white"
                : "text-black bg-white/90 shadow-sm hover:bg-[#FF7857] hover:text-white"
            }`}
          >
            {copied ? "¡Enlace copiado! " : "Compartir publicación"}
          </button>
          {whatsappLink && (
            <a
              onClick={(e) => {
                e.preventDefault();
                withAuth(() => {
                  window.open(whatsappLink, "_blank");
                });
              }}
              rel="noopener noreferrer"
              className="mt-3 w-full text-center bg-[#4dac00] text-white px-4 py-2 rounded-full hover:bg-[#1ebe57] transition-colors delay-100 duration-300 cursor-pointer text-sm font-semibold"
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
