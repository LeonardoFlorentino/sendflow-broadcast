import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { translateError } from "../lib/errors";
import { PasswordField } from "./PasswordField";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

export function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const [submitError, setSubmitError] = useState("");
  const { signIn } = useAuthContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormData) {
    setSubmitError("");
    try {
      await signIn(data.email, data.password);
      navigate("/");
    } catch (err: unknown) {
      const appError = translateError(err);
      console.error("Sign in error:", appError.code, appError.originalError);
      setSubmitError(appError.userMessage);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
          Entrar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Acesse sua conta para gerenciar campanhas.
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <TextField
          fullWidth
          label="Email"
          type="email"
          disabled={isSubmitting}
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register("email")}
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

        <PasswordField
          fullWidth
          label="Senha"
          disabled={isSubmitting}
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register("password")}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2.2 },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          size="large"
          sx={{
            mt: 0.5,
            py: 1.4,
            borderRadius: 2.2,
            fontWeight: 700,
            boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
          }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Entrar"}
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
