export const FORMAS_COLABORACION = [
  { value: "TRANSITO", label: "Tránsito" },
  { value: "TRASLADO", label: "Traslado" },
  { value: "AVISTAMIENTO", label: "Avistamiento" },
  { value: "DIFUSION", label: "Difusión" },
  { value: "COORDINACION", label: "Coordinación" },
  { value: "ECONOMICA", label: "Ayuda económica" },
];

export const DETALLE_CAMPO = {
  TRANSITO: "detalleTransito",
  TRASLADO: "detalleTraslado",
  AVISTAMIENTO: "detalleAvistamiento",
  DIFUSION: "detalleDifusion",
  COORDINACION: "detalleCoordinacion",
  ECONOMICA: "detalleEconomico",
};

export const LABELS_DISPONIBILIDAD = {
  URGENCIAS: "Puedo actuar ante urgencias",
  COORDINACION_PREVIA: "Puedo colaborar con coordinación previa",
  OCASIONAL: "Puedo ayudar de manera ocasional",
  SOLO_DIFUSION: "Solo puedo colaborar con difusión o apoyo leve",
};

export const LABELS_MOMENTOS = {
  MANANA: "Mañana",
  SIESTA: "Siesta",
  TARDE: "Tarde",
  NOCHE: "Noche",
  FINES_DE_SEMANA: "Fines de semana",
  DEPENDE_DEL_DIA: "Depende del día",
};

export const PREFERENCIAS_TRANSITO = [
  { value: "PERROS", label: "Perros" },
  { value: "GATOS", label: "Gatos" },
  { value: "PERROS_O_GATOS", label: "Perros o gatos" },
];

export const PERIODOS_TRANSITO = [
  {
    value: "TRANSITO_CORTO_O_DE_EMERGENCIA",
    label: "Tránsito corto o de emergencia",
  },
  {
    value: "TRANSITO_HASTA_REENCUENTRO_CON_SU_FAMILIA",
    label: "Tránsito hasta el reencuentro con su familia",
  },
  {
    value: "TRANSITO_HASTA_ADOPCION",
    label: "Tránsito hasta adopción",
  },
  {
    value: "TRANSITO_POSTOPERATORIO_O_RECUPERACION",
    label: "Tránsito postoperatorio o recuperación",
  },
];

export const ZONAS_TRASLADO = [
  { value: "TRASLADOS_EN_MI_ZONA", label: "Traslados en mi zona" },
  {
    value: "TRASLADOS_DENTRO_DE_SAN_MIGUEL_DE_TUCUMAN",
    label: "Traslados dentro de San Miguel de Tucumán",
  },
  {
    value: "TRASLADOS_EN_CAPITAL_Y_ALREDEDORES",
    label: "Traslados en Capital y alrededores",
  },
];

export const DISPONIBILIDAD_TRASLADO = [
  {
    value: "PODRIA_COLABORAR_ANTE_URGENCIAS",
    label: "Podría colaborar ante urgencias",
  },
  {
    value: "SOLO_CON_COORDINACION_PREVIA",
    label: "Solo con coordinación previa",
  },
];

export const CONDICIONES_ANIMAL_TRASLADO = [
  { value: "SANO", label: "Animal sano" },
  { value: "EN_TRATAMIENTO", label: "En tratamiento" },
];

export const OPCIONES_AVISTAMIENTO = [
  {
    value: "BUSCAR_CERCA_DE_MI_CASA",
    label: "Puedo salir a buscar cerca de mi casa",
  },
  {
    value: "RECORRER_BARRIOS_CERCANOS",
    label: "Puedo recorrer varias cuadras o barrios cercanos",
  },
  {
    value: "REPORTAR_POSIBLES_CASOS",
    label: "Puedo reportar posibles casos de animales que necesiten ayuda",
  },
];

export const OPCIONES_DIFUSION = [
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "WHATSAPP", label: "Grupos de WhatsApp" },
  {
    value: "CARGAR_CASOS_EN_LA_BASE_DE_DATOS",
    label: "Cargar casos en la base de datos",
  },
];

export const OPCIONES_COORDINACION = [
  { value: "CONTACTAR_PERSONAS_RED", label: "Contactar personas de la red" },
  { value: "SEGUIMIENTO_DE_CASOS", label: "Seguimiento de casos" },
  {
    value: "ORGANIZAR_INFO_BASE_DATOS",
    label: "Organizar info de la base de datos",
  },
];

export const OPCIONES_ECONOMICO = [
  { value: "COLABORACION_OCASIONAL", label: "Colaboración ocasional" },
  {
    value: "COLABORACION_ANTE_URGENCIAS",
    label: "Colaboración ante urgencias",
  },
  {
    value: "ALIMENTO_O_MEDICAMENTOS",
    label: "Con alimento o medicamentos",
  },
];

export const OPCIONES_DETALLE = {
  AVISTAMIENTO: OPCIONES_AVISTAMIENTO,
  DIFUSION: OPCIONES_DIFUSION,
  COORDINACION: OPCIONES_COORDINACION,
  ECONOMICA: OPCIONES_ECONOMICO,
};

const mapOptionsToLabels = (options) =>
  Object.fromEntries(options.map(({ value, label }) => [value, label]));

export const LABELS_PREFERENCIA_TRANSITO = mapOptionsToLabels(PREFERENCIAS_TRANSITO);
export const LABELS_PERIODOS_TRANSITO = mapOptionsToLabels(PERIODOS_TRANSITO);
export const LABELS_ZONAS_TRASLADO = mapOptionsToLabels(ZONAS_TRASLADO);
export const LABELS_DISPONIBILIDAD_TRASLADO = mapOptionsToLabels(DISPONIBILIDAD_TRASLADO);
export const LABELS_CONDICIONES_ANIMAL_TRASLADO = mapOptionsToLabels(
  CONDICIONES_ANIMAL_TRASLADO,
);
