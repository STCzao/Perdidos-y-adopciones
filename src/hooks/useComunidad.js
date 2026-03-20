import { useEffect, useState } from "react";
import { comunidadService } from "../services/comunidad";

export const useComunidad = () => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const resp = await comunidadService.obtenerComunidad();

        if (!resp?.success || !Array.isArray(resp.comunidades)) {
          throw new Error("Respuesta invalida del servidor");
        }

        setCasos(resp.comunidades);
      } catch (err) {
        console.error("Error cargando comunidad:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return { casos, loading, error };
};
