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
        title="Contacto y colaboración"
        description="Contactanos para colaborar con Perdidos y Adopciones, ofrecer ayuda, insumos, tránsito o difusión para los casos de la comunidad."
        path="/contacto"
        structuredData={[
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Contacto", path: "/contacto" },
          ]),
        ]}
      />
      <Navbar />

      <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 border-b border-[#2f241d]/10 pb-8 text-center"
          >
          
            <span className="inline-flex rounded-full border border-[#d46f49]/20 bg-[#fbf0e8] px-4 py-1.5 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[#d46f49]">
              Red de colaboradores
            </span>
            <h1 className="font-editorial mt-4 text-[2.4rem] leading-[1.05] text-[#241914] sm:text-[3rem]">
              Sumate a la red de acción
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[0.95rem] leading-relaxed text-[#5f4c41]">
              Este espacio está pensado para organizar una red de personas dispuestas
              a colaborar en situaciones vinculadas a animales perdidos, encontrados o
              en adopción. Podés elegir una o varias formas de ayuda, según tu zona,
              tu disponibilidad y tus posibilidades reales.
            </p>
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
