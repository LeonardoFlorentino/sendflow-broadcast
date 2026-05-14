import { FirebaseError } from "firebase/app";
import { AppError } from "./AppError";
import { ErrorCode } from "./codes";

const firebaseAuthMap: Record<string, ErrorCode> = {
  "auth/invalid-credential": ErrorCode.AUTH_INVALID_CREDENTIALS,
  "auth/invalid-login-credentials": ErrorCode.AUTH_INVALID_CREDENTIALS,
  "auth/wrong-password": ErrorCode.AUTH_INVALID_CREDENTIALS,
  "auth/user-not-found": ErrorCode.AUTH_USER_NOT_FOUND,
  "auth/email-already-in-use": ErrorCode.AUTH_EMAIL_ALREADY_IN_USE,
  "auth/weak-password": ErrorCode.AUTH_WEAK_PASSWORD,
  "auth/invalid-email": ErrorCode.AUTH_INVALID_EMAIL,
  "auth/too-many-requests": ErrorCode.AUTH_TOO_MANY_REQUESTS,
  "auth/user-disabled": ErrorCode.AUTH_USER_DISABLED,
  "auth/requires-recent-login": ErrorCode.AUTH_REQUIRES_RECENT_LOGIN,
  "auth/network-request-failed": ErrorCode.NETWORK_OFFLINE,
  "auth/operation-not-allowed": ErrorCode.AUTH_OPERATION_NOT_ALLOWED,
  "auth/user-token-expired": ErrorCode.AUTH_SESSION_EXPIRED,
  "auth/id-token-expired": ErrorCode.AUTH_SESSION_EXPIRED,
};

const firestoreMap: Record<string, ErrorCode> = {
  "permission-denied": ErrorCode.PERMISSION_DENIED,
  unauthenticated: ErrorCode.PERMISSION_UNAUTHENTICATED,
  "not-found": ErrorCode.DATA_NOT_FOUND,
  "already-exists": ErrorCode.DATA_ALREADY_EXISTS,
  "resource-exhausted": ErrorCode.RESOURCE_EXHAUSTED,
  unavailable: ErrorCode.NETWORK_UNAVAILABLE,
  "deadline-exceeded": ErrorCode.NETWORK_TIMEOUT,
  cancelled: ErrorCode.OPERATION_CANCELLED,
  "invalid-argument": ErrorCode.DATA_INVALID,
  aborted: ErrorCode.DATA_CONFLICT,
  "failed-precondition": ErrorCode.DATA_CONFLICT,
  internal: ErrorCode.INTERNAL,
};

function hasCode(value: unknown): value is { code: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    typeof (value as { code: unknown }).code === "string"
  );
}

export function translateError(err: unknown): AppError {
  if (AppError.is(err)) return err;

  if (err instanceof FirebaseError || hasCode(err)) {
    const code = String((err as { code: string }).code);
    const mapped = firebaseAuthMap[code] ?? firestoreMap[code];
    if (mapped) {
      return new AppError(mapped, { cause: err });
    }
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return new AppError(ErrorCode.NETWORK_OFFLINE, { cause: err });
  }

  return new AppError(ErrorCode.UNKNOWN, { cause: err });
}
