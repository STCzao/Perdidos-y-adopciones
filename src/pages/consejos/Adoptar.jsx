import AdviceLayout from "./AdviceLayout";

const steps = [
  {
    title: "Si quieres dar en adopcion un animal, prioriza un hogar adecuado",
    bullets: [
      "Asegúrate de que la persona adoptante tenga un espacio seguro.",
      "Verifica que pueda cubrir alimentación, higiene, atención veterinaria y tiempo.",
      "Conversa sobre rutina, convivencia con otros animales y compromiso a largo plazo.",
    ],
  },
  {
    title: "Cuenta la informacion con honestidad",
    bullets: [
      "Sé claro sobre su estado de salud y su carácter.",
      "Prioriza hogares responsables por sobre la rapidez.",
      "Dar en adopción no es entregar: es buscar el mejor hogar posible.",
    ],
  },
  {
    title: "Si quieres adoptar, evalua tu realidad antes de decidir",
    bullets: [
      "Piensa si tu espacio, tu tiempo y tu situación actual son adecuados.",
      "Ten en cuenta los costos y cuidados que implica.",
      "Pregunta todo lo necesario antes de adoptar.",
    ],
  },
  {
    title: "Haz preguntas concretas antes de comprometerte",
    bullets: [
      "Si el animal tiene alguna condición de salud.",
      "Si presenta conductas especiales o necesita cuidados particulares.",
      "Cómo es su carácter y nivel de actividad.",
    ],
  },
];

const AdoptarScreen = () => (
  <AdviceLayout
    eyebrow="Nuevo hogar"
    title="Que hacer si quieres adoptar o dar en adopcion"
    description="Una adopción responsable empieza antes del encuentro: con información clara, expectativas realistas y compromiso sostenido."
    accent="#768B44"
    steps={steps}
    closing="Adoptar es sumar un integrante a la familia. No es un impulso: es una decisión consciente que cambia dos vidas y requiere compromiso durante toda la vida del animal."
  />
);

export default AdoptarScreen;
