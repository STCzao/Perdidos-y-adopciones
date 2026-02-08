import { InputField } from "./FormFields";
import { LOCALIDADES_TUCUMAN } from "../../constants/localidades";

/**
 * Campos específicos para publicaciones de tipo PERDIDO o ENCONTRADO
 */
export const PerdidoEncontradoFields = ({ form, handleChange, errors, submitting }) => {
  if (form.tipo !== "PERDIDO" && form.tipo !== "ENCONTRADO") return null;

  return (
    <>
      {/* Campo Localidad */}
      <div className="mt-4">
        <label className="flex items-left text-left text-sm mb-1 ml-2">
          Localidad *
        </label>
        <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-4">
          <select
            name="localidad"
            value={form.localidad}
            onChange={handleChange}
            disabled={submitting}
            className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
          >
            <option value="">Seleccione una localidad</option>
            {LOCALIDADES_TUCUMAN.map((localidad) => (
              <option key={localidad} value={localidad}>
                {localidad}
              </option>
            ))}
          </select>
        </div>
        {errors.localidad && (
          <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
            {errors.localidad}
          </p>
        )}
      </div>

      <InputField
        label="Dirección, calle o zona específica:"
        name="lugar"
        type="text"
        value={form.lugar}
        onChange={handleChange}
        disabled={submitting}
        error={errors.lugar}
        placeholder="Ej: Barrio Norte, calle San Martín 500 *"
      />

      <div className="mt-4">
        <label className="flex items-left text-left text-sm mb-1 ml-2">
          Fecha en que perdió/encontró a su animal
        </label>
        <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            disabled={submitting}
            className="bg-transparent pr-8 text-gray-500 outline-none text-sm w-full h-full"
          />
        </div>
        {errors.fecha && (
          <p className="text-red-400 text-xs mt-1 text-left w-full px-4">
            {errors.fecha}
          </p>
        )}
      </div>
    </>
  );
};
