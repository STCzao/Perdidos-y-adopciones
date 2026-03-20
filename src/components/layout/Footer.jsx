import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="px-6 font-medium sm:px-10 md:px-16 lg:px-24 xl:px-32 pt-10 w-full bg-[#FF7857] text-white">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-white/20 pb-8">
        {/* Logo + Descripción */}
        <div className="md:max-w-md text-center md:text-left">
          <img className="h-20" src={import.meta.env.VITE_FOOTER_IMG_URL} alt="" />
          <p className="mt-6 text-sm leading-relaxed text-white/90">
            Una plataforma que conecta personas con animales perdidos,
            encontrados y en adopción, para que cada caso sea visibilizado y
            pueda recibir ayuda que merece.
          </p>
        </div>

        {/* Links + Contacto */}
        <div className="flex-1 flex flex-col sm:flex-row sm:justify-center md:justify-end gap-10 sm:gap-16 text-center sm:text-left">
          {/* Links */}
          <div>
            <h2 className="font-semibold mb-5 text-white">Secciones</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  onClick={() => {
                    navigate("/");
                    window.scrollTo(0, 0);
                  }}
                  className="hover:underline hover:text-black transition cursor-pointer"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate("/perdidos-informacion");
                    window.scrollTo(0, 0);
                  }}
                  className="hover:underline hover:text-black transition cursor-pointer"
                >
                  Perdidos
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate("/encontrados-informacion");
                    window.scrollTo(0, 0);
                  }}
                  className="hover:underline hover:text-black transition cursor-pointer"
                >
                  Encontrados
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate("/adopciones-informacion");
                    window.scrollTo(0, 0);
                  }}
                  className="hover:underline hover:text-black transition cursor-pointer"
                >
                  Adopciones
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate("/casos-ayuda");
                    window.scrollTo(0, 0);
                  }}
                  className="hover:underline hover:text-black transition cursor-pointer"
                >
                  Casos para ayuda
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="font-semibold mb-5 text-white">Contacto</h2>
            <div className="text-sm space-y-2 text-white/90">
              <p
                onClick={() => {
                  navigate("/contacto");
                  window.scrollTo(0, 0);
                }}
                className="hover:underline hover:text-black transition cursor-pointer"
              >
                Consultas
              </p>
              <p>+54 381 570-3940</p>
              <p>perdidosyadopcionesrec@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copy */}
      <p className="pt-6 text-center text-xs md:text-sm pb-6 text-white/80">
        © {new Date().getFullYear()} Perdidos y Adopciones. Todos los derechos
        reservados.
      </p>
    </footer>
  );
}
