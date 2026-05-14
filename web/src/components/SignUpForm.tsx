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
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { translateError } from "../lib/errors";
import { PasswordField } from "./PasswordField";

const signUpSchema = z
  .object({
    displayName: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não correspondem",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [submitError, setSubmitError] = useState("");
  const { signUp } = useAuthContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignUpFormData) {
    setSubmitError("");
    try {
      await signUp(data.email, data.password, data.displayName);
      navigate("/");
    } catch (err: unknown) {
      const appError = translateError(err);
      console.error("Sign up error:", appError.code, appError.originalError);
      setSubmitError(appError.userMessage);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
          Criar conta
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure seu acesso e comece a enviar campanhas.
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <TextField
          fullWidth
          label="Nome completo"
          disabled={isSubmitting}
          autoComplete="name"
          error={Boolean(errors.displayName)}
          helperText={errors.displayName?.message}
          {...register("displayName")}
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
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
        />

        <PasswordField
          fullWidth
          label="Senha"
          disabled={isSubmitting}
          autoComplete="new-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message ?? "Mínimo 6 caracteres"}
          {...register("password")}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
        />

        <PasswordField
          fullWidth
          label="Confirmar senha"
          disabled={isSubmitting}
          autoComplete="new-password"
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
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
          {isSubmitting ? <CircularProgress size={24} /> : "Cadastrar"}
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
