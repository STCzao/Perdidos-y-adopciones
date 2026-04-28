export function LoadingState({
  label = "Cargando contenido...",
  fullScreen = false,
  compact = false,
  className = "",
}) {
  const containerClassName = fullScreen
    ? "flex min-h-screen items-center justify-center bg-[color:var(--nature-sand)] px-4"
    : compact
      ? "flex items-center justify-center p-6"
      : "flex min-h-[16rem] items-center justify-center px-4";

  return (
    <div className={`${containerClassName} ${className}`.trim()} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[color:var(--shell-line)] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(248,240,229,0.9))] shadow-[0_16px_40px_rgba(36,25,20,0.12)]" />
          <div className="absolute inset-[4px] animate-spin rounded-full border-2 border-transparent border-t-[color:var(--shell-accent-strong)] border-r-[color:var(--shell-accent)]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--shell-bark)] shadow-[0_0_0_5px_rgba(255,250,244,0.9)]" />
        </div>
        <p className="max-w-xs text-sm font-semibold text-[color:var(--shell-muted)]">{label}</p>
      </div>
    </div>
  );
}

export default LoadingState;
