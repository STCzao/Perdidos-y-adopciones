import { useState } from "react";
import { LOCALIDADES_TUCUMAN } from "../../utils/localidades";

const fieldClassName =
  "mt-1.5 w-full rounded-[0.6rem] border border-[#2f241d]/10 bg-white/88 px-3.5 py-3 text-[0.82rem] text-[#241914] outline-none transition-colors duration-300 focus:border-[#d46f49]/45 focus:bg-white focus:ring-2 focus:ring-[#d46f49]/12 disabled:cursor-not-allowed disabled:opacity-45";

const CardFiltro = ({ filtros, setFiltros, tipo, razasPorEspecie = {} }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "especie") {
      setFiltros((prev) => ({ ...prev, especie: value, raza: "" }));
      return;
    }

    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFiltros({
      raza: "",
      edad: "",
      lugar: "",
      localidad: "",
      sexo: "",
      tamano: "",
      color: "",
      detalles: "",
      especie: "",
    });
  };

  return (
    <aside className="w-full rounded-[0.95rem] border border-[#2f241d]/10 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(248,240,229,0.92))] p-4 shadow-[0_20px_48px_rgba(36,25,20,0.08)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#816959]">
            Filtros
          </p>
          <h3 className="mt-2 text-[1.25rem] font-bold leading-none text-[#241914]">
            Refinar resultados
          </h3>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-[0.45rem] border border-[#2f241d]/10 bg-white/80 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#6f5546] lg:hidden"
          onClick={() => setIsOpenMobile((prev) => !prev)}
        >
          {isOpenMobile ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <div
        className={`transition-all duration-300 ${
          isOpenMobile
            ? "mt-5 max-h-[1600px] opacity-100"
            : "pointer-events-none mt-0 max-h-0 overflow-hidden opacity-0 lg:pointer-events-auto lg:mt-5 lg:max-h-none lg:overflow-visible lg:opacity-100"
        }`}
      >
        <div className="grid gap-3">
          <div>
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6f5546]">
              Especie
            </label>
            <select
              name="especie"
              value={filtros.especie}
              onChange={handleChange}
              className={fieldClassName}
            >
              <option value="">Todas las especies</option>
              <option value="PERRO">Perro</option>
              <option value="GATO">Gato</option>
              <option value="AVE">Ave</option>
              <option value="CONEJO">Conejo</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div>
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6f5546]">
              Sexo
            </label>
            <select
              name="sexo"
              value={filtros.sexo}
              onChange={handleChange}
              className={fieldClassName}
            >
              <option value="">Desconozco</option>
              <option value="MACHO">Macho</option>
              <option value="HEMBRA">Hembra</option>
            </select>
          </div>

          <div>
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6f5546]">
              Raza
            </label>
            <select
              name="raza"
              value={filtros.raza}
              onChange={handleChange}
              disabled={!filtros.especie}
              className={fieldClassName}
            >
              <option value="">
                {filtros.especie ? "Todas las razas" : "Selecciona especie primero"}
              </option>
              {(razasPorEspecie[filtros.especie] || []).map((raza) => (
                <option key={raza} value={raza}>
                  {raza}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6f5546]">
              Tamaño
            </label>
            <select
              name="tamano"
              value={filtros.tamano}
              onChange={handleChange}
              className={fieldClassName}
            >
              <option value="">Sin especificar</option>
              <option value="MINI">Mini</option>
              <option value="PEQUEÑO">Pequeño</option>
              <option value="MEDIANO">Mediano</option>
              <option value="GRANDE">Grande</option>
            </select>
          </div>

          <div>
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6f5546]">
              Color
            </label>
            <input
              type="text"
              name="color"
              value={filtros.color}
              onChange={handleChange}
              placeholder="Ej: Marrón"
              className={fieldClassName}
            />
          </div>

          {(tipo === "PERDIDO" || tipo === "ADOPCION") && (
            <div>
              <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6f5546]">
                Edad
              </label>
              <select
                name="edad"
                value={filtros.edad}
                onChange={handleChange}
                className={fieldClassName}
              >
                <option value="">Sin especificar</option>
                <option value="JOVEN">Joven</option>
                <option value="CACHORRO">Cachorro</option>
                <option value="ADULTO">Adulto</option>
                <option value="MAYOR">Mayor</option>
              </select>
            </div>
          )}

          {(tipo === "PERDIDO" || tipo === "ENCONTRADO") && (
            <div>
              <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6f5546]">
                Localidad
              </label>
              <select
                name="localidad"
                value={filtros.localidad}
                onChange={handleChange}
                className={fieldClassName}
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

          {(tipo === "PERDIDO" || tipo === "ENCONTRADO") && (
            <div>
              <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6f5546]">
                Zona o barrio
              </label>
              <input
                type="text"
                name="lugar"
                value={filtros.lugar}
                onChange={handleChange}
                placeholder="Ej: Centro o Barrio Norte"
                className={fieldClassName}
              />
            </div>
          )}

          <div>
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6f5546]">
              Señas particulares
            </label>
            <input
              type="text"
              name="detalles"
              value={filtros.detalles}
              onChange={handleChange}
              placeholder="Ej: Collar azul o cicatriz"
              className={fieldClassName}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearFilters}
          className="mt-5 w-full rounded-[0.6rem] border border-[#d46f49]/20 bg-[#f2d3bf] px-4 py-3 text-[0.76rem] font-semibold text-[#7b3f2d] transition-colors hover:bg-[#edc4aa]"
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
};

export default CardFiltro;
