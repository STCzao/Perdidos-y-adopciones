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

export const OPCIONES_TRANSITO = [
  { value: "PERROS", label: "Perros" },
  { value: "GATOS", label: "Gatos" },
  { value: "OTROS", label: "Otros animales" },
];

export const OPCIONES_TRASLADO = [
  { value: "AUTO", label: "Con auto propio" },
  { value: "MOTO", label: "Con moto" },
  { value: "TRANSPORTE", label: "En transporte público" },
];

export const OPCIONES_AVISTAMIENTO = [
  { value: "ZONA_NORTE", label: "Zona norte" },
  { value: "ZONA_SUR", label: "Zona sur" },
  { value: "ZONA_CENTRO", label: "Centro" },
  { value: "ALREDEDORES", label: "Alrededores / Gran Tucumán" },
];

export const OPCIONES_DIFUSION = [
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "WHATSAPP", label: "Grupos de WhatsApp" },
  { value: "OTRO", label: "Otro" },
];

export const OPCIONES_COORDINACION = [
  { value: "SEGUIMIENTO", label: "Seguimiento de casos" },
  { value: "CONTACTO", label: "Gestión de contactos" },
  { value: "BASE_DATOS", label: "Mantenimiento de base de datos" },
];

export const OPCIONES_ECONOMICO = [
  { value: "VETERINARIA", label: "Gastos veterinarios" },
  { value: "ALIMENTO", label: "Alimento" },
  { value: "TRASLADO", label: "Traslado" },
  { value: "OTRO", label: "Otro" },
];

export const OPCIONES_DETALLE = {
  TRANSITO: OPCIONES_TRANSITO,
  TRASLADO: OPCIONES_TRASLADO,
  AVISTAMIENTO: OPCIONES_AVISTAMIENTO,
  DIFUSION: OPCIONES_DIFUSION,
  COORDINACION: OPCIONES_COORDINACION,
  ECONOMICA: OPCIONES_ECONOMICO,
};
