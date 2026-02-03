import {
  SelectField,
  InputField,
  TextAreaField,
  ImageUploadField,
} from "./FormFields";

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
}) => {
  return (
    <>
      {/* Tipo */}
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

      {/* Nombre del animal - solo para PERDIDO y ADOPCION */}
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

      {/* Imagen */}
      <ImageUploadField
        uploading={uploading}
        handleImageUpload={handleImageUpload}
        imageUrl={form.img}
        error={errors.img}
        disabled={submitting}
      />

      {/* Especie */}
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

      {/* Edad - solo para PERDIDO y ADOPCION */}
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
            { value: "JOVEN", label: "Joven (0 a 12 meses)" },
            { value: "CACHORRO", label: "Cachorro (1 a 4 años)" },
            { value: "ADULTO", label: "Adulto (5 a 10 años)" },
            { value: "MAYOR", label: "Mayor (Más de 10 años)" },
          ]}
        />
      )}

      {/* Raza */}
      <InputField
        label="Raza"
        name="raza"
        type="text"
        value={form.raza}
        onChange={handleChange}
        disabled={submitting}
        error={errors.raza}
        placeholder="Ingrese la raza de su animal *"
      />

      {/* Color */}
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

      {/* Sexo */}
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

      {/* Tamaño */}
      <SelectField
        label="Tamaño"
        name="tamaño"
        value={form.tamaño}
        onChange={handleChange}
        disabled={submitting}
        error={errors.tamaño}
        placeholder="Seleccione el tamaño de su animal *"
        options={[
          { value: "SIN ESPECIFICAR", label: "Sin especificar" },
          { value: "MINI", label: "Mini" },
          { value: "PEQUEÑO", label: "Pequeño" },
          { value: "MEDIANO", label: "Mediano" },
          { value: "GRANDE", label: "Grande" },
        ]}
      />

      {/* WhatsApp */}
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

      {/* Detalles Adicionales */}
      <TextAreaField
        label="Señas particulares y estado del animal"
        name="detalles"
        value={form.detalles}
        onChange={handleChange}
        disabled={submitting}
        error={errors.detalles}
        placeholder="Agregar aquí cualquier detalle que ayude a identificarlo o a tratar con él: manchas, cicatrices, heridas, si está medicado, si llevaba collar, temperamento o cualquier otra información importante."
        rows={4}
      />
    </>
  );
};
