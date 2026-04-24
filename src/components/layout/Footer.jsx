import { useNavigate } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "Inicio", path: "/" },
  { label: "Perdidos", path: "/publicaciones/perdidos" },
  { label: "Encontrados", path: "/publicaciones/encontrados" },
  { label: "Adopciones", path: "/publicaciones/adopciones" },
  { label: "Casos resueltos", path: "/casos-resueltos" },
  { label: "Comunidad", path: "/casos-ayuda" },
];

export default function Footer() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="relative overflow-hidden bg-[#241914] px-4 pb-28 pt-12 text-white sm:px-6 md:pb-8 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,200,158,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(219,231,181,0.10),transparent_20%)]" />

      <div className="relative mx-auto max-w-[1600px] border-t border-white/10 pt-10">
        <div className="grid gap-10 pb-10 lg:grid-cols-[1.1fr_0.65fr_0.75fr]">
          <div className="max-w-xl">
            <img
              className="h-20 w-auto object-contain"
              src={import.meta.env.VITE_FOOTER_IMG_URL}
              alt="Perdidos y Adopciones"
            />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/74">
              Una base comunitaria para visibilizar animales perdidos,
              encontrados y en adopción, y ayudar a que cada caso tenga más
              oportunidades de reunión o de nuevo hogar.
            </p>
          </div>

          <div>
            <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#f4c89e]">
              Navegación
            </h2>
            <div className="mt-5 grid gap-3 text-sm">
              {FOOTER_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigateTo(link.path)}
                  className="w-fit cursor-pointer rounded-full px-1 text-left text-white/84 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#dbe7b5]">
              Contacto
            </h2>
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/74">
              <button
                onClick={() => navigateTo("/contacto")}
                className="w-fit cursor-pointer rounded-full px-1 text-left text-white/84 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Quiero colaborar
              </button>
              <span>+54 381 570-3940</span>
              <span>perdidosyadopcionesrec@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Perdidos y Adopciones.</p>
          <p>Base comunitaria para visibilizar, reunir y dar hogar.</p>
        </div>
      </div>
    </footer>
  );
}
