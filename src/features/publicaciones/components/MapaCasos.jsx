import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { IconAdjustmentsHorizontal, IconChevronDown, IconX } from "@tabler/icons-react";
import MapaBase from "../../../components/map/MapaBase";
import { TUCUMAN_CENTER } from "../../../components/map/mapConstants";
import { getPublicacionIcon } from "../../../components/map/leafletIcons";
import LoadingState from "../../../components/ui/LoadingState";
import { publicacionesService } from "../../../services/publicaciones";
import { getTipoColorMeta } from "../../../utils/publicacionColors";
import { getPublicacionDetailPath } from "../utils/publicacionPaths";
import {
  ANTIGUEDADES_MAPA,
  ESPECIES_MAPA,
  FILTROS_DEFAULT,
  SEXOS_MAPA,
  TAMANOS_MAPA,
  TIPOS_MAPA,
  contarFiltrosActivos,
  contarPorTipo,
  filtrarPublicaciones,
  hayFiltrosModificados,
  toggleValor,
} from "../utils/mapaFiltros";
import CardMapaPreview from "./CardMapaPreview";
import {
  BotonCercaMio,
  Chip,
  ChipBoton,
  GrupoChips,
  SeccionFiltro,
  SelectorAntiguedad,
  UbicacionUsuario,
} from "./MapaFiltrosUI";

// En dispositivos con mouse la tarjeta aparece al pasar por encima del pin y el
// click lleva directo al caso. En pantallas táctiles no existe el hover, así que
// el toque abre la misma tarjeta como popup con un botón para ir al caso.
const canHover = () =>
  typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;

const MENSAJES_GEO = {
  1: "No diste permiso de ubicación.",
  2: "No pudimos obtener tu ubicación.",
  3: "La ubicación tardó demasiado.",
};

const MapaCasos = ({
  className = "",
  mapClassName = "h-full w-full",
  zoom = 12,
  scrollWheelZoom = true,
  children,
}) => {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverMode] = useState(canHover);
  const [filtros, setFiltros] = useState(FILTROS_DEFAULT);
  const [masFiltrosAbierto, setMasFiltrosAbierto] = useState(false); // escritorio
  const [panelMovilAbierto, setPanelMovilAbierto] = useState(false); // celular
  const [posicionUsuario, setPosicionUsuario] = useState(null);
  const [estadoGeo, setEstadoGeo] = useState("idle"); // idle | buscando | ok | error
  const [avisoGeo, setAvisoGeo] = useState("");
  const [popupAbierto, setPopupAbierto] = useState(false); // solo táctil
  const avisoTimeoutRef = useRef(null);
  const masFiltrosRef = useRef(null);
  const botonMasFiltrosRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const resultados = await Promise.all(
          TIPOS_MAPA.map(({ value }) => publicacionesService.getPublicacionesActivasPorTipo(value)),
        );
        if (!cancelled) setPublicaciones(resultados.flat());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => window.clearTimeout(avisoTimeoutRef.current), []);

  // Escape cierra cualquier panel abierto
  useEffect(() => {
    if (!masFiltrosAbierto && !panelMovilAbierto) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setMasFiltrosAbierto(false);
      setPanelMovilAbierto(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [masFiltrosAbierto, panelMovilAbierto]);

  // "Más filtros" puede tapar pines: se cierra al hacer clic fuera del panel.
  useEffect(() => {
    if (!masFiltrosAbierto) return undefined;
    const onPointerDown = (event) => {
      if (
        masFiltrosRef.current?.contains(event.target) ||
        botonMasFiltrosRef.current?.contains(event.target)
      ) {
        return;
      }
      setMasFiltrosAbierto(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [masFiltrosAbierto]);

  const conUbicacion = useMemo(
    () => publicaciones.filter((publicacion) => publicacion.ubicacionPublica?.coordinates),
    [publicaciones],
  );

  const visibles = useMemo(
    () => filtrarPublicaciones(conUbicacion, filtros),
    [conUbicacion, filtros],
  );

  // Contadores de los chips de tipo: todos los filtros menos el de tipo.
  const conteoPorTipo = useMemo(
    () => contarPorTipo(filtrarPublicaciones(conUbicacion, filtros, { ignorar: "tipos" })),
    [conUbicacion, filtros],
  );

  const filtrosPanelActivos = contarFiltrosActivos(filtros);
  const masFiltrosActivos = contarFiltrosActivos(filtros, ["tamanos", "sexos"]);
  const filtrosModificados = hayFiltrosModificados(filtros);
  const sinResultados = !loading && conUbicacion.length > 0 && visibles.length === 0;

  const toggleFiltro = (clave, valor) =>
    setFiltros((prev) => ({ ...prev, [clave]: toggleValor(prev[clave], valor) }));

  const setAntiguedad = (antiguedad) => setFiltros((prev) => ({ ...prev, antiguedad }));

  const limpiarFiltros = () => setFiltros(FILTROS_DEFAULT);

  const mostrarAvisoGeo = (mensaje) => {
    setAvisoGeo(mensaje);
    window.clearTimeout(avisoTimeoutRef.current);
    avisoTimeoutRef.current = window.setTimeout(() => setAvisoGeo(""), 4000);
  };

  const buscarCercaMio = () => {
    setPanelMovilAbierto(false);

    if (!navigator.geolocation) {
      setEstadoGeo("error");
      mostrarAvisoGeo("Tu navegador no permite obtener la ubicación.");
      return;
    }

    setEstadoGeo("buscando");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        // Objeto nuevo en cada pedido: vuelve a centrar aunque la posición no cambie.
        setPosicionUsuario({
          lat: coords.latitude,
          lng: coords.longitude,
          precision: coords.accuracy,
        });
        setEstadoGeo("ok");
      },
      (error) => {
        setEstadoGeo(posicionUsuario ? "ok" : "error");
        mostrarAvisoGeo(MENSAJES_GEO[error?.code] || MENSAJES_GEO[2]);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  const irAlCaso = (publicacion) =>
    navigate(getPublicacionDetailPath(publicacion), { state: { publicacion } });

  const botonLimpiar = (className = "") => (
    <button
      type="button"
      onClick={limpiarFiltros}
      className={`cursor-pointer whitespace-nowrap text-[0.72rem] font-bold text-[#a44939] underline decoration-dotted underline-offset-2 hover:text-[#7f3428] ${className}`}
    >
      Limpiar filtros
    </button>
  );

  return (
    <div className={`relative isolate z-0 overflow-hidden ${className}`}>
      {loading ? (
        <div className="flex h-full w-full items-center justify-center bg-[#efe6da]">
          <LoadingState label="Cargando mapa..." />
        </div>
      ) : (
        <MapaBase
          center={TUCUMAN_CENTER}
          zoom={zoom}
          scrollWheelZoom={scrollWheelZoom}
          className={mapClassName}
        >
          {visibles.map((publicacion) => {
            const [lng, lat] = publicacion.ubicacionPublica.coordinates;

            return (
              <Marker
                key={publicacion._id}
                position={[lat, lng]}
                icon={getPublicacionIcon(publicacion.tipo, publicacion.especie)}
                eventHandlers={
                  hoverMode
                    ? { click: () => irAlCaso(publicacion) }
                    : {
                        popupopen: () => setPopupAbierto(true),
                        popupclose: () => setPopupAbierto(false),
                      }
                }
              >
                {hoverMode ? (
                  <Tooltip direction="top" opacity={1} className="mapa-card-tooltip">
                    <CardMapaPreview publicacion={publicacion} />
                  </Tooltip>
                ) : (
                  // El autoPan con padding deja la tarjeta fuera de la zona de los
                  // chips (arriba) y del cartel de ayuda (abajo), que van encima del mapa.
                  <Popup
                    className="mapa-card-popup"
                    closeButton={false}
                    autoPanPaddingTopLeft={[12, 60]}
                    autoPanPaddingBottomRight={[12, 72]}
                  >
                    <CardMapaPreview
                      publicacion={publicacion}
                      compacto
                      footer={
                        <Link
                          to={getPublicacionDetailPath(publicacion)}
                          state={{ publicacion }}
                          className="mt-1 block rounded-[0.5rem] py-2 text-center text-[0.78rem] font-bold !text-white"
                          style={{ backgroundColor: getTipoColorMeta(publicacion.tipo).accent }}
                        >
                          Ver caso
                        </Link>
                      }
                    />
                  </Popup>
                )}
              </Marker>
            );
          })}

          <UbicacionUsuario posicion={posicionUsuario} />
        </MapaBase>
      )}

      {/* Controles: arriba a la derecha. left-14 deja libres los botones de zoom (arriba a la izquierda). */}
      {!loading && (
        <div className="pointer-events-none absolute left-14 right-3 top-3 z-[1000] flex flex-col items-end gap-2">
          {/* Fila 1: tipo (siempre visible) + botón "Filtros" en celular */}
          <div className="pointer-events-auto flex flex-wrap justify-end gap-1.5">
            {TIPOS_MAPA.map(({ value, label }) => (
              <Chip
                key={value}
                activo={filtros.tipos.includes(value)}
                accent={getTipoColorMeta(value).accent}
                onClick={() => toggleFiltro("tipos", value)}
              >
                {label}
                <span className="opacity-80">({conteoPorTipo[value] || 0})</span>
              </Chip>
            ))}

            <ChipBoton
              onClick={() => setPanelMovilAbierto(true)}
              destacado={filtrosPanelActivos > 0}
              className="lg:hidden"
              aria-haspopup="dialog"
              aria-expanded={panelMovilAbierto}
            >
              <IconAdjustmentsHorizontal size={14} aria-hidden="true" />
              Filtros{filtrosPanelActivos > 0 && ` (${filtrosPanelActivos})`}
            </ChipBoton>
          </div>

          {/* Fila 2 (solo escritorio): especie, antigüedad, cerca mío, más filtros */}
          <div className="pointer-events-auto hidden flex-wrap items-center justify-end gap-1.5 lg:flex">
            {ESPECIES_MAPA.map(({ value, label }) => (
              <Chip
                key={value}
                activo={filtros.especies.includes(value)}
                onClick={() => toggleFiltro("especies", value)}
              >
                {label}
              </Chip>
            ))}

            <SelectorAntiguedad
              opciones={ANTIGUEDADES_MAPA}
              valor={filtros.antiguedad}
              onChange={setAntiguedad}
            />

            <BotonCercaMio estado={estadoGeo} onClick={buscarCercaMio} />

            <ChipBoton
              ref={botonMasFiltrosRef}
              onClick={() => setMasFiltrosAbierto((abierto) => !abierto)}
              destacado={masFiltrosActivos > 0}
              aria-expanded={masFiltrosAbierto}
            >
              Más filtros{masFiltrosActivos > 0 && ` (${masFiltrosActivos})`}
              <IconChevronDown
                size={14}
                className={`transition-transform ${masFiltrosAbierto ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </ChipBoton>
          </div>

          {/* Panel "Más filtros" (escritorio) */}
          {masFiltrosAbierto && (
            <div
              ref={masFiltrosRef}
              className="pointer-events-auto hidden w-[19rem] flex-col gap-3 rounded-[1rem] border border-[#d8ccc0] bg-[rgba(255,250,244,0.97)] p-3.5 shadow-[0_14px_36px_rgba(36,25,20,0.16)] backdrop-blur-sm lg:flex">
              <SeccionFiltro titulo="Tamaño">
                <GrupoChips
                  opciones={TAMANOS_MAPA}
                  seleccionados={filtros.tamanos}
                  onToggle={(valor) => toggleFiltro("tamanos", valor)}
                />
              </SeccionFiltro>
              <SeccionFiltro titulo="Sexo">
                <GrupoChips
                  opciones={SEXOS_MAPA}
                  seleccionados={filtros.sexos}
                  onToggle={(valor) => toggleFiltro("sexos", valor)}
                />
              </SeccionFiltro>
              <p className="text-[0.66rem] leading-snug text-[#816959]">
                Sin ninguno marcado se muestran todos.
              </p>
            </div>
          )}

          {filtrosModificados && (
            <div className="pointer-events-auto hidden rounded-full bg-[rgba(255,255,255,0.92)] px-3 py-1 shadow-sm lg:block">
              {botonLimpiar()}
            </div>
          )}

          {avisoGeo && (
            <p
              role="status"
              className="pointer-events-auto max-w-[16rem] rounded-[0.8rem] bg-[rgba(36,25,20,0.88)] px-3 py-2 text-[0.72rem] leading-snug text-white shadow-sm"
            >
              {avisoGeo}
            </p>
          )}
        </div>
      )}

      {/* Sin resultados con los filtros actuales */}
      {sinResultados && (
        <div className="pointer-events-none absolute inset-0 z-[999] flex items-center justify-center p-6">
          <div className="pointer-events-auto rounded-[1rem] border border-[#d8ccc0] bg-[rgba(255,250,244,0.97)] px-5 py-4 text-center shadow-[0_14px_36px_rgba(36,25,20,0.18)]">
            <p className="text-sm font-bold text-[#241914]">No hay casos con estos filtros</p>
            <button
              type="button"
              onClick={limpiarFiltros}
              className="mt-2.5 cursor-pointer rounded-full bg-[#241914] px-4 py-1.5 text-[0.75rem] font-bold text-white transition-colors hover:bg-[#45362d]"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Panel de filtros en celular: hoja inferior dentro del mapa */}
      {panelMovilAbierto && (
        <div className="absolute inset-0 z-[1001] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros del mapa">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-[rgba(36,25,20,0.32)]"
            onClick={() => setPanelMovilAbierto(false)}
            aria-label="Cerrar filtros"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88%] flex-col rounded-t-[1.2rem] bg-[#fffaf4] shadow-[0_-12px_36px_rgba(36,25,20,0.2)]">
            <div className="flex items-center justify-between border-b border-[#2f241d]/10 px-4 py-2.5">
              <p className="text-sm font-extrabold text-[#241914]">Filtros</p>
              <div className="flex items-center gap-3">
                {filtrosModificados && botonLimpiar()}
                <button
                  type="button"
                  onClick={() => setPanelMovilAbierto(false)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#5f4c41] hover:bg-[#f3ebe1]"
                  aria-label="Cerrar"
                >
                  <IconX size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-3">
              <SeccionFiltro titulo="Especie">
                <GrupoChips
                  opciones={ESPECIES_MAPA}
                  seleccionados={filtros.especies}
                  onToggle={(valor) => toggleFiltro("especies", valor)}
                />
              </SeccionFiltro>

              <SeccionFiltro titulo="Antigüedad">
                <SelectorAntiguedad
                  opciones={ANTIGUEDADES_MAPA}
                  valor={filtros.antiguedad}
                  onChange={setAntiguedad}
                  className="w-full"
                />
              </SeccionFiltro>

              <SeccionFiltro titulo="Ubicación">
                <BotonCercaMio estado={estadoGeo} onClick={buscarCercaMio} className="w-fit" />
              </SeccionFiltro>

              <SeccionFiltro titulo="Tamaño">
                <GrupoChips
                  opciones={TAMANOS_MAPA}
                  seleccionados={filtros.tamanos}
                  onToggle={(valor) => toggleFiltro("tamanos", valor)}
                />
              </SeccionFiltro>

              <SeccionFiltro titulo="Sexo">
                <GrupoChips
                  opciones={SEXOS_MAPA}
                  seleccionados={filtros.sexos}
                  onToggle={(valor) => toggleFiltro("sexos", valor)}
                />
              </SeccionFiltro>
            </div>

            <div className="border-t border-[#2f241d]/10 px-4 py-2.5">
              <button
                type="button"
                onClick={() => setPanelMovilAbierto(false)}
                className="w-full cursor-pointer rounded-full bg-[#241914] py-2.5 text-sm font-bold text-white"
              >
                Ver {visibles.length} {visibles.length === 1 ? "caso" : "casos"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlays de quien usa el mapa (ej. el cartel de ayuda de la Home):
          se ocultan mientras hay una tarjeta abierta para no taparla. */}
      {!popupAbierto && children}
    </div>
  );
};

export default MapaCasos;
