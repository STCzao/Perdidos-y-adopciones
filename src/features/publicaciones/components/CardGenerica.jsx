import { memo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatFecha } from "../../../utils/dateHelpers.js";
import { getTipoColorMeta } from "../../../utils/publicacionColors.js";
import { getPublicacionDetailPath } from "../utils/publicacionPaths";
import { formatBooleanish, getPublicacionTamano } from "../utils/publicacionFields";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { publicacionesService } from "../../../services/publicaciones";
import { getCloudinaryUrl } from "../../../utils/cloudinaryUtils";

const tipoHeaderLabel = {
  PERDIDO: "SE BUSCA",
  ENCONTRADO: "BUSCA A SU FAMILIA",
  ADOPCION: "EN ADOPCIÓN",
};

const estadoResueltolabel = {
  "YA APARECIO": "YA APARECIÓ",
  "APARECIO SU FAMILIA": "ENCONTRÓ SU FAMILIA",
  "ADOPTADO": "ADOPTADO",
};

const tipoDateLabel = {
  PERDIDO: "Perdido el",
  ENCONTRADO: "Encontrado el",
  ADOPCION: "Desde el",
};

const tipoLocationLabel = {
  PERDIDO: "SE EXTRAVIÓ EN",
  ENCONTRADO: "ENCONTRADO EN",
  ADOPCION: "ZONA DE REFERENCIA",
};

const CardGenerica = ({ publicacion, cardId, isSuccessful = false }) => {
  const withAuth = useRequireAuth();
  const location = useLocation();
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");
  const {
    nombreanimal,
    especie,
    tipo,
    raza,
    localidad,
    lugar,
    fecha,
    img,
    estado,
    afinidad,
    afinidadanimales,
    energia,
    castrado,
  } = publicacion;

  const tamano = getPublicacionTamano(publicacion);
  const meta = getTipoColorMeta(tipo);
  const detailPath = getPublicacionDetailPath(publicacion);
  const primaryLocation = localidad || lugar;
  const secondaryLocation = localidad && lugar ? lugar : null;
  const subtitleParts = [especie, raza, tamano].filter(Boolean);

  const handleWhatsappClick = () => {
    withAuth(async () => {
      if (contactLoading || !publicacion?._id) return;

      setContactError("");
      setContactLoading(true);

      try {
        const response = await publicacionesService.getContactoPublicacion(
          publicacion._id,
        );

        if (!response.success || !response.whatsapp) {
          setContactError(response.msg || "No hay contacto disponible");
          return;
        }

        const digits = String(response.whatsapp).replace(/\D/g, "");
        if (digits) {
          window.open(
            `https://wa.me/549${digits}`,
            "_blank",
            "noopener,noreferrer",
          );
        }
      } finally {
        setContactLoading(false);
      }
    });
  };

  return (
    <article
      id={cardId}
      className="group flex h-[32rem] w-full max-w-[21rem] flex-col overflow-hidden rounded-[1rem] border border-black/8 bg-white shadow-[0_18px_40px_rgba(20,20,20,0.08)] transition-transform duration-300 hover:-translate-y-1"
    >
      <header
        className="flex items-center justify-center text-center px-4 py-0.5"
        style={{ backgroundColor: meta.accent }}
      >
        <span className="text-[1rem] font-extrabold uppercase tracking-wide text-white">
          {isSuccessful
            ? (estadoResueltolabel[estado] || tipoHeaderLabel[tipo])
            : (tipoHeaderLabel[tipo] || tipoHeaderLabel.PERDIDO)}
        </span>
      </header>

      {img ? (
        <div className="relative mx-2 mt-2 h-[13rem] overflow-hidden rounded-[0.55rem] bg-[#ece8e2]">
          <img
            src={getCloudinaryUrl(img, { width: 80, quality: 20 })}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl opacity-70"
          />
          <LazyLoadImage
            src={getCloudinaryUrl(img, { width: 420 })}
            alt={nombreanimal || especie || "Imagen de publicación"}
            width={420}
            height={192}
            className="relative z-10 block h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mx-2 mt-2 flex h-[12rem] items-center justify-center rounded-[0.55rem] bg-[#ece8e2] text-sm font-medium text-[#999]">
          Sin imagen
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-4 pb-3.5 pt-3">
        <div>
          <h3
            className="line-clamp-2 text-[1.55rem] font-extrabold leading-[1.05]"
            style={{ color: meta.accent }}
          >
            {nombreanimal || especie}
          </h3>
          {subtitleParts.length > 0 && (
            <p className="mt-1 text-[0.78rem] text-[#555]">
              {subtitleParts.join(" · ")}
            </p>
          )}
        </div>

        {tipo === "ADOPCION" ? (
          <div className="rounded-[0.6rem] border border-[#e2e2e2] bg-white px-3 py-2">
            <p className="text-[0.54rem] uppercase tracking-[0.18em] text-[#aaa]">
              PERFIL DE ADOPCIÓN - AFINIDADES
            </p>
            <div className="mt-1 flex flex-col gap-0.5">
              {afinidad && (
                <div className="flex items-center justify-between">
                  <span className="text-[0.74rem] text-[#777]">Con niños</span>
                  <span className="text-[0.76rem] font-semibold text-[#1a1a1a]">{formatBooleanish(afinidad)}</span>
                </div>
              )}
              {afinidadanimales && (
                <div className="flex items-center justify-between">
                  <span className="text-[0.74rem] text-[#777]">Con animales</span>
                  <span className="text-[0.76rem] font-semibold text-[#1a1a1a]">{formatBooleanish(afinidadanimales)}</span>
                </div>
              )}
              {energia && (
                <div className="flex items-center justify-between">
                  <span className="text-[0.74rem] text-[#777]">Energía</span>
                  <span className="text-[0.76rem] font-semibold text-[#1a1a1a]">{energia}</span>
                </div>
              )}
              {castrado !== undefined && castrado !== null && castrado !== "" && (
                <div className="flex items-center justify-between">
                  <span className="text-[0.74rem] text-[#777]">Castrado</span>
                  <span className="text-[0.76rem] font-semibold text-[#1a1a1a]">{formatBooleanish(castrado)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-[0.6rem] border border-[#e2e2e2] bg-white px-3 py-2">
            <p className="text-[0.54rem] uppercase tracking-[0.18em] text-[#aaa]">
              {tipoLocationLabel[tipo] || tipoLocationLabel.PERDIDO}
            </p>
            <p className="text-[0.85rem] font-bold text-[#1a1a1a]">
              {primaryLocation || "Sin ubicación informada"}
            </p>
            {secondaryLocation && (
              <p className="text-[0.74rem] text-[#777]">{secondaryLocation}</p>
            )}
          </div>
        )}

        {fecha && (
          <p className="text-[0.72rem] text-[#999]">
            {tipoDateLabel[tipo] || tipoDateLabel.PERDIDO}: {formatFecha(fecha)}
          </p>
        )}

        <div className="mt-auto">
          <div
            className={`grid gap-2 ${isSuccessful ? "grid-cols-1" : "grid-cols-2"}`}
          >
            <Link
              to={detailPath}
              state={{ publicacion, backSearch: location.search, from: isSuccessful ? "exitosas" : "publicaciones" }}
              className="rounded-[0.6rem] border border-[#d0d0d0] bg-white py-2.5 text-center text-[0.8rem] font-bold text-[#1a1a1a] transition-colors hover:bg-[#f6f6f6]"
            >
              Ver caso
            </Link>

            {!isSuccessful && (
              <button
                type="button"
                onClick={handleWhatsappClick}
                disabled={contactLoading}
                className="rounded-[0.6rem] py-2.5 text-center text-[0.8rem] font-bold text-white transition-opacity hover:opacity-92 disabled:cursor-wait disabled:opacity-60"
                style={{ backgroundColor: meta.accent }}
              >
                {contactLoading ? "..." : "WhatsApp"}
              </button>
            )}
          </div>

          {contactError && (
            <p className="mt-2 text-center text-[0.65rem] text-red-600">
              {contactError}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default memo(CardGenerica);
