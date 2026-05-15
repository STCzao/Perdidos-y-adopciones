import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../components/ui/ModalShell";
import { adminService } from "../../services/admin";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import LoadingState from "../../components/ui/LoadingState";

let modalControl;

const FILTRO_SELECT =
  "rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] outline-none transition focus:border-[#d46f49]/40";

const SortableHeader = ({ label, campo, sortBy, sortOrder, onSort }) => (
  <th
    onClick={() => onSort(campo)}
    className="cursor-pointer select-none px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#816959]"
  >
    {label}
    {sortBy === campo ? (sortOrder === "asc" ? " ↑" : " ↓") : ""}
  </th>
);

export const AdminUsuarios = {
  openModal: () => {
    if (!modalControl) return false;
    modalControl.setOpen(true);
    return true;
  },

  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("fechaCreacion");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filtros, setFiltros] = useState({ search: "", rol: "", estado: "" });
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      item: null,
      action: "",
      nuevoRol: "",
    });

    const cargarUsuarios = useCallback(async (params) => {
      setLoading(true);
      setError("");
      try {
        const result = await adminService.getUsuariosAdmin(params);
        if (result.success) {
          setUsuarios(result.usuarios);
          setTotalPages(result.totalPages);
          setTotal(result.total);
        } else {
          setError(result.msg || "Error al cargar usuarios");
        }
      } catch {
        setError("Error de conexión al servidor");
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
        cargarUsuarios({ page: 1, limit: 20, sortBy, sortOrder, ...filtros });
      } else {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      };
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      if (!open) return;
      cargarUsuarios({ page, limit: 20, sortBy, sortOrder, ...filtros });
    }, [cargarUsuarios, filtros, open, page, sortBy, sortOrder]);

    const handleSort = (campo) => {
      if (sortBy === campo) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(campo);
        setSortOrder("asc");
      }
      setPage(1);
    };

    const handleCambiarEstado = useCallback(async (usuario) => {
      try {
        const id = usuario._id || usuario.id || usuario.uid;
        const nuevoEstado = !usuario.estado;

        if (usuario.rol === "ADMIN_ROLE") {
          setError("No se puede modificar el estado de un administrador");
          return;
        }

        const result = await adminService.cambiarEstadoUsuario(id, nuevoEstado);

        if (result.success) {
          setUsuarios((prev) =>
            prev.map((u) => ((u._id || u.id || u.uid) === id ? { ...u, estado: nuevoEstado } : u)),
          );
        } else {
          setError(result.msg || "Error al cambiar estado");
        }
      } catch {
        setError("Error de conexión al servidor");
      }
    }, []);

    const handleCambiarRol = async (usuario, nuevoRol) => {
      try {
        const id = usuario._id || usuario.id || usuario.uid;
        const result = await adminService.cambiarRolUsuario(id, nuevoRol);

        if (result.success) {
          setUsuarios((prev) =>
            prev.map((u) => ((u._id || u.id || u.uid) === id ? { ...u, rol: nuevoRol } : u)),
          );
        } else {
          setError(result.msg || "Error al cambiar rol");
        }
      } catch {
        setError("Error de conexión al servidor");
      }
    };

    const closeConfirmModal = useCallback(() => {
      setConfirmModal({ isOpen: false, item: null, action: "", nuevoRol: "" });
    }, []);

    const handleConfirm = useCallback(async () => {
      switch (confirmModal.action) {
        case "toggleState":
          await handleCambiarEstado(confirmModal.item);
          break;
        case "cambiarRol":
          await handleCambiarRol(confirmModal.item, confirmModal.nuevoRol);
          break;
        default:
          break;
      }

      closeConfirmModal();
    }, [closeConfirmModal, confirmModal, handleCambiarEstado, handleCambiarRol]);

    const handleClose = useCallback(() => {
      setOpen(false);
      setUsuarios([]);
      setLoading(false);
      setError("");
      setPage(1);
      setTotalPages(1);
      setTotal(0);
      setSortBy("fechaCreacion");
      setSortOrder("desc");
      setFiltros({ search: "", rol: "", estado: "" });
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

            <h1 className="mt-2 text-3xl font-medium text-[color:var(--shell-ink)]">
              Administrar usuarios
            </h1>
            <p className="mt-1 text-sm text-[color:var(--shell-muted)]">
              Gestiona todos los usuarios del sitio
            </p>

            {error && (
              <div className="mt-4 rounded-[1rem] border border-[#d62828]/18 bg-[color:var(--shell-danger-soft)] p-3">
                <p className="text-[#a44939]">{error}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <input
                className={FILTRO_SELECT}
                placeholder="Buscar por nombre o email..."
                value={filtros.search}
                onChange={(e) => {
                  setFiltros((p) => ({ ...p, search: e.target.value }));
                  setPage(1);
                }}
              />
              <select
                className={FILTRO_SELECT}
                value={filtros.rol}
                onChange={(e) => {
                  setFiltros((p) => ({ ...p, rol: e.target.value }));
                  setPage(1);
                }}
              >
                <option value="">Todos los roles</option>
                <option value="USER_ROLE">Usuario</option>
                <option value="MODERADOR_ROLE">Moderador</option>
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
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>

            {loading ? (
              <LoadingState compact label="Cargando usuarios..." />
            ) : (
              <>
                <div className="mt-6 overflow-hidden rounded-[1rem] border border-[color:var(--shell-line)] bg-white shadow-sm">
                  <div className="max-h-[56vh] overflow-x-auto overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-[color:var(--shell-line)] bg-[#fffaf4]">
                        <tr>
                          <SortableHeader label="Nombre" campo="nombre" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                          <SortableHeader label="Correo" campo="correo" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                          <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
                            Teléfono
                          </th>
                          <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
                            Rol
                          </th>
                          <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
                            Estado
                          </th>
                          <SortableHeader label="Fecha" campo="fechaCreacion" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                          <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[color:var(--shell-line)]">
                        {usuarios.map((usuario) => {
                          const id = usuario._id || usuario.id || usuario.uid;

                          return (
                            <tr key={id}>
                              <td className="px-4 py-3 font-medium text-[#3d332d]">{usuario.nombre || "—"}</td>
                              <td className="px-4 py-3 text-[#5f4c41]">{usuario.correo || "—"}</td>
                              <td className="px-4 py-3 text-[#5f4c41]">{usuario.telefono || "—"}</td>
                              <td className="px-4 py-3">
                                <select
                                  value={usuario.rol}
                                  disabled={usuario.rol === "ADMIN_ROLE" || loading}
                                  onChange={(e) => {
                                    const nuevoRol = e.target.value;
                                    setConfirmModal({
                                      isOpen: true,
                                      item: usuario,
                                      action: "cambiarRol",
                                      nuevoRol,
                                    });
                                  }}
                                  className="rounded-[0.5rem] border border-[color:var(--shell-line)] bg-white px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <option value="USER_ROLE">Usuario</option>
                                  <option value="MODERADOR_ROLE">Moderador</option>
                                  {usuario.rol === "ADMIN_ROLE" && <option value="ADMIN_ROLE">Admin</option>}
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    usuario.estado
                                      ? "bg-[#dbe7b5] text-[#4d6a2e]"
                                      : "bg-[color:var(--shell-danger-soft)] text-[#a44939]"
                                  }`}
                                >
                                  {usuario.estado ? "Activo" : "Inactivo"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[#816959]">
                                {usuario.fechaCreacion
                                  ? new Date(usuario.fechaCreacion).toLocaleDateString("es-AR")
                                  : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() =>
                                    setConfirmModal({
                                      isOpen: true,
                                      item: usuario,
                                      action: "toggleState",
                                      nuevoRol: "",
                                    })
                                  }
                                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                    usuario.rol === "ADMIN_ROLE"
                                      ? "cursor-not-allowed bg-[#d8d0c6] text-[#8f7f74]"
                                      : usuario.estado
                                        ? "cursor-pointer bg-[color:var(--shell-danger)] text-white hover:bg-[#b91f1f]"
                                        : "cursor-pointer bg-[color:var(--shell-bark)] text-white hover:bg-[#45362d]"
                                  }`}
                                  disabled={loading || usuario.rol === "ADMIN_ROLE"}
                                >
                                  {usuario.rol === "ADMIN_ROLE"
                                    ? "Bloqueado"
                                    : usuario.estado
                                      ? "Desactivar"
                                      : "Activar"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {usuarios.length === 0 && !loading && (
                  <div className="py-8 text-center text-[color:var(--shell-muted)]/80">
                    No hay usuarios para mostrar
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[color:var(--shell-muted)]">
                      {total} usuarios · Pagina {page} de {totalPages}
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
            type="usuario"
          />
        </motion.div>
      </ModalShell>
    );
  }),
};
