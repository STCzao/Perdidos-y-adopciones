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
        title="Comunidad solidaria"
        description="Sumate a la comunidad solidaria de Perdidos y Adopciones Tucumán."
        path="/contacto"
        structuredData={[
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Comunidad solidaria", path: "/contacto" },
          ]),
        ]}
      />
      <Navbar />

      <div className="min-h-screen px-4 pb-[calc(var(--mobile-bottom-nav-offset)+env(safe-area-inset-bottom))] pt-28 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 border-b border-[#2f241d]/10 pb-8 text-center"
          >
            <span className="inline-flex rounded-full border border-[#d46f49]/20 bg-[#fbf0e8] px-4 py-1.5 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[#d46f49]">
              Comunidad solidaria
            </span>
            <h1 className="font-editorial mt-4 text-[2.4rem] leading-[1.05] text-[#241914] sm:text-[3rem]">
              Sumate a una red que ayuda
            </h1>
            <div className="mx-auto mt-4 max-w-lg space-y-3 text-[0.95rem] leading-relaxed text-[#5f4c41]">
              <p>
                Cuando un animal se pierde o necesita ayuda, cada persona puede hacer
                una diferencia.
              </p>
              <p>
                Esta red busca conectar y organizar esas acciones, según la zona, el
                tiempo y las posibilidades de cada uno.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ColaboradoresForm />
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactScreen;
