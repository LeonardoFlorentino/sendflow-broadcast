import {describe, expect, it} from "vitest";
import {AppError} from "./AppError";
import {ErrorCode} from "./codes";
import {errorMessages} from "./messages";

describe("AppError (functions)", () => {
  it("usa a mensagem padrão em português para o código", () => {
    const err = new AppError(ErrorCode.DATA_NOT_FOUND);
    expect(err.code).toBe(ErrorCode.DATA_NOT_FOUND);
    expect(err.userMessage).toBe(errorMessages[ErrorCode.DATA_NOT_FOUND]);
  });

  it("permite override de mensagem", () => {
    const err = new AppError(ErrorCode.VALIDATION_REQUIRED, {
      message: "Campo telefone é obrigatório",
    });
    expect(err.userMessage).toBe("Campo telefone é obrigatório");
  });

  it("preserva detalhes estruturados", () => {
    const err = new AppError(ErrorCode.DATA_INVALID, {
      details: {field: "phone", value: "abc"},
    });
    expect(err.details).toEqual({field: "phone", value: "abc"});
  });

  it("AppError.is identifica corretamente", () => {
    expect(AppError.is(new AppError(ErrorCode.UNKNOWN))).toBe(true);
    expect(AppError.is(new Error("x"))).toBe(false);
  });

  it("é serializável via toJSON", () => {
    const err = new AppError(ErrorCode.PERMISSION_DENIED, {
      details: {userId: "u1"},
    });
    expect(err.toJSON()).toEqual({
      name: "AppError",
      code: ErrorCode.PERMISSION_DENIED,
      message: errorMessages[ErrorCode.PERMISSION_DENIED],
      details: {userId: "u1"},
    });
  });
});

describe("errorMessages (functions)", () => {
  it("toda enum entry tem mensagem em português", () => {
    for (const code of Object.values(ErrorCode)) {
      const msg = errorMessages[code];
      expect(msg, `mensagem ausente para ${code}`).toBeTruthy();
      expect(msg.length, `mensagem vazia para ${code}`).toBeGreaterThan(3);
    }
  });
});
