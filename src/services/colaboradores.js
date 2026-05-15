import axiosInstance from "./api";

export const colaboradoresService = {
  registrar: (datos) => axiosInstance.post("/colaboradores", datos),

  getColaboradores: (params) => axiosInstance.get("/colaboradores", { params }),

  toggleEstado: (id, activo) =>
    axiosInstance.patch(`/colaboradores/${id}/estado`, { activo }),

  exportar: (params) =>
    axiosInstance.get("/colaboradores/exportar", {
      params,
      responseType: "blob",
      headers: { "x-token": localStorage.getItem("token") },
    }),
};
