import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const mockFile = new File(["contenido"], "foto.jpg", { type: "image/jpeg" });

const mockFetchOk = (body) =>
  vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(body),
  });

const mockFetchFail = (status, statusText) =>
  vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText,
    json: () => Promise.resolve({}),
  });

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("uploadToCloudinary", () => {
  it("retorna la secure_url en caso de éxito", async () => {
    global.fetch = mockFetchOk({ secure_url: "https://res.cloudinary.com/demo/foto.jpg" });

    const url = await uploadToCloudinary(mockFile);

    expect(url).toBe("https://res.cloudinary.com/demo/foto.jpg");
  });

  it("lanza error si response.ok es false", async () => {
    global.fetch = mockFetchFail(400, "Bad Request");

    await expect(uploadToCloudinary(mockFile)).rejects.toThrow("Error 400: Bad Request");
  });

  it("lanza error si la respuesta no trae secure_url", async () => {
    global.fetch = mockFetchOk({ public_id: "demo/foto" });

    await expect(uploadToCloudinary(mockFile)).rejects.toThrow(/No se recibi[oó] URL de imagen/i);
  });

  it("usa el mensaje de error de Cloudinary si está disponible", async () => {
    global.fetch = mockFetchOk({ error: { message: "Invalid upload preset" } });

    await expect(uploadToCloudinary(mockFile)).rejects.toThrow("Invalid upload preset");
  });

  it("lanza error de timeout si AbortController cancela la request", async () => {
    global.fetch = vi.fn().mockImplementation(
      (_, { signal }) =>
        new Promise((_, reject) => {
          signal.addEventListener("abort", () => {
            const err = new Error("aborted");
            err.name = "AbortError";
            reject(err);
          });
        }),
    );

    const promise = uploadToCloudinary(mockFile);
    vi.advanceTimersByTime(30001);

    await expect(promise).rejects.toThrow(/tiempo l[ií]mite/i);
  });

  it("limpia el timeout aunque la request falle", async () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    global.fetch = mockFetchFail(500, "Server Error");

    await expect(uploadToCloudinary(mockFile)).rejects.toThrow();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("limpia el timeout en caso de éxito", async () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    global.fetch = mockFetchOk({ secure_url: "https://res.cloudinary.com/demo/foto.jpg" });

    await uploadToCloudinary(mockFile);

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("llama a fetch con el método POST", async () => {
    global.fetch = mockFetchOk({ secure_url: "https://res.cloudinary.com/demo/foto.jpg" });

    await uploadToCloudinary(mockFile);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("cloudinary.com"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("incluye un AbortSignal en la request", async () => {
    global.fetch = mockFetchOk({ secure_url: "https://res.cloudinary.com/demo/foto.jpg" });

    await uploadToCloudinary(mockFile);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});
