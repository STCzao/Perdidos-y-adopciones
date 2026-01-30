/**
 * Componentes de campos de formulario reutilizables
 */

export const SelectField = ({ label, name, value, onChange, disabled, options, error, placeholder }) => (
  <div className="mt-4">
    <label className="flex items-left text-sm mb-1 ml-2">{label}</label>
    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
    {error && <p className="text-red-400 text-xs mt-1 text-left w-full px-4">{error}</p>}
  </div>
);

export const InputField = ({ label, name, type = "text", value, onChange, disabled, error, placeholder, maxLength }) => (
  <div className="mt-4">
    <label className="flex items-left text-sm mb-1 ml-2">{label}</label>
    <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1 text-left w-full px-4">{error}</p>}
  </div>
);

export const TextAreaField = ({ label, name, value, onChange, disabled, error, placeholder, rows = 4 }) => (
  <div className="mt-4">
    <label className="flex text-left items-left text-sm mb-1 ml-2">{label}</label>
    <div className="flex items-center w-full bg-white border border-gray-300/80 min-h-12 rounded-2xl overflow-hidden p-4 gap-2">
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full resize-none"
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1 text-left w-full px-4">{error}</p>}
  </div>
);

export const CheckboxField = ({ label, name, checked, onChange, disabled, error }) => (
  <div className="flex flex-col items-start w-full mt-4">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {label}
    </label>
    {error && <p className="text-red-400 text-xs mt-1 text-left w-full px-4">{error}</p>}
  </div>
);

export const ImageUploadField = ({ uploading, handleImageUpload, imageUrl, error, disabled }) => (
  <div className="mt-4">
    <label className="flex items-left text-sm mb-1 ml-2">Imagen</label>
    <div className="flex items-center justify-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading || disabled}
        className="bg-transparent text-gray-500 outline-none text-sm w-full file:h-10 file:ml-2 file:p-3 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF7857] file:text-white hover:file:bg-[#E5674F] text-center"
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1 text-left w-full px-4">{error}</p>}
    {imageUrl && (
      <div className="mt-2 flex justify-center">
        <img
          src={imageUrl}
          alt="Vista previa"
          className="w-32 h-32 object-cover rounded-2xl border border-white/50"
        />
      </div>
    )}
  </div>
);
