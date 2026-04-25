import AdviceLayout from "./AdviceLayout";

const steps = [
  {
    title: "Buscalo en la zona inmediata",
    text: "Recorre el lugar donde se perdió, llamándolo por su nombre y revisando los puntos donde podría haberse refugiado.",
    bullets: [
      "Pregunta a vecinos, comerciantes y personas que estén en la calle.",
      "Mira debajo de autos, veredas, obras y patios abiertos.",
    ],
  },
  {
    title: "Revisa si alguien ya lo encontró",
    text: "Antes de publicar, mira los avisos de encontrados en esta página y en grupos barriales.",
  },
  {
    title: "Publica el aviso cuanto antes",
    text: "Crea una publicación como perdido con fotos claras y la zona exacta donde se extravió. Las primeras horas son clave.",
  },
  {
    title: "Difundi de forma ordenada",
    text: "Comparte siempre el mismo aviso para evitar información cruzada y facilitar que te contacten.",
    bullets: [
      "Publica en grupos barriales y redes sociales.",
      "Mantén una sola referencia principal para el caso.",
    ],
  },
  {
    title: "Vuelve a recorrer la zona",
    text: "Hazlo en distintos horarios. Muchos animales se esconden y reaparecen después, cuando baja el ruido o el movimiento.",
  },
  {
    title: "Pide ayuda",
    text: "Contacta rescatistas, veterinarias cercanas o personas del barrio. Buscar en red siempre aumenta las chances.",
  },
  {
    title: "Mantén el aviso actualizado",
    text: "Agrega nuevos datos si hay avistamientos y marca el caso como resuelto cuando aparezca.",
  },
];

const PerdiScreen = () => (
  <AdviceLayout
    eyebrow="Busqueda activa"
    title="Que hacer si perdiste un animal"
    description="Una guia breve para moverte rapido, ordenar la difusion y aumentar las chances de reencuentro."
    accent="#D62828"
    steps={steps}
    closing="No hace falta hacerlo perfecto para empezar a ayudar. Moverte rapido, publicar bien y sostener la busqueda con informacion clara ya hace una diferencia enorme."
  />
);

export default PerdiScreen;
