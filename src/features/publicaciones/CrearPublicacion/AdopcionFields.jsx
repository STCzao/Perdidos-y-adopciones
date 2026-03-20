import { SelectField, InputField, CheckboxField } from "./FormFields";

/**
 * Campos específicos para publicaciones de tipo ADOPCION
 */
export const AdopcionFields = ({ form, handleChange, errors, submitting }) => {
  if (form.tipo !== "ADOPCION") return null;

  return (
    <>
      <SelectField
        label="Afinidad con niños"
        name="afinidad"
        value={form.afinidad}
        onChange={handleChange}
        disabled={submitting}
        error={errors.afinidad}
        placeholder="Seleccione la afinidad con niños *"
        options={[
          { value: "ALTA", label: "Alta" },
          { value: "MEDIA", label: "Media" },
          { value: "BAJA", label: "Baja" },
          { value: "DESCONOZCO", label: "Desconozco" },
        ]}
      />

      <SelectField
        label="Afinidad con animales"
        name="afinidadanimales"
        value={form.afinidadanimales}
        onChange={handleChange}
        disabled={submitting}
        error={errors.afinidadanimales}
        placeholder="Seleccione la afinidad con animales *"
        options={[
          { value: "ALTA", label: "Alta" },
          { value: "MEDIA", label: "Media" },
          { value: "BAJA", label: "Baja" },
          { value: "DESCONOZCO", label: "Desconozco" },
        ]}
      />

      <SelectField
        label="Nivel de energía"
        name="energia"
        value={form.energia}
        onChange={handleChange}
        disabled={submitting}
        error={errors.energia}
        placeholder="Seleccione el nivel de energía *"
        options={[
          { value: "ALTA", label: "Alta" },
          { value: "MEDIA", label: "Media" },
          { value: "BAJA", label: "Baja" },
        ]}
      />

      <CheckboxField
        label="¿Está castrado?"
        name="castrado"
        checked={form.castrado}
        onChange={handleChange}
        disabled={submitting}
        error={errors.castrado}
      />
    </>
  );
};
