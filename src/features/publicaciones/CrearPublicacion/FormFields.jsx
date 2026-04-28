const fieldLabel = "block text-sm font-semibold text-[#5f4c41]";
const fieldInput =
  "mt-1.5 w-full rounded-[0.9rem] border border-[#2f241d]/12 bg-white px-4 py-2.5 text-sm text-[#3d332d] outline-none transition placeholder:text-[#9e8e84] focus:border-[#d46f49]/45 focus:ring-2 focus:ring-[#d46f49]/15 disabled:opacity-50";
const fieldError = "mt-1.5 text-xs text-[#a84632]";

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  disabled,
  options,
  error,
  placeholder,
}) => (
  <div>
    <label htmlFor={name} className={fieldLabel}>
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={fieldInput}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className={fieldError}>{error}</p>}
  </div>
);

export const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
  error,
  placeholder,
  maxLength,
}) => (
  <div>
    <label htmlFor={name} className={fieldLabel}>
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      maxLength={maxLength}
      className={fieldInput}
    />
    {error && <p className={fieldError}>{error}</p>}
  </div>
);

export const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  disabled,
  error,
  placeholder,
  rows = 4,
}) => (
  <div>
    <label htmlFor={name} className={fieldLabel}>
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className={`${fieldInput} resize-none`}
    />
    {error && <p className={fieldError}>{error}</p>}
  </div>
);

export const CheckboxField = ({ label, name, checked, onChange, disabled, error }) => (
  <div>
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 cursor-pointer rounded border-[#2f241d]/20 accent-[#5a3f35]"
      />
      <span className="text-sm font-semibold text-[#5f4c41]">{label}</span>
    </label>
    {error && <p className={fieldError}>{error}</p>}
  </div>
);

export const ImageUploadField = ({
  uploading,
  handleImageUpload,
  imageUrl,
  error,
  disabled,
}) => (
  <div>
    <label className={fieldLabel}>Imagen</label>
    <label
      className={`mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-[0.9rem] border border-dashed border-[#2f241d]/20 bg-white px-4 py-3 transition hover:border-[#d46f49]/45 hover:bg-[#fffaf4] ${
        uploading || disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="h-5 w-5 shrink-0 text-[#816959]"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <span className="text-sm text-[#816959]">
        {uploading ? "Subiendo imagen..." : imageUrl ? "Cambiar imagen" : "Seleccionar imagen"}
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading || disabled}
        className="sr-only"
      />
    </label>
    {error && <p className={fieldError}>{error}</p>}
    {imageUrl && (
      <div className="mt-3">
        <img
          src={imageUrl}
          alt="Vista previa"
          className="h-28 w-28 rounded-[0.9rem] border border-[#2f241d]/10 object-cover shadow-sm"
        />
      </div>
    )}
  </div>
);
