import axiosInstance from "./api";

export const cloudinaryService = {
  getSignature: (carpeta, timestamp) =>
    axiosInstance
      .get("/cloudinary/signature", { params: { carpeta, timestamp } })
      .then((r) => r.data),
};
