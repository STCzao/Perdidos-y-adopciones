import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formatFecha = (fecha) => {
  if (!fecha) return "-";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const waitForAssets = async (element) => {
  if (!element) return;

  const fontReady =
    document.fonts?.ready?.catch(() => null) ?? Promise.resolve();
  const images = Array.from(element.querySelectorAll("img"));
  const imageReady = Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        const onDone = () => {
          img.removeEventListener("load", onDone);
          img.removeEventListener("error", onDone);
          resolve();
        };
        img.addEventListener("load", onDone);
        img.addEventListener("error", onDone);
      });
    }),
  );

  await Promise.all([fontReady, imageReady]);
};

/**
 * Componente para generar carteles en PDF estilo flyer para publicaciones
 * Diseño optimizado para imprimir en A4 y pegar en la calle
 */
const CardPdf = ({ publicacion, fileName }) => {
  const cardRef = useRef(null);

  const {
    nombreanimal,
    especie,
    tipo,
    raza,
    lugar,
    fecha,
    sexo,
    tamaño,
    color,
    edad,
    detalles,
    afinidad,
    afinidadanimales,
    energia,
    castrado,
    whatsapp,
    img,
    estado,
  } = publicacion;

  // Configuración de colores y textos según tipo
  const tipoConfig = {
    PERDIDO: {
      color: "#FF0000",
      ubicacionLabel: "Extraviado en:",
    },
    ENCONTRADO: {
      color: "#2165FF",
      ubicacionLabel: "Encontrado en:",
    },
    ADOPCION: {
      color: "#4dac00",
      ubicacionLabel: null,
    },
  };

  const config = tipoConfig[tipo] || tipoConfig.PERDIDO;

  /**
   * Genera y descarga el PDF del cartel
   */
  const generatePDF = async () => {
    if (!cardRef.current) return;

    try {
      await waitForAssets(cardRef.current);
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 0,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Colocar la imagen exactamente en el tamaño A4 sin escalar
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const defaultFileName = `${tipo}_${nombreanimal || especie}_${new Date().getTime()}.pdf`;
      const finalFileName = fileName || defaultFileName;

      pdf.save(finalFileName);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, intenta nuevamente.");
    }
  };

  // Determinar qué mostrar en el nombre grande
  const nombreGrande =
    tipo === "ENCONTRADO"
      ? especie
        ? especie.toUpperCase()
        : "ANIMAL ENCONTRADO"
      : nombreanimal
        ? nombreanimal.toUpperCase()
        : "";

  return (
    <div className="flex flex-col gap-4">
      {/* Cartel optimizado para PDF - Tamaño A4 */}
      <div
        ref={cardRef}
        style={{
          width: "210mm",
          height: "297mm",
          minHeight: "297mm",
          maxHeight: "297mm",
          margin: "0 auto",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* HEADER CON ESTADO */}
        <div
          style={{
            flexShrink: 0,
            height: "44mm",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: config.color,
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              fontSize: "5.5rem",
              fontWeight: "bold",
              textAlign: "center",
              transform: "translateY(-0.35em)",
              lineHeight: 0.8,
              display: "inline-block",
            }}
          >
            {estado || "SE BUSCA"}
          </h1>
        </div>

        {/* LÍNEA SEPARADORA NEGRA */}
        <div
          style={{
            flexShrink: 0,
            marginTop: "1mm",
            height: "2mm",
            backgroundColor: "#000000",
          }}
        ></div>

        {/* CONTENIDO PRINCIPAL - 2 COLUMNAS */}
        <div
          style={{
            flexShrink: 0,
            display: "grid",
            gridTemplateColumns: "60% 40%",
            height: "127mm",
            minHeight: "127mm",
            maxHeight: "127mm",
          }}
        >
          {/* COLUMNA IZQUIERDA - IMAGEN */}
          <div
            style={{
              backgroundColor: "#e6dac6",
              padding: "24px",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {img ? (
              <img
                src={img}
                alt={nombreanimal || especie}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div style={{ fontSize: "1.5rem", color: "#9ca3af" }}>
                Sin imagen
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA - DATOS */}
          <div
            style={{
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingLeft: "16px",
              paddingRight: "16px",
              paddingTop: "24px",
              paddingBottom: "24px",
              overflow: "hidden",
              height: "100%",
            }}
          >
            {/* Especie | Sexo */}
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              <p
                style={{
                  color: "#000000",
                  fontSize: "1.15rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                {especie && sexo
                  ? `${especie} | ${sexo}`
                  : especie || sexo || ""}
              </p>
              {tamaño && (
                <p
                  style={{
                    color: "#000000",
                    fontSize: "1.15rem",
                    fontWeight: "500",
                    textTransform: "uppercase",
                  }}
                >
                  {tamaño}
                </p>
              )}
            </div>

            {/* Raza */}
            {raza && (
              <div style={{ marginBottom: "12px" }}>
                <p
                  style={{
                    color: "#000000",
                    fontSize: "0.80rem",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  RAZA:
                </p>
                <p
                  style={{
                    color: "#000000",
                    fontSize: "1.15rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {raza}
                </p>
              </div>
            )}

            {/* Color */}
            {color && (
              <div style={{ marginBottom: "12px" }}>
                <p
                  style={{
                    color: "#000000",
                    fontSize: "0.80rem",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  COLOR:
                </p>
                <p
                  style={{
                    color: "#000000",
                    fontSize: "1.15rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    lineHeight: "1.25",
                  }}
                >
                  {color}
                </p>
              </div>
            )}

            {/* Info de ADOPCIÓN */}
            {tipo === "ADOPCION" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "8px",
                  textAlign: "center",
                }}
              >
                {castrado !== undefined && (
                  <div>
                    <p style={{ color: "#000000", fontSize: "0.80rem" }}>
                      CASTRADO:
                    </p>
                    <p
                      style={{
                        color: "#000000",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {castrado ? "SÍ" : "NO"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Espacio para señas particulares */}
            {detalles && (
              <div
                style={{
                  marginTop: "16px",
                  flex: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    color: "#000000",
                    fontSize: "0.80rem",
                    textAlign: "center",
                    lineHeight: "1.625",
                    textTransform: "uppercase",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  }}
                >
                  {detalles}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* LÍNEA SEPARADORA NEGRA */}
        <div
          style={{
            flexShrink: 0,
            height: "2mm",
            backgroundColor: "#000000",
          }}
        ></div>

        {/* NOMBRE GRANDE (O ESPECIE SI ES ENCONTRADO) */}
        <div
          style={{
            flexShrink: 0,
            height: "20mm",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          {nombreGrande && (
            <h2
              style={{
                color: config.color,
                fontSize: "4.5rem",
                fontWeight: "bold",
                letterSpacing: "0.025em",
                margin: 0,
                lineHeight: "1",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "translateY(-0.20em)",
              }}
            >
              {nombreGrande}
            </h2>
          )}
        </div>

        {/* UBICACIÓN Y FECHA - Solo para PERDIDO y ENCONTRADO */}
        <div
          style={{
            flexShrink: 0,
            height: "58mm",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          {(tipo === "PERDIDO" || tipo === "ENCONTRADO") && lugar ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {config.ubicacionLabel}
              </p>
              <p
                style={{
                  color: "#000000",
                  letterSpacing: "0.02em",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  lineHeight: "1.2",
                  margin: 0,
                }}
              >
                {lugar}
              </p>
              {fecha && (
                <p
                  style={{
                    color: "#000000",
                    letterSpacing: "0.01em",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    lineHeight: "1.2",
                    margin: 0,
                  }}
                >
                  {formatFecha(fecha)}
                </p>
              )}
            </div>
          ) : null}

          {tipo === "ADOPCION" && (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                  letterSpacing: "0.01em",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Edad:
              </p>
              <p
                style={{
                  color: "#000000",
                  letterSpacing: "0.02em",
                  fontSize: "2.25rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  lineHeight: "1.2",
                  margin: 0,
                }}
              >
                {edad}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER - URL DEL SITIO */}
        <div
          style={{
            flexShrink: 0,
            height: "8mm",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
          }}
        >
          <p
            style={{
              color: "#ffffff",
              fontSize: "1.25rem",
              fontWeight: "500",
              textAlign: "center",
              margin: 0,
              lineHeight: "1",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "translateY(-0.30em)",
            }}
          >
            CASO EN: WWW.PERDIDOSYADOPCIONES.COM.AR
          </p>
        </div>

        {/* FOOTER - TELÉFONO */}
        <div
          style={{
            flexShrink: 0,
            height: "36mm",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: whatsapp ? config.color : "#ffffff",
          }}
        >
          {whatsapp && (
            <p
              style={{
                color: "#ffffff",
                fontSize: "6rem",
                fontWeight: "500",
                textAlign: "center",
                margin: 0,
                lineHeight: "1",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "translateY(-0.50em)",
              }}
            >
              {whatsapp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Función utilitaria para generar PDF sin mostrar el componente
 */
export const generarPDFPublicacion = async (publicacion, fileName) => {
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.style.top = "0";
  document.body.appendChild(tempContainer);

  const { createRoot } = await import("react-dom/client");
  const root = createRoot(tempContainer);

  return new Promise((resolve, reject) => {
    root.render(
      <CardPdf
        publicacion={publicacion}
        showDownloadButton={false}
        fileName={fileName}
      />,
    );

    setTimeout(async () => {
      try {
        const cardElement = tempContainer.querySelector("div > div");
        if (!cardElement) {
          throw new Error("No se pudo encontrar el elemento de la card");
        }

        await waitForAssets(cardElement);
        const canvas = await html2canvas(cardElement, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: cardElement.offsetWidth,
          height: cardElement.offsetHeight,
        });

        const imgData = canvas.toDataURL("image/jpeg");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Colocar la imagen exactamente en el tamaño A4 sin escalar
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        const defaultFileName = `${publicacion.tipo}_${publicacion.nombreanimal || publicacion.especie}_${new Date().getTime()}.pdf`;
        pdf.save(fileName || defaultFileName);

        root.unmount();
        document.body.removeChild(tempContainer);
        resolve();
      } catch (error) {
        root.unmount();
        document.body.removeChild(tempContainer);
        reject(error);
      }
    }, 1000);
  });
};

export default CardPdf;
