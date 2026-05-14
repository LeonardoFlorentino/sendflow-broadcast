import { describe, expect, it } from "vitest";
import { AppError } from "./AppError";
import { ErrorCode } from "./codes";
import { errorMessages } from "./messages";

describe("AppError", () => {
  it("usa a mensagem padrão em português para o código", () => {
    const err = new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS);
    expect(err.code).toBe(ErrorCode.AUTH_INVALID_CREDENTIALS);
    expect(err.userMessage).toBe(
      errorMessages[ErrorCode.AUTH_INVALID_CREDENTIALS],
    );
    expect(err.message).toBe(err.userMessage);
  });

  it("permite override da mensagem", () => {
    const err = new AppError(ErrorCode.UNKNOWN, {
      message: "Mensagem customizada",
    });
    expect(err.userMessage).toBe("Mensagem customizada");
  });

  it("preserva a causa original sem expor ao usuário", () => {
    const original = new Error("stack trace técnico");
    const err = new AppError(ErrorCode.OPERATION_FAILED, { cause: original });
    expect(err.originalError).toBe(original);
    expect(err.userMessage).not.toContain("stack");
  });

  it("AppError.is identifica instâncias", () => {
    expect(AppError.is(new AppError(ErrorCode.UNKNOWN))).toBe(true);
    expect(AppError.is(new Error("x"))).toBe(false);
    expect(AppError.is(null)).toBe(false);
    expect(AppError.is(undefined)).toBe(false);
  });

  it("toJSON expõe formato serializável sem causa", () => {
    const err = new AppError(ErrorCode.DATA_NOT_FOUND, {
      details: { id: "abc" },
      cause: new Error("interno"),
    });
    const json = err.toJSON();
    expect(json).toEqual({
      name: "AppError",
      code: ErrorCode.DATA_NOT_FOUND,
      message: errorMessages[ErrorCode.DATA_NOT_FOUND],
      details: { id: "abc" },
    });
  });

  it("é uma subclasse de Error", () => {
    const err = new AppError(ErrorCode.UNKNOWN);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("AppError");
  });
});

describe("errorMessages", () => {
  it("tem uma mensagem em português para todos os códigos", () => {
    for (const code of Object.values(ErrorCode)) {
      const msg = errorMessages[code];
      expect(msg, `mensagem ausente para ${code}`).toBeTruthy();
      expect(msg.length, `mensagem vazia para ${code}`).toBeGreaterThan(3);
    }
  });
});
