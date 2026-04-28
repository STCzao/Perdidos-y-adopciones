import axiosInstance from "./api";
import { buildServiceSuccess, mapServiceError } from "./serviceUtils";

export const usuariosService = {
  getMiPerfil: async () => {
    try {
      const { data } = await axiosInstance.get("/usuarios/mi-perfil");

      return buildServiceSuccess({
        usuario: data.usuario,
        seguridad: data.seguridad || null,
        requestId: data.requestId || "",
      });
    } catch (error) {
      return mapServiceError(error, "Error al obtener perfil");
    }
  },

  actualizarPerfil: async (datos) => {
    try {
      const datosPermitidos = {};

      if (datos.nombre !== undefined) datosPermitidos.nombre = datos.nombre.trim();
      if (datos.telefono !== undefined) datosPermitidos.telefono = datos.telefono.trim();
      if (datos.img !== undefined) datosPermitidos.img = datos.img.trim();

      if (!Object.keys(datosPermitidos).length) {
        return {
          success: false,
          msg: "No hay campos válidos para actualizar",
          errors: {},
          requestId: "",
        };
      }

      const { data } = await axiosInstance.put("/usuarios/mi-perfil", datosPermitidos);

      return buildServiceSuccess({
        usuario: data.usuario || data,
        seguridad: data.seguridad || null,
        requestId: data.requestId || "",
      });
    } catch (error) {
      return mapServiceError(error, "Error al actualizar perfil");
    }
  },

  cambiarPassword: async (body) => {
    try {
      const { data } = await axiosInstance.patch("/usuarios/mi-perfil/password", body);
      return buildServiceSuccess({
        ...data,
        requestId: data.requestId || "",
      });
    } catch (error) {
      return mapServiceError(error, "Error al cambiar la contraseña");
    }
  },

  borrarUsuario: async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/usuarios/${id}`);
      return buildServiceSuccess({
        ...data,
        requestId: data.requestId || "",
      });
    } catch (error) {
      return mapServiceError(error, "Error al eliminar usuario");
    }
  },
};
