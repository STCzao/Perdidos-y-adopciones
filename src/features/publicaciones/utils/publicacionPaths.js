const tipoToSlug = {
  ADOPCION: "adopciones",
  PERDIDO: "perdidos",
  ENCONTRADO: "encontrados",
};

export const getPublicacionSlug = (tipo) => tipoToSlug[tipo] || "perdidos";

export const getPublicacionDetailPath = (publicacion) =>
  `/publicaciones/${getPublicacionSlug(publicacion.tipo)}/${publicacion._id}`;
