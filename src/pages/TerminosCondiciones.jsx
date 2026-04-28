import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Seo from "../components/seo/Seo";

const sections = [
  {
    title: "Introducción",
    content:
      "Perdidos y Adopciones es una plataforma comunitaria pensada para difundir casos de animales perdidos, encontrados y en adopción. Al navegar o publicar contenido en el sitio, aceptas estas condiciones de uso.",
  },
  {
    title: "Uso del sitio",
    content:
      "Quienes usan la plataforma se comprometen a compartir información veraz, actualizada y respetuosa. No está permitido publicar contenido engañoso, ofensivo, discriminatorio o que vulnere derechos de terceros.",
  },
  {
    title: "Privacidad de datos",
    content:
      "Los datos ingresados se utilizan para facilitar el contacto entre personas usuarias y mejorar el funcionamiento del proyecto. Recomendamos publicar solo la información necesaria para resolver cada caso.",
  },
  {
    title: "Responsabilidad",
    content:
      "Perdidos y Adopciones actúa como espacio de difusión y conexión entre personas. No garantiza resultados concretos en cada publicación ni asume responsabilidad por acuerdos, contactos o interacciones fuera del sitio.",
  },
  {
    title: "Contacto",
    content:
      "Si tienes dudas sobre estas condiciones o necesitas reportar un problema, puedes escribirnos a través de la sección de contacto para que podamos ayudarte.",
  },
];

export default function TerminosCondiciones() {
  return (
    <div className="bg-[color:var(--nature-sand)] text-[color:var(--nature-ink)]">
      <Seo
        title="Términos y Condiciones"
        description="Consulta los términos y condiciones de uso de Perdidos y Adopciones, con pautas de publicación, privacidad de datos, responsabilidades y contacto."
        path="/terminos-y-condiciones"
      />
      <Navbar />

      <main className="px-4 pb-16 pt-26 sm:px-6 sm:pt-30 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl rounded-[1.6rem] border border-[color:var(--shell-line)] bg-[color:var(--shell-surface)] p-6 shadow-[0_18px_40px_rgba(36,25,20,0.08)] sm:p-8">
          <h1 className="font-editorial text-[2.2rem] leading-[0.95] text-[color:var(--shell-bark)] sm:text-[3rem]">
            Términos y Condiciones de uso
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--shell-muted)] sm:text-base">
            Estas condiciones explican cómo funciona el sitio, qué esperamos del uso
            comunitario y de qué manera cuidamos la información compartida en cada caso.
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
