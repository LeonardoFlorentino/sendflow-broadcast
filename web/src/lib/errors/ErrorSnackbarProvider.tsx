import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Alert, Snackbar } from "@mui/material";
import { AppError } from "./AppError";
import { translateError } from "./translate";
import {
  ErrorSnackbarContext,
  type ErrorHandlerApi,
} from "./errorSnackbarContext";

type Severity = "error" | "warning" | "info" | "success";

interface SnackbarMessage {
  message: string;
  severity: Severity;
  code?: string;
}

interface ErrorSnackbarProviderProps {
  children: ReactNode;
  autoHideDuration?: number;
  onError?: (err: AppError) => void;
}

export function ErrorSnackbarProvider({
  children,
  autoHideDuration = 6000,
  onError,
}: ErrorSnackbarProviderProps) {
  const [snack, setSnack] = useState<SnackbarMessage | null>(null);

  const dismiss = useCallback(() => setSnack(null), []);

  const showMessage = useCallback(
    (message: string, severity: Severity = "info") => {
      setSnack({ message, severity });
    },
    [],
  );

  const showError = useCallback(
    (err: unknown): AppError => {
      const appError = translateError(err);
      setSnack({
        message: appError.userMessage,
        severity: "error",
        code: appError.code,
      });
      if (onError) onError(appError);
      else if (appError.originalError) {
        console.error("[AppError]", appError.code, appError.originalError);
      }
      return appError;
    },
    [onError],
  );

  const api = useMemo<ErrorHandlerApi>(
    () => ({ showError, showMessage, dismiss }),
    [showError, showMessage, dismiss],
  );

  return (
    <ErrorSnackbarContext.Provider value={api}>
      {children}
      <Snackbar
        open={snack !== null}
        autoHideDuration={autoHideDuration}
        onClose={dismiss}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {snack ? (
          <Alert
            onClose={dismiss}
            severity={snack.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ErrorSnackbarContext.Provider>
  );
}
