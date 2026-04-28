/**
 * Fixed full-screen backdrop overlay for modal dialogs.
 * Centralizes z-index, background, and flex-centering used across all app modals.
 */
export default function ModalShell({ children, className = "" }) {
  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(28,20,16,0.58)] font-medium backdrop-blur-sm${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
