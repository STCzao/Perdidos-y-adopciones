export const mediaScreenConfig = {
  adopciones: {
    title: "Sección de",
    tipo: "ADOPCIONES",
    cards: [
      {
        id: "view",
        buttonText: "Ver todos los anuncios",
        action: { type: "navigate", path: "/publicaciones/adopciones" },
      },
      {
        id: "create",
        buttonText: "Crear publicación",
        action: { type: "createPost" },
      },
      {
        id: "advice",
        buttonText: "¿Qué hacer si querés adoptar o dar en adopción un animal?",
        action: { type: "navigate", path: "/consejos-adopcion" },
      },
    ],
  },
  encontrados: {
    title: "Sección de animales",
    tipo: "ENCONTRADOS",
    cards: [
      {
        id: "view",
        buttonText: "Ver todos los anuncios",
        action: { type: "navigate", path: "/publicaciones/encontrados" },
      },
      {
        id: "create",
        buttonText: "Crear publicación",
        action: { type: "createPost" },
      },
      {
        id: "advice",
        buttonText: "¿Qué hacer si encontraste un animal?",
        action: { type: "navigate", path: "/consejos-encontre" },
      },
    ],
  },
  perdidos: {
    title: "Sección de animales",
    tipo: "PERDIDOS",
    cards: [
      {
        id: "view",
        buttonText: "Ver todos los anuncios",
        action: { type: "navigate", path: "/publicaciones/perdidos" },
      },
      {
        id: "create",
        buttonText: "Crear publicación",
        action: { type: "createPost" },
      },
      {
        id: "advice",
        buttonText: "¿Qué hacer si se perdió tu animal?",
        action: { type: "navigate", path: "/consejos-perdi" },
      },
    ],
  },
};
