import { useCallback, useEffect, useRef, useState } from "react";
import { cloudinaryService } from "../services/cloudinary";

let scriptPromise = null;

const loadWidgetScript = () => {
  if (scriptPromise) return scriptPromise;

  if (window.cloudinary?.createUploadWidget) {
    scriptPromise = Promise.resolve();
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("No se pudo cargar el widget de Cloudinary"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

const getWidgetPalette = () => {
  const styles = window.getComputedStyle(document.documentElement);

  return {
    window: styles.getPropertyValue("--shell-surface").trim(),
    windowBorder: styles.getPropertyValue("--shell-line").trim(),
    tabIcon: styles.getPropertyValue("--nature-bark").trim(),
    menuIcons: styles.getPropertyValue("--nature-bark").trim(),
    textDark: styles.getPropertyValue("--nature-ink").trim(),
    textLight: styles.getPropertyValue("--shell-surface").trim(),
    link: styles.getPropertyValue("--shell-accent-strong").trim(),
    action: styles.getPropertyValue("--shell-danger").trim(),
    inactiveTabIcon: styles.getPropertyValue("--shell-line").trim(),
    error: styles.getPropertyValue("--shell-danger").trim(),
    inProgress: styles.getPropertyValue("--shell-accent-strong").trim(),
    complete: styles.getPropertyValue("--shell-bark").trim(),
    sourceBg: styles.getPropertyValue("--shell-surface-soft").trim(),
  };
};

export const useCloudinaryWidget = () => {
  const [uploading, setUploading] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    return () => {
      widgetRef.current?.destroy?.();
      widgetRef.current = null;
    };
  }, []);

  const openWidget = useCallback(async (carpeta, { onSuccess, onError } = {}) => {
    try {
      await loadWidgetScript();

      if (
        !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
        !import.meta.env.VITE_CLOUDINARY_API_KEY
      ) {
        throw new Error("Falta configurar Cloudinary en las variables de entorno");
      }

      if (!window.cloudinary?.createUploadWidget) {
        throw new Error("No se pudo inicializar el widget de Cloudinary");
      }
    } catch (error) {
      onError?.(error.message);
      return;
    }

    widgetRef.current?.destroy?.();
    widgetRef.current = null;

    try {
      let widget;

      widget = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
          uploadSignature: async (callback, paramsToSign) => {
            try {
              const data = await cloudinaryService.getSignature(
                carpeta,
                paramsToSign.timestamp,
              );
              callback(data.signature);
            } catch {
              callback("");
            }
          },
          folder: carpeta,
          multiple: false,
          maxFileSize: 5_000_000,
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          sources: ["local", "camera"],
          language: "es",
          showAdvancedOptions: false,
          cropping: false,
          styles: {
            palette: getWidgetPalette(),
          },
        },
        (error, result) => {
          if (error) {
            setUploading(false);
            widget?.destroy?.();
            if (widgetRef.current === widget) {
              widgetRef.current = null;
            }
            onError?.("Error al subir la imagen. Intentá nuevamente.");
            return;
          }

          if (result.event === "success") {
            setUploading(false);
            widget?.destroy?.();
            if (widgetRef.current === widget) {
              widgetRef.current = null;
            }
            onSuccess?.(result.info.secure_url);
          }

          if (result.event === "close") {
            setUploading(false);
            widget?.destroy?.();
            if (widgetRef.current === widget) {
              widgetRef.current = null;
            }
          }
        },
      );

      widgetRef.current = widget;
      setUploading(true);
      widget.open();
    } catch {
      setUploading(false);
      onError?.("No se pudo abrir el selector de imagen.");
    }
  }, []);

  return { openWidget, uploading };
};
