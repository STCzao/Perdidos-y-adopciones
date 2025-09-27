import { useEffect, useState } from "react";
import { publicacionesService } from "./services";

function App() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const data = await publicacionesService.getPublicaciones();
        if (data.publicaciones) {
          setPublicaciones(data.publicaciones);
        } else {
          setError(data.msg || "No se encontraron publicaciones");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPublicaciones();
  }, []);

  if (cargando) return <p>Cargando publicaciones...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>🐾 Publicaciones</h1>
      <ul>
        {publicaciones.map((pub) => (
          <li key={pub._id}>
            <strong>{pub.titulo}</strong> - {pub.tipo} - Estado: {pub.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
