import React from "react";
import Logo from "../../assets/Logo Perdidos y adopciones.png";

const Navbar = () => {
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
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-10 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-[#FF7857] shadow-md text-white backdrop-blur-lg py-3 md:py-4"
          : "bg-transparent text-white py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
        <img
          src={Logo}
          alt="logo"
          className="h-16 transition-all duration-300"
        />
      </a>

      {/* Links + Buscador */}
      <div className="hidden md:flex items-center gap-8 lg:gap-12">
        {/* Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          {navLinks.map((link, i) =>
            link.dropdown ? (
              <div key={i} className="relative group">
                <button
                  className={`flex items-center gap-1 text-white font-medium transition-colors ${
                    isScrolled ? "hover:text-black" : "hover:text-[#FF7857]"
                  }`}
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
                {/* Dropdown */}
                <div
                  className={`absolute top-8 left-0 shadow-lg rounded-md min-w-[200px] py-2 flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ${
                    isScrolled
                      ? "bg-transparent border border-black"
                      : "bg-transparent border border-[#FF7857]"
                  }`}
                >
                  {link.dropdown.map((item, j) => (
                    <a
                      key={j}
                      href={item.path}
                      className="px-4 py-2 text-white hover:bg-white/20 transition-colors"
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
                className={`font-medium text-white transition-colors ${
                  isScrolled ? "hover:text-black" : "hover:text-[#FF7857]"
                }`}
              >
                {link.name}
              </a>
            )
          )}
        </div>

        {/* Buscador pegado a los links */}
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

      {/* Mobile menu button */}
      <div className="flex md:hidden items-center gap-3">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke={isScrolled ? "#000" : "#FFF"}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-black transition-transform duration-500 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-6 right-6 p-2"
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
            <div
              key={i}
              className="flex flex-col items-center gap-2 border border-[#FF7857] p-3 rounded-lg gap-5"
            >
              <button
                className="font-medium text-black"
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
                    className="font-medium text-[#FF7857]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
            </div>
          ) : (
            <a
              key={i}
              href={link.path}
              className="font-medium text-black "
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          )
        )}

        {/* Buscador mobile */}
        <div className="font-medium flex items-center rounded-full overflow-hidden px-3 py-1.5 mt-4 w-3/4 border border-[#FF7857]">
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none w-full placeholder-black text-[#FF7857]"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
