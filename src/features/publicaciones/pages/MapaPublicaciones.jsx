import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import Seo from "../../../components/seo/Seo";
import { buildBreadcrumbSchema } from "../../../components/seo/seoUtils";
import MapaCasos from "../components/MapaCasos";

const MapaPublicacionesPage = () => (
  <div className="bg-[#f6efe4] text-[#241914]">
    <Seo
      title="Mapa de casos"
      description="Mapa con animales perdidos y encontrados activos, geolocalizados de forma aproximada por privacidad."
      path="/mapa"
      structuredData={[
        buildBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Mapa de casos", path: "/mapa" },
        ]),
      ]}
    />
    <Navbar />

    <div className="px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-26 sm:px-6 sm:pt-30 lg:px-8 lg:pb-16 lg:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-5 max-w-2xl">
          <h1 className="font-editorial text-[2.1rem] leading-[0.96] sm:text-[2.6rem]">
            Mapa de casos
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5f4c41]">
            Animales perdidos y encontrados activos cerca tuyo. Por privacidad, cada pin
            muestra una ubicación aproximada y no la dirección exacta reportada.
          </p>
        </div>

        <MapaCasos
          zoom={12}
          className="h-[70vh] min-h-[420px] w-full overflow-hidden rounded-[1rem] border border-[#2f241d]/10 shadow-sm"
        />
      </div>
    </div>

    <Footer />
  </div>
);

export default MapaPublicacionesPage;
