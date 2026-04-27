import {
  SelectField,
  InputField,
  TextAreaField,
  ImageUploadField,
} from "./FormFields";
import { PUBLICACION_SIZE_FIELD } from "../utils/publicacionFields";

/**
 * Campos comunes a todos los tipos de publicaciones
 */
export const CommonFields = ({
  form,
  handleChange,
  errors,
  submitting,
  handleImageUpload,
  uploading,
  razasPorEspecie = {},
}) => {
  return (
    <>
      <SelectField
        label="Seleccione el tipo de publicación"
        name="tipo"
        value={form.tipo}
        onChange={handleChange}
        disabled={submitting}
        error={errors.tipo}
        placeholder="Seleccione entre perdido/encontrado/adopción *"
        options={[
          { value: "PERDIDO", label: "Perdido" },
          { value: "ENCONTRADO", label: "Encontrado" },
          { value: "ADOPCION", label: "Adopción" },
        ]}
      />

      {(form.tipo === "ADOPCION" || form.tipo === "PERDIDO") && (
        <InputField
          label="Nombre de su animal"
          name="nombreanimal"
          type="text"
          value={form.nombreanimal}
          onChange={handleChange}
          disabled={submitting}
          error={errors.nombreanimal}
          placeholder="Ingrese el nombre de su animal *"
        />
      )}

      <ImageUploadField
        uploading={uploading}
        handleImageUpload={handleImageUpload}
        imageUrl={form.img}
        error={errors.img}
        disabled={submitting}
      />

      <SelectField
        label="Especie"
        name="especie"
        value={form.especie}
        onChange={handleChange}
        disabled={submitting}
        error={errors.especie}
        placeholder="Seleccione la especie de su animal *"
        options={[
          { value: "PERRO", label: "Perro" },
          { value: "GATO", label: "Gato" },
          { value: "AVE", label: "Ave" },
          { value: "CONEJO", label: "Conejo" },
          { value: "OTRO", label: "Otro" },
        ]}
      />

      {(form.tipo === "PERDIDO" || form.tipo === "ADOPCION") && (
        <SelectField
          label="Edad aproximada de su animal"
          name="edad"
          value={form.edad}
          onChange={handleChange}
          disabled={submitting}
          error={errors.edad}
          placeholder="Seleccione la edad de su animal *"
          options={[
            { value: "SIN ESPECIFICAR", label: "Sin especificar" },
            { value: "CACHORRO", label: "Cachorro (0 a 12 meses)" },
            { value: "JOVEN", label: "Joven (1 a 4 años)" },
            { value: "ADULTO", label: "Adulto (5 a 10 años)" },
            { value: "MAYOR", label: "Mayor (más de 10 años)" },
          ]}
        />
      )}

      <SelectField
        label="Raza"
        name="raza"
        value={form.raza}
        onChange={handleChange}
        disabled={submitting || !form.especie}
        error={errors.raza}
        placeholder={
          !form.especie
            ? "Seleccione primero la especie"
            : "Seleccione la raza de su animal *"
        }
        options={(razasPorEspecie[form.especie] || []).map((raza) => ({
          value: raza,
          label: raza,
        }))}
      />

      <InputField
        label="Color"
        name="color"
        type="text"
        value={form.color}
        onChange={handleChange}
        disabled={submitting}
        error={errors.color}
        placeholder="Ingrese el color principal del animal (especifique manchas y otros colores) *"
      />

      <SelectField
        label="Sexo"
        name="sexo"
        value={form.sexo}
        onChange={handleChange}
        disabled={submitting}
        error={errors.sexo}
        placeholder="Seleccione el sexo de su animal *"
        options={[
          { value: "MACHO", label: "Macho" },
          { value: "HEMBRA", label: "Hembra" },
          { value: "DESCONOZCO", label: "Desconozco" },
        ]}
      />

      <SelectField
        label="Tamaño"
        name={PUBLICACION_SIZE_FIELD}
        value={form[PUBLICACION_SIZE_FIELD]}
        onChange={handleChange}
        disabled={submitting}
        error={errors[PUBLICACION_SIZE_FIELD]}
        placeholder="Seleccione el tamaño de su animal *"
        options={[
          { value: "SIN ESPECIFICAR", label: "Sin especificar" },
          { value: "MINI", label: "Mini" },
          { value: "PEQUEÑO", label: "Pequeño" },
          { value: "MEDIANO", label: "Mediano" },
          { value: "GRANDE", label: "Grande" },
        ]}
      />

      <InputField
        label="Número de contacto"
        name="whatsapp"
        type="tel"
        value={form.whatsapp}
        onChange={handleChange}
        disabled={submitting}
        error={errors.whatsapp}
        placeholder="Ej: 38123456789 (solo números, 10-15 dígitos) *"
        maxLength={15}
      />

      <TextAreaField
        label="Señas particulares y estado del animal"
        name="detalles"
        value={form.detalles}
        onChange={handleChange}
        disabled={submitting}
        error={errors.detalles}
        placeholder="Agregá aquí cualquier detalle que ayude a identificarlo o a tratar con él: manchas, cicatrices, heridas, si está medicado, si llevaba collar, temperamento o cualquier otra información importante."
        rows={4}
      />
    </>
  );
};
