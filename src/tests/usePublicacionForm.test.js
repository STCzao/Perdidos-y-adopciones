import { describe, it, expect } from "vitest";
import {
  aplicarCambioCampo,
  aplicarUbicacion,
  quitarUbicacion,
} from "../features/publicaciones/CrearPublicacion/usePublicacionForm";

const formPerdido = {
  tipo: "PERDIDO",
  nombreanimal: "Toby",
  edad: "2",
  especie: "Perro",
  raza: "Mestizo",
  localidad: "San Miguel de Tucumán",
  lugar: "Calle inventada 123",
  fecha: "2026-10-20",
  whatsapp: "3811234567",
  lat: null,
  lng: null,
  fuenteUbicacion: null,
};

const cambio = (name, value, extra = {}) => ({ name, value, type: "text", ...extra });

describe("aplicarCambioCampo", () => {
  it("editar lugar no borra una ubicación GPS", () => {
    const conGps = aplicarUbicacion(formPerdido, { lat: -26.8, lng: -65.2 }, "gps");
    const next = aplicarCambioCampo(conGps, cambio("lugar", "Plaza Independencia"));

    expect(next.lugar).toBe("Plaza Independencia");
    expect(next.lat).toBe(-26.8);
    expect(next.lng).toBe(-65.2);
    expect(next.fuenteUbicacion).toBe("gps");
  });

  it("editar lugar no borra una ubicación marcada en el mapa", () => {
    const conPin = aplicarUbicacion(formPerdido, { lat: -26.83, lng: -65.21 }, "mapa");
    const next = aplicarCambioCampo(conPin, cambio("lugar", "Frente a la plaza"));

    expect(next.lat).toBe(-26.83);
    expect(next.lng).toBe(-65.21);
    expect(next.fuenteUbicacion).toBe("mapa");
  });

  it("cambiar de tipo limpia la ubicación y los campos de ubicación", () => {
    const conPin = aplicarUbicacion(formPerdido, { lat: -26.83, lng: -65.21 }, "mapa");
    const next = aplicarCambioCampo(conPin, cambio("tipo", "ENCONTRADO"));

    expect(next.tipo).toBe("ENCONTRADO");
    expect(next.lat).toBeNull();
    expect(next.lng).toBeNull();
    expect(next.fuenteUbicacion).toBeNull();
    expect(next.lugar).toBe("");
    expect(next.localidad).toBe("");
  });

  it("cambiar de especie resetea la raza", () => {
    const next = aplicarCambioCampo(formPerdido, cambio("especie", "Gato"));
    expect(next.especie).toBe("Gato");
    expect(next.raza).toBe("");
  });

  it("deja solo dígitos en el whatsapp", () => {
    const next = aplicarCambioCampo(formPerdido, cambio("whatsapp", "+54 381-123"));
    expect(next.whatsapp).toBe("54381123");
  });

  it("usa checked para los checkbox", () => {
    const next = aplicarCambioCampo(formPerdido, {
      name: "castrado",
      value: "on",
      type: "checkbox",
      checked: true,
    });
    expect(next.castrado).toBe(true);
  });
});

describe("aplicarUbicacion / quitarUbicacion", () => {
  it("guarda lat, lng y la fuente sin tocar el resto del form", () => {
    const next = aplicarUbicacion(formPerdido, { lat: -26.8, lng: -65.2 }, "mapa");

    expect(next).toMatchObject({ lat: -26.8, lng: -65.2, fuenteUbicacion: "mapa" });
    expect(next.lugar).toBe(formPerdido.lugar);
  });

  it("una nueva ubicación reemplaza a la anterior y su fuente", () => {
    const conGps = aplicarUbicacion(formPerdido, { lat: -26.8, lng: -65.2 }, "gps");
    const next = aplicarUbicacion(conGps, { lat: -26.9, lng: -65.3 }, "mapa");

    expect(next).toMatchObject({ lat: -26.9, lng: -65.3, fuenteUbicacion: "mapa" });
  });

  it("quitarUbicacion limpia lat, lng y fuente pero conserva la dirección", () => {
    const conPin = aplicarUbicacion(formPerdido, { lat: -26.8, lng: -65.2 }, "mapa");
    const next = quitarUbicacion(conPin);

    expect(next).toMatchObject({ lat: null, lng: null, fuenteUbicacion: null });
    expect(next.lugar).toBe(formPerdido.lugar);
  });
});
