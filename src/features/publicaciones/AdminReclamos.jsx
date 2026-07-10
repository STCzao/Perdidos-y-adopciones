import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../components/ui/ModalShell";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import LoadingState from "../../components/ui/LoadingState";
import { reclamosService } from "../../services/reclamos";
import { adminService } from "../../services/admin";

let modalControl;

const FILTRO_SELECT =
  "rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] outline-none transition focus:border-[#d46f49]/40";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const formatFecha = (value) => (value ? new Date(value).toLocaleDateString() : "Sin fecha");

const Chip = ({ children }) => (
  <span className="rounded-full border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] px-2.5 py-0.5 text-xs text-[color:var(--shell-muted)]">
    {children}
  </span>
);

export const AdminReclamos = {
  openModal: () => {
    if (!modalControl) return false;
    modalControl.setOpen(true);
    return true;
  },

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState("buscador");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [telefono, setTelefono] = useState("");
    const [clusters, setClusters] = useState([]);
    const [loadingClusters, setLoadingClusters] = useState(false);
    const [huboBusqueda, setHuboBusqueda] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const [selectedClusterId, setSelectedClusterId] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());

    const [usuarioQuery, setUsuarioQuery] = useState("");
    const [usuarioResultados, setUsuarioResultados] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [buscandoUsuario, setBuscandoUsuario] = useState(false);

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });

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
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      };
    }, [open]);

    const buscarClusters = useCallback(async (telefonoBusqueda, targetPage = 1) => {
      setLoadingClusters(true);
      setError("");
      try {
        const result = await reclamosService.getHuerfanos(telefonoBusqueda, targetPage, 20);
        if (result.success) {
          setClusters(result.clusters || []);
          setTotal(result.total || 0);
          setTotalPages(result.totalPages || 1);
          setPage(result.page || targetPage);
        } else {
          setError(result.msg || "Error al buscar publicaciones huérfanas");
        }
      } catch {
        setError("Error de conexión al servidor");
      } finally {
        setLoadingClusters(false);
        setHuboBusqueda(true);
      }
    }, []);

    const abrirDetalle = useCallback(async (usuarioViejoId) => {
      setSelectedClusterId(usuarioViejoId);
      setView("detalle");
      setLoadingDetalle(true);
      setError("");
      setUsuarioQuery("");
      setUsuarioSeleccionado(null);
      setUsuarioResultados([]);
      try {
        const result = await reclamosService.getHuerfanoDetalle(usuarioViejoId);
        if (result.success) {
          setPublicaciones(result.publicaciones || []);
          setSelectedIds(new Set((result.publicaciones || []).map((p) => p._id)));
        } else {
          setError(result.msg || "Error al cargar el detalle del cluster");
        }
      } catch {
        setError("Error de conexión al servidor");
      } finally {
        setLoadingDetalle(false);
      }
    }, []);

    const volverABuscador = useCallback(() => {
      setView("buscador");
      setSelectedClusterId(null);
      setPublicaciones([]);
      setSelectedIds(new Set());
      setError("");
    }, []);

    useEffect(() => {
      if (view !== "detalle") return;
      if (!usuarioQuery || OBJECT_ID_REGEX.test(usuarioQuery.trim())) {
        setUsuarioResultados([]);
        return;
      }

      const timer = setTimeout(async () => {
        setBuscandoUsuario(true);
        const result = await adminService.getUsuariosAdmin({ search: usuarioQuery, limit: 8 });
        setBuscandoUsuario(false);
        if (result.success) {
          setUsuarioResultados(result.usuarios || []);
        }
      }, 400);

      return () => clearTimeout(timer);
    }, [usuarioQuery, view]);

    const toggleSeleccion = (id) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    const getUsuarioNuevoId = useCallback(() => {
      const query = usuarioQuery.trim();
      if (usuarioSeleccionado) return usuarioSeleccionado._id;
      if (OBJECT_ID_REGEX.test(query)) return query;
      return null;
    }, [usuarioQuery, usuarioSeleccionado]);

    const abrirConfirmacion = () => {
      const usuarioNuevoId = getUsuarioNuevoId();
      if (!usuarioNuevoId) {
        setError("Elegí un usuario de la lista o pegá un ID válido");
        return;
      }
      if (selectedIds.size === 0) {
        setError("Seleccioná al menos una publicación");
        return;
      }
      setError("");
      setConfirmModal({
        isOpen: true,
        item: {
          cantidad: selectedIds.size,
          correo: usuarioSeleccionado?.correo || usuarioNuevoId,
        },
      });
    };

    const closeConfirmModal = useCallback(() => {
      setConfirmModal({ isOpen: false, item: null });
    }, []);

    const handleConfirmarReasignacion = useCallback(async () => {
      const usuarioNuevoId = getUsuarioNuevoId();
      if (!usuarioNuevoId) return;

      const todasSeleccionadas = selectedIds.size === publicaciones.length;

      const result = await reclamosService.asignarPublicaciones(
        todasSeleccionadas
          ? { usuarioViejoId: selectedClusterId, usuarioNuevo: usuarioNuevoId }
          : { publicaciones: [...selectedIds], usuarioNuevo: usuarioNuevoId },
      );

      if (result.success) {
        setSuccessMsg(`${result.publicacionesReasignadas} publicación(es) reasignadas correctamente`);
        volverABuscador();
      } else {
        setError(result.msg || "Error al reasignar publicaciones");
      }
    }, [selectedClusterId, selectedIds, publicaciones, getUsuarioNuevoId, volverABuscador]);

    const handleClose = useCallback(() => {
      setOpen(false);
      setView("buscador");
      setError("");
      setSuccessMsg("");
      setTelefono("");
      setClusters([]);
      setHuboBusqueda(false);
      setPage(1);
      setTotalPages(1);
      setTotal(0);
      setSelectedClusterId(null);
      setPublicaciones([]);
      setSelectedIds(new Set());
      setUsuarioQuery("");
      setUsuarioResultados([]);
      setUsuarioSeleccionado(null);
      closeConfirmModal();
    }, [closeConfirmModal]);

    if (!open) return null;

    return (
      <ModalShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex max-h-[90vh] w-full max-w-5xl flex-col items-center overflow-y-auto"
        >
          <div className="relative w-full max-w-5xl rounded-[1.5rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] px-6 py-6 text-center shadow-[0_28px_70px_rgba(36,25,20,0.12)] sm:px-8">
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
                Reclamar publicaciones
              </h1>
              <p className="mt-1 text-sm text-[color:var(--shell-muted)]">
                Reasigná publicaciones huérfanas a la cuenta nueva de un usuario
              </p>
            </div>

            {successMsg && (
              <div className="mt-4 rounded-[1rem] border border-[color:var(--shell-line)] bg-[#eaf5ea] p-3">
                <p className="text-[#2f6b2f]">{successMsg}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-[1rem] border border-[#d62828]/18 bg-[color:var(--shell-danger-soft)] p-3">
                <p className="text-[#a44939]">{error}</p>
              </div>
            )}

            {view === "buscador" ? (
              <>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <input
                    className={FILTRO_SELECT}
                    placeholder="Buscar por teléfono (whatsapp)"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && buscarClusters(telefono, 1)}
                  />
                  <button
                    onClick={() => buscarClusters(telefono, 1)}
                    className="cursor-pointer rounded-full bg-[color:var(--shell-bark)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#45362d]"
                  >
                    Buscar
                  </button>
                  <button
                    onClick={() => {
                      setTelefono("");
                      buscarClusters("", 1);
                    }}
                    className="cursor-pointer rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] transition hover:bg-[#fffaf4]"
                  >
                    Ver todos los huérfanos
                  </button>
                </div>

                {huboBusqueda && !loadingClusters && (
                  <p className="mt-4 text-sm text-[color:var(--shell-muted)]">
                    {total} cuenta{total === 1 ? "" : "s"} huérfana{total === 1 ? "" : "s"} encontrada
                    {total === 1 ? "" : "s"}
                  </p>
                )}

                {loadingClusters ? (
                  <LoadingState compact label="Buscando..." />
                ) : (
                  <div className="mt-4 max-h-[50vh] space-y-3 overflow-y-auto text-left">
                    {clusters.map((cluster) => (
                      <div
                        key={cluster.usuarioViejoId}
                        className="flex flex-col gap-3 rounded-[1.1rem] border border-[color:var(--shell-line)] bg-white/72 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold text-[color:var(--shell-ink)]">
                            {cluster.cantidad} publicación(es)
                          </p>
                          <p className="mt-1 text-sm text-[#7b685c]">
                            {formatFecha(cluster.primeraFecha)} — {formatFecha(cluster.ultimaFecha)}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {(cluster.tipos || []).map((t) => (
                              <Chip key={t}>{t}</Chip>
                            ))}
                            {(cluster.localidades || []).map((l) => (
                              <Chip key={l}>{l}</Chip>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => abrirDetalle(cluster.usuarioViejoId)}
                          className="cursor-pointer rounded-full bg-[color:var(--shell-bark)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#45362d]"
                        >
                          Ver detalle
                        </button>
                      </div>
                    ))}

                    {huboBusqueda && clusters.length === 0 && (
                      <div className="py-8 text-center text-[color:var(--shell-muted)]/80">
                        No se encontraron publicaciones huérfanas
                      </div>
                    )}
                  </div>
                )}

                {!loadingClusters && totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[color:var(--shell-muted)]">
                      Página {page} de {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={page === 1}
                        onClick={() => buscarClusters(telefono, page - 1)}
                        className="rounded-lg border border-[color:var(--shell-line)] px-3 py-1.5 disabled:opacity-40"
                      >
                        Anterior
                      </button>
                      <button
                        disabled={page === totalPages}
                        onClick={() => buscarClusters(telefono, page + 1)}
                        className="rounded-lg border border-[color:var(--shell-line)] px-3 py-1.5 disabled:opacity-40"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mt-4 flex items-center justify-start">
                  <button
                    onClick={volverABuscador}
                    className="cursor-pointer rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] transition hover:bg-[#fffaf4]"
                  >
                    ← Volver
                  </button>
                </div>

                {loadingDetalle ? (
                  <LoadingState compact label="Cargando publicaciones..." />
                ) : (
                  <>
                    <div className="mt-4 max-h-[45vh] space-y-2 overflow-y-auto text-left">
                      {publicaciones.map((pub) => (
                        <label
                          key={pub._id}
                          className="flex cursor-pointer items-start gap-3 rounded-[1rem] border border-[color:var(--shell-line)] bg-white/72 p-3"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.has(pub._id)}
                            onChange={() => toggleSeleccion(pub._id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-[color:var(--shell-ink)]">
                              {pub.nombreanimal || "Sin nombre"} — {pub.tipo} / {pub.especie}
                            </p>
                            <p className="text-sm text-[#7b685c]">
                              {pub.localidad} • {formatFecha(pub.fecha)} • WhatsApp: {pub.whatsapp}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2">
                      <div className="relative">
                        <input
                          className={FILTRO_SELECT}
                          placeholder="Buscar usuario destino por correo o ID"
                          value={usuarioQuery}
                          onChange={(e) => {
                            setUsuarioQuery(e.target.value);
                            setUsuarioSeleccionado(null);
                          }}
                        />
                        {usuarioResultados.length > 0 && !usuarioSeleccionado && (
                          <div className="absolute left-0 top-full z-10 mt-1 w-72 rounded-[0.9rem] border border-[color:var(--shell-line)] bg-white text-left shadow-lg">
                            {usuarioResultados.map((u) => (
                              <button
                                key={u._id}
                                onClick={() => {
                                  setUsuarioSeleccionado(u);
                                  setUsuarioQuery(u.correo);
                                  setUsuarioResultados([]);
                                }}
                                className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-[#fffaf4]"
                              >
                                <span className="font-medium text-[#3d332d]">{u.nombre}</span>
                                <span className="ml-2 text-[color:var(--shell-muted)]">{u.correo}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {buscandoUsuario && (
                          <p className="mt-1 text-xs text-[color:var(--shell-muted)]">Buscando...</p>
                        )}
                      </div>

                      <button
                        onClick={abrirConfirmacion}
                        disabled={selectedIds.size === 0}
                        className="cursor-pointer rounded-full bg-[color:var(--shell-bark)] px-4 py-2 text-sm text-white transition-colors hover:bg-[#45362d] disabled:opacity-40"
                      >
                        Reasignar seleccionadas ({selectedIds.size})
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <ConfirmModal
            confirmModal={confirmModal}
            onClose={closeConfirmModal}
            onConfirm={handleConfirmarReasignacion}
            type="reclamo"
          />
        </motion.div>
      </ModalShell>
    );
  }),
};
