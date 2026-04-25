export const getPublicacionTamano = (publicacion) =>
  publicacion?.["tamaño"] ||
  publicacion?.["tamaÃ±o"] ||
  publicacion?.["tamaÃƒÂ±o"] ||
  publicacion?.["tamaÃƒÆ’Ã‚Â±o"] ||
  publicacion?.["tamaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±o"] ||
  publicacion?.["tamaÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±o"] ||
  "";
