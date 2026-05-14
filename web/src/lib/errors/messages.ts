import { ErrorCode } from "./codes";

export const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: "Email ou senha incorretos.",
  [ErrorCode.AUTH_EMAIL_ALREADY_IN_USE]: "Este email já está em uso.",
  [ErrorCode.AUTH_WEAK_PASSWORD]:
    "A senha precisa ter pelo menos 6 caracteres.",
  [ErrorCode.AUTH_USER_NOT_FOUND]: "Usuário não encontrado.",
  [ErrorCode.AUTH_INVALID_EMAIL]: "O email informado é inválido.",
  [ErrorCode.AUTH_TOO_MANY_REQUESTS]:
    "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  [ErrorCode.AUTH_USER_DISABLED]: "Esta conta foi desativada.",
  [ErrorCode.AUTH_REQUIRES_RECENT_LOGIN]:
    "Por segurança, faça login novamente para continuar.",
  [ErrorCode.AUTH_SESSION_EXPIRED]: "Sua sessão expirou. Faça login novamente.",
  [ErrorCode.AUTH_OPERATION_NOT_ALLOWED]:
    "Esta operação não está habilitada. Contate o suporte.",

  [ErrorCode.PERMISSION_DENIED]:
    "Você não tem permissão para realizar esta ação.",
  [ErrorCode.PERMISSION_UNAUTHENTICATED]:
    "Faça login para acessar este recurso.",

  [ErrorCode.NETWORK_OFFLINE]:
    "Sem conexão com a internet. Verifique sua rede e tente novamente.",
  [ErrorCode.NETWORK_TIMEOUT]:
    "A requisição demorou demais para responder. Tente novamente.",
  [ErrorCode.NETWORK_UNAVAILABLE]:
    "Serviço temporariamente indisponível. Tente novamente em instantes.",

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

  [ErrorCode.UNKNOWN]: "Ocorreu um erro inesperado. Tente novamente.",
  [ErrorCode.INTERNAL]:
    "Erro interno do servidor. Nossa equipe foi notificada.",
};

export function getErrorMessage(code: ErrorCode): string {
  return errorMessages[code] ?? errorMessages[ErrorCode.UNKNOWN];
}
