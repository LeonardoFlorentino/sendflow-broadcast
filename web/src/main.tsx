import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { AuthProvider } from "./contexts/authProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ErrorSnackbarProvider } from "./lib/errors";
import theme from "./theme";
import router from "./router";
import "./index.css";

dayjs.locale("pt-br");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <ErrorSnackbarProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ErrorSnackbarProvider>
        </LocalizationProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
);
