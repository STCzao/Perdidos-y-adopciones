import React from "react";
import { useSidebar } from "../SidebarOpciones/SidebarOpciones";
import { CrearPublicacion } from "../CrearPublicacion/CrearPublicacion";
import { EditarPerfil } from "../EditarPerfil/EditarPerfil";
import { VerPublicaciones } from "../VerPublicaciones/VerPublicaciones";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useLocation } from "react-router-dom";

const NavbarContent = () => {
  const { open, setOpen } = useSidebar();
  const withAuth = useRequireAuth();

  const navLinks = [
    { name: "Inicio", path: "/" },
    {
      name: "Perdidos",
      dropdown: [
        {
          name: "Colocar anuncio de he perdido un animal",
          action: () => withAuth(() => CrearPublicacion.openModal()),
        },
        {
          name: "Ver anuncios de animales perdidos",
          path: "/publicaciones/perdidos",
        },
        { name: "¿Qué hacer si perdí un animal?", path: "/consejos-perdi" },
      ],
    },
    {
      name: "Encontrados",
      dropdown: [
        {
          name: "Colocar anuncio de he encontrado un animal",
          action: () => withAuth(() => CrearPublicacion.openModal()),
        },
        {
          name: "Ver anuncios de animales encontrados",
          path: "/publicaciones/encontrados",
        },
        {
          name: "¿Qué hacer si encontré un animal?",
          path: "/consejos-encontre",
        },
      ],
    },
    {
      name: "Adopciones",
      dropdown: [
        {
          name: "Colocar anuncio de animal en adopción ",
          action: () => withAuth(() => CrearPublicacion.openModal()),
        },
        {
          name: "Ver anuncios de animales en adopción",
          path: "/publicaciones/adopciones",
        },
        {
          name: "¿Qué hacer si quiero adoptar o dar en adopción?",
          path: "/consejos-adopcion",
        },
      ],
    },
    {
      name: "Casos resueltos",
      path: "/casos-resueltos",
    },
    {
      name: "Historias & consejos",
      path: "/casos-ayuda",
    },
  ];

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = React.useState({});

  const location = useLocation();
  const isResueltos = location.pathname.startsWith("/casos-resueltos");
  const isPublicaciones = location.pathname.startsWith("/publicaciones");
  const isSolidNavbar = isPublicaciones || isResueltos || isScrolled;

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (name) => {
    setMobileDropdownOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-8 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
          isSolidNavbar
            ? "bg-[#FF7857] shadow-md text-white backdrop-blur-lg py-2"
            : "bg-transparent text-white py-2"
        }`}
      >
        {/* Logo - Mantiene posición a la izquierda */}
        <div
          className={`flex flex-col items-center cursor-pointer ${
            !isPublicaciones || !isResueltos ? "drop-shadow-[0_0_2px_black]" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Guardar posición de scroll antes de cambiar el estado
            const currentScrollY = window.scrollY;
            const currentScrollX = window.scrollX;
            setOpen(!open);
            // Restaurar posición inmediatamente
            requestAnimationFrame(() => {
              window.scrollTo(currentScrollX, currentScrollY);
            });
          }}
        >
          <img
            src={import.meta.env.VITE_NAVBAR_LOGO_URL}
            alt="logo"
            className={`h-16 transition-all duration-300 ${
              isSolidNavbar ? "filter-none" : "invert"
            }`}
            draggable="false"
          />
          <div className="flex ml-1 items-center text-sm font-medium">
            <span>Perfil</span>
          </div>
        </div>

        {/* Contenedor para todos los elementos de la derecha */}
        <div className="flex items-center text-sm">
          {/* Desktop Nav - Ahora a la derecha */}
          <div
            className={`hidden md:flex items-center ${
              !isPublicaciones || !isResueltos ? "drop-shadow-[0_0_2px_black]" : ""
            }`}
          >
            <div className="flex items-center gap-6 ml-10">
              {navLinks.map((link, i) =>
                link.dropdown ? (
                  <div key={i} className="relative group">
                    <button
                      className={`flex items-center gap-1 font-medium transition-colors delay-100 duration-300 ${
                        isSolidNavbar
                          ? "hover:text-black"
                          : "hover:text-[#FF7857]"
                      }`}
                      onTouchStart={(e) => {
                        // Para dispositivos táctiles (tablets)
                        e.preventDefault();
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown.classList.toggle("opacity-0");
                        dropdown.classList.toggle("invisible");
                        dropdown.classList.toggle("opacity-100");
                        dropdown.classList.toggle("visible");
                      }}
                    >
                      {link.name}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    <div
                      className="absolute top-8 left-1/2 transform -translate-x-1/2 rounded-xl min-w-[220px] flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#FF7857] text-white border border-white shadow-xl"
                      onMouseLeave={(e) => {
                        // Cerrar dropdown al salir (solo mouse)
                        if (window.matchMedia("(hover: hover)").matches) {
                          e.currentTarget.classList.add(
                            "opacity-0",
                            "invisible",
                          );
                          e.currentTarget.classList.remove(
                            "opacity-100",
                            "visible",
                          );
                        }
                      }}
                    >
                      {link.dropdown.map((item, j) =>
                        item.action ? (
                          <button
                            key={j}
                            onClick={() => {
                              item.action();
                            }}
                            className="px-4 py-2 text-left text-white hover:bg-white/20 transition-colors delay-100 duration-300 w-full"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <a
                            key={j}
                            href={item.path}
                            className="px-4 py-2 text-white hover:bg-white/20 transition-colors"
                          >
                            {item.name}
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <a
                    key={i}
                    href={link.path}
                    className={`font-medium transition-colors delay-100 duration-300 ${
                      isSolidNavbar
                        ? "hover:text-black"
                        : "hover:text-[#FF7857]"
                    }`}
                  >
                    {link.name}
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Mobile Menu Button - Mantiene posición */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 transition-colors delay-100 duration-300 hover:text-[#FF7857]"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-[#FF7857] text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-white transition-all duration-500 z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 p-6 transition-colors delay-100 duration-300 hover:text-[#ffd1c2]"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {navLinks.map((link, i) =>
          link.dropdown ? (
            <div key={i} className="flex flex-col items-center gap-2">
              <button
                className="font-medium transition-colors delay-100 duration-300 hover:text-[#ffd1c2]"
                onClick={() => toggleDropdown(link.name)}
              >
                {link.name}
              </button>
              {link.dropdown &&
                mobileDropdownOpen[link.name] &&
                link.dropdown.map((item, j) =>
                  item.action ? (
                    <button
                      key={j}
                      onClick={() => {
                        item.action();
                        setIsMenuOpen(false);
                      }}
                      className="transition-colors delay-100 duration-300 hover:text-[#ffd1c2]"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <a
                      key={j}
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ),
                )}
            </div>
          ) : (
            <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </a>
          ),
        )}
      </div>

      {/* Sidebar y modales */}
      <CrearPublicacion.Component />
      <EditarPerfil.Component />
      <VerPublicaciones.Component />
    </>
  );
};

const Navbar = () => <NavbarContent />;

export default Navbar;
