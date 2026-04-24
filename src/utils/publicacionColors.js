export const TIPO_COLOR_META = {
  PERDIDO: {
    accent: "#D62828",
    accentSoft: "#F8D7DA",
  },
  ENCONTRADO: {
    accent: "#2165FF",
    accentSoft: "#DCE8FF",
  },
  ADOPCION: {
    accent: "#768B44",
    accentSoft: "#E7ECD7",
  },
};

export const getTipoColorMeta = (tipo) =>
  TIPO_COLOR_META[tipo] || TIPO_COLOR_META.PERDIDO;
