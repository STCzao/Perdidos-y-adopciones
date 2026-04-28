import { useCloudinaryWidget } from "../../../hooks/useCloudinaryWidget";

export const useImageUpload = (setFormImage, setErrors, carpeta = "publicaciones") => {
  const { openWidget, uploading } = useCloudinaryWidget();

  const handleImageUpload = () => {
    openWidget(carpeta, {
      onSuccess: (url) => {
        setErrors((prev) => ({ ...prev, img: "" }));
        setFormImage(url);
      },
      onError: () => {
        setErrors((prev) => ({
          ...prev,
          img: "Error al subir la imagen. Intentá nuevamente.",
        }));
      },
    });
  };

  return { handleImageUpload, uploading };
};
