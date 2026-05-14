import { ErrorCode } from "./codes";
import { getErrorMessage } from "./messages";

export interface AppErrorOptions {
  message?: string;
  cause?: unknown;
  details?: Record<string, unknown>;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly userMessage: string;
  readonly details?: Record<string, unknown>;
  readonly originalError?: unknown;

  constructor(code: ErrorCode, options: AppErrorOptions = {}) {
    const userMessage = options.message ?? getErrorMessage(code);
    super(userMessage);
    this.name = "AppError";
    this.code = code;
    this.userMessage = userMessage;
    this.details = options.details;
    this.originalError = options.cause;
  }

  static is(value: unknown): value is AppError {
    return value instanceof AppError;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.userMessage,
      details: this.details,
    };
  }
}
