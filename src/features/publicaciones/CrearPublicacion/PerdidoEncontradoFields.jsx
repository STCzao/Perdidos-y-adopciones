import { InputField } from "./FormFields";
import { LOCALIDADES_TUCUMAN } from "../../../utils/localidades";

const fieldLabel = "block text-sm font-semibold text-[#5f4c41]";
const fieldInput =
  "mt-1.5 w-full rounded-[0.9rem] border border-[#2f241d]/12 bg-white px-4 py-2.5 text-sm text-[#3d332d] outline-none transition placeholder:text-[#9e8e84] focus:border-[#d46f49]/45 focus:ring-2 focus:ring-[#d46f49]/15 disabled:opacity-50";
const fieldError = "mt-1.5 text-xs text-[#a84632]";

export const PerdidoEncontradoFields = ({ form, handleChange, errors, submitting }) => {
  if (form.tipo !== "PERDIDO" && form.tipo !== "ENCONTRADO") return null;

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
