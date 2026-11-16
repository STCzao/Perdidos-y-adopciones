import { describe, expect, it } from "vitest";
import {
  FILTROS_DEFAULT,
  contarFiltrosActivos,
  contarPorTipo,
  cumpleAntiguedad,
  filtrarPublicaciones,
  getGrupoEspecie,
  hayFiltrosModificados,
  parseFechaLocal,
  toggleValor,
} from "../features/publicaciones/utils/mapaFiltros";

const HOY = new Date(2026, 10, 16, 15, 30); // 16/11/2026 15:30 local

const pub = (overrides = {}) => ({
  _id: Math.random().toString(36),
  tipo: "PERDIDO",
  especie: "PERRO",
  fecha: "2026-11-15",
  tamaño: "MEDIANO",
  sexo: "MACHO",
  ...overrides,
});

const filtros = (overrides = {}) => ({ ...FILTROS_DEFAULT, ...overrides });

describe("parseFechaLocal", () => {
  it("interpreta YYYY-MM-DD como fecha local, sin correrse un día", () => {
    const fecha = parseFechaLocal("2026-11-16");
    expect(fecha.getFullYear()).toBe(2026);
    expect(fecha.getMonth()).toBe(10);
    expect(fecha.getDate()).toBe(16);
    expect(fecha.getHours()).toBe(0);
  });

  it("acepta fechas ISO completas y descarta valores inválidos", () => {
    expect(parseFechaLocal("2026-11-10T12:00:00.000Z")).toBeInstanceOf(Date);
    expect(parseFechaLocal("no-es-fecha")).toBeNull();
    expect(parseFechaLocal("")).toBeNull();
    expect(parseFechaLocal(undefined)).toBeNull();
  });
});

describe("getGrupoEspecie", () => {
  it("agrupa AVE, CONEJO y OTRO en OTROS", () => {
    expect(getGrupoEspecie("PERRO")).toBe("PERRO");
    expect(getGrupoEspecie("GATO")).toBe("GATO");
    expect(getGrupoEspecie("AVE")).toBe("OTROS");
    expect(getGrupoEspecie("CONEJO")).toBe("OTROS");
    expect(getGrupoEspecie("OTRO")).toBe("OTROS");
    expect(getGrupoEspecie(undefined)).toBe("OTROS");
  });
});

describe("cumpleAntiguedad", () => {
  it("sin límite deja pasar todo, incluso sin fecha", () => {
    expect(cumpleAntiguedad(pub({ fecha: undefined }), null, HOY)).toBe(true);
  });

  it("incluye el borde exacto de 7 días y excluye el día anterior", () => {
    expect(cumpleAntiguedad(pub({ fecha: "2026-11-09" }), 7, HOY)).toBe(true);
    expect(cumpleAntiguedad(pub({ fecha: "2026-11-08" }), 7, HOY)).toBe(false);
    expect(cumpleAntiguedad(pub({ fecha: "2026-11-16" }), 7, HOY)).toBe(true);
  });

  it("usa fechaCreacion si falta fecha, y excluye si no hay ninguna", () => {
    expect(
      cumpleAntiguedad(pub({ fecha: undefined, fechaCreacion: "2026-11-14T10:00:00.000Z" }), 7, HOY),
    ).toBe(true);
    expect(cumpleAntiguedad(pub({ fecha: undefined }), 30, HOY)).toBe(false);
  });
});

describe("filtrarPublicaciones", () => {
  const publicaciones = [
    pub({ tipo: "PERDIDO", especie: "PERRO", sexo: "MACHO", tamaño: "GRANDE", fecha: "2026-11-15" }),
    pub({ tipo: "PERDIDO", especie: "GATO", sexo: "HEMBRA", tamaño: "PEQUEÑO", fecha: "2026-10-01" }),
    pub({ tipo: "ENCONTRADO", especie: "AVE", sexo: "DESCONOZCO", tamaño: "MINI", fecha: "2026-11-12" }),
    pub({ tipo: "ENCONTRADO", especie: "PERRO", sexo: undefined, tamaño: undefined, fecha: "2026-11-01" }),
  ];

  it("con los filtros por defecto devuelve todo", () => {
    expect(filtrarPublicaciones(publicaciones, filtros(), { hoy: HOY })).toHaveLength(4);
  });

  it("filtra por tipo y especie", () => {
    expect(filtrarPublicaciones(publicaciones, filtros({ tipos: ["ENCONTRADO"] }), { hoy: HOY })).toHaveLength(2);
    expect(filtrarPublicaciones(publicaciones, filtros({ especies: ["OTROS"] }), { hoy: HOY })).toHaveLength(1);
    expect(filtrarPublicaciones(publicaciones, filtros({ especies: [] }), { hoy: HOY })).toHaveLength(0);
  });

  it("filtra por antigüedad", () => {
    expect(filtrarPublicaciones(publicaciones, filtros({ antiguedad: 7 }), { hoy: HOY })).toHaveLength(2);
    expect(filtrarPublicaciones(publicaciones, filtros({ antiguedad: 30 }), { hoy: HOY })).toHaveLength(3);
  });

  it("tamaño y sexo vacíos no filtran; sin dato cuentan como SIN ESPECIFICAR / DESCONOZCO", () => {
    expect(filtrarPublicaciones(publicaciones, filtros({ tamanos: ["SIN ESPECIFICAR"] }), { hoy: HOY })).toHaveLength(1);
    expect(filtrarPublicaciones(publicaciones, filtros({ sexos: ["DESCONOZCO"] }), { hoy: HOY })).toHaveLength(2);
    expect(
      filtrarPublicaciones(publicaciones, filtros({ sexos: ["MACHO", "HEMBRA"] }), { hoy: HOY }),
    ).toHaveLength(2);
  });

  it("los contadores de tipo ignoran el filtro de tipo pero respetan el resto", () => {
    const f = filtros({ tipos: ["PERDIDO"], especies: ["PERRO"] });
    const conteo = contarPorTipo(filtrarPublicaciones(publicaciones, f, { ignorar: "tipos", hoy: HOY }));
    expect(conteo).toEqual({ PERDIDO: 1, ENCONTRADO: 1 });
  });
});

describe("contarFiltrosActivos / hayFiltrosModificados", () => {
  it("no cuenta nada con los valores por defecto", () => {
    expect(contarFiltrosActivos(filtros())).toBe(0);
    expect(hayFiltrosModificados(filtros())).toBe(false);
  });

  it("cuenta cada grupo modificado una sola vez, sin importar el orden", () => {
    expect(contarFiltrosActivos(filtros({ especies: ["OTROS", "GATO", "PERRO"] }))).toBe(0);
    expect(contarFiltrosActivos(filtros({ especies: ["PERRO"], antiguedad: 7 }))).toBe(2);
    expect(contarFiltrosActivos(filtros({ tamanos: ["MINI", "GRANDE"], sexos: ["MACHO"] }))).toBe(2);
  });

  it("detecta cambios en tipo, que no cuenta para el botón Filtros", () => {
    const f = filtros({ tipos: ["PERDIDO"] });
    expect(contarFiltrosActivos(f)).toBe(0);
    expect(hayFiltrosModificados(f)).toBe(true);
  });
});

describe("toggleValor", () => {
  it("agrega y quita valores", () => {
    expect(toggleValor(["A"], "B")).toEqual(["A", "B"]);
    expect(toggleValor(["A", "B"], "A")).toEqual(["B"]);
  });
});
