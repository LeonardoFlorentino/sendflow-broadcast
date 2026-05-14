import { useContext } from "react";
import {
  ErrorSnackbarContext,
  type ErrorHandlerApi,
} from "./errorSnackbarContext";

export function useErrorHandler(): ErrorHandlerApi {
  const ctx = useContext(ErrorSnackbarContext);
  if (!ctx) {
    throw new Error(
      "useErrorHandler precisa estar dentro de <ErrorSnackbarProvider>",
    );
  }
  return ctx;
}
