import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FirebaseError } from "firebase/app";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

export function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthContext();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError("Email é obrigatório");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return false;
    }
    if (!password) {
      setError("Senha é obrigatória");
      return false;
    }
    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return false;
    }
    setError("");
    return true;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: unknown) {
      const code = err instanceof FirebaseError ? err.code : "";
      console.error("Sign in error:", code, err);

      if (code === "auth/invalid-credential") {
        setError("Email ou senha incorretos");
      } else if (code === "auth/user-not-found") {
        setError("Usuário não encontrado");
      } else if (code === "auth/invalid-email") {
        setError("Email inválido");
      } else if (code === "auth/too-many-requests") {
        setError(
          "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
        );
      } else {
        const message =
          err instanceof Error ? err.message : "Erro ao fazer login";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="w-full">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
          Entrar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Acesse sua conta para gerenciar campanhas.
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <MailOutlineRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2.2 },
          }}
        />

        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2.2 },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          size="large"
          sx={{
            mt: 0.5,
            py: 1.4,
            borderRadius: 2.2,
            fontWeight: 700,
            boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Entrar"}
        </Button>

        <Box className="text-center">
          <Typography variant="body2" color="text.secondary">
            Não tem conta?{" "}
            <MuiLink
              component="button"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToSignUp();
              }}
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Cadastre-se
            </MuiLink>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
