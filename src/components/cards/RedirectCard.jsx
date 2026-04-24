const surfaceClasses = {
  dark: "border border-white/12 bg-[rgba(21,16,14,0.52)] text-white shadow-[0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur-md",
  light:
    "border border-[#2f241d]/10 bg-[#fbf6ef] text-[#241914] shadow-[0_18px_55px_rgba(47,36,29,0.08)]",
};

export default function RedirectCard({
  surface = "light",
  accent,
  accentSoft,
  badge,
  title,
  description,
  value,
  ctaLabel,
  onClick,
  actions = [],
  className = "",
}) {
  const isDark = surface === "dark";

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-5 ${surfaceClasses[surface]} ${className}`}
    >
      <div
        className="absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl"
        style={{ backgroundColor: `${accent}18` }}
      />

      <div className="relative flex h-full flex-col">
        {badge && (
          <span
            className="inline-flex rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.24em]"
            style={{
              color: isDark ? accent : "#ffffff",
              backgroundColor: isDark ? accentSoft : accent,
            }}
          >
            {badge}
          </span>
        )}

        {value !== undefined && value !== null ? (
          <p
            className={`mt-5 text-6xl font-black leading-none ${
              isDark ? "text-[#fff8ef]" : "text-[#241914]"
            }`}
          >
            {value}
          </p>
        ) : (
          <h3
            className={`font-editorial mt-3 text-[1.7rem] leading-none ${
              isDark ? "text-[#fff8ef]" : "text-[#241914]"
            }`}
          >
            {title}
          </h3>
        )}

        {title && value !== undefined && value !== null && (
          <h3
            className={`mt-3 text-lg font-bold leading-tight ${
              isDark ? "text-[#fff8ef]" : "text-[#241914]"
            }`}
          >
            {title}
          </h3>
        )}

        {description && (
          <p
            className={`mt-4 text-sm leading-relaxed ${
              isDark ? "text-white/78" : "text-[#5a4a3f]"
            }`}
          >
            {description}
          </p>
        )}

        {actions.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  action.variant === "primary"
                    ? "text-white focus-visible:ring-white/80 focus-visible:ring-offset-transparent"
                    : isDark
                      ? "border border-white/12 bg-white/10 text-white hover:bg-white/16 focus-visible:ring-white/70 focus-visible:ring-offset-transparent"
                      : "border border-[#2f241d]/10 bg-white/70 text-[#241914] hover:bg-white focus-visible:ring-[#2f241d]/35 focus-visible:ring-offset-[#fbf6ef]"
                }`}
                style={
                  action.variant === "primary"
                    ? { backgroundColor: accent }
                    : undefined
                }
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : (
          ctaLabel &&
          onClick && (
            <button
              onClick={onClick}
              className={`mt-auto inline-flex min-h-11 w-fit items-center justify-center pt-6 text-sm font-bold transition-transform duration-300 group-hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isDark
                  ? "text-[#fff8ef] focus-visible:ring-white/70 focus-visible:ring-offset-transparent"
                  : "focus-visible:ring-[#2f241d]/35 focus-visible:ring-offset-[#fbf6ef]"
              }`}
              style={{ color: isDark ? undefined : accent }}
            >
              {ctaLabel}
            </button>
          )
        )}
      </div>
    </article>
  );
}
