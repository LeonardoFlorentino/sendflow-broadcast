import {describe, expect, it} from "vitest";
import {HttpsError} from "firebase-functions/v2/https";
import {AppError} from "./AppError";
import {ErrorCode} from "./codes";
import {toHttpsError} from "./toHttpsError";

describe("toHttpsError", () => {
  it("retorna o próprio HttpsError quando já recebe um", () => {
    const original = new HttpsError("not-found", "x");
    expect(toHttpsError(original)).toBe(original);
  });

  it("mapeia AppError para HttpsError com mensagem em português", () => {
    const appErr = new AppError(ErrorCode.PERMISSION_DENIED);
    const result = toHttpsError(appErr);
    expect(result).toBeInstanceOf(HttpsError);
    expect(result.code).toBe("permission-denied");
    expect(result.message).toMatch(/permissão/i);
  });

  it("anexa código de domínio nos details", () => {
    const appErr = new AppError(ErrorCode.DATA_NOT_FOUND, {
      details: {id: "abc"},
    });
    const result = toHttpsError(appErr);
    expect(result.details).toMatchObject({
      code: ErrorCode.DATA_NOT_FOUND,
      details: {id: "abc"},
    });
  });

  it("mapeia validação para invalid-argument", () => {
    const appErr = new AppError(ErrorCode.VALIDATION_REQUIRED);
    expect(toHttpsError(appErr).code).toBe("invalid-argument");
  });

  it("mapeia range para out-of-range", () => {
    const appErr = new AppError(ErrorCode.VALIDATION_RANGE);
    expect(toHttpsError(appErr).code).toBe("out-of-range");
  });

  it("encapsula erros desconhecidos como unknown", () => {
    const result = toHttpsError(new Error("falha aleatória"));
    expect(result.code).toBe("unknown");
    expect(result.message).toMatch(/inesperado/i);
  });
});
