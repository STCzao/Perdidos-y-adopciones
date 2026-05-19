import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Seo from "../components/seo/Seo";
import ColaboradoresForm from "../features/colaboradores/ColaboradoresForm";

const Colabora = () => (
  <div className="text-[#241914]">
    <Seo
      title="Sumate a la red"
      description="Registrate como colaborador/a de la red de Perdidos y Adopciones Tucumán."
      path="/colabora"
    />
    <Navbar />

    <div className="relative min-h-screen px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-32 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mx-auto max-w-2xl">
        <span className="inline-flex rounded-[0.45rem] bg-[#E7ECD7] px-4 py-2 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[#241914]">
          Red de colaboradores
        </span>
        <h1 className="font-editorial mt-4 text-[2.6rem] leading-[0.92] text-[#241914] sm:text-[3.2rem]">
          Sumate a la red
        </h1>
        <p className="mb-8 mt-4 text-[0.96rem] leading-relaxed text-[#5f4c41]">
          Cada gesto suma. Completá el formulario y te contactamos cuando haya una
          oportunidad de colaborar.
        </p>

        <ColaboradoresForm />
      </div>
    </div>

    <Footer />
  </div>
);

export default Colabora;
