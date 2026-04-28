import axiosInstance from "./api";
import { buildServiceSuccess, mapServiceError } from "./serviceUtils";

const PUBLICACIONES_CACHE_TTL_MS = 30_000;
const publicacionesListCache = new Map();
const publicacionesListPending = new Map();
const publicacionDetailCache = new Map();
const publicacionDetailPending = new Map();
const publicacionesContactoCache = new Map();
const publicacionesContactoPending = new Map();

const buildPublicacionesListKey = ({
  page = 1,
  limit = 12,
  tipo = "",
  estado = "",
  search = "",
} = {}) =>
  JSON.stringify({
    page: Number(page) || 1,
    limit: Number(limit) || 12,
    tipo: tipo || "",
    estado: estado || "",
    search: search || "",
  });

const getCachedPublicacionesList = (key) => {
  const entry = publicacionesListCache.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= Date.now()) {
    publicacionesListCache.delete(key);
    return null;
  }

  return entry.data;
};

const setCachedPublicacionesList = (key, data) => {
  publicacionesListCache.set(key, {
    data,
    expiresAt: Date.now() + PUBLICACIONES_CACHE_TTL_MS,
  });
};

const getCachedTimedEntry = (map, key) => {
  const entry = map.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= Date.now()) {
    map.delete(key);
    return null;
  }

  return entry.data;
};

const setCachedTimedEntry = (map, key, data) => {
  map.set(key, {
    data,
    expiresAt: Date.now() + PUBLICACIONES_CACHE_TTL_MS,
  });
};

// Caché de listas completas (todas las páginas) por tipo — usado por PublicacionesPage
export const publicacionesTodasCache = {};
export const publicacionesTodasPending = {};

export const clearPublicacionesListCache = () => {
  publicacionesListCache.clear();
  publicacionesListPending.clear();
  publicacionDetailCache.clear();
  publicacionDetailPending.clear();
  publicacionesContactoCache.clear();
  publicacionesContactoPending.clear();
  Object.keys(publicacionesTodasCache).forEach((k) => delete publicacionesTodasCache[k]);
  Object.keys(publicacionesTodasPending).forEach((k) => delete publicacionesTodasPending[k]);
};

export const publicacionesService = {
  getRazas: async () => {
    try {
      const { data } = await axiosInstance.get("/publicaciones/razas");
      return data;
    } catch (error) {
      console.error("Error en getRazas:", error);
      return {
        success: false,
        razas: [],
        razasPorEspecie: {},
        msg: "No se pudieron obtener las razas",
        errors: {},
      };
    }
  },

  getPublicaciones: async (
    { page = 1, limit = 12, tipo, estado, search } = {},
    { forceRefresh = false } = {},
  ) => {
    const cacheKey = buildPublicacionesListKey({
      page,
      limit,
      tipo,
      estado,
      search,
    });

    if (!forceRefresh) {
      const cached = getCachedPublicacionesList(cacheKey);
      if (cached) {
        return cached;
      }

      const pendingRequest = publicacionesListPending.get(cacheKey);
      if (pendingRequest) {
        return pendingRequest;
      }
    }

    const request = (async () => {
      try {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", limit);

        if (tipo) params.append("tipo", tipo);
        if (estado) params.append("estado", estado);
        if (search) params.append("search", search);

        const { data } = await axiosInstance.get(`/publicaciones?${params.toString()}`);
        setCachedPublicacionesList(cacheKey, data);
        return data;
      } catch (error) {
        return mapServiceError(error, "No se pudieron obtener publicaciones");
      } finally {
        publicacionesListPending.delete(cacheKey);
      }
    })();

    publicacionesListPending.set(cacheKey, request);
    return request;
  },

  getPublicacionesUsuario: async (id) => {
    try {
      const { data } = await axiosInstance.get(`/publicaciones/usuario/${id}`);
      return data;
    } catch (error) {
      console.error("Error en getPublicacionesUsuario:", error);
      return mapServiceError(error, "No se pudieron obtener publicaciones del usuario");
    }
  },

  getPublicacionById: async (id) => {
    const cacheKey = String(id || "");

    const cached = getCachedTimedEntry(publicacionDetailCache, cacheKey);
    if (cached) {
      return cached;
    }

    const pendingRequest = publicacionDetailPending.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest;
    }

    const request = (async () => {
      try {
        const { data } = await axiosInstance.get(`/publicaciones/${id}`);
        setCachedTimedEntry(publicacionDetailCache, cacheKey, data);
        return data;
      } catch (error) {
        return mapServiceError(error, "No se pudo obtener la publicación");
      } finally {
        publicacionDetailPending.delete(cacheKey);
      }
    })();

    publicacionDetailPending.set(cacheKey, request);
    return request;
  },

  getContactoPublicacion: async (id) => {
    const cacheKey = String(id || "");

    const cached = getCachedTimedEntry(publicacionesContactoCache, cacheKey);
    if (cached) {
      return cached;
    }

    const pendingRequest = publicacionesContactoPending.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest;
    }

    const request = (async () => {
      try {
        const { data } = await axiosInstance.get(`/publicaciones/contacto/${id}`);
        const result = buildServiceSuccess({
          whatsapp: data.whatsapp || "",
        });
        setCachedTimedEntry(publicacionesContactoCache, cacheKey, result);
        return result;
      } catch (error) {
        return mapServiceError(error, "No se pudo obtener el contacto de la publicación");
      } finally {
        publicacionesContactoPending.delete(cacheKey);
      }
    })();

    publicacionesContactoPending.set(cacheKey, request);
    return request;
  },

  crearPublicacion: async (datos) => {
    try {
      const { data } = await axiosInstance.post("/publicaciones", datos);
      clearPublicacionesListCache();
      return data;
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  actualizarPublicacion: async (id, datos) => {
    try {
      const { data } = await axiosInstance.put(`/publicaciones/${id}`, datos);
      clearPublicacionesListCache();
      return data;
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  actualizarEstado: async (id, estado) => {
    try {
      const { data } = await axiosInstance.put(`/publicaciones/${id}/estado`, { estado });
      clearPublicacionesListCache();
      return buildServiceSuccess({ publicacion: data.publicacion });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },

  borrarPublicacion: async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/publicaciones/${id}`);
      clearPublicacionesListCache();
      return data;
    } catch (error) {
      return mapServiceError(error, "Error de conexión al servidor");
    }
  },
};
