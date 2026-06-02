import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ModalShell from "../../../components/ui/ModalShell";
import LoadingState from "../../../components/ui/LoadingState";
import { colaboradoresService } from "../../../services/colaboradores";
import {
  DETALLE_CAMPO,
  FORMAS_COLABORACION,
  LABELS_CONDICIONES_ANIMAL_TRASLADO,
  LABELS_DISPONIBILIDAD,
  LABELS_DISPONIBILIDAD_TRASLADO,
  LABELS_MOMENTOS,
  LABELS_PERIODOS_TRANSITO,
  LABELS_PREFERENCIA_TRANSITO,
  LABELS_ZONAS_TRASLADO,
  OPCIONES_DETALLE,
} from "../../../utils/colaboradoresConstants";
import { LOCALIDADES_TUCUMAN } from "../../../utils/localidades";

let modalControl;

const FILTRO_SELECT =
  "rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] outline-none transition focus:border-[#d46f49]/40";

const getDetalleLabel = (forma, valor) =>
  OPCIONES_DETALLE[forma]?.find((item) => item.value === valor)?.label || valor;

const getFormaLabel = (forma) =>
  FORMAS_COLABORACION.find((item) => item.value === forma)?.label || forma;

const TagList = ({ values, labelMap, fallback = "—" }) => {
  if (!values?.length) {
    return <span className="text-[#816959]">{fallback}</span>;
  }

  return values.map((value) => (
    <span
      key={value}
      className="rounded-full bg-[#d46f49]/10 px-2 py-0.5 text-[0.65rem] text-[#d46f49]"
    >
      {labelMap[value] || value}
    </span>
  ));
};

const DetalleForma = React.memo(({ forma, detalle }) => {
  if (forma === "TRANSITO") {
    return (
      <>
        <dd className="mt-1 text-[#3d332d]">
          <span className="font-medium text-[#5f4c41]">Preferencia:</span>{" "}
          {LABELS_PREFERENCIA_TRANSITO[detalle.preferencia] || "—"}
        </dd>
        <dd className="mt-2 flex flex-wrap gap-1">
          <TagList
            values={detalle.periodos}
            labelMap={LABELS_PERIODOS_TRANSITO}
            fallback="Sin períodos cargados"
          />
        </dd>
      </>
    );
  }

  if (forma === "TRASLADO") {
    return (
      <>
        <dd className="mt-1 text-[#3d332d]">
          <span className="font-medium text-[#5f4c41]">Zonas</span>
        </dd>
        <dd className="mt-1 flex flex-wrap gap-1">
          <TagList
            values={detalle.zonas}
            labelMap={LABELS_ZONAS_TRASLADO}
            fallback="Sin zonas cargadas"
          />
        </dd>
        <dd className="mt-2 text-[#3d332d]">
          <span className="font-medium text-[#5f4c41]">Disponibilidad</span>
        </dd>
        <dd className="mt-1 flex flex-wrap gap-1">
          <TagList
            values={detalle.disponibilidad}
            labelMap={LABELS_DISPONIBILIDAD_TRASLADO}
            fallback="Sin disponibilidad cargada"
          />
        </dd>
        <dd className="mt-2 text-[#3d332d]">
          <span className="font-medium text-[#5f4c41]">Condición del animal</span>
        </dd>
        <dd className="mt-1 flex flex-wrap gap-1">
          <TagList
            values={detalle.condicionAnimal}
            labelMap={LABELS_CONDICIONES_ANIMAL_TRASLADO}
            fallback="Sin condiciones cargadas"
          />
        </dd>
      </>
    );
  }

  if (detalle.opciones?.length > 0) {
    return (
      <dd className="mt-1 flex flex-wrap gap-1">
        {detalle.opciones.map((option) => (
          <span
            key={option}
            className="rounded-full bg-[#d46f49]/10 px-2 py-0.5 text-[0.65rem] text-[#d46f49]"
          >
            {getDetalleLabel(forma, option)}
          </span>
        ))}
      </dd>
    );
  }

  return <dd className="mt-1 text-[#816959]">Sin opciones cargadas</dd>;
});

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
          "Disponibilidad general",
          LABELS_DISPONIBILIDAD[detalle.disponibilidadGeneral] ||
            detalle.disponibilidadGeneral ||
            "—",
        ],
      ].map(([label, value]) => (
        <div
          key={label}
          className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white/60 px-3 py-2"
        >
          <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
            {label}
          </dt>
          <dd className="mt-0.5 text-[#3d332d]">{value}</dd>
        </div>
      ))}

      <div className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white/60 px-3 py-2">
        <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#816959]">
          Momentos de disponibilidad
        </dt>
        <dd className="mt-1 flex flex-wrap gap-1">
          {detalle.momentosDisponibilidad?.length > 0 ? (
            detalle.momentosDisponibilidad.map((momento) => (
              <span
                key={momento}
                className="rounded-full bg-[#ffe4d4] px-2 py-0.5 text-[0.65rem] text-[#d46f49]"
              >
                {LABELS_MOMENTOS[momento] || momento}
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
              {getFormaLabel(forma)}
            </dt>
            <DetalleForma forma={forma} detalle={det} />
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
    }, [cargar, filtros, open]);

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
          prev.map((item) =>
            item._id === colab._id ? { ...item, activo: !item.activo } : item,
          ),
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
        const link = document.createElement("a");
        link.href = url;
        link.download = `colaboradores-${new Date().toLocaleDateString("es-AR")}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
      } catch {
        setError("Error al exportar. Intentá de nuevo.");
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
              <h1 className="mt-2 text-3xl font-medium text-[color:var(--shell-ink)]">
                Comunidad solidaria
              </h1>
              <p className="mt-1 text-sm text-[color:var(--shell-muted)]">
                Gestiona los registros de personas que quieren colaborar
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
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, localidad: e.target.value }))
                  }
                >
                  <option value="">Todas las localidades</option>
                  {LOCALIDADES_TUCUMAN.map((localidad) => (
                    <option key={localidad} value={localidad}>
                      {localidad}
                    </option>
                  ))}
                </select>
                <select
                  className={FILTRO_SELECT}
                  value={filtros.forma}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, forma: e.target.value }))}
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
                  onChange={(e) => setFiltros((prev) => ({ ...prev, activo: e.target.value }))}
                >
                  <option value="">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
                <button
                  onClick={() => setOrden((current) => (current === "desc" ? "asc" : "desc"))}
                  className="rounded-[0.7rem] border border-[color:var(--shell-line)] bg-white px-3 py-2 text-sm text-[#3d332d] transition hover:bg-[#fffaf4]"
                >
                  {orden === "desc" ? "Más recientes primero" : "Más antiguos primero"}
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
                          {[
                            "Nombre",
                            "Teléfono",
                            "Localidad",
                            "Formas",
                            "Disponibilidad",
                            "Fecha",
                            "Estado",
                          ].map((header) => (
                            <th key={header} className="px-3 py-2 text-left">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[color:var(--shell-line)]">
                        {colaboradoresOrdenados.map((colaborador) => (
                          <tr
                            key={colaborador._id}
                            onClick={() => setDetalle(colaborador)}
                            className={`cursor-pointer text-xs transition hover:bg-[#fffaf4] ${
                              detalle?._id === colaborador._id
                                ? "bg-[#fffaf4] ring-1 ring-inset ring-[#d46f49]/20"
                                : ""
                            }`}
                          >
                            <td className="px-3 py-2 font-medium">{colaborador.nombre}</td>
                            <td className="px-3 py-2">{colaborador.telefono}</td>
                            <td className="px-3 py-2">{colaborador.localidad}</td>
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {colaborador.formasColaboracion.map((forma) => (
                                  <span
                                    key={forma}
                                    className="rounded-full bg-[#d46f49]/10 px-1.5 py-0.5 text-[0.62rem] font-semibold text-[#d46f49]"
                                  >
                                    {getFormaLabel(forma)}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-[#5f4c41]">
                              {LABELS_DISPONIBILIDAD[colaborador.disponibilidadGeneral] ||
                                colaborador.disponibilidadGeneral ||
                                "—"}
                            </td>
                            <td className="px-3 py-2 text-[#816959]">
                              {colaborador.fechaRegistro
                                ? new Date(colaborador.fechaRegistro).toLocaleDateString("es-AR")
                                : "—"}
                            </td>
                            <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => toggleActivo(colaborador)}
                                className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold transition ${
                                  colaborador.activo
                                    ? "bg-[#4d6a2e]/15 text-[#4d6a2e] hover:bg-[#4d6a2e]/25"
                                    : "bg-[#9e9e9e]/15 text-[#666] hover:bg-[#9e9e9e]/25"
                                }`}
                              >
                                {colaborador.activo ? "Activo" : "Inactivo"}
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

                <div
                  className={`lg:pl-6 ${
                    !detalle ? "hidden lg:flex lg:items-center lg:justify-center" : "lg:self-start"
                  }`}
                >
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
                      Seleccioná un registro para ver el detalle
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
