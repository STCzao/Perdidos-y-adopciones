import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../components/ui/ModalShell";
import { adminService } from "../../services/admin";
import { publicacionesService } from "../../services/publicaciones";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import LoadingState from "../../components/ui/LoadingState";
import { getEstadosPermitidos } from "../../utils/estadosPublicacion";
import { getTipoColorMeta } from "../../utils/publicacionColors";
import { LOCALIDADES_TUCUMAN } from "../../utils/localidades";
import { getPublicacionTitulo } from "./utils/publicacionFields";

let modalControl;

const FILTRO_SELECT =
  "rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] outline-none transition focus:border-[#d46f49]/40";

const getTipoBadgeStyle = (tipo) => {
  const meta = getTipoColorMeta(tipo);

  return {
    backgroundColor: `${meta.accent}33`,
    color: meta.accent,
  };
};

export const AdminPublicaciones = {
  openModal: () => {
    if (!modalControl) return false;
    modalControl.setOpen(true);
    return true;
  },

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("fechaCreacion");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filtros, setFiltros] = useState({
      search: "",
      tipo: "",
      estado: "",
      raza: "",
      localidad: "",
    });
    const [searchInput, setSearchInput] = useState("");
    const [razasDisponibles, setRazasDisponibles] = useState([]);
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      item: null,
      action: "",
    });

    const cargarPublicaciones = useCallback(async (targetPage = 1, params = {}) => {
      setLoading(true);
      setError("");
      try {
        const result = await adminService.getPublicacionesPagina(targetPage, 15, params);
        if (result.success) {
          setPublicaciones(result.publicaciones || []);
          setTotalPages(result.totalPages || 1);
          setPage(targetPage);
        } else {
          setError(result.msg || "Error al cargar publicaciones");
        }
      } catch {
        setError("Error de conexion al servidor");
      } finally {
        setLoading(false);
      }
    }, []);

    useLayoutEffect(() => {
      modalControl = { setOpen };
      return () => {
        modalControl = null;
      };
    }, []);

    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        publicacionesService.getRazas().then((res) => {
          if (res.razasPorEspecie) {
            const todasRazas = Object.values(res.razasPorEspecie).flat();
            setRazasDisponibles([...new Set(todasRazas)].sort());
          }
        });
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      };
    }, [open]);

    useEffect(() => {
      if (!open) return;
      const timer = setTimeout(() => {
        setFiltros((p) => ({ ...p, search: searchInput }));
        setPage(1);
      }, 400);
      return () => clearTimeout(timer);
    }, [searchInput, open]);

    useEffect(() => {
      if (!open) return;
      cargarPublicaciones(page, { sortBy, sortOrder, ...filtros });
    }, [cargarPublicaciones, filtros, open, page, sortBy, sortOrder]);

    const handleSort = (campo) => {
      if (sortBy === campo) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(campo);
        setSortOrder("asc");
      }
      setPage(1);
    };

    const handleEliminar = useCallback(async (publicacion) => {
      try {
        const result = await publicacionesService.borrarPublicacion(publicacion._id);
        if (result.success) {
          await cargarPublicaciones(page, { sortBy, sortOrder, ...filtros });
          return true;
        }

        setError(result.msg || "Error al eliminar publicacion");
        return false;
      } catch {
        setError("Error de conexion al eliminar");
        return false;
      }
    }, [cargarPublicaciones, filtros, page, sortBy, sortOrder]);

    const handleEditarEstado = useCallback(async (id, nuevoEstado) => {
      try {
        const result = await publicacionesService.actualizarEstado(id, nuevoEstado);
        if (result.success) {
          setPublicaciones((prev) => prev.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p)));
          return true;
        }

        setError(result.msg || "Error al actualizar estado");
        return false;
      } catch {
        setError("Error de conexion al actualizar estado");
        return false;
      }
    }, []);

    const exportar = async () => {
      try {
        const blob = await adminService.exportarPublicaciones(filtros);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `publicaciones-${new Date().toLocaleDateString("es-AR")}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        setError("Error al exportar. Intenta de nuevo.");
      }
    };

    const openConfirmModal = useCallback((item, action) => {
      setConfirmModal({ isOpen: true, item, action });
    }, []);

    const closeConfirmModal = useCallback(() => {
      setConfirmModal({ isOpen: false, item: null, action: "" });
    }, []);

    const handleConfirm = useCallback(async () => {
      if (confirmModal.action === "delete" && confirmModal.item) {
        await handleEliminar(confirmModal.item);
      }
      closeConfirmModal();
    }, [closeConfirmModal, confirmModal, handleEliminar]);

    const handleClose = useCallback(() => {
      setOpen(false);
      setError("");
      setPublicaciones([]);
      setPage(1);
      setTotalPages(1);
      setSortBy("fechaCreacion");
      setSortOrder("desc");
      setFiltros({ search: "", tipo: "", estado: "", raza: "", localidad: "" });
      setSearchInput("");
      setRazasDisponibles([]);
      closeConfirmModal();
    }, [closeConfirmModal]);

    if (!open) return null;

    return (
      <ModalShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex max-h-[90vh] w-full max-w-6xl flex-col items-center overflow-y-auto"
        >
          <div className="relative w-full max-w-6xl rounded-[1.5rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] px-6 py-6 text-center shadow-[0_28px_70px_rgba(36,25,20,0.12)] sm:px-8">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 cursor-pointer text-[color:var(--shell-muted)] transition-colors hover:text-[color:var(--shell-accent-strong)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col items-center justify-center">
              <h1 className="mt-2 text-3xl font-medium text-[color:var(--shell-ink)]">
                Administrar publicaciones
              </h1>
              <p className="mt-1 text-sm text-[color:var(--shell-muted)]">
                Gestiona todas las publicaciones del sitio
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-[1rem] border border-[#d62828]/18 bg-[color:var(--shell-danger-soft)] p-3">
                <p className="text-[#a44939]">{error}</p>
                <button
                  onClick={() => cargarPublicaciones(page, { sortBy, sortOrder, ...filtros })}
                  className="mt-2 cursor-pointer rounded-full bg-[color:var(--shell-danger)] px-4 py-2 text-white transition-colors hover:bg-[#b91f1f]"
                >
                  Reintentar
                </button>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <input
                className={FILTRO_SELECT}
                placeholder="Buscar por nombre, raza..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <select
                className={FILTRO_SELECT}
                value={filtros.tipo}
                onChange={(e) => {
                  setFiltros((p) => ({ ...p, tipo: e.target.value }));
                  setPage(1);
                }}
              >
                <option value="">Todos los tipos</option>
                <option value="PERDIDO">Perdido</option>
                <option value="ENCONTRADO">Encontrado</option>
                <option value="ADOPCION">Adopcion</option>
              </select>
              <select
                className={FILTRO_SELECT}
                value={filtros.estado}
                onChange={(e) => {
                  setFiltros((p) => ({ ...p, estado: e.target.value }));
                  setPage(1);
                }}
              >
                <option value="">Todos los estados</option>
                <optgroup label="Perdido">
                  <option value="SE BUSCA">Se busca</option>
                  <option value="YA APARECIO">Ya apareció</option>
                </optgroup>
                <optgroup label="Encontrado">
                  <option value="BUSCANDO A SU FAMILIA">Buscando a su familia</option>
                  <option value="APARECIO SU FAMILIA">Apareció su familia</option>
                  <option value="TIENE NUEVA FAMILIA">Tiene nueva familia</option>
                </optgroup>
                <optgroup label="Adopción">
                  <option value="EN BUSCA DE UN HOGAR">En busca de un hogar</option>
                  <option value="ADOPTADO">Adoptado</option>
                </optgroup>
                <option value="INACTIVO">Inactivo</option>
              </select>
              <select
                className={FILTRO_SELECT}
                value={filtros.localidad}
                onChange={(e) => {
                  setFiltros((p) => ({ ...p, localidad: e.target.value }));
                  setPage(1);
                }}
              >
                <option value="">Todas las localidades</option>
                {LOCALIDADES_TUCUMAN.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {razasDisponibles.length > 0 && (
                <select
                  className={FILTRO_SELECT}
                  value={filtros.raza}
                  onChange={(e) => {
                    setFiltros((p) => ({ ...p, raza: e.target.value }));
                    setPage(1);
                  }}
                >
                  <option value="">Todas las razas</option>
                  {razasDisponibles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => {
                  setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
                  setPage(1);
                }}
                className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] transition hover:bg-[#fffaf4]"
              >
                {sortOrder === "desc" ? "Mas reciente primero" : "Mas antiguo primero"}
              </button>
              <button
                onClick={exportar}
                className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] transition hover:bg-[#fffaf4]"
              >
                Exportar Excel
              </button>
            </div>

            {loading ? (
              <LoadingState compact label="Cargando publicaciones..." />
            ) : (
              <>
                <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto">
                  {publicaciones.map((publicacion) => (
                    <PublicacionItem
                      key={publicacion._id}
                      publicacion={publicacion}
                      onEliminar={openConfirmModal}
                      onEditarEstado={handleEditarEstado}
                      loading={loading}
                    />
                  ))}

                  {publicaciones.length === 0 && !loading && (
                    <div className="py-8 text-center text-[color:var(--shell-muted)]/80">
                      No hay publicaciones para mostrar
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[color:var(--shell-muted)]">
                      Pagina {page} de {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={page === 1 || loading}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-lg border border-[color:var(--shell-line)] px-3 py-1.5 disabled:opacity-40"
                      >
                        Anterior
                      </button>
                      <button
                        disabled={page === totalPages || loading}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-lg border border-[color:var(--shell-line)] px-3 py-1.5 disabled:opacity-40"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <ConfirmModal
            confirmModal={confirmModal}
            onClose={closeConfirmModal}
            onConfirm={handleConfirm}
            type="publicacion"
          />
        </motion.div>
      </ModalShell>
    );
  }),
};

const PublicacionItem = React.memo(({ publicacion, onEliminar, onEditarEstado, loading }) => {
  const estados = getEstadosPermitidos(publicacion.tipo);

  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    onEditarEstado(publicacion._id, nuevoEstado);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 rounded-[1.1rem] border border-[color:var(--shell-line)] bg-white/72 p-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="flex-1 text-left">
        <h3 className="text-lg font-semibold text-[color:var(--shell-ink)]">
          {getPublicacionTitulo(publicacion)}
        </h3>

        <div className="mt-2 flex flex-wrap gap-2 text-sm text-[color:var(--shell-muted)]">
          <span className="rounded px-2 py-1" style={getTipoBadgeStyle(publicacion.tipo)}>
            {publicacion.tipo}
          </span>

          <select
            value={publicacion.estado}
            onChange={handleEstadoChange}
            disabled={loading}
            className="cursor-pointer rounded-[0.6rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-2 py-1 text-[color:var(--shell-muted)]"
          >
            {estados.map((estado) => (
              <option className="text-black" key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>

          <span className="text-[color:var(--shell-muted)]">Raza: {publicacion.raza}</span>
          <span className="text-[color:var(--shell-muted)]">Color: {publicacion.color}</span>
        </div>

        <p className="mt-2 text-sm text-[#7b685c]">
          Por: {publicacion.usuario?.nombre} •{" "}
          {publicacion.fechaCreacion
            ? new Date(publicacion.fechaCreacion).toLocaleDateString()
            : "Sin fecha"}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:ml-4 sm:w-auto sm:flex-row">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("openCrearPublicacion", { detail: publicacion }));
          }}
          className="w-full cursor-pointer rounded-full bg-[color:var(--shell-bark)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#45362d] sm:w-auto"
          disabled={loading}
        >
          Editar
        </button>
        <button
          onClick={() => onEliminar(publicacion, "delete")}
          className="w-full cursor-pointer rounded-full bg-[color:var(--shell-danger)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#b91f1f] sm:w-auto"
          disabled={loading}
        >
          Eliminar
        </button>
      </div>
    </motion.div>
  );
});
