export const ErrorCode = {
  // Autenticação
  AUTH_INVALID_CREDENTIALS: "auth/invalid_credentials",
  AUTH_EMAIL_ALREADY_IN_USE: "auth/email_already_in_use",
  AUTH_WEAK_PASSWORD: "auth/weak_password",
  AUTH_USER_NOT_FOUND: "auth/user_not_found",
  AUTH_INVALID_EMAIL: "auth/invalid_email",
  AUTH_TOO_MANY_REQUESTS: "auth/too_many_requests",
  AUTH_USER_DISABLED: "auth/user_disabled",
  AUTH_REQUIRES_RECENT_LOGIN: "auth/requires_recent_login",
  AUTH_SESSION_EXPIRED: "auth/session_expired",
  AUTH_OPERATION_NOT_ALLOWED: "auth/operation_not_allowed",

  // Permissão
  PERMISSION_DENIED: "permission/denied",
  PERMISSION_UNAUTHENTICATED: "permission/unauthenticated",

  // Rede
  NETWORK_OFFLINE: "network/offline",
  NETWORK_TIMEOUT: "network/timeout",
  NETWORK_UNAVAILABLE: "network/unavailable",

  // Dados
  DATA_NOT_FOUND: "data/not_found",
  DATA_ALREADY_EXISTS: "data/already_exists",
  DATA_INVALID: "data/invalid",
  DATA_CONFLICT: "data/conflict",

  // Validação
  VALIDATION_REQUIRED: "validation/required",
  VALIDATION_FORMAT: "validation/format",
  VALIDATION_RANGE: "validation/range",

  // Operação
  OPERATION_FAILED: "operation/failed",
  OPERATION_CANCELLED: "operation/cancelled",
  RESOURCE_EXHAUSTED: "operation/resource_exhausted",

  // Genérico
  UNKNOWN: "unknown",
  INTERNAL: "internal",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
