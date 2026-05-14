import {ErrorCode} from "./codes";

export const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_UNAUTHENTICATED]:
    "Faça login para acessar este recurso.",
  [ErrorCode.AUTH_SESSION_EXPIRED]:
    "Sua sessão expirou. Faça login novamente.",

  [ErrorCode.PERMISSION_DENIED]:
    "Você não tem permissão para realizar esta ação.",

  [ErrorCode.DATA_NOT_FOUND]: "Registro não encontrado.",
  [ErrorCode.DATA_ALREADY_EXISTS]: "Este registro já existe.",
  [ErrorCode.DATA_INVALID]: "Os dados informados são inválidos.",
  [ErrorCode.DATA_CONFLICT]:
    "O registro foi alterado em outro lugar. Atualize e tente novamente.",

  [ErrorCode.VALIDATION_REQUIRED]: "Preencha todos os campos obrigatórios.",
  [ErrorCode.VALIDATION_FORMAT]: "Formato inválido.",
  [ErrorCode.VALIDATION_RANGE]: "Valor fora do intervalo permitido.",

  [ErrorCode.OPERATION_FAILED]: "Não foi possível concluir a operação.",
  [ErrorCode.OPERATION_CANCELLED]: "Operação cancelada.",
  [ErrorCode.RESOURCE_EXHAUSTED]:
    "Limite de uso atingido. Tente novamente mais tarde.",
  [ErrorCode.PRECONDITION_FAILED]:
    "A operação não pode ser concluída no estado atual.",

  [ErrorCode.NETWORK_TIMEOUT]:
    "A operação demorou demais para responder.",
  [ErrorCode.NETWORK_UNAVAILABLE]:
    "Serviço temporariamente indisponível. Tente novamente em instantes.",

  [ErrorCode.UNKNOWN]: "Ocorreu um erro inesperado. Tente novamente.",
  [ErrorCode.INTERNAL]:
    "Erro interno do servidor. Nossa equipe foi notificada.",
};

export function getErrorMessage(code: ErrorCode): string {
  return errorMessages[code] ?? errorMessages[ErrorCode.UNKNOWN];
}
