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
  name = "password",
  className = "",
}) {
  return (
    <div
      className={`flex h-13 w-full items-center gap-2 rounded-[1.4rem] border border-white/12 bg-white/92 pl-5 pr-2 shadow-sm transition-colors duration-300 focus-within:border-[#f4c89e] focus-within:ring-2 focus-within:ring-[#f4c89e]/45 ${className}`}
    >
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-sm text-[#3d332d] placeholder:text-[#7e7066] outline-none"
        value={value}
        onChange={onChange}
        autoComplete={name === "password" ? "current-password" : "new-password"}
      />
      <button
        type="button"
        onClick={onToggle}
        className="cursor-pointer rounded-full p-2 text-[#6d5f56] transition-colors duration-300 hover:bg-[#f5ede3] hover:text-[#241914] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f241d]/20"
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {show ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-5"
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-5"
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
