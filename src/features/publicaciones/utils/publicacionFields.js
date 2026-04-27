export const PUBLICACION_SIZE_FIELD = "tamaño";

const normalizeLooseKey = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();

export const getPublicacionTamano = (publicacion) =>
  publicacion?.[PUBLICACION_SIZE_FIELD] ||
  publicacion?.tamano ||
  Object.entries(publicacion || {}).find(([key, value]) => {
    const normalizedKey = normalizeLooseKey(key);
    return ["tamano", "tamao"].includes(normalizedKey) && value;
  })?.[1] ||
  "";

export const getPublicacionTitulo = (publicacion) => {
  if (!publicacion) return "Publicación";

  if (publicacion.tipo === "PERDIDO") {
    return publicacion.nombreanimal
      ? `Se busca a ${publicacion.nombreanimal}`
      : "Animal perdido";
  }

  if (publicacion.tipo === "ENCONTRADO") {
    const referencia =
      publicacion.localidad || publicacion.lugar || "ubicación desconocida";
    return `${publicacion.especie || "Animal"} encontrado en ${referencia}`;
  }

  if (publicacion.tipo === "ADOPCION") {
    return publicacion.nombreanimal
      ? `${publicacion.nombreanimal} busca un hogar`
      : "Animal en adopción";
  }

  return publicacion.nombreanimal || publicacion.especie || "Publicación";
};
