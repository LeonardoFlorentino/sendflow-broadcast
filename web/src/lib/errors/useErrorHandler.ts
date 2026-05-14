import { useContext } from "react";
import { ErrorSnackbarContext } from "./ErrorSnackbarProvider";
import type { ErrorHandlerApi } from "./ErrorSnackbarProvider";

export function useErrorHandler(): ErrorHandlerApi {
  const ctx = useContext(ErrorSnackbarContext);
  if (!ctx) {
    throw new Error(
      "useErrorHandler precisa estar dentro de <ErrorSnackbarProvider>",
    );
  }
  return ctx;
}
