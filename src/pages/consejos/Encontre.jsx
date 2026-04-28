import AdviceLayout from "./AdviceLayout";

const steps = [
  {
    title: "Publica el aviso cuanto antes",
    text: "Este es uno de los pasos más importantes para facilitar el reencuentro.",
    bullets: [
      "Sácale una o varias fotos claras.",
      "Publica el caso como encontrado en esta página.",
      "Indica bien la zona donde lo viste o lo levantaste.",
      "Suma cualquier detalle que ayude a identificarlo.",
    ],
  },
  {
    title: "Difunde la publicación",
    bullets: [
      "Comparte el link en grupos barriales y redes sociales.",
      "Pide que lo difundan usando esa misma publicación.",
      "Cuanta más visibilidad tenga el caso, más chances hay de resolverlo.",
    ],
  },
  {
    title: "Observa al animal antes de intervenir",
    bullets: [
      "Mira si está asustado, herido o tranquilo.",
      "Observa si cruza calles sin mirar o si busca personas.",
      "Evalúa si puedes acercarte sin generar más riesgo.",
      "No todos los animales se dejan agarrar; forzar la situación puede empeorarla.",
    ],
  },
  {
    title: "Acércate con calma",
    bullets: [
      "Háblale suave y despacio.",
      "Evita movimientos bruscos.",
      "Ofrécele agua o comida si tienes.",
      "No lo mires fijo ni lo rodees.",
    ],
  },
  {
    title: "Resguárdalo si te es posible, aunque sea de forma provisoria",
    text: "En Tucumán no hay lugares oficiales de resguardo, por eso el tránsito solidario es clave.",
    bullets: [
      "Si puedes, ofrece tránsito provisorio aunque sea por unas horas o unos días.",
      "No es adopción: es darle un lugar seguro mientras aparece ayuda.",
      "Agua, algo de comida y un espacio tranquilo ya hacen una gran diferencia.",
      "Si no puedes llevarlo a tu casa, intenta retenerlo un rato y pedir ayuda cerca.",
    ],
  },
  {
    title: "Pide ayuda para tránsito o resguardo",
    bullets: [
      "Pide ayuda en la misma publicación.",
      "Contacta rescatistas independientes.",
      "Busca colaboración comunitaria para conseguir un tránsito.",
    ],
  },
  {
    title: "Mantén el aviso actualizado",
    bullets: [
      "Si cambia la zona donde se lo ve, actualiza la publicación.",
      "Si aparece alguien que puede ayudar, avísalo.",
      "Cuando el caso se resuelva, marca el aviso como resuelto.",
    ],
  },
];

const EncontreScreen = () => (
  <AdviceLayout
    eyebrow="Resguardo activo"
    title="Qué hacer si encontraste un animal"
    description="Una guía pensada para ordenar los primeros pasos, bajar riesgos y aumentar las posibilidades de que vuelva con su familia."
    accent="#2165FF"
    path="/consejos-encontre"
    steps={steps}
    closing="No hace falta hacerlo todo solo ni hacerlo perfecto. Publicar, difundir, resguardar un rato o pedir ayuda ya suma y puede cambiar por completo el resultado del caso."
  />
);

export default EncontreScreen;
