import { useState } from "react";
import CardPdf from "../../components/CardPDF/CardPDF.JSX";

/**
 * Página para previsualizar las cards de PDF antes de generarlas
 */
const PreviewPDF = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("PERDIDO");

  // Datos de ejemplo para cada tipo
  const ejemplos = {
    PERDIDO: {
      nombreanimal: "TRISTAN",
      especie: "PERRO",
      tipo: "PERDIDO",
      raza: "MESTIZO",
      lugar: "PARQUE GUILLERMINA",
      fecha: "2026-01-02",
      sexo: "MACHO",
      tamaño: "MEDIANO",
      color: "NEGRO, MARRÓN Y BLANCO",
      edad: "3 años",
      detalles: "ESPACIO PARA LAS SEÑAS QUE HAYAN ANOTADO ESPACIO PARA LAS SEÑAS QUE HAYAN ANOTADO",
      whatsapp: "381 - 5678912",
      img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800",
      estado: "SE BUSCA!",
    },
    ENCONTRADO: {
      especie: "GATO",
      tipo: "ENCONTRADO",
      raza: "SIAMÉS",
      lugar: "PLAZA INDEPENDENCIA",
      fecha: "2026-02-05",
      sexo: "HEMBRA",
      tamaño: "PEQUEÑO",
      color: "BLANCO Y GRIS",
      detalles: "Collar azul con cascabel. Muy cariñosa.",
      whatsapp: "381 - 9876543",
      img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
      estado: "BUSCANDO A SU FAMILIA",
    },
    ADOPCION: {
      nombreanimal: "LUNA",
      especie: "PERRA",
      tipo: "ADOPCION",
      raza: "LABRADOR",
      sexo: "HEMBRA",
      tamaño: "GRANDE",
      color: "DORADO",
      edad: "2 años",
      detalles: "Perrita muy activa y cariñosa. Le encanta jugar con niños.",
      afinidad: "ALTA",
      afinidadanimales: "MEDIA",
      energia: "ALTA",
      castrado: true,
      whatsapp: "381 - 1234567",
      img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800",
      estado: "EN BUSCA DE UN HOGAR",
    },
  };

  const publicacionActual = ejemplos[tipoSeleccionado];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            📋 Previsualización de Cards PDF
          </h1>
          <p className="text-gray-600 mb-4">
            Visualiza cómo se verán las cards antes de exportar el PDF
          </p>

          {/* Selector de tipo */}
          <div className="flex gap-4">
            <button
              onClick={() => setTipoSeleccionado("PERDIDO")}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                tipoSeleccionado === "PERDIDO"
                  ? "bg-red-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🔴 PERDIDO
            </button>
            <button
              onClick={() => setTipoSeleccionado("ENCONTRADO")}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                tipoSeleccionado === "ENCONTRADO"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🔵 ENCONTRADO
            </button>
            <button
              onClick={() => setTipoSeleccionado("ADOPCION")}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                tipoSeleccionado === "ADOPCION"
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🟢 ADOPCIÓN
            </button>
          </div>
        </div>

        {/* Información del tipo seleccionado */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Datos del ejemplo - {tipoSeleccionado}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Estado:</span>{" "}
              <span className="text-gray-600">{publicacionActual.estado}</span>
            </div>
            {publicacionActual.nombreanimal && (
              <div>
                <span className="font-semibold text-gray-700">Nombre:</span>{" "}
                <span className="text-gray-600">
                  {publicacionActual.nombreanimal}
                </span>
              </div>
            )}
            <div>
              <span className="font-semibold text-gray-700">Especie:</span>{" "}
              <span className="text-gray-600">{publicacionActual.especie}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Raza:</span>{" "}
              <span className="text-gray-600">{publicacionActual.raza}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Tamaño:</span>{" "}
              <span className="text-gray-600">{publicacionActual.tamaño}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Color:</span>{" "}
              <span className="text-gray-600">{publicacionActual.color}</span>
            </div>
          </div>
        </div>

        {/* Preview del PDF */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Vista previa del cartel (Tamaño real A4)
          </h2>
          
          {/* Sin escala - Vista 1:1 */}
          <div className="flex justify-center overflow-auto">
            <CardPdf
              publicacion={publicacionActual}
              fileName={`preview_${tipoSeleccionado}.pdf`}
            />
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-bold text-blue-800 mb-2">💡 Instrucciones:</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Selecciona el tipo de publicación arriba</li>
            <li>• Visualiza cómo se verá el cartel antes de generarlo</li>
            <li>• Usa el botón "Descargar Cartel PDF" para generar el archivo</li>
            <li>• El diseño está optimizado para imprimir en tamaño A4</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PreviewPDF;
