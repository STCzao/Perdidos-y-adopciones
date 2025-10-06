import React from "react";
import Logo from "../../assets/Logo Perdidos y adopciones.png";
import {
  SidebarProvider,
  useSidebar,
  SidebarOpciones,
} from "../SidebarOpciones/SidebarOpciones";

import { CrearPublicacion } from "../CrearPublicacion/CrearPublicacion";
import { EditarPerfil } from "../EditarPerfil/EditarPerfil";
import { VerPublicaciones } from "../VerPublicaciones/VerPublicaciones";
import { EditarPublicacion } from "../EditarPublicacion/EditarPublicacion";

const NavbarContent = ({ cerrarSesion }) => {
  const { open, setOpen } = useSidebar();

  const navLinks = [
    { name: "Inicio", path: "/" },
    {
      name: "¿Qué hacer?",
      dropdown: [
        { name: "¿Qué hacer si perdí a mi perro?", path: "/perdi-perro" },
        { name: "¿Qué hacer si encontré un perro?", path: "/encontre-perro" },
      ],
    },
    { name: "Casos para ayuda", path: "/casos" },
  ];

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = React.useState({});

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
          isScrolled
            ? "bg-[#FF7857] shadow-md text-white backdrop-blur-lg py-3"
            : "bg-transparent text-white py-4 md:py-6"
        }`}
      >
        {/* Logo - Mantiene posición a la izquierda */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <img
            src={Logo}
            alt="logo"
            className="h-16 transition-all duration-300"
          />
        </div>

        {/* Contenedor para todos los elementos de la derecha */}
        <div className="flex items-center gap-8">
          {/* Desktop Nav - Ahora a la derecha */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-8">
              {navLinks.map((link, i) =>
                link.dropdown ? (
                  <div key={i} className="relative group">
                    <button
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        isScrolled ? "hover:text-black" : "hover:text-[#FF7857]"
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
                      className={`absolute top-8 left-1/2 transform -translate-x-1/2 shadow-lg rounded-md min-w-[200px] flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ${
                        isScrolled
                          ? "bg-[#FF7857] text-white border border-white"
                          : "bg-transparent border border-[#FF7857]"
                      }`}
                      onMouseLeave={(e) => {
                        // Cerrar dropdown al salir (solo mouse)
                        if (window.matchMedia("(hover: hover)").matches) {
                          e.currentTarget.classList.add(
                            "opacity-0",
                            "invisible"
                          );
                          e.currentTarget.classList.remove(
                            "opacity-100",
                            "visible"
                          );
                        }
                      }}
                    >
                      {link.dropdown.map((item, j) => (
                        <a
                          key={j}
                          href={item.path}
                          className="px-4 py-2 text-white hover:bg-white/20 transition-colors"
                          onClick={() => {
                            // Cerrar dropdown al hacer click en un item (tablets)
                            const dropdown = document.querySelector(
                              `[data-dropdown="${link.name}"]`
                            );
                            if (dropdown) {
                              dropdown.classList.add("opacity-0", "invisible");
                              dropdown.classList.remove(
                                "opacity-100",
                                "visible"
                              );
                            }
                          }}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a
                    key={i}
                    href={link.path}
                    className={`font-medium transition-colors ${
                      isScrolled ? "hover:text-black" : "hover:text-[#FF7857]"
                    }`}
                  >
                    {link.name}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Buscador Desktop - Ahora a la derecha */}
          <div className="hidden md:flex items-center gap-4">
            <div>
              <input
                type="text"
                placeholder="Buscar..."
                className={`px-4 py-2 rounded-md outline-none bg-transparent placeholder-white text-white transition-all ${
                  isScrolled ? "border border-white" : "border border-[#FF7857]"
                }`}
              />
            </div>
          </div>

          {/* Mobile Menu Button - Mantiene posición */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
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
          className="absolute top-4 right-4 p-6"
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
                className="font-medium"
                onClick={() => toggleDropdown(link.name)}
              >
                {link.name}
              </button>
              {link.dropdown &&
                mobileDropdownOpen[link.name] &&
                link.dropdown.map((item, j) => (
                  <a
                    key={j}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
            </div>
          ) : (
            <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </a>
          )
        )}

        {/* Buscador mobile */}
        <div className="flex items-center rounded-md overflow-hidden px-3 py-1.5 mt-4 w-3/4 border border-white">
          <input
            type="text"
            placeholder="Buscar..."
            className="outline-none w-full placeholder-white text-white"
          />
        </div>
      </div>

      {/* Sidebar y modales */}
      <SidebarOpciones cerrarSesion={cerrarSesion} />
      <CrearPublicacion.Component />
      <EditarPerfil.Component />
      <VerPublicaciones.Component />
      <EditarPublicacion.Component />
    </>
  );
};

const Navbar = ({ cerrarSesion }) => (
  <SidebarProvider>
    <NavbarContent cerrarSesion={cerrarSesion} />
  </SidebarProvider>
);

export default Navbar;
