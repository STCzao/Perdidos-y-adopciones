/**
 * Fixed full-screen backdrop overlay for modal dialogs.
 * Centralizes z-index, background, and flex-centering used across all app modals.
 */
export default function ModalShell({ children, className = "" }) {
  return (
    <div
      className={`fixed font-medium inset-0 z-[200] flex items-center justify-center bg-black/50${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
