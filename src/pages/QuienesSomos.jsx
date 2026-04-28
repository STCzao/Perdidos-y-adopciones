import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Seo from "../components/seo/Seo";

const sections = [
  {
    title: "Misión del proyecto",
    content:
      "Buscamos dar visibilidad a animales perdidos, encontrados y en adopción para que cada publicación tenga más alcance, más claridad y mejores posibilidades de lograr un reencuentro o un nuevo hogar.",
  },
  {
    title: "Quiénes lo hacen",
    content:
      "Perdidos y Adopciones se sostiene gracias a personas comprometidas con el bienestar animal, la difusión responsable y la ayuda comunitaria frente a situaciones urgentes o procesos de adopción.",
  },
  {
    title: "Cómo nació",
    content:
      "El proyecto surgió a partir de la necesidad de reunir en un solo espacio casos dispersos en redes sociales, para ordenar la información, facilitar el contacto y dar más herramientas a quienes buscan ayuda.",
  },
  {
    title: "Cómo contribuir",
    content:
      "Puedes colaborar compartiendo publicaciones, aportando tránsito, ofreciendo recursos o ayudando a que la información llegue a más personas. Toda participación responsable suma al impacto comunitario.",
  },
];

export default function QuienesSomos() {
  return (
    <div className="bg-[color:var(--nature-sand)] text-[color:var(--nature-ink)]">
      <Seo
        title="Quiénes somos"
        description="Conoce la misión de Perdidos y Adopciones, cómo nació el proyecto, quiénes lo impulsan y de qué manera puedes contribuir a la comunidad."
        path="/quienes-somos"
      />
      <Navbar />

      <main className="px-4 pb-16 pt-26 sm:px-6 sm:pt-30 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl rounded-[1.6rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] p-6 shadow-[0_18px_40px_rgba(36,25,20,0.08)] sm:p-8">
          <h1 className="font-editorial text-[2.2rem] leading-[0.95] text-[color:var(--shell-bark)] sm:text-[3rem]">
            Quiénes somos
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--shell-muted)] sm:text-base">
            Somos una iniciativa comunitaria enfocada en conectar personas, ordenar
            información útil y dar más oportunidades a cada animal que necesita ayuda.
          </p>

          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-[1.2rem] bg-[color:var(--shell-surface-soft)] p-5"
              >
                <h2 className="text-xl font-semibold text-[color:var(--shell-bark)]">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--shell-muted)] sm:text-base">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex rounded-full border border-[color:var(--shell-line)] bg-[color:var(--shell-surface-soft)] px-5 py-2.5 text-sm font-semibold text-[color:var(--shell-bark)] transition-colors duration-200 hover:bg-[color:var(--shell-surface-alt)]"
          >
            Volver al inicio
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
