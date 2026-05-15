import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../../components/ui/ModalShell";
import LoadingState from "../../../components/ui/LoadingState";
import { colaboradoresService } from "../../../services/colaboradores";
import {
  DETALLE_CAMPO,
  FORMAS_COLABORACION,
  LABELS_DISPONIBILIDAD,
  LABELS_MOMENTOS,
  OPCIONES_DETALLE,
} from "../../../utils/colaboradoresConstants";
import { LOCALIDADES_TUCUMAN } from "../../../utils/localidades";

let modalControl;

const FILTRO_SELECT =
  "rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] outline-none transition focus:border-[#d46f49]/40";

const getDetalleLabel = (forma, valor) =>
  OPCIONES_DETALLE[forma]?.find((item) => item.value === valor)?.label || valor;

const DetalleColaborador = React.memo(({ detalle, onVolver, onToggleActivo }) => (
  <div>
    <div className="mb-4 flex items-center justify-between lg:hidden">
      <button
        onClick={onVolver}
        className="cursor-pointer rounded-full border border-[color:var(--shell-line)] px-3 py-1.5 text-sm text-[#5c4b42] transition hover:bg-[#f6efe4]"
      >
        ← Volver
      </button>
      <button
        onClick={() => onToggleActivo(detalle)}
        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition ${
          detalle.activo ? "bg-[#4d6a2e]/15 text-[#4d6a2e]" : "bg-[#9e9e9e]/15 text-[#666]"
        }`}
      >
        {detalle.activo ? "Activo" : "Inactivo"}
      </button>
    </div>

    <div className="mb-4 hidden items-center justify-between lg:flex">
      <h2 className="text-lg font-semibold text-[color:var(--shell-ink)]">{detalle.nombre}</h2>
      <button
        onClick={() => onToggleActivo(detalle)}
        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition ${
          detalle.activo ? "bg-[#4d6a2e]/15 text-[#4d6a2e]" : "bg-[#9e9e9e]/15 text-[#666]"
        }`}
      >
        {detalle.activo ? "Activo" : "Inactivo"}
      </button>
    </div>

    <dl className="space-y-2 text-sm">
      {[
        ["Teléfono", detalle.telefono],
        ["Email", detalle.email || "—"],
        ["Localidad", detalle.localidad],
        ["Barrio", detalle.barrio || "—"],
        ["Referencia", detalle.direccionReferencia || "—"],
        [
          "Disponibilidad",
          LABELS_DISPONIBILIDAD[detalle.disponibilidadGeneral] || detalle.disponibilidadGeneral,
        ],
      ].map(([k, v]) => (
        <div
          key={k}
          className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white/60 px-3 py-2"
        >
          <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
            {k}
          </dt>
          <dd className="mt-0.5 text-[#3d332d]">{v}</dd>
        </div>
      ))}

      <div className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white/60 px-3 py-2">
        <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
          Momentos disponibles
        </dt>
        <dd className="mt-1 flex flex-wrap gap-1">
          {detalle.momentosDisponibilidad?.length > 0 ? (
            detalle.momentosDisponibilidad.map((m) => (
              <span key={m} className="rounded-full bg-[#ffe4d4] px-2 py-0.5 text-[0.65rem] text-[#d46f49]">
                {LABELS_MOMENTOS[m] || m}
              </span>
            ))
          ) : (
            <span className="text-[#816959]">—</span>
          )}
        </dd>
      </div>

      {detalle.formasColaboracion.map((forma) => {
        const campo = DETALLE_CAMPO[forma];
        const det = detalle[campo];
        if (!det) return null;

        return (
          <div
            key={forma}
            className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white/60 px-3 py-2"
          >
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
              {FORMAS_COLABORACION.find((f) => f.value === forma)?.label}
            </dt>
            {det.opciones?.length > 0 && (
              <dd className="mt-1 flex flex-wrap gap-1">
                {det.opciones.map((o) => (
                  <span key={o} className="rounded-full bg-[#d46f49]/10 px-2 py-0.5 text-[0.65rem] text-[#d46f49]">
                    {getDetalleLabel(forma, o)}
                  </span>
                ))}
              </dd>
            )}
            {det.observaciones && <dd className="mt-1 text-[#5f4c41]">{det.observaciones}</dd>}
          </div>
        );
      })}

      {detalle.observacionesFinales && (
        <div className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white/60 px-3 py-2">
          <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
            Observaciones finales
          </dt>
          <dd className="mt-0.5 text-[#3d332d]">{detalle.observacionesFinales}</dd>
        </div>
      )}
    </dl>
  </div>
));

export const AdminColaboradores = {
  openModal: () => {
    if (!modalControl) return false;
    modalControl.setOpen(true);
    return true;
  },
  Component: React.memo(() => {
    const [open, setOpen] = useState(false);
    const [colaboradores, setColaboradores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [detalle, setDetalle] = useState(null);
    const [filtros, setFiltros] = useState({ localidad: "", forma: "", activo: "" });
    const [orden, setOrden] = useState("desc");

    const cargar = useCallback(async (filtrosActuales) => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (filtrosActuales.localidad) params.localidad = filtrosActuales.localidad;
        if (filtrosActuales.forma) params.forma = filtrosActuales.forma;
        if (filtrosActuales.activo) params.activo = filtrosActuales.activo;
        const { data } = await colaboradoresService.getColaboradores(params);
        setColaboradores(data.colaboradores || []);
      } catch {
        setError("Error al cargar colaboradores.");
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
        cargar(filtros);
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
      if (open) cargar(filtros);
    }, [filtros]); // eslint-disable-line react-hooks/exhaustive-deps

    const colaboradoresOrdenados = useMemo(
      () =>
        [...colaboradores].sort((a, b) => {
          const da = new Date(a.fechaRegistro);
          const db = new Date(b.fechaRegistro);
          return orden === "desc" ? db - da : da - db;
        }),
      [colaboradores, orden],
    );

    const toggleActivo = async (colab) => {
      try {
        await colaboradoresService.toggleEstado(colab._id, !colab.activo);
        setColaboradores((prev) =>
          prev.map((c) => (c._id === colab._id ? { ...c, activo: !c.activo } : c)),
        );
        if (detalle?._id === colab._id) {
          setDetalle((prev) => ({ ...prev, activo: !prev.activo }));
        }
      } catch {
        setError("Error al cambiar el estado.");
      }
    };

    const exportar = async () => {
      const params = {};
      if (filtros.localidad) params.localidad = filtros.localidad;
      if (filtros.forma) params.forma = filtros.forma;
      if (filtros.activo) params.activo = filtros.activo;

      try {
        const { data } = await colaboradoresService.exportar(params);
        const url = URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `colaboradores-${new Date().toLocaleDateString("es-AR")}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        setError("Error al exportar. Intenta de nuevo.");
      }
    };

    const handleClose = useCallback(() => {
      setOpen(false);
      setDetalle(null);
      setError("");
      setColaboradores([]);
      setFiltros({ localidad: "", forma: "", activo: "" });
      setOrden("desc");
    }, []);

    if (!open) return null;

    return (
      <ModalShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-y-auto"
        >
          <div className="relative w-full rounded-[1.5rem] border border-[color:var(--shell-line)] bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] px-6 py-6 shadow-[0_28px_70px_rgba(36,25,20,0.12)] sm:px-8">
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
              <h1 className="mt-2 text-3xl font-medium text-[color:var(--shell-ink)]">Colaboradores</h1>
              <p className="mt-1 text-sm text-[color:var(--shell-muted)]">
                Gestiona los registros de la red de colaboradores
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-[1rem] border border-[#d62828]/18 bg-[color:var(--shell-danger-soft)] p-3">
                <p className="text-[#a44939]">{error}</p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <select
                  className={FILTRO_SELECT}
                  value={filtros.localidad}
                  onChange={(e) => setFiltros((p) => ({ ...p, localidad: e.target.value }))}
                >
                  <option value="">Todas las localidades</option>
                  {LOCALIDADES_TUCUMAN.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <select
                  className={FILTRO_SELECT}
                  value={filtros.forma}
                  onChange={(e) => setFiltros((p) => ({ ...p, forma: e.target.value }))}
                >
                  <option value="">Todas las formas</option>
                  {FORMAS_COLABORACION.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  className={FILTRO_SELECT}
                  value={filtros.activo}
                  onChange={(e) => setFiltros((p) => ({ ...p, activo: e.target.value }))}
                >
                  <option value="">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
                <button
                  onClick={() => setOrden((o) => (o === "desc" ? "asc" : "desc"))}
                  className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] transition hover:bg-[#fffaf4]"
                >
                  {orden === "desc" ? "Mas reciente primero" : "Mas antiguo primero"}
                </button>
              </div>
              <button
                onClick={exportar}
                className="cursor-pointer rounded-full border border-[color:var(--shell-line)] bg-white px-4 py-2 text-sm font-semibold text-[#5f4c41] transition hover:bg-[#fffaf4]"
              >
                Exportar Excel
              </button>
            </div>

            {loading ? (
              <LoadingState compact label="Cargando colaboradores..." />
            ) : (
              <div className="mt-5 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:divide-x lg:divide-[color:var(--shell-line)]">
                <div className={detalle ? "hidden lg:block" : ""}>
                  <div className="max-h-[55vh] overflow-x-auto overflow-y-auto rounded-[1rem] border border-[color:var(--shell-line)] bg-white shadow-sm lg:rounded-r-none">
                    <table className="w-full text-sm">
                      <thead className="border-b border-[color:var(--shell-line)] bg-[#fffaf4] text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
                        <tr>
                          {["Nombre", "Teléfono", "Localidad", "Formas", "Disponibilidad", "Fecha", "Estado"].map((h) => (
                            <th key={h} className="px-3 py-2 text-left">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[color:var(--shell-line)]">
                        {colaboradoresOrdenados.map((c) => (
                          <tr
                            key={c._id}
                            onClick={() => setDetalle(c)}
                            className={`cursor-pointer text-xs transition hover:bg-[#fffaf4] ${
                              detalle?._id === c._id ? "bg-[#fffaf4] ring-1 ring-inset ring-[#d46f49]/20" : ""
                            }`}
                          >
                            <td className="px-3 py-2 font-medium">{c.nombre}</td>
                            <td className="px-3 py-2">{c.telefono}</td>
                            <td className="px-3 py-2">{c.localidad}</td>
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {c.formasColaboracion.map((f) => (
                                  <span
                                    key={f}
                                    className="rounded-full bg-[#d46f49]/10 px-1.5 py-0.5 text-[0.62rem] font-semibold text-[#d46f49]"
                                  >
                                    {FORMAS_COLABORACION.find((fc) => fc.value === f)?.label || f}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-[#5f4c41]">
                              {LABELS_DISPONIBILIDAD[c.disponibilidadGeneral] || c.disponibilidadGeneral}
                            </td>
                            <td className="px-3 py-2 text-[#816959]">
                              {c.fechaRegistro ? new Date(c.fechaRegistro).toLocaleDateString("es-AR") : "—"}
                            </td>
                            <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => toggleActivo(c)}
                                className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold transition ${
                                  c.activo
                                    ? "bg-[#4d6a2e]/15 text-[#4d6a2e] hover:bg-[#4d6a2e]/25"
                                    : "bg-[#9e9e9e]/15 text-[#666] hover:bg-[#9e9e9e]/25"
                                }`}
                              >
                                {c.activo ? "Activo" : "Inactivo"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {colaboradoresOrdenados.length === 0 && (
                      <p className="py-10 text-center text-sm text-[#816959]">
                        No hay colaboradores con esos filtros.
                      </p>
                    )}
                  </div>
                </div>

                <div className={`lg:pl-6 ${!detalle ? "hidden lg:flex lg:items-center lg:justify-center" : "lg:self-start"}`}>
                  {detalle ? (
                    <div className="max-h-[55vh] overflow-y-auto rounded-[1rem] border border-[color:var(--shell-line)] bg-white/60 p-4 shadow-sm">
                      <DetalleColaborador
                        detalle={detalle}
                        onVolver={() => setDetalle(null)}
                        onToggleActivo={toggleActivo}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-[color:var(--shell-muted)]">
                      Selecciona un registro para ver el detalle
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </ModalShell>
    );
  }),
};
