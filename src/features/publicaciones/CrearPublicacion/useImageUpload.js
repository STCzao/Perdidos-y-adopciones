import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

export const useImageUpload = (setFormImage, setErrors) => {
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
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
      const url = await uploadToCloudinary(file);
      setFormImage(url);
      return { uploading: false, success: true };
    } catch (error) {
      setErrors((prev) => ({ ...prev, img: error.message || "Error al subir imagen" }));
      return { uploading: false, success: false };
    }
  };

  return { handleImageUpload };
};
