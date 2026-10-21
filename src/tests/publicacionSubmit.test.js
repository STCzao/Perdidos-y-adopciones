import { describe, it, expect } from "vitest";
import {
  CODIGO_UBICACION_NO_RESUELTA,
  construirDatosParaEnviar,
  interpretarRespuestaPublicacion,
} from "../features/publicaciones/CrearPublicacion/publicacionSubmit";
import {
  aplicarCambioCampo,
  aplicarUbicacion,
} from "../features/publicaciones/CrearPublicacion/usePublicacionForm";
import { mapServiceError } from "../services/serviceUtils";

const formPerdido = {
  tipo: "PERDIDO",
  nombreanimal: "Toby",
  edad: "2",
  especie: "Perro",
  raza: "Mestizo",
  sexo: "MACHO",
  tamaño: "MEDIANO",
  color: "Negro",
  whatsapp: "3811234567",
  imgs: ["https://res.cloudinary.com/demo/image/upload/toby.jpg"],
  detalles: "",
  localidad: "San Miguel de Tucumán",
  lugar: "Calle inventada 123",
  fecha: "2026-10-20",
  lat: null,
  lng: null,
  fuenteUbicacion: null,
};

const errorAxios = (status, data) => ({ response: { status, data, headers: {} } });

describe("interpretarRespuestaPublicacion", () => {
  it("detecta el éxito", () => {
    expect(interpretarRespuestaPublicacion({ success: true }).tipo).toBe("exito");
  });

  it("con codigo UBICACION_NO_RESUELTA (422) muestra el aviso de dirección no encontrada", () => {
    const response = mapServiceError(
      errorAxios(422, {
        success: false,
        msg: "No se pudo ubicar la dirección",
        codigo: CODIGO_UBICACION_NO_RESUELTA,
      }),
      "Error de conexión al servidor",
    );

    const resultado = interpretarRespuestaPublicacion(response);

    expect(resultado.tipo).toBe("ubicacionNoResuelta");
    expect(resultado.msg).toMatch(/No encontramos esa dirección/);
    expect(resultado.msg).toMatch(/ubicación actual o marcar el punto en el mapa/);
  });

  it("con codigo UBICACION_NO_RESUELTA (502) avisa que no se pudo verificar la dirección", () => {
    const response = mapServiceError(
      errorAxios(502, { success: false, msg: "Geocoding caído", codigo: CODIGO_UBICACION_NO_RESUELTA }),
      "Error de conexión al servidor",
    );

    const resultado = interpretarRespuestaPublicacion(response);

    expect(resultado.tipo).toBe("ubicacionNoResuelta");
    expect(resultado.msg).toMatch(/No pudimos verificar la dirección/);
  });

  it("los errores de validación se siguen mostrando como antes", () => {
    const response = mapServiceError(
      errorAxios(400, { success: false, msg: "Datos inválidos", errors: { lugar: "Muy corto" } }),
      "Error de conexión al servidor",
    );

    expect(interpretarRespuestaPublicacion(response)).toEqual({
      tipo: "validacion",
      msg: "Datos inválidos",
      errors: { lugar: "Muy corto" },
    });
  });

  it("los errores de conexión se siguen mostrando como antes", () => {
    const response = mapServiceError(new Error("Network Error"), "Error de conexión al servidor");
    const resultado = interpretarRespuestaPublicacion(response);

    expect(resultado.tipo).not.toBe("ubicacionNoResuelta");
    expect(resultado.msg).toBe("Error de conexión al servidor");
  });

  it("sin errors ni codigo usa el mensaje genérico", () => {
    expect(interpretarRespuestaPublicacion({ success: false })).toEqual({
      tipo: "error",
      msg: "Error al procesar la publicacion",
    });
  });
});

describe("construirDatosParaEnviar", () => {
  it("no manda lat/lng si no hay ubicación elegida", () => {
    const datos = construirDatosParaEnviar(formPerdido, false);

    expect(datos.lugar).toBe("Calle inventada 123");
    expect(datos).not.toHaveProperty("lat");
    expect(datos).not.toHaveProperty("lng");
    expect(datos).not.toHaveProperty("fuenteUbicacion");
  });

  it("manda lat/lng junto con lugar si se marcó en el mapa", () => {
    const form = aplicarUbicacion(formPerdido, { lat: -26.83, lng: -65.21 }, "mapa");
    const datos = construirDatosParaEnviar(form, false);

    expect(datos).toMatchObject({ lugar: "Calle inventada 123", lat: -26.83, lng: -65.21 });
  });

  it("no manda lat/lng para ADOPCION", () => {
    const form = { ...formPerdido, tipo: "ADOPCION", lat: -26.8, lng: -65.2 };
    const datos = construirDatosParaEnviar(form, false);

    expect(datos).not.toHaveProperty("lat");
    expect(datos).not.toHaveProperty("lugar");
  });

  it("al editar incluye el estado si existe", () => {
    const datos = construirDatosParaEnviar({ ...formPerdido, estado: "SE BUSCA" }, true);
    expect(datos.estado).toBe("SE BUSCA");
  });
});

describe("flujo de fallback cuando la dirección no se encuentra", () => {
  it("tras el aviso, elegir GPS y editar la dirección reenvía con coordenadas", () => {
    const primerIntento = construirDatosParaEnviar(formPerdido, false);
    expect(primerIntento).not.toHaveProperty("lat");

    const respuesta = mapServiceError(
      errorAxios(422, { success: false, msg: "No encontrada", codigo: CODIGO_UBICACION_NO_RESUELTA }),
      "Error de conexión al servidor",
    );
    expect(interpretarRespuestaPublicacion(respuesta).tipo).toBe("ubicacionNoResuelta");

    let form = aplicarUbicacion(formPerdido, { lat: -26.82, lng: -65.22 }, "gps");
    form = aplicarCambioCampo(form, { name: "lugar", value: "Cerca de la plaza", type: "text" });

    const segundoIntento = construirDatosParaEnviar(form, true);

    expect(segundoIntento).toMatchObject({
      lugar: "Cerca de la plaza",
      localidad: "San Miguel de Tucumán",
      lat: -26.82,
      lng: -65.22,
    });
  });
});
