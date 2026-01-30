/**
 * Hook para manejar la subida de imágenes a Cloudinary
 */
export const useImageUpload = (setFormImage, setErrors) => {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrors((prev) => ({ ...prev, img: "" }));

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, img: "Solo se permiten imágenes" }));
      return { uploading: false };
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        img: "La imagen no puede superar 5MB",
      }));
      return { uploading: false };
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "pet_uploads");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dzxp6fhvu/image/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data.secure_url) {
        setFormImage(data.secure_url);
        return { uploading: false, success: true };
      } else {
        setErrors((prev) => ({ ...prev, img: "Error al subir imagen" }));
        return { uploading: false, success: false };
      }
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      setErrors((prev) => ({ ...prev, img: "Error de conexión" }));
      return { uploading: false, success: false };
    }
  };

  return { handleImageUpload };
};
