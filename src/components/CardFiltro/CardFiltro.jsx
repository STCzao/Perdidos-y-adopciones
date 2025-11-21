const CardFiltro = ({ filtros, setFiltros }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#763A0D]/70 backdrop-blur border border-white/20 rounded-xl shadow-md p-4 text-white font-medium flex flex-col gap-4">
      <h3 className="text-lg font-bold mb-2">Filtros</h3>

      {/* Raza (texto libre) */}
      <div>
        <label className="text-sm">Raza</label>
        <input
          type="text"
          name="raza"
          value={filtros.raza}
          onChange={handleChange}
          placeholder="Ej: Mestizo"
          className="w-full mt-1 p-2 rounded bg-white/20 text-black text-black placeholder-white/50 outline-none"
        />
      </div>

      {/* Edad (desplegable) */}
      <div>
        <label className="text-sm">Edad</label>
        <select
          name="edad"
          value={filtros.edad}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-white/20 text-black outline-none"
        >
          <option value="">Cualquiera</option>
          <option value="CACHORRO">Cachorro</option>
          <option value="ADULTO">Adulto</option>
          <option value="MAYOR">Mayor</option>
        </select>
      </div>

      {/* Sexo */}
      <div>
        <label className="text-sm">Sexo</label>
        <select
          name="sexo"
          value={filtros.sexo}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-white/20 text-black outline-none"
        >
          <option value="">Cualquiera</option>
          <option value="MACHO">Macho</option>
          <option value="HEMBRA">Hembra</option>
        </select>
      </div>

      {/* Tamaño */}
      <div>
        <label className="text-sm">Tamaño</label>
        <select
          name="tamaño"
          value={filtros.tamaño}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-white/20 text-black outline-none"
        >
          <option value="">Cualquiera</option>
          <option value="MINI">Mini</option>
          <option value="PEQUEÑO">Pequeño</option>
          <option value="MEDIANO">Mediano</option>
          <option value="GRANDE">Grande</option>
        </select>
      </div>

      {/* Color (texto libre) */}
      <div>
        <label className="text-sm">Color</label>
        <input
          type="text"
          name="color"
          value={filtros.color}
          onChange={handleChange}
          placeholder="Ej: Marrón"
          className="w-full mt-1 p-2 rounded bg-white/20 text-black placeholder-white/50 outline-none"
        />
      </div>
    </div>
  );
};

export default CardFiltro;
