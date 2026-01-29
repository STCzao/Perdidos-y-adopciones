import axiosInstance from '../utils/axiosInstance';

export const usuariosService = {
  getMiPerfil: async () => {
    try {
      const { data } = await axiosInstance.get('/usuarios/mi-perfil');

      return {
        ok: true,
        usuario: data.usuario || data,
      };
    } catch (error) {
      console.error("Error en getMiPerfil:", error);
      
      if (error.response?.status === 401) {
        return {
          ok: false,
          msg: "Sesión expirada",
          status: 401,
        };
      }

      return {
        ok: false,
        msg: error.response?.data?.msg || "Error al obtener perfil",
        errors: error.response?.data?.errors,
      };
    }
  },

  actualizarPerfil: async (datos) => {
    try {
      // Filtrar solo los campos permitidos
      const datosPermitidos = {};
      if (datos.nombre !== undefined)
        datosPermitidos.nombre = datos.nombre.trim();
      if (datos.telefono !== undefined)
        datosPermitidos.telefono = datos.telefono.trim();

      // Si no hay campos válidos, retornar error
      if (Object.keys(datosPermitidos).length === 0) {
        return {
          ok: false,
          msg: "No hay campos válidos para actualizar",
        };
      }

      const { data: responseData } = await axiosInstance.put('/usuarios/mi-perfil', datosPermitidos);

      return {
        ok: true,
        ...responseData,
        _id: responseData._id || responseData.uid,
        usuario: responseData.usuario || responseData,
      };
    } catch (error) {
      console.error("Error en actualizarPerfil:", error);

      if (error.response?.status === 401) {
        return {
          ok: false,
          msg: "Sesión expirada",
          status: 401
        };
      }

      let errorMsg = error.response?.data?.msg || "Error al actualizar perfil";

      // Si hay errores específicos, extraerlos
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errorMsg = errors.join(", ");
        } else if (typeof errors === "object") {
          errorMsg = Object.values(errors).join(", ");
        }
      }

      return {
        ok: false,
        msg: errorMsg,
        errors: error.response?.data?.errors,
      };
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
      console.error("Error en borrarUsuario:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return {
          ok: false,
          msg: "No tiene permisos para esta acción",
        };
      }

      return {
        ok: false,
        msg: error.response?.data?.msg || "Error al eliminar usuario",
      };
    }
  },
};
