import { useState } from "react";
import { LOCALIDADES_TUCUMAN } from "../../constants/localidades";

const CardFiltro = ({ filtros, setFiltros, tipo }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFiltros({
      raza: "",
      edad: "",
      lugar: "",
      localidad: "",
      sexo: "",
      tamaño: "",
      color: "",
      detalles: "",
      especie: "",
    });
  };

  return (
    <div className="w-full max-w-xs bg-white/90 border border-[#FF7857]/20 rounded-2xl shadow-md p-4 text-black font-medium flex flex-col gap-3">
      <button
        type="button"
        className="flex items-center justify-between w-full text-sm font-semibold text-black uppercase mb-1 lg:cursor-pointer"
        onClick={() => setIsOpenMobile((prev) => !prev)}
      >
        <span>Buscar por</span>
        <span className="inline-flex lg:hidden items-center justify-center text-[11px] px-2 py-1 rounded-full bg-[#FF7857]/10 text-[#FF7857] border border-[#FF7857]/30">
          {isOpenMobile ? "Ocultar" : "Mostrar"}
        </span>
      </button>

      <div
        className={`flex flex-col gap-3 lg:gap-3 transition-all duration-300 ${
          isOpenMobile
            ? "max-h-[1000px] opacity-100 overflow-visible"
            : "max-h-0 opacity-0 overflow-hidden pointer-events-none lg:max-h-none lg:opacity-100 lg:pointer-events-auto lg:overflow-visible"
        } lg:max-h-none lg:opacity-100 lg:pointer-events-auto lg:overflow-visible`}
      >
        {/* Especie (desplegable) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black">Especie</label>
          <select
            name="especie"
            value={filtros.especie}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 rounded-full bg-white border border-black/50 text-xs text-black/50 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
          >
            <option value="">Seleccione la especie *</option>
            <option value="PERRO">Perro</option>
            <option value="GATO">Gato</option>
            <option value="AVE">Ave</option>
            <option value="CONEJO">Conejo</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        {/* Sexo */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black">Sexo</label>
          <select
            name="sexo"
            value={filtros.sexo}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 rounded-full bg-white border border-black/50 text-xs text-black/50 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
          >
            <option value="">Desconozco</option>
            <option value="MACHO">Macho</option>
            <option value="HEMBRA">Hembra</option>
          </select>
        </div>

        {/* Raza (texto libre) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black">Raza</label>
          <input
            type="text"
            name="raza"
            value={filtros.raza}
            onChange={handleChange}
            placeholder="Ej: Mestizo"
            className="w-full mt-1 px-3 py-2 rounded-full text-xs bg-white border border-black/50 text-black placeholder-black/40 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
          />
        </div>

        {/* Tamaño */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black">Tamaño</label>
          <select
            name="tamaño"
            value={filtros.tamaño}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 rounded-full bg-white border border-black/50 text-xs text-black/50 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
          >
            <option value="">Sin especificar</option>
            <option value="MINI">Mini</option>
            <option value="PEQUEÑO">Pequeño</option>
            <option value="MEDIANO">Mediano</option>
            <option value="GRANDE">Grande</option>
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
            className="w-full mt-1 px-3 py-2 rounded-full text-xs bg-white border border-black/50 text-black placeholder-black/50 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
          />
        </div>

        {/* Edad (desplegable) */}
        {(tipo === "PERDIDO" || tipo === "ADOPCION") && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-black">Edad</label>
            <select
              name="edad"
              value={filtros.edad}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-full bg-white border border-black/50 text-xs text-black/50 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
            >
              <option value="">Sin especificar</option>
              <option value="JOVEN">Joven</option>
              <option value="CACHORRO">Cachorro</option>
              <option value="ADULTO">Adulto</option>
              <option value="MAYOR">Mayor</option>
            </select>
          </div>
        )}

        {/* Localidad */}
        {(tipo === "PERDIDO" || tipo === "ENCONTRADO") && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-black">Localidad</label>
            <select
              name="localidad"
              value={filtros.localidad}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-full bg-white border border-black/50 text-xs text-black/50 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
            >
              <option value="">Todas las localidades</option>
              {LOCALIDADES_TUCUMAN.map((localidad) => (
                <option key={localidad} value={localidad}>
                  {localidad}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Zona/Barrio */}
        {(tipo === "PERDIDO" || tipo === "ENCONTRADO") && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-black">Zona/Barrio/Calle</label>
            <input
              type="text"
              name="lugar"
              value={filtros.lugar}
              onChange={handleChange}
              placeholder="Ej: Centro, Barrio Norte, San Martín..."
              className="w-full mt-1 px-3 py-2 rounded-full text-xs bg-white border border-black/50 text-black placeholder-black/40 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
            />
          </div>
        )}

        {/* Señas particulares (texto libre) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black">Señas particulares</label>
          <input
            type="text"
            name="detalles"
            value={filtros.detalles}
            onChange={handleChange}
            placeholder="Ej: Collar azul, cicatriz, etc"
            className="w-full mt-1 px-3 py-2 rounded-full text-xs bg-white border border-black/50 text-black placeholder-black/50 outline-none focus:border-[#FF7857] focus:ring-1 focus:ring-[#FF7857]/60 transition-colors delay-100 duration-300"
          />
        </div>
        <button
          type="button"
          onClick={handleClearFilters}
          className="w-full px-3 py-2 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/30 hover:bg-red-500/20 transition-colors delay-100 duration-300"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default CardFiltro;
