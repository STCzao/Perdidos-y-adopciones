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

export const MultiImageField = ({
  imgs,
  onAddImage,
  onRemoveImage,
  onMoveImage,
  uploading,
  error,
  disabled,
}) => {
  const MAX = 5;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onAddImage(file);
    e.target.value = "";
  };

  return (
    <div>
      <label className={fieldLabel}>
        Imagenes * ({imgs.length} / {MAX})
      </label>

      {imgs.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-2">
          {imgs.map((url, i) => (
            <div key={`${url}-${i}`} className="relative flex flex-col items-center gap-1">
              <div className="relative h-24 w-24 overflow-hidden rounded-[0.9rem] border border-[#2f241d]/10">
                <img src={url} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveImage(i)}
                  disabled={disabled || uploading}
                  className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#2a1f19]/70 text-white transition hover:bg-[#2a1f19] disabled:opacity-50"
                  aria-label="Eliminar imagen"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="h-3 w-3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-[#2a1f19]/70 px-1.5 py-0.5 text-[0.55rem] font-bold text-white">
                    Portada
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onMoveImage(i, -1)}
                  disabled={i === 0 || disabled || uploading}
                  className="cursor-pointer rounded px-1 py-0.5 text-[0.65rem] text-[#816959] transition hover:bg-[#f0e8df] disabled:opacity-30"
                  aria-label="Mover izquierda"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => onMoveImage(i, 1)}
                  disabled={i === imgs.length - 1 || disabled || uploading}
                  className="cursor-pointer rounded px-1 py-0.5 text-[0.65rem] text-[#816959] transition hover:bg-[#f0e8df] disabled:opacity-30"
                  aria-label="Mover derecha"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {imgs.length < MAX && (
        <label
          className={`mt-2 flex w-full cursor-pointer items-center gap-3 rounded-[0.9rem] border border-dashed border-[#2f241d]/20 bg-white px-4 py-3 transition hover:border-[#d46f49]/45 hover:bg-[#fffaf4] ${
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
            {uploading ? "Subiendo imagen..." : "Agregar foto"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || disabled}
            className="sr-only"
          />
        </label>
      )}

      {error && <p className={fieldError}>{error}</p>}
    </div>
  );
};
