/**
 * Password input with show/hide toggle button.
 * Renders the eye SVG icons used across Login, Register, and ResetPassword.
 */
export default function PasswordInput({
  value,
  onChange,
  show,
  onToggle,
  placeholder = "Contraseña",
  className = "",
}) {
  return (
    <div
      className={`flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 ${className}`}
    >
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
        value={value}
        onChange={onChange}
      />
      <button type="button" onClick={onToggle} className="pr-4 cursor-pointer">
        {show ? (
          // Ojo tachado
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.224-3.592m3.1-2.448A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.043 5.04M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3l18 18"
            />
          </svg>
        ) : (
          // Ojo abierto
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
