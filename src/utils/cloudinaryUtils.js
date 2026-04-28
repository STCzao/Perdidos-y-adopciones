/**
 * Inserta parámetros de transformación en una URL de Cloudinary.
 * Solo actúa sobre URLs de res.cloudinary.com que no tengan ya transformaciones.
 */
export const getCloudinaryUrl = (url, { width, quality = "auto", format = "auto" } = {}) => {
  if (!url?.includes("res.cloudinary.com/")) return url ?? "";

  // Si ya tiene transformaciones inyectadas (coma después de /upload/), devolver tal cual
  if (/\/upload\/[^/]*,/.test(url)) return url;

  const transforms = [`q_${quality}`, `f_${format}`, "c_limit"];
  if (width) transforms.unshift(`w_${width}`);

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
};
