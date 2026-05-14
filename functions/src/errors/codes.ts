export const ErrorCode = {
  // Autenticação / sessão
  AUTH_UNAUTHENTICATED: "auth/unauthenticated",
  AUTH_SESSION_EXPIRED: "auth/session_expired",

  // Permissão
  PERMISSION_DENIED: "permission/denied",

  // Dados
  DATA_NOT_FOUND: "data/not_found",
  DATA_ALREADY_EXISTS: "data/already_exists",
  DATA_INVALID: "data/invalid",
  DATA_CONFLICT: "data/conflict",

  // Validação
  VALIDATION_REQUIRED: "validation/required",
  VALIDATION_FORMAT: "validation/format",
  VALIDATION_RANGE: "validation/range",

  // Operação / quota
  OPERATION_FAILED: "operation/failed",
  OPERATION_CANCELLED: "operation/cancelled",
  RESOURCE_EXHAUSTED: "operation/resource_exhausted",
  PRECONDITION_FAILED: "operation/precondition_failed",

  // Rede / disponibilidade
  NETWORK_TIMEOUT: "network/timeout",
  NETWORK_UNAVAILABLE: "network/unavailable",

  // Genérico
  UNKNOWN: "unknown",
  INTERNAL: "internal",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
