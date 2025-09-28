const InputField = ({ label, type, value, onChange }) => (
  <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
    <input
      type={type}
      placeholder={label}
      value={value}
      onChange={onChange}
      className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
      required
    />
  </div>
);

export default InputField;
