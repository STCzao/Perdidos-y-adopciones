import { useMemo, useState } from "react";

export const useFiltro = (data) => {
  const [query, setQuery] = useState("");

  const filtrados = useMemo(() => {
    const texto = (query || "").toLowerCase();

    return data.filter((pub) => {
      const nombre = pub?.usuario?.nombre;

      if (typeof nombre !== "string") return false;

      return nombre.toLowerCase().includes(texto);
    });
  }, [data, query]);

  return { filtrados, query, setQuery };
};
