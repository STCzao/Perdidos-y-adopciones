import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Marker, Popup, Tooltip } from "react-leaflet";
import MapaBase from "../../../components/map/MapaBase";
import { TUCUMAN_CENTER } from "../../../components/map/mapConstants";
import { getPublicacionIcon } from "../../../components/map/leafletIcons";
import LoadingState from "../../../components/ui/LoadingState";
import { publicacionesService } from "../../../services/publicaciones";
import { getTipoColorMeta } from "../../../utils/publicacionColors";
import { getPublicacionDetailPath } from "../utils/publicacionPaths";
import CardMapaPreview from "./CardMapaPreview";

const TIPOS_MAPA = [
  { tipo: "PERDIDO", label: "Perdidos" },
  { tipo: "ENCONTRADO", label: "Encontrados" },
];

// En dispositivos con mouse la tarjeta aparece al pasar por encima del pin y el
// click lleva directo al caso. En pantallas táctiles no existe el hover, así que
// el toque abre la misma tarjeta como popup con un botón para ir al caso.
const canHover = () =>
  typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;

const MapaCasos = ({
  className = "",
  mapClassName = "h-full w-full",
  zoom = 12,
  scrollWheelZoom = true,
  children,
}) => {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tiposVisibles, setTiposVisibles] = useState(() => TIPOS_MAPA.map((t) => t.tipo));
  const [hoverMode] = useState(canHover);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const resultados = await Promise.all(
          TIPOS_MAPA.map(({ tipo }) => publicacionesService.getPublicacionesActivasPorTipo(tipo)),
        );
        if (!cancelled) setPublicaciones(resultados.flat());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const conUbicacion = useMemo(
    () => publicaciones.filter((publicacion) => publicacion.ubicacionPublica?.coordinates),
    [publicaciones],
  );

  const conteoPorTipo = useMemo(
    () =>
      conUbicacion.reduce((acc, publicacion) => {
        acc[publicacion.tipo] = (acc[publicacion.tipo] || 0) + 1;
        return acc;
      }, {}),
    [conUbicacion],
  );

  const visibles = useMemo(
    () => conUbicacion.filter((publicacion) => tiposVisibles.includes(publicacion.tipo)),
    [conUbicacion, tiposVisibles],
  );

  const toggleTipo = (tipo) =>
    setTiposVisibles((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo],
    );

  const irAlCaso = (publicacion) =>
    navigate(getPublicacionDetailPath(publicacion), { state: { publicacion } });

  return (
    <div className={`relative isolate z-0 ${className}`}>
      {loading ? (
        <div className="flex h-full w-full items-center justify-center bg-[#efe6da]">
          <LoadingState label="Cargando mapa..." />
        </div>
      ) : (
        <MapaBase
          center={TUCUMAN_CENTER}
          zoom={zoom}
          scrollWheelZoom={scrollWheelZoom}
          className={mapClassName}
        >
          {visibles.map((publicacion) => {
            const [lng, lat] = publicacion.ubicacionPublica.coordinates;

            return (
              <Marker
                key={publicacion._id}
                position={[lat, lng]}
                icon={getPublicacionIcon(publicacion.tipo, publicacion.especie)}
                eventHandlers={hoverMode ? { click: () => irAlCaso(publicacion) } : undefined}
              >
                {hoverMode ? (
                  <Tooltip direction="top" opacity={1} className="mapa-card-tooltip">
                    <CardMapaPreview publicacion={publicacion} />
                  </Tooltip>
                ) : (
                  <Popup className="mapa-card-popup" closeButton={false}>
                    <CardMapaPreview
                      publicacion={publicacion}
                      footer={
                        <Link
                          to={getPublicacionDetailPath(publicacion)}
                          state={{ publicacion }}
                          className="mt-1 block rounded-[0.5rem] py-2 text-center text-[0.78rem] font-bold !text-white"
                          style={{ backgroundColor: getTipoColorMeta(publicacion.tipo).accent }}
                        >
                          Ver caso
                        </Link>
                      }
                    />
                  </Popup>
                )}
              </Marker>
            );
          })}
        </MapaBase>
      )}

      {/* Filtros por tipo + leyenda de íconos */}
      <div className="pointer-events-none absolute right-3 top-3 z-[1000] flex flex-col items-end gap-2">
        <div className="pointer-events-auto flex flex-wrap justify-end gap-1.5">
          {TIPOS_MAPA.map(({ tipo, label }) => {
            const activo = tiposVisibles.includes(tipo);
            const { accent } = getTipoColorMeta(tipo);

            return (
              <button
                key={tipo}
                type="button"
                onClick={() => toggleTipo(tipo)}
                aria-pressed={activo}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold shadow-sm backdrop-blur-sm transition-colors"
                style={
                  activo
                    ? { backgroundColor: accent, borderColor: accent, color: "#fff" }
                    : { backgroundColor: "rgba(255,255,255,0.92)", borderColor: "#d8ccc0", color: "#5f4c41" }
                }
              >
                {label}
                {!loading && <span className="opacity-80">({conteoPorTipo[tipo] || 0})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
};

export default MapaCasos;
