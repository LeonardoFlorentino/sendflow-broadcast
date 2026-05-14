import { afterEach, describe, expect, it, vi } from "vitest";
import { FirebaseError } from "firebase/app";
import { translateError } from "./translate";
import { AppError } from "./AppError";
import { ErrorCode } from "./codes";

describe("translateError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna o próprio AppError quando já é AppError", () => {
    const original = new AppError(ErrorCode.PERMISSION_DENIED);
    expect(translateError(original)).toBe(original);
  });

  it("mapeia auth/invalid-credential para credenciais inválidas", () => {
    const fbError = new FirebaseError("auth/invalid-credential", "raw");
    const result = translateError(fbError);
    expect(result.code).toBe(ErrorCode.AUTH_INVALID_CREDENTIALS);
    expect(result.userMessage).toMatch(/email ou senha/i);
  });

  it("mapeia auth/email-already-in-use", () => {
    const fbError = new FirebaseError("auth/email-already-in-use", "raw");
    expect(translateError(fbError).code).toBe(
      ErrorCode.AUTH_EMAIL_ALREADY_IN_USE,
    );
  });

  it("mapeia auth/network-request-failed para offline", () => {
    const fbError = new FirebaseError("auth/network-request-failed", "raw");
    expect(translateError(fbError).code).toBe(ErrorCode.NETWORK_OFFLINE);
  });

  it("mapeia permission-denied do firestore", () => {
    const result = translateError({ code: "permission-denied", message: "x" });
    expect(result.code).toBe(ErrorCode.PERMISSION_DENIED);
  });

  it("mapeia unavailable para indisponibilidade de rede", () => {
    const result = translateError({ code: "unavailable", message: "x" });
    expect(result.code).toBe(ErrorCode.NETWORK_UNAVAILABLE);
  });

  it("detecta offline via navigator quando o erro não é reconhecido", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const result = translateError(new Error("network down"));
    expect(result.code).toBe(ErrorCode.NETWORK_OFFLINE);
  });

  it("retorna UNKNOWN para erros não mapeados", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
    const result = translateError(new Error("erro qualquer"));
    expect(result.code).toBe(ErrorCode.UNKNOWN);
    expect(result.userMessage).toMatch(/inesperado/i);
  });

  it("preserva a causa original", () => {
    const original = new FirebaseError("auth/invalid-credential", "raw");
    const result = translateError(original);
    expect(result.originalError).toBe(original);
  });
});
