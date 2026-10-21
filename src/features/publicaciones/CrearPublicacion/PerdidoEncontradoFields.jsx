import { useState } from "react";
import { InputField } from "./FormFields";
import SelectorUbicacionMapa from "./SelectorUbicacionMapa";
import { LOCALIDADES_TUCUMAN } from "../../../utils/localidades";

const fieldLabel = "block text-sm font-semibold text-[#5f4c41]";
const fieldInput =
  "mt-1.5 w-full rounded-[0.9rem] border border-[#2f241d]/12 bg-white px-4 py-2.5 text-sm text-[#3d332d] outline-none transition placeholder:text-[#9e8e84] focus:border-[#d46f49]/45 focus:ring-2 focus:ring-[#d46f49]/15 disabled:opacity-50";
const fieldError = "mt-1.5 text-xs text-[#a84632]";
const ubicacionButton =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";
const ubicacionButtonActivo = "border-[#4d6a2e]/30 bg-[#eaf3e1] text-[#4d6a2e]";
const ubicacionButtonInactivo = "border-[#2f241d]/12 bg-white text-[#5f4c41] hover:bg-[#f6efe4]";

export const PerdidoEncontradoFields = ({
  form,
  handleChange,
  errors,
  submitting,
  onCapturarUbicacion,
  capturandoUbicacion,
  errorUbicacion,
  onMarcarEnMapa,
  onQuitarUbicacion,
  avisoUbicacion,
}) => {
  const [mapaAbierto, setMapaAbierto] = useState(false);

  if (form.tipo !== "PERDIDO" && form.tipo !== "ENCONTRADO") return null;

  const tieneUbicacion = form.lat != null && form.lng != null;

  return (
    <>
      <div>
        <label htmlFor="localidad" className={fieldLabel}>
          Localidad
        </label>
        <select
          id="localidad"
          name="localidad"
          value={form.localidad}
          onChange={handleChange}
          disabled={submitting}
          className={fieldInput}
        >
          <option value="">Seleccione una localidad</option>
          {LOCALIDADES_TUCUMAN.map((localidad) => (
            <option key={localidad} value={localidad}>
              {localidad}
            </option>
          ))}
        </select>
        {errors.localidad && <p className={fieldError}>{errors.localidad}</p>}
      </div>

      <InputField
        label="Dirección, calle o zona específica"
        name="lugar"
        type="text"
        value={form.lugar}
        onChange={handleChange}
        disabled={submitting}
        error={errors.lugar}
        placeholder="Ej: Barrio Norte, calle San Martín 500"
      />

      <div
        className={
          avisoUbicacion ? "rounded-[1rem] border border-[#a84632]/25 bg-[#fbeee8] p-4" : ""
        }
      >
        {avisoUbicacion && (
          <p role="alert" className="mb-3 text-sm font-semibold text-[#a84632]">
            {avisoUbicacion}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCapturarUbicacion}
            disabled={submitting || capturandoUbicacion}
            className={`${ubicacionButton} ${
              form.fuenteUbicacion === "gps" ? ubicacionButtonActivo : ubicacionButtonInactivo
            }`}
          >
            {capturandoUbicacion
              ? "Obteniendo ubicación..."
              : form.fuenteUbicacion === "gps"
                ? "✓ Ubicación GPS capturada"
                : "Usar mi ubicación GPS"}
          </button>

          <button
            type="button"
            onClick={() => setMapaAbierto(true)}
            disabled={submitting}
            className={`${ubicacionButton} ${
              form.fuenteUbicacion === "mapa" ? ubicacionButtonActivo : ubicacionButtonInactivo
            }`}
          >
            {form.fuenteUbicacion === "mapa" ? "✓ Ubicación marcada en el mapa" : "Marcar en el mapa"}
          </button>
        </div>

        {tieneUbicacion ? (
          <p className="mt-1.5 text-xs text-[#8d7a6d]">
            El pin define la ubicación; la dirección queda como referencia.{" "}
            <button
              type="button"
              onClick={onQuitarUbicacion}
              disabled={submitting}
              className="cursor-pointer font-semibold text-[#a84632] underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Quitar ubicación
            </button>
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-[#8d7a6d]">
            Usar el GPS o marcar el punto en el mapa mejora la precisión del pin respecto de cargar
            solo la dirección.
          </p>
        )}
        {errorUbicacion && <p className={fieldError}>{errorUbicacion}</p>}
      </div>

      {mapaAbierto && (
        <SelectorUbicacionMapa
          tipo={form.tipo}
          ubicacionInicial={tieneUbicacion ? { lat: form.lat, lng: form.lng } : null}
          onConfirmar={(ubicacion) => {
            onMarcarEnMapa(ubicacion);
            setMapaAbierto(false);
          }}
          onCancelar={() => setMapaAbierto(false)}
        />
      )}

      <div>
        <label htmlFor="fecha" className={fieldLabel}>
          Fecha en que perdió / encontró al animal
        </label>
        <input
          id="fecha"
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          disabled={submitting}
          className={fieldInput}
        />
        {errors.fecha && <p className={fieldError}>{errors.fecha}</p>}
      </div>
    </>
  );
};
