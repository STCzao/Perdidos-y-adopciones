import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CrearPublicacion } from "../../features/publicaciones/CrearPublicacion/CrearPublicacion";
import { EditarPerfil } from "../../features/usuarios/EditarPerfil";
import { VerPublicaciones } from "../../features/publicaciones/VerPublicaciones";
import { AdminPublicaciones } from "../../features/publicaciones/AdminPublicaciones";
import { AdminUsuarios } from "../../features/usuarios/AdminUsuarios";
import { CrearComunidad } from "../../features/comunidad/CrearComunidad";
import { VerComunidad } from "../../features/comunidad/VerComunidad";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useAuth } from "../../context/AuthContext";
import { ConfirmModal } from "../ui/ConfirmModal";

const NAV_LINKS = [
  { name: "Inicio", path: "/" },
  {
    name: "Perdidos",
    items: [
      { name: "Ver casos", path: "/publicaciones/perdidos" },
      { name: "Publicar caso", action: "create" },
      { name: "Qué hacer", path: "/consejos-perdi" },
    ],
  },
  {
    name: "Encontrados",
    items: [
      { name: "Ver casos", path: "/publicaciones/encontrados" },
      { name: "Publicar caso", action: "create" },
      { name: "Qué hacer", path: "/consejos-encontre" },
    ],
  },
  {
    name: "Adopciones",
    items: [
      { name: "Ver casos", path: "/publicaciones/adopciones" },
      { name: "Publicar caso", action: "create" },
      { name: "Qué hacer", path: "/consejos-adopcion" },
    ],
  },
  { name: "Resueltos", path: "/casos-resueltos" },
  { name: "Comunidad", path: "/casos-ayuda" },
];

const MOBILE_PRIMARY_LINKS = [
  { key: "inicio", label: "Inicio", path: "/", icon: "home" },
  {
    key: "publicaciones",
    label: "Publicaciones",
    path: "/publicaciones/perdidos",
    icon: "search",
  },
  { key: "crear", label: "Crear", action: "create", icon: "plus" },
  {
    key: "resueltos",
    label: "Resueltos",
    path: "/casos-resueltos",
    icon: "check",
  },
  {
    key: "comunidad",
    label: "Comunidad",
    path: "/casos-ayuda",
    icon: "people",
  },
];

const getInitials = (nombre = "") =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "US";

const ProfileAvatar = ({ user, className = "" }) => {
  if (user?.img) {
    return (
      <img
        src={user.img}
        alt={user.nombre ? `Perfil de ${user.nombre}` : "Perfil"}
        className={`h-10 w-10 rounded-[0.95rem] object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-[0.95rem] bg-[#f4c89e] text-sm font-bold tracking-[0.08em] text-[#2a1f19] ${className}`}
    >
      {getInitials(user?.nombre)}
    </div>
  );
};

const BottomNavIcon = ({ type, active = false }) => {
  const stroke = active ? "#2a1f19" : "currentColor";

  return (
    <svg
      className="h-[1.15rem] w-[1.15rem]"
      fill="none"
      stroke={stroke}
      strokeWidth="1.85"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {type === "home" && <path d="M3 11.5 12 4l9 7.5M5 10.5V20h14v-9.5" />}
      {type === "search" && (
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </>
      )}
      {type === "plus" && (
        <>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </>
      )}
      {type === "check" && <path d="m5 13 4 4L19 7" />}
      {type === "people" && (
        <>
          <path d="M7.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M16.5 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
          <path d="M3.5 19c.8-2.8 3-4.2 6-4.2 2.9 0 5.1 1.4 5.9 4.2" />
          <path d="M14.5 18c.5-1.8 2-2.9 4.1-2.9 1 0 1.8.2 2.4.5" />
        </>
      )}
    </svg>
  );
};

const NavbarContent = () => {
  const { login, user, cerrarSesion } = useAuth();
  const withAuth = useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = React.useRef(null);

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = React.useState(null);
  const [isDesktopProfileMenuOpen, setIsDesktopProfileMenuOpen] = React.useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState({
    isOpen: false,
    item: null,
  });

  const isAdmin = !!(user && user.rol === "ADMIN_ROLE");

  const isSolidNavbar =
    isScrolled ||
    location.pathname.startsWith("/publicaciones") ||
    location.pathname.startsWith("/casos-resueltos") ||
    location.pathname.startsWith("/casos-ayuda") ||
    location.pathname.startsWith("/contacto");

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 14);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDesktopDropdown(null);
        setIsDesktopProfileMenuOpen(false);
        setIsMobileProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    setActiveDesktopDropdown(null);
    setIsDesktopProfileMenuOpen(false);
    setIsMobileProfileMenuOpen(false);
  }, [location.pathname]);

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    setActiveDesktopDropdown(null);
    setIsDesktopProfileMenuOpen(false);
    setIsMobileProfileMenuOpen(false);
  };

  const handleCreatePost = () => {
    withAuth(() => CrearPublicacion.openModal());
    setActiveDesktopDropdown(null);
    setIsDesktopProfileMenuOpen(false);
    setIsMobileProfileMenuOpen(false);
  };

  const handleProfileAction = (action) => {
    if (action === "profile") EditarPerfil.openModal();
    if (action === "posts") VerPublicaciones.openModal();
    if (action === "admin-posts") AdminPublicaciones.openModal();
    if (action === "admin-users") AdminUsuarios.openModal();
    if (action === "admin-comunidad-create") CrearComunidad.openModal();
    if (action === "admin-comunidad-list") VerComunidad.openModal();
    if (action === "logout") setConfirmModal({ isOpen: true, item: { tipo: "sesion" } });
    setIsDesktopProfileMenuOpen(false);
    setIsMobileProfileMenuOpen(false);
  };

  const openDesktopDropdown = (name) => setActiveDesktopDropdown(name);
  const closeDesktopDropdown = () => setActiveDesktopDropdown(null);

  const renderDropdownItem = (item) => {
    if (item.action === "create") {
      return (
        <button
          key={item.name}
          onClick={handleCreatePost}
          className="w-full cursor-pointer rounded-[0.95rem] bg-[#f4c89e] px-3 py-2 text-left text-sm font-semibold text-[#2a1f19] transition-colors duration-300 hover:bg-[#ffd8b6]"
        >
          {item.name}
        </button>
      );
    }

    return (
      <button
        key={item.name}
        onClick={() => navigateTo(item.path)}
        className="w-full cursor-pointer rounded-[0.95rem] px-3 py-2 text-left text-sm font-medium text-white/88 transition-colors duration-300 hover:bg-white/10 hover:text-white"
      >
        {item.name}
      </button>
    );
  };

  const profileMenuItems = login
    ? [
        { key: "profile", label: "Mi perfil" },
        { key: "posts", label: "Mis publicaciones" },
        ...(isAdmin
          ? [
              { key: "admin-comunidad-create", label: "Crear caso para ayuda" },
              { key: "admin-posts", label: "Todas las publicaciones" },
              { key: "admin-users", label: "Todos los usuarios" },
              { key: "admin-comunidad-list", label: "Todos los casos para ayuda" },
            ]
          : []),
        { key: "contact", label: "Colaborar", path: "/contacto" },
        { key: "logout", label: "Cerrar sesión", tone: "danger" },
      ]
    : [
        { key: "login", label: "Iniciar sesión", path: "/login" },
        { key: "register", label: "Registrarse", path: "/register" },
        { key: "contact", label: "Colaborar", path: "/contacto" },
      ];

  const isMobileBottomLinkActive = (item) => {
    if (item.key === "inicio") return location.pathname === "/";
    if (item.key === "publicaciones") return location.pathname.startsWith("/publicaciones");
    if (item.key === "resueltos") return location.pathname.startsWith("/casos-resueltos");
    if (item.key === "comunidad") return location.pathname.startsWith("/casos-ayuda");
    return false;
  };

  const renderProfileMenuButtons = (isMobile = false) =>
    profileMenuItems.map((item) =>
      item.path ? (
        <button
          key={item.key}
          onClick={() => navigateTo(item.path)}
          className={`w-full cursor-pointer text-left text-sm font-medium transition-colors duration-300 ${
            isMobile
              ? "rounded-[0.95rem] border border-white/8 bg-white/8 px-3 py-2 text-white hover:bg-white/12"
              : "rounded-[0.95rem] px-3 py-2 text-white/88 hover:bg-white/10 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ) : (
        <button
          key={item.key}
          onClick={() => handleProfileAction(item.key)}
          className={`w-full cursor-pointer text-left text-sm font-medium transition-colors duration-300 ${
            isMobile
              ? item.tone === "danger"
                ? "rounded-[0.95rem] border border-[#b84e3c]/25 bg-[#b84e3c]/12 px-3 py-2 text-[#f1b0a4] hover:bg-[#b84e3c]/18"
                : "rounded-[0.95rem] border border-white/8 bg-white/8 px-3 py-2 text-white hover:bg-white/12"
              : item.tone === "danger"
                ? "rounded-[0.95rem] px-3 py-2 text-[#f1b0a4] hover:bg-[#b84e3c]/14 hover:text-white"
                : "rounded-[0.95rem] px-3 py-2 text-white/88 hover:bg-white/10 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ),
    );

  return (
    <>
      <nav ref={navRef} className="fixed left-0 top-0 z-50 w-full px-3 pt-2.5 sm:px-5 lg:px-8">
        <div
          className={`mx-auto flex max-w-[1680px] items-center justify-between gap-4 rounded-[1.35rem] border px-3 py-2.5 transition-all duration-500 sm:px-4 ${
            isSolidNavbar
              ? "border-white/10 bg-[rgba(32,23,20,0.82)] shadow-[0_20px_60px_rgba(20,15,13,0.22)] backdrop-blur-xl"
              : "border-white/12 bg-[rgba(36,26,22,0.34)] shadow-[0_20px_60px_rgba(20,15,13,0.14)] backdrop-blur-md"
          }`}
        >
          <button
            onClick={() => navigateTo("/")}
            className="flex shrink-0 cursor-pointer items-center gap-3 rounded-[1rem] bg-transparent px-1 py-1 text-left transition-colors duration-300 hover:bg-white/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label="Ir al inicio"
          >
            <img
              src={import.meta.env.VITE_NAVBAR_LOGO_URL}
              alt="Perdidos y Adopciones"
              className={`h-12 w-auto max-w-[8.2rem] object-contain transition-all duration-300 ${
                isSolidNavbar ? "filter-none" : "invert"
              }`}
              draggable="false"
            />
          </button>

          <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-1 rounded-[1rem] border border-white/10 bg-[rgba(255,255,255,0.05)] px-2 py-1.5 backdrop-blur-sm">
              {NAV_LINKS.map((link) =>
                link.items ? (
                  <div
                    key={link.name}
                    className="relative -mb-4 pb-4"
                    onMouseEnter={() => openDesktopDropdown(link.name)}
                    onMouseLeave={closeDesktopDropdown}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDesktopDropdown((prev) =>
                          prev === link.name ? null : link.name,
                        )
                      }
                      onFocus={() => openDesktopDropdown(link.name)}
                      className="flex cursor-pointer items-center gap-2 rounded-[0.95rem] px-4 py-1.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10 hover:text-[#f4c89e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                      aria-haspopup="menu"
                      aria-expanded={activeDesktopDropdown === link.name}
                      aria-controls={`desktop-dropdown-${link.name}`}
                    >
                      {link.name}
                      <svg
                        className={`h-4 w-4 transition-transform duration-300 ${
                          activeDesktopDropdown === link.name ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    <div
                      id={`desktop-dropdown-${link.name}`}
                      className={`absolute left-1/2 top-full z-20 mt-2 flex min-w-[220px] -translate-x-1/2 flex-col gap-2 rounded-[1.15rem] border border-white/10 bg-[rgba(28,20,17,0.92)] p-3 shadow-[0_22px_70px_rgba(20,15,13,0.22)] backdrop-blur-xl transition-all duration-200 ${
                        activeDesktopDropdown === link.name
                          ? "visible translate-y-0 opacity-100"
                          : "invisible translate-y-2 opacity-0"
                      }`}
                      role="menu"
                    >
                      {link.items.map((item) => renderDropdownItem(item))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `rounded-[0.95rem] px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                        isActive
                          ? "bg-[#f4c89e] text-[#2a1f19] shadow-[0_10px_24px_rgba(244,200,158,0.18)]"
                          : "border border-white/8 bg-white/8 text-white hover:border-white/14 hover:bg-white/12 hover:text-[#f4c89e]"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ),
              )}
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              onClick={handleCreatePost}
              className="cursor-pointer rounded-[0.95rem] bg-[#f4c89e] px-5 py-2 text-sm font-bold text-[#2a1f19] shadow-[0_10px_24px_rgba(244,200,158,0.18)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Publicar caso
            </button>
            <button
              onClick={() => navigateTo("/contacto")}
              className="cursor-pointer rounded-[0.95rem] border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10 hover:text-[#f4c89e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Colaborar
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDesktopProfileMenuOpen((value) => !value)}
                className="flex cursor-pointer items-center gap-3 rounded-[1rem] border border-white/10 bg-white/6 px-2.5 py-2 text-white transition-colors duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-expanded={isDesktopProfileMenuOpen}
                aria-haspopup="menu"
              >
                <ProfileAvatar user={user} />
                <div className="min-w-0 text-left">
                  <p className="max-w-[11rem] truncate text-sm font-semibold text-white">
                    {login ? user?.nombre || "Mi cuenta" : "Mi cuenta"}
                  </p>
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-white/56">
                    {login ? "Perfil" : "Acceso"}
                  </p>
                </div>
                <svg
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                    isDesktopProfileMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <div
                className={`absolute right-0 top-full z-20 mt-2 flex min-w-[260px] flex-col gap-2 rounded-[1.15rem] border border-white/10 bg-[rgba(28,20,17,0.94)] p-3 shadow-[0_22px_70px_rgba(20,15,13,0.22)] backdrop-blur-xl transition-all duration-200 ${
                  isDesktopProfileMenuOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-2 opacity-0"
                }`}
                role="menu"
              >
                {login && (
                  <div className="rounded-[1rem] border border-white/8 bg-white/6 px-3 py-3">
                    <p className="text-sm font-semibold text-white">{user?.nombre}</p>
                    <p className="mt-1 text-xs text-white/62">{user?.correo}</p>
                  </div>
                )}
                {renderProfileMenuButtons()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileProfileMenuOpen((value) => !value)}
              className="flex cursor-pointer items-center gap-2 rounded-[1rem] border border-white/10 bg-white/8 px-2 py-2 text-white transition-colors duration-300 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c89e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-expanded={isMobileProfileMenuOpen}
              aria-haspopup="menu"
            >
              <ProfileAvatar user={user} className="h-9 w-9" />
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${
                  isMobileProfileMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`mx-auto mt-2 w-full max-w-[1680px] md:hidden transition-all duration-200 ${
            isMobileProfileMenuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <div className="ml-auto max-w-[320px] rounded-[1.15rem] border border-white/10 bg-[rgba(28,20,17,0.94)] p-3 shadow-[0_22px_70px_rgba(20,15,13,0.22)] backdrop-blur-xl">
            <div className="rounded-[1rem] border border-white/8 bg-white/6 px-3 py-3">
              <p className="text-sm font-semibold text-white">
                {login ? user?.nombre || "Mi cuenta" : "Mi cuenta"}
              </p>
              <p className="mt-1 text-xs text-white/62">
                {login ? user?.correo || "Perfil" : "Acceso a tu cuenta"}
              </p>
            </div>

            <div className="mt-3 flex flex-col gap-2">{renderProfileMenuButtons(true)}</div>
          </div>
        </div>
      </nav>

      <div className="md:hidden h-18" />

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#2f241d]/10 bg-[rgba(255,249,242,0.94)] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_45px_rgba(31,20,14,0.14)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-[560px] grid-cols-5 gap-2">
          {MOBILE_PRIMARY_LINKS.map((item) => {
            const isActive = isMobileBottomLinkActive(item);
            const isCreate = item.action === "create";

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => (isCreate ? handleCreatePost() : navigateTo(item.path))}
                className={`flex min-h-[3.7rem] cursor-pointer flex-col items-center justify-center gap-1 rounded-[1rem] px-2 text-center transition-all duration-200 ${
                  isCreate
                    ? "bg-[#f4c89e] text-[#2a1f19] shadow-[0_12px_30px_rgba(244,200,158,0.22)]"
                    : isActive
                      ? "bg-[#f0dcc8] text-[#2a1f19]"
                      : "text-[#6f5f53] hover:bg-[#f7ede2]"
                }`}
                aria-label={item.label}
              >
                <BottomNavIcon type={item.icon} active={isActive || isCreate} />
                <span className="text-[0.68rem] font-semibold leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <CrearPublicacion.Component />
      <EditarPerfil.Component />
      <VerPublicaciones.Component />
      <CrearComunidad.Component />
      <VerComunidad.Component />

      <ConfirmModal
        confirmModal={confirmModal}
        onClose={() => setConfirmModal({ isOpen: false, item: null })}
        onConfirm={cerrarSesion}
        type="sesion"
      />
    </>
  );
};

const Navbar = () => <NavbarContent />;

export default Navbar;
