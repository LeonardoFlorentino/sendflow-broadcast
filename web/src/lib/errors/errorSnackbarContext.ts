import { createContext } from "react";
import type { AppError } from "./AppError";

type Severity = "error" | "warning" | "info" | "success";

export interface ErrorHandlerApi {
  showError: (err: unknown) => AppError;
  showMessage: (message: string, severity?: Severity) => void;
  dismiss: () => void;
}

export const ErrorSnackbarContext = createContext<ErrorHandlerApi | null>(null);
