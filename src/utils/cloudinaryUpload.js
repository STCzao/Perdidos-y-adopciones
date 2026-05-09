const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const TIMEOUT_MS = 30000;

export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error(data.error?.message || "No se recibió URL de imagen");
    }

    return data.secure_url;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("La carga de imagen excedió el tiempo límite (30s)");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
