import { describe, it, expect } from "vitest";
import {
  getResponseRequestId,
  getErrorRequestId,
  withRequestIdMessage,
  mapServiceError,
  buildServiceSuccess,
} from "../services/serviceUtils";

describe("getResponseRequestId", () => {
  it("retorna el header x-request-id", () => {
    const response = { headers: { "x-request-id": "abc-123" }, data: {} };
    expect(getResponseRequestId(response)).toBe("abc-123");
  });

  it("retorna requestId del body si no hay header", () => {
    const response = { headers: {}, data: { requestId: "xyz-456" } };
    expect(getResponseRequestId(response)).toBe("xyz-456");
  });

  it("retorna el header X-Request-Id", () => {
    const response = { headers: { "X-Request-Id": "pascal-789" }, data: {} };
    expect(getResponseRequestId(response)).toBe("pascal-789");
  });

  it("prioriza x-request-id sobre data.requestId", () => {
    const response = { headers: { "x-request-id": "header-id" }, data: { requestId: "body-id" } };
    expect(getResponseRequestId(response)).toBe("header-id");
  });

  it("retorna string vacío si la response es null", () => {
    expect(getResponseRequestId(null)).toBe("");
  });

  it("retorna string vacío si no hay ningún id", () => {
    const response = { headers: {}, data: {} };
    expect(getResponseRequestId(response)).toBe("");
  });
});

describe("getErrorRequestId", () => {
  it("retorna el id desde error.response.headers", () => {
    const error = { response: { headers: { "x-request-id": "err-123" }, data: {} } };
    expect(getErrorRequestId(error)).toBe("err-123");
  });

  it("retorna el id desde error.response.data", () => {
    const error = { response: { headers: {}, data: { requestId: "data-456" } } };
    expect(getErrorRequestId(error)).toBe("data-456");
  });

  it("retorna string vacío si el error no tiene response", () => {
    expect(getErrorRequestId(new Error("network error"))).toBe("");
  });

  it("retorna string vacío si el error es null", () => {
    expect(getErrorRequestId(null)).toBe("");
  });
});

describe("withRequestIdMessage", () => {
  it("agrega el ID al mensaje si existe", () => {
    expect(withRequestIdMessage("Error de red", "abc-123")).toBe("Error de red (ID: abc-123)");
  });

  it("retorna el mensaje sin cambios si no hay requestId", () => {
    expect(withRequestIdMessage("Error de red", "")).toBe("Error de red");
  });

  it("retorna el mensaje sin cambios si requestId es undefined", () => {
    expect(withRequestIdMessage("Error de red", undefined)).toBe("Error de red");
  });
});

describe("mapServiceError", () => {
  it("siempre retorna success false", () => {
    const error = {
      response: { data: { success: true, msg: "ok" }, status: 400, headers: {} },
    };
    expect(mapServiceError(error, "fallback").success).toBe(false);
  });

  it("usa el msg del backend si está disponible", () => {
    const error = {
      response: { data: { msg: "Error del servidor" }, status: 500, headers: {} },
    };
    expect(mapServiceError(error, "fallback").msg).toBe("Error del servidor");
  });

  it("usa el fallback si el backend no manda msg", () => {
    const error = {
      response: { data: {}, status: 500, headers: {} },
    };
    expect(mapServiceError(error, "fallback msg").msg).toBe("fallback msg");
  });

  it("incluye el status HTTP", () => {
    const error = {
      response: { data: {}, status: 404, headers: {} },
    };
    expect(mapServiceError(error, "fallback").status).toBe(404);
  });

  it("retorna errors vacío si el backend no los manda", () => {
    const error = {
      response: { data: {}, status: 400, headers: {} },
    };
    expect(mapServiceError(error, "fallback").errors).toEqual({});
  });

  it("incluye los errors del backend si los manda", () => {
    const error = {
      response: {
        data: { errors: { correo: "invalido" } },
        status: 422,
        headers: {},
      },
    };
    expect(mapServiceError(error, "fallback").errors).toEqual({ correo: "invalido" });
  });

  it("funciona sin response", () => {
    const error = new Error("Network Error");
    const result = mapServiceError(error, "Sin conexión");
    expect(result.success).toBe(false);
    expect(result.msg).toBe("Sin conexión");
    expect(result.errors).toEqual({});
    expect(result.status).toBeUndefined();
  });

  it("aplica el parámetro extra", () => {
    const error = { response: { data: {}, status: 400, headers: {} } };
    const result = mapServiceError(error, "fallback", { campo: "adicional" });
    expect(result.campo).toBe("adicional");
  });
});

describe("buildServiceSuccess", () => {
  it("retorna success true", () => {
    expect(buildServiceSuccess({}).success).toBe(true);
  });

  it("incluye el payload completo", () => {
    const result = buildServiceSuccess({ data: [1, 2, 3], total: 3 });
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.total).toBe(3);
  });

  it("funciona sin argumentos", () => {
    expect(buildServiceSuccess()).toEqual({ success: true });
  });
});
