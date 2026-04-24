import axiosInstance from "./api";

const mapAxiosError = (error, fallbackMsg) => ({
  ok: false,
  msg: error.response?.data?.msg || fallbackMsg,
  errors: error.response?.data?.errors || {},
  status: error.response?.status,
});

export const usuariosService = {
  getMiPerfil: async () => {
    try {
      const { data } = await axiosInstance.get("/usuarios/mi-perfil");

      return {
        ok: true,
        usuario: data.usuario,
        seguridad: data.seguridad || null,
      };
    } catch (error) {
      return mapAxiosError(error, "Error al obtener perfil");
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
          ok: false,
          msg: "No hay campos válidos para actualizar",
        };
      }

      const { data } = await axiosInstance.put("/usuarios/mi-perfil", datosPermitidos);

      return {
        ok: true,
        usuario: data.usuario || data,
        seguridad: data.seguridad || null,
      };
    } catch (error) {
      return mapAxiosError(error, "Error al actualizar perfil");
    }
  },

  cambiarPassword: async (body) => {
    try {
      const { data } = await axiosInstance.patch("/usuarios/mi-perfil/password", body);
      return {
        ok: true,
        ...data,
      };
    } catch (error) {
      return mapAxiosError(error, "Error al cambiar la contraseña");
    }
  },

  borrarUsuario: async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/usuarios/${id}`);
      return {
        ok: true,
        ...data,
      };
    } catch (error) {
      return mapAxiosError(error, "Error al eliminar usuario");
    }
  },
};
