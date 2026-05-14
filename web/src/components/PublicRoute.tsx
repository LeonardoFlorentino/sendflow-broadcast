import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rotas públicas
 * Redireciona usuários autenticados para a dashboard
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
