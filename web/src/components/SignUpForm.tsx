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
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { translateError } from "../lib/errors";

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthContext();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!displayName.trim()) {
      setError("Nome é obrigatório");
      return false;
    }
    if (displayName.trim().length < 2) {
      setError("Nome deve ter no mínimo 2 caracteres");
      return false;
    }
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
    if (password !== confirmPassword) {
      setError("Senhas não correspondem");
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
      await signUp(email, password, displayName);
      navigate("/");
    } catch (err: unknown) {
      const appError = translateError(err);
      console.error("Sign up error:", appError.code, appError.originalError);
      setError(appError.userMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="w-full">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
          Criar conta
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure seu acesso e comece a enviar campanhas.
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          fullWidth
          label="Nome completo"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={loading}
          autoComplete="name"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <PersonOutlineRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
        />

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
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
        />

        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="new-password"
          helperText="Mínimo 6 caracteres"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
        />

        <TextField
          fullWidth
          label="Confirmar senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          autoComplete="new-password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
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
          {loading ? <CircularProgress size={24} /> : "Cadastrar"}
        </Button>

        <Box className="text-center">
          <Typography variant="body2" color="text.secondary">
            Já tem conta?{" "}
            <MuiLink
              component="button"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Entre aqui
            </MuiLink>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
