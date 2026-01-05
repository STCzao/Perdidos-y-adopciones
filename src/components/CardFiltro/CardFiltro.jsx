const CardFiltro = ({ filtros, setFiltros }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#763A0D]/70 backdrop-blur max-w-[200px] border border-white/20 rounded-xl shadow-md p-2 text-white font-medium flex flex-col">
      <h3 className="text-l font-bold mb-2">Buscar por...</h3>

      {/* Raza (texto libre) */}
      <div>
        <label className="text-sm">Raza</label>
        <input
          type="text"
          name="raza"
          value={filtros.raza}
          onChange={handleChange}
          placeholder="Ej: Mestizo"
          className="w-full text-white mt-1 p-2 rounded text-xs bg-white/20 text-black text-black placeholder-white/50 outline-none"
        />
      </div>

      {/* Edad (desplegable) */}
      <div>
        <label className="text-sm">Edad</label>
        <select
          name="edad"
          value={filtros.edad}
          onChange={handleChange}
          className="w-full mt-1 p-2 text-white rounded bg-white/20 text-black text-xs outline-none"
        >
          <option className="text-black" value="">
            Seleccione la edad *
          </option>
          <option className="text-black" value="SIN ESPECIFICAR">
            Sin especificar
          </option>
          <option className="text-black" value="CACHORRO">
            Cachorro
          </option>
          <option className="text-black" value="ADULTO">
            Adulto
          </option>
          <option className="text-black" value="MAYOR">
            Mayor
          </option>
        </select>
      </div>

      {/* Especie */}
      <div>
        <label className="text-sm">Especie</label>
        <select
          name="especie"
          value={filtros.especie}
          onChange={handleChange}
          className="w-full mt-1 text-white p-2 rounded bg-white/20 text-black text-xs outline-none"
        >
          <option className="text-black" value="">
            Seleccione la especie *
          </option>
          <option className="text-black" value="PERRO">
            Perro
          </option>
          <option className="text-black" value="GATO">
            Gato
          </option>
          <option className="text-black" value="AVE">
            Ave
          </option>
          <option className="text-black" value="CONEJO">
            Conejo
          </option>
          <option className="text-black" value="OTRO">
            Otro
          </option>
        </select>
      </div>

      {/* Sexo */}
      <div>
        <label className="text-sm">Sexo</label>
        <select
          name="sexo"
          value={filtros.sexo}
          onChange={handleChange}
          className="w-full mt-1 text-white p-2 rounded bg-white/20 text-black text-xs outline-none"
        >
          <option className="text-black" value="">
            Seleccione el sexo *
          </option>
          <option className="text-black" value="DESCONOZCO">
            Desconozco
          </option>
          <option className="text-black" value="MACHO">
            Macho
          </option>
          <option className="text-black" value="HEMBRA">
            Hembra
          </option>
        </select>
      </div>

      {/* Tamaño */}
      <div>
        <label className="text-sm">Tamaño</label>
        <select
          name="tamaño"
          value={filtros.tamaño}
          onChange={handleChange}
          className="w-full mt-1 text-white p-2 rounded bg-white/20 text-black text-xs outline-none"
        >
          <option className="text-black" value="">
            Seleccione el tamaño *
          </option>
          <option className="text-black" value="SIN ESPECIFICAR">
            Sin especificar
          </option>
          <option className="text-black" value="MINI">
            Mini
          </option>
          <option className="text-black" value="PEQUEÑO">
            Pequeño
          </option>
          <option className="text-black" value="MEDIANO">
            Mediano
          </option>
          <option className="text-black" value="GRANDE">
            Grande
          </option>
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
          className="w-full text-white mt-1 p-2 text-xs rounded bg-white/20 text-black placeholder-white/50 outline-none"
        />
      </div>
      {/* Señas particulares (texto libre) */}
      <div>
        <label className="text-sm">Señas particulares</label>
        <input
          type="text"
          name="detalles"
          value={filtros.detalles}
          onChange={handleChange}
          placeholder="Ej: Collar azul, cicatriz, etc"
          className="w-full text-white mt-1 p-2 rounded text-xs bg-white/20 text-black text-black placeholder-white/50 outline-none"
        />
      </div>

    </div>
  );
};

export default CardFiltro;
