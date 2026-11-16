import L from "leaflet";
import { getTipoColorMeta } from "../../utils/publicacionColors";

const iconCache = new Map();

// Trazos de Tabler Icons (MIT), en viewBox 24x24, para dibujar la especie dentro del pin.
const ESPECIE_PATHS = {
  PERRO: [
    "M11 5h2",
    "M19 12c-.667 5.333 -2.333 8 -5 8h-4c-2.667 0 -4.333 -2.667 -5 -8",
    "M11 16c0 .667 .333 1 1 1s1 -.333 1 -1h-2z",
    "M12 18v2",
    "M10 11v.01",
    "M14 11v.01",
    "M5 4l6 .97l-6.238 6.688a1.021 1.021 0 0 1 -1.41 .111a.953 .953 0 0 1 -.327 -.954l1.975 -6.815z",
    "M19 4l-6 .97l6.238 6.688c.358 .408 .989 .458 1.41 .111a.953 .953 0 0 0 .327 -.954l-1.975 -6.815z",
  ],
  GATO: [
    "M20 3v10a8 8 0 1 1 -16 0v-10l3.432 3.432a7.963 7.963 0 0 1 4.568 -1.432c1.769 0 3.403 .574 4.728 1.546l3.272 -3.546z",
    "M2 16h5l-4 4",
    "M22 16h-5l4 4",
    "M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
    "M9 11v.01",
    "M15 11v.01",
  ],
  // Huella genérica para especies sin ícono propio
  OTRO: [
    "M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.835 -3.454 -3.538z",
    "M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z",
    "M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z",
    "M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z",
    "M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z",
  ],
};

const getEspecieKey = (especie) => {
  const value = String(especie || "").toUpperCase();
  return ESPECIE_PATHS[value] ? value : "OTRO";
};

// Pin plano (sin ícono) para marcar un punto manual al crear/editar una publicación.
const createPinIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<svg width="26" height="35" viewBox="0 0 26 35" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.8 0 0 5.8 0 13c0 9.7 13 22 13 22s13-12.3 13-22C26 5.8 20.2 0 13 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="13" cy="13" r="5" fill="#fff"/>
    </svg>`,
    iconSize: [26, 35],
    iconAnchor: [13, 35],
    popupAnchor: [0, -32],
  });

// Pin con la silueta de la especie: el color indica el tipo (perdido/encontrado)
// y el dibujo la especie, para leer el caso de un vistazo.
const createEspecieIcon = (color, especieKey) => {
  const paths = ESPECIE_PATHS[especieKey]
    .map((d) => `<path d="${d}"/>`)
    .join("");

  return L.divIcon({
    className: "mapa-especie-pin",
    html: `<svg width="38" height="48" viewBox="0 0 38 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 1C9.06 1 1 9.06 1 19c0 13.2 18 28 18 28s18-14.8 18-28C37 9.06 28.94 1 19 1z" fill="${color}" stroke="#fff" stroke-width="2"/>
      <g transform="translate(8 8) scale(0.9167)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
    </svg>`,
    iconSize: [38, 48],
    iconAnchor: [19, 47],
    popupAnchor: [0, -44],
    tooltipAnchor: [0, -46],
  });
};

export const getPublicacionIcon = (tipo, especie) => {
  const especieKey = getEspecieKey(especie);
  const cacheKey = `${tipo}:${especieKey}`;

  if (!iconCache.has(cacheKey)) {
    iconCache.set(cacheKey, createEspecieIcon(getTipoColorMeta(tipo).accent, especieKey));
  }
  return iconCache.get(cacheKey);
};

export const getTipoIcon = (tipo) => getPublicacionIcon(tipo);

export const manualPinIcon = createPinIcon("#2a1f19");
