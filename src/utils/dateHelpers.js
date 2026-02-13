/**
 * Formatea una fecha en formato YYYY-MM-DD a DD/MM/YYYY
 * Sin conversion a Date para evitar problemas de zona horaria
 */

export const formatFecha = (fecha) => {
  if (!fecha) return "-";

  //Si ya tiene formato DD/MM/YYYY, devolverlo tal cual
  if (fecha.includes("/")) return fecha;

  if (fecha.includes("-")) {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  }

  return fecha;
};

/**
 * Compara dos fechas en formato YYYY-MM-DD sin usar Date
 * Retorna: positivo si fecha1 > fecha2, negativo si fecha1 < fecha2, o si son iguales
 */

export const compareFechas = (fecha1, fecha2) => {
  if (!fecha1 && !fecha2) return 0;
  if (!fecha1) return 1;
  if (!fecha2) return -1;

  //Comparacion directa de string en formato YYYY-MM-DD
  return fecha2.localeCompare(fecha1);
};

/**
 * Valida que una fecha no sea mayor a hoy
 * Usa el constructor Date con parametros para evitar problemas en zona horaria
 */

export const validarFechaNoFutura = (fechaString) => {
  if (!fechaString || !fechaString.trim()) return false;

  const [year, month, day] = fechaString.split("-").map(Number);
  const fechaIngresada = new Date(year, month - 1, day);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return fechaIngresada <= hoy;
};
