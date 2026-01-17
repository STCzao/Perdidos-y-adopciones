import { useState } from "react";

const CardFiltro = ({ filtros, setFiltros }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-xs bg-white/90 border border-[#FF7857]/20 rounded-2xl shadow-md p-4 text-black font-medium flex flex-col gap-3">
      <button
        type="button"
        className="flex items-center justify-between w-full text-sm font-semibold text-black tracking-[0.08em] uppercase mb-1 lg:cursor-default"
        onClick={() => setIsOpenMobile((prev) => !prev)}
      >
        <span>Buscar por</span>
        <span className="inline-flex lg:hidden items-center justify-center text-[11px] px-2 py-1 rounded-full bg-[#FF7857]/10 text-[#FF7857] border border-[#FF7857]/30">
          {isOpenMobile ? "Ocultar" : "Mostrar"}
        </span>
      </button>

      <div
        className={`flex flex-col gap-3 lg:gap-3 transition-all duration-300 overflow-hidden lg:overflow-visible ${
          isOpenMobile
            ? "max-h-[1000px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none lg:max-h-none lg:opacity-100 lg:pointer-events-auto"
        } lg:max-h-none lg:opacity-100 lg:pointer-events-auto`}
      >
        {/* Raza (texto libre) */}
        <div className="flex flex-col gap-1">
        <label className="text-xs text-black/70">Raza</label>
        <input
          type="text"
          name="raza"
          value={filtros.raza}
          onChange={handleChange}
          placeholder="Ej: Mestizo"
          className="w-full mt-1 px-3 py-2 rounded-full text-xs bg-white border border-black/10 text-black placeholder-black/40 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
        />
      </div>

      {/* Edad (desplegable) */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/70">Edad</label>
        <select
          name="edad"
          value={filtros.edad}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 rounded-full bg-white border border-black/10 text-xs text-black outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
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

      {/* Lugar */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/70">Lugar</label>
        <input
          type="text"
          name="lugar"
          value={filtros.lugar}
          onChange={handleChange}
          placeholder="Ej: Ciudad, barrio, calle..."
          className="w-full mt-1 px-3 py-2 rounded-full text-xs bg-white border border-black/10 text-black placeholder-black/40 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
        />
      </div>

      {/* Sexo */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/70">Sexo</label>
        <select
          name="sexo"
          value={filtros.sexo}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 rounded-full bg-white border border-black/10 text-xs text-black outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
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
      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/70">Tamaño</label>
        <select
          name="tamaño"
          value={filtros.tamaño}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 rounded-full bg-white border border-black/10 text-xs text-black outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
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
      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/70">Color</label>
        <input
          type="text"
          name="color"
          value={filtros.color}
          onChange={handleChange}
          placeholder="Ej: Marrón"
          className="w-full mt-1 px-3 py-2 rounded-full text-xs bg-white border border-black/10 text-black placeholder-black/40 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
        />
      </div>
      {/* Señas particulares (texto libre) */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/70">Señas particulares</label>
        <input
          type="text"
          name="detalles"
          value={filtros.detalles}
          onChange={handleChange}
          placeholder="Ej: Collar azul, cicatriz, etc"
          className="w-full mt-1 px-3 py-2 rounded-full text-xs bg-white border border-black/10 text-black placeholder-black/40 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
        />
      </div>
      </div>
    </div>
  );
};

export default CardFiltro;
