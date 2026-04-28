export const SITE_URL = "https://www.perdidosyadopciones.com.ar";
export const SITE_NAME = "Perdidos y Adopciones";
export const DEFAULT_TITLE = "Perdidos y Adopciones | Red para animales perdidos, encontrados y en adopción";
export const DEFAULT_DESCRIPTION =
  "Base comunitaria para publicar animales perdidos, encontrados y en adopción en Tucumán, difundir casos y conectar ayuda real.";

export const getSiteOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return SITE_URL;
};

export const buildCanonicalUrl = (path = "/") => {
  const origin = getSiteOrigin().replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
};

export const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "perdidosyadopcionesrec@gmail.com",
      areaServed: "AR",
      availableLanguage: "es",
    },
  ],
});

export const buildWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "es-AR",
});

const TIPO_TO_LABEL = {
  PERDIDO: "LostPet",
  ENCONTRADO: "FoundPet",
  ADOPCION: "AdoptPet",
};

export const buildAnimalPostingSchema = (publicacion) => {
  if (!publicacion) return null;

  const name = publicacion.nombreanimal || publicacion.especie || "Animal";
  const description =
    publicacion.detalles ||
    `${publicacion.tipo?.toLowerCase() || "caso"} de ${publicacion.especie || "animal"} en ${publicacion.localidad || "Tucumán"}`;
  const url = buildCanonicalUrl(
    `/publicaciones/${(publicacion.tipo === "PERDIDO" ? "perdidos" : publicacion.tipo === "ENCONTRADO" ? "encontrados" : "adopciones")}/${publicacion._id}`,
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    headline: name,
    description,
    url,
    inLanguage: "es-AR",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (publicacion.img) schema.image = publicacion.img;
  if (publicacion.fecha) schema.datePublished = publicacion.fecha;
  if (publicacion.localidad || publicacion.lugar) {
    schema.contentLocation = {
      "@type": "Place",
      name: publicacion.localidad || publicacion.lugar,
      address: {
        "@type": "PostalAddress",
        addressRegion: "Tucumán",
        addressCountry: "AR",
      },
    };
  }

  const keyword = TIPO_TO_LABEL[publicacion.tipo];
  if (keyword) schema.keywords = keyword;

  return schema;
};

export const buildBreadcrumbSchema = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: buildCanonicalUrl(item.path),
  })),
});
