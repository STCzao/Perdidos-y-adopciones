import { getPublicacionTamano } from "./publicacionFields";

// Lógica pura de los filtros del mapa de casos (sin React), para poder testearla.

export const TIPOS_MAPA = [
  { value: "PERDIDO", label: "Perdidos" },
  { value: "ENCONTRADO", label: "Encontrados" },
];

// "OTROS" agrupa AVE, CONEJO y OTRO.
export const ESPECIES_MAPA = [
  { value: "PERRO", label: "Perros" },
  { value: "GATO", label: "Gatos" },
  { value: "OTROS", label: "Otros" },
];

export const ANTIGUEDADES_MAPA = [
  { value: 7, label: "Últimos 7 días" },
  { value: 30, label: "Últimos 30 días" },
  { value: null, label: "Todos" },
];

export const TAMANOS_MAPA = [
  { value: "MINI", label: "Mini" },
  { value: "PEQUEÑO", label: "Pequeño" },
  { value: "MEDIANO", label: "Mediano" },
  { value: "GRANDE", label: "Grande" },
  { value: "SIN ESPECIFICAR", label: "Sin especificar" },
];

export const SEXOS_MAPA = [
  { value: "MACHO", label: "Macho" },
  { value: "HEMBRA", label: "Hembra" },
  { value: "DESCONOZCO", label: "Desconocido" },
];

// Tipo y especie arrancan con todo seleccionado (como los chips de tipo).
// Tamaño y sexo arrancan vacíos: vacío = sin filtrar; al marcar alguno se restringe.
export const FILTROS_DEFAULT = Object.freeze({
  tipos: TIPOS_MAPA.map((t) => t.value),
  especies: ESPECIES_MAPA.map((e) => e.value),
  antiguedad: null,
  tamanos: [],
  sexos: [],
});

export const getGrupoEspecie = (especie) => {
  const value = String(especie || "").toUpperCase();
  return value === "PERRO" || value === "GATO" ? value : "OTROS";
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

// "YYYY-MM-DD" se interpreta como fecha LOCAL. `new Date("2026-11-16")` la toma
// como medianoche UTC, que en Argentina (UTC-3) es el día anterior.
export const parseFechaLocal = (value) => {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (match && String(value).length === 10) {
    const [, y, m, d] = match;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Día en que se perdió/encontró; si falta, el día de creación de la publicación.
export const getFechaCaso = (publicacion) =>
  parseFechaLocal(publicacion?.fecha) || parseFechaLocal(publicacion?.fechaCreacion);

export const cumpleAntiguedad = (publicacion, dias, hoy = new Date()) => {
  if (!dias) return true;
  const fecha = getFechaCaso(publicacion);
  if (!fecha) return false;

  const limite = startOfDay(hoy);
  limite.setDate(limite.getDate() - dias);
  return startOfDay(fecha) >= limite;
};

const getTamanoFiltro = (publicacion) => getPublicacionTamano(publicacion) || "SIN ESPECIFICAR";
const getSexoFiltro = (publicacion) => publicacion?.sexo || "DESCONOZCO";

/**
 * Aplica los filtros. `ignorar` permite excluir un filtro (ej. "tipos") para
 * calcular los contadores de los chips de tipo con el resto de filtros aplicados.
 */
export const filtrarPublicaciones = (
  publicaciones,
  filtros,
  { ignorar = null, hoy = new Date() } = {},
) =>
  publicaciones.filter(
    (publicacion) =>
      (ignorar === "tipos" || filtros.tipos.includes(publicacion.tipo)) &&
      filtros.especies.includes(getGrupoEspecie(publicacion.especie)) &&
      cumpleAntiguedad(publicacion, filtros.antiguedad, hoy) &&
      (filtros.tamanos.length === 0 || filtros.tamanos.includes(getTamanoFiltro(publicacion))) &&
      (filtros.sexos.length === 0 || filtros.sexos.includes(getSexoFiltro(publicacion))),
  );

export const contarPorTipo = (publicaciones) =>
  publicaciones.reduce((acc, publicacion) => {
    acc[publicacion.tipo] = (acc[publicacion.tipo] || 0) + 1;
    return acc;
  }, {});

const mismoConjunto = (a, b) => a.length === b.length && a.every((value) => b.includes(value));

// Cuántos filtros secundarios (los que van dentro del panel) difieren del default.
export const contarFiltrosActivos = (filtros, claves = ["especies", "antiguedad", "tamanos", "sexos"]) =>
  claves.filter((clave) => {
    const actual = filtros[clave];
    const base = FILTROS_DEFAULT[clave];
    return Array.isArray(base) ? !mismoConjunto(actual, base) : actual !== base;
  }).length;

export const hayFiltrosModificados = (filtros) =>
  contarFiltrosActivos(filtros, Object.keys(FILTROS_DEFAULT)) > 0;

export const toggleValor = (lista, valor) =>
  lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
