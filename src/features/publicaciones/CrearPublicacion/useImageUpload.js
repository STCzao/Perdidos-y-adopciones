import { useState } from "react";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;

export const useImagesUpload = (imgs, setFormImgs, setErrors) => {
  const [uploading, setUploading] = useState(false);

  const handleAddImage = async (file) => {
    if (!file) return;

    if (imgs.length >= MAX_IMAGES) {
      setErrors((prev) => ({ ...prev, imgs: `Maximo ${MAX_IMAGES} imagenes` }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imgs: "Solo se permiten imagenes" }));
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imgs: `La imagen no puede superar ${MAX_SIZE_MB}MB` }));
      return;
    }

    setErrors((prev) => ({ ...prev, imgs: "" }));
    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      setFormImgs([...imgs, url]);
    } catch (error) {
      setErrors((prev) => ({ ...prev, imgs: error.message || "Error al subir imagen" }));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormImgs(imgs.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleMoveImage = (index, direction) => {
    const newImgs = [...imgs];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newImgs.length) return;

    [newImgs[index], newImgs[targetIndex]] = [newImgs[targetIndex], newImgs[index]];
    setFormImgs(newImgs);
  };

  return { handleAddImage, handleRemoveImage, handleMoveImage, uploading };
};

export const useImageUpload = (setFormImage, setErrors) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return { uploading: false, success: false };

    setErrors((prev) => ({ ...prev, img: "" }));

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, img: "Solo se permiten imagenes" }));
      return { uploading: false, success: false };
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, img: `La imagen no puede superar ${MAX_SIZE_MB}MB` }));
      return { uploading: false, success: false };
    }

    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      setFormImage(url);
      return { uploading: false, success: true };
    } catch (error) {
      setErrors((prev) => ({ ...prev, img: error.message || "Error al subir imagen" }));
      return { uploading: false, success: false };
    } finally {
      setUploading(false);
    }
  };

  return { handleImageUpload, uploading };
};
