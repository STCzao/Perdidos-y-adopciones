/**
 * Mapeo de tipos de publicación a sus estados disponibles
 * Cada tipo tiene un estado por defecto y estados permitidos
 */

export const ESTADO_CONFIG = {
  PERDIDO: {
    default: "SE BUSCA",
    estados: ["SE BUSCA", "YA APARECIO", "INACTIVO"],
  },
  ENCONTRADO: {
    default: "BUSCANDO A SU FAMILIA",
    estados: ["BUSCANDO A SU FAMILIA", "APARECIO SU FAMILIA", "INACTIVO"],
  },
  ADOPCION: {
    default: "EN BUSCA DE UN HOGAR",
    estados: ["EN BUSCA DE UN HOGAR", "ADOPTADO", "INACTIVO"],
  },
};

/**
 * Obtiene el estado por defecto según el tipo de publicación
 * @param {string} tipo - Tipo de publicación (PERDIDO, ENCONTRADO, ADOPCION)
 * @returns {string} Estado por defecto
 */
export const getEstadoDefault = (tipo) => {
  return ESTADO_CONFIG[tipo]?.default || "INACTIVO";
};

/**
 * Obtiene los estados permitidos según el tipo de publicación
 * @param {string} tipo - Tipo de publicación (PERDIDO, ENCONTRADO, ADOPCION)
 * @returns {array} Array de estados permitidos
 */
export const getEstadosPermitidos = (tipo) => {
  return ESTADO_CONFIG[tipo]?.estados || ["INACTIVO"];
};
