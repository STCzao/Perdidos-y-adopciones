import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Seo from "../components/seo/Seo";
import ColaboradoresForm from "../features/colaboradores/ColaboradoresForm";
import { buildBreadcrumbSchema } from "../components/seo/seoUtils";

const ContactScreen = () => {
  return (
    <div className="bg-[#f6efe4] text-[#241914]">
      <Seo
        title="Contacto y colaboracion"
        description="Contactanos para colaborar con Perdidos y Adopciones, ofrecer ayuda, insumos, transito o difusion para los casos de la comunidad."
        path="/contacto"
        structuredData={[
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Contacto", path: "/contacto" },
          ]),
        ]}
      />
      <Navbar />

      <section
        className="relative isolate overflow-hidden px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-30 lg:px-8 lg:pt-30"
        style={{
          background:
            "linear-gradient(180deg, #2c211d 0%, #43302a 58%, #5a3f35 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-55"
          style={{
            backgroundImage: `linear-gradient(125deg, rgba(25,20,17,0.74), rgba(25,20,17,0.26)), url(${import.meta.env.VITE_CONTACT_IMG_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute left-[-8rem] top-36 h-72 w-72 rounded-full bg-[#c86d4b]/18 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8rem] top-28 h-80 w-80 rounded-full bg-[#95a667]/12 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[1.35rem] border border-white/10 bg-[rgba(22,17,15,0.52)] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:rounded-[2rem] sm:p-6 lg:sticky lg:top-32 lg:p-8"
            >
              <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.26em] text-[#f5e7d9]">
                Colaborar
              </span>
              <h1 className="font-editorial mt-4 text-[2rem] leading-[0.94] text-white sm:mt-5 sm:text-[3rem]">
                Formulario para colaboradores.
              </h1>
              <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-white/82 sm:mt-4 sm:text-[0.98rem]">
                Si quieres sumarte a esta iniciativa, aqui puedes contarnos como te
                gustaria ayudar.
              </p>
              <p className="mt-3 max-w-xl text-[0.86rem] leading-relaxed text-white/68 sm:text-[0.92rem]">
                Hay distintas formas de colaborar según tu tiempo, recursos y nivel
                de participacion.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              <ColaboradoresForm />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactScreen;
