import { useState } from "react";
import { Marker } from "react-leaflet";
import ModalShell from "../../../components/ui/ModalShell";
import MapaBase from "../../../components/map/MapaBase";
import { getPublicacionIcon } from "../../../components/map/leafletIcons";

const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PublicacionUbicacionMapa = ({ tipo, especie, coordinates, className = "" }) => {
  const [expanded, setExpanded] = useState(false);

  if (!coordinates) return null;

  const [lng, lat] = coordinates;

  return (
    <>
      <div className={`relative ${className}`}>
        <MapaBase
          center={[lat, lng]}
          zoom={16}
          className="h-full w-full"
          scrollWheelZoom={false}
          attributionControl={false}
        >
          <Marker position={[lat, lng]} icon={getPublicacionIcon(tipo, especie)} />
        </MapaBase>

        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="absolute bottom-1.5 right-1.5 z-[500] flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[0.65rem] font-semibold text-[#333] shadow-sm transition hover:bg-white"
        >
          <ExpandIcon />
          Expandir mapa
        </button>
      </div>

      {expanded && (
        <ModalShell elevated>
          <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[1.2rem] border border-[color:var(--shell-line)] bg-white shadow-[0_28px_70px_rgba(36,25,20,0.24)]">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute right-3 top-3 z-[500] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#d1c2b5] bg-white/92 text-[#5c4b42] shadow-sm transition-colors hover:bg-white"
              aria-label="Cerrar mapa"
            >
              <CloseIcon />
            </button>

            <MapaBase center={[lat, lng]} zoom={17} className="h-full w-full">
              <Marker position={[lat, lng]} icon={getPublicacionIcon(tipo, especie)} />
            </MapaBase>
          </div>
        </ModalShell>
      )}
    </>
  );
};

export default PublicacionUbicacionMapa;
