import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Componente de proteção de rotas
 * Verifica autenticação e redireciona para login se necessário
 * O userId (UID do usuário) está disponível globalmente via useAuthContext
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
