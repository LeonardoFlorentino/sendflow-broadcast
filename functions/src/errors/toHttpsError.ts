import {HttpsError} from "firebase-functions/v2/https";
import type {FunctionsErrorCode} from "firebase-functions/v2/https";
import {AppError} from "./AppError";
import {ErrorCode} from "./codes";

const httpsCodeByErrorCode: Record<ErrorCode, FunctionsErrorCode> = {
  [ErrorCode.AUTH_UNAUTHENTICATED]: "unauthenticated",
  [ErrorCode.AUTH_SESSION_EXPIRED]: "unauthenticated",
  [ErrorCode.PERMISSION_DENIED]: "permission-denied",
  [ErrorCode.DATA_NOT_FOUND]: "not-found",
  [ErrorCode.DATA_ALREADY_EXISTS]: "already-exists",
  [ErrorCode.DATA_INVALID]: "invalid-argument",
  [ErrorCode.DATA_CONFLICT]: "aborted",
  [ErrorCode.VALIDATION_REQUIRED]: "invalid-argument",
  [ErrorCode.VALIDATION_FORMAT]: "invalid-argument",
  [ErrorCode.VALIDATION_RANGE]: "out-of-range",
  [ErrorCode.OPERATION_FAILED]: "internal",
  [ErrorCode.OPERATION_CANCELLED]: "cancelled",
  [ErrorCode.RESOURCE_EXHAUSTED]: "resource-exhausted",
  [ErrorCode.PRECONDITION_FAILED]: "failed-precondition",
  [ErrorCode.NETWORK_TIMEOUT]: "deadline-exceeded",
  [ErrorCode.NETWORK_UNAVAILABLE]: "unavailable",
  [ErrorCode.UNKNOWN]: "unknown",
  [ErrorCode.INTERNAL]: "internal",
};

export function toHttpsError(err: unknown): HttpsError {
  if (err instanceof HttpsError) return err;

  const appError = AppError.is(err) ?
    err :
    new AppError(ErrorCode.UNKNOWN, {cause: err});

  const httpsCode = httpsCodeByErrorCode[appError.code] ?? "unknown";
  return new HttpsError(httpsCode, appError.userMessage, {
    code: appError.code,
    details: appError.details,
  });
}
