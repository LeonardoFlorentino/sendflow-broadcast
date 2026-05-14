import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack spacing={2} sx={{ maxWidth: 520, width: "100%" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Algo deu errado
          </Typography>
          <Alert severity="error">
            {this.state.error.message ||
              "Ocorreu um erro inesperado ao renderizar esta tela."}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Você pode tentar recarregar a tela. Se o problema persistir, faça
            logout e entre novamente.
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<RefreshRoundedIcon />}
              onClick={this.reset}
              sx={{ fontWeight: 700 }}
            >
              Tentar novamente
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{ fontWeight: 700 }}
            >
              Recarregar a página
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }
}
