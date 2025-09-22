import { useEffect, useState } from "react";
import { getPublicaciones } from "./services/publicaciones";

function App() {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    getPublicaciones()
      .then((data) => setPublicaciones(data.publicaciones))
      .catch((err) => console.error("Error:", err.message));
  }, []);

  return (
    <div>
      <h1>🐾 Publicaciones</h1>
      <ul>
        {publicaciones.map((pub) => (
          <li key={pub._id}>
            <strong>{pub.titulo}</strong> - {pub.tipo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
