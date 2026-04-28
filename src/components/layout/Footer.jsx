import { Link, useNavigate } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "Inicio", path: "/" },
  { label: "Perdidos", path: "/publicaciones/perdidos" },
  { label: "Encontrados", path: "/publicaciones/encontrados" },
  { label: "Adopciones", path: "/publicaciones/adopciones" },
  { label: "Casos resueltos", path: "/casos-resueltos" },
  { label: "Comunidad", path: "/casos-ayuda" },
  { label: "Términos y Condiciones", path: "/terminos-y-condiciones" },
  { label: "Quiénes somos", path: "/quienes-somos" },
];

export default function Footer() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--shell-line)]/70 bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(248,240,229,0.96))] px-4 pb-28 pt-12 text-[color:var(--shell-ink)] sm:px-6 md:pb-8 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,36,29,0.07),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(95,76,65,0.06),transparent_20%)]" />

      <div className="relative mx-auto max-w-[1600px] border-t border-[color:var(--shell-line)]/70 pt-10">
        <div className="grid gap-10 pb-10 lg:grid-cols-[1.1fr_0.65fr_0.75fr]">
          <div className="max-w-xl">
            <img
              className="h-20 w-auto object-contain"
              src={import.meta.env.VITE_FOOTER_IMG_URL}
              alt="Perdidos y Adopciones"
            />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--shell-muted)]">
              Una base comunitaria para visibilizar animales perdidos,
              encontrados y en adopción, y ayudar a que cada caso tenga más
              oportunidades de reunión o de nuevo hogar.
            </p>
          </div>

          <div>
            <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[color:var(--shell-bark)]">
              Navegación
            </h2>
            <div className="mt-5 grid gap-3 text-sm">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => window.scrollTo(0, 0)}
                  className="w-fit cursor-pointer rounded-full px-1 text-left text-[color:var(--shell-muted)] transition-colors duration-300 hover:text-[color:var(--shell-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--shell-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[color:var(--shell-bark)]">
              Contacto
            </h2>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[color:var(--shell-muted)]">
              <button
                onClick={() => navigateTo("/contacto")}
                className="w-fit cursor-pointer rounded-full px-1 text-left text-[color:var(--shell-muted)] transition-colors duration-300 hover:text-[color:var(--shell-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--shell-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Quiero colaborar
              </button>
              <span>+54 381 570-3940</span>
              <span>perdidosyadopcionesrec@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[color:var(--shell-line)]/70 pt-6 text-xs text-[#7b685c] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Perdidos y Adopciones.</p>
          <p>Base comunitaria para visibilizar, reunir y dar hogar.</p>
        </div>
      </div>
    </footer>
  );
}
