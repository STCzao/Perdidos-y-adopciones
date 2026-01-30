import { InputField } from "./FormFields";

/**
 * Campos específicos para publicaciones de tipo PERDIDO o ENCONTRADO
 */
export const PerdidoEncontradoFields = ({ form, handleChange, errors, submitting }) => {
  if (form.tipo !== "PERDIDO" && form.tipo !== "ENCONTRADO") return null;

  return (
    <>
      <InputField
        label="Se extravió/encontró en:"
        name="lugar"
        type="text"
        value={form.lugar}
        onChange={handleChange}
        disabled={submitting}
        error={errors.lugar}
        placeholder="Indique la dirección, calle o zona *"
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
