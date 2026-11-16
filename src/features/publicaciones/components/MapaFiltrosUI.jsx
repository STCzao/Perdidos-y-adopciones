import { useEffect } from "react";
import { Circle, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { IconCurrentLocation, IconLoader2 } from "@tabler/icons-react";

// Piezas visuales de los filtros del mapa de casos. El estado vive en MapaCasos.

const CHIP_INACTIVO = {
  backgroundColor: "rgba(255,255,255,0.92)",
  borderColor: "#d8ccc0",
  color: "#5f4c41",
};

const CHIP_BASE =
  "flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.72rem] font-bold shadow-sm backdrop-blur-sm transition-colors";

export const Chip = ({ activo, accent = "#241914", onClick, children, className = "", ...props }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={activo}
    className={`${CHIP_BASE} ${className}`}
    style={activo ? { backgroundColor: accent, borderColor: accent, color: "#fff" } : CHIP_INACTIVO}
    {...props}
  >
    {children}
  </button>
);

// Botón neutro con el mismo formato de chip (para "Más filtros", "Filtros", etc.)
// React 19: `ref` llega como prop común, no hace falta forwardRef.
export const ChipBoton = ({ ref, onClick, children, className = "", destacado = false, ...props }) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    className={`${CHIP_BASE} hover:bg-white ${className}`}
    style={
      destacado
        ? { backgroundColor: "#fffaf4", borderColor: "#241914", color: "#241914" }
        : CHIP_INACTIVO
    }
    {...props}
  >
    {children}
  </button>
);

export const GrupoChips = ({ opciones, seleccionados, onToggle }) => (
  <div className="flex flex-wrap gap-1.5">
    {opciones.map(({ value, label }) => (
      <Chip key={value} activo={seleccionados.includes(value)} onClick={() => onToggle(value)}>
        {label}
      </Chip>
    ))}
  </div>
);

// Selector de una sola opción con forma de píldora segmentada.
export const SelectorAntiguedad = ({ opciones, valor, onChange, className = "" }) => (
  <div
    role="radiogroup"
    aria-label="Antigüedad"
    className={`flex rounded-full border border-[#d8ccc0] bg-[rgba(255,255,255,0.92)] p-0.5 shadow-sm backdrop-blur-sm ${className}`}
  >
    {opciones.map(({ value, label }) => {
      const activo = valor === value;
      return (
        <button
          key={label}
          type="button"
          role="radio"
          aria-checked={activo}
          onClick={() => onChange(value)}
          className={`flex-1 cursor-pointer whitespace-nowrap rounded-full px-2.5 py-1 text-[0.72rem] font-bold transition-colors ${
            activo ? "bg-[#241914] text-white" : "text-[#5f4c41] hover:bg-[#f3ebe1]"
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export const BotonCercaMio = ({ estado, onClick, className = "" }) => (
  <ChipBoton
    onClick={onClick}
    disabled={estado === "buscando"}
    destacado={estado === "ok"}
    className={`disabled:cursor-wait ${className}`}
    aria-label="Centrar el mapa en mi ubicación"
  >
    {estado === "buscando" ? (
      <IconLoader2 size={14} className="animate-spin" aria-hidden="true" />
    ) : (
      <IconCurrentLocation size={14} aria-hidden="true" />
    )}
    {estado === "buscando" ? "Ubicando..." : "Cerca mío"}
  </ChipBoton>
);

export const SeccionFiltro = ({ titulo, children }) => (
  <div>
    <p className="mb-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#9b8574]">
      {titulo}
    </p>
    {children}
  </div>
);

// Va DENTRO de MapaBase (necesita el contexto del mapa para useMap).
// La posición se usa solo para mover el mapa y dibujar el punto: no sale del navegador.
export const UbicacionUsuario = ({ posicion }) => {
  const map = useMap();

  useEffect(() => {
    if (!posicion) return;
    map.flyTo([posicion.lat, posicion.lng], 14, { duration: 0.9 });
  }, [map, posicion]);

  if (!posicion) return null;

  return (
    <>
      {posicion.precision > 0 && (
        <Circle
          center={[posicion.lat, posicion.lng]}
          radius={Math.min(posicion.precision, 400)}
          pathOptions={{ color: "#241914", weight: 1, opacity: 0.25, fillOpacity: 0.06 }}
          interactive={false}
        />
      )}
      <CircleMarker
        center={[posicion.lat, posicion.lng]}
        radius={7}
        pathOptions={{ color: "#fff", weight: 2.5, fillColor: "#241914", fillOpacity: 1 }}
      >
        <Tooltip direction="top" offset={[0, -6]}>
          Estás acá
        </Tooltip>
      </CircleMarker>
    </>
  );
};
