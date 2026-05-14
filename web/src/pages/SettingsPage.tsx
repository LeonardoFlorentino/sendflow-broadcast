import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { useAuthContext } from "../hooks/useAuthContext";
import { translateError, useErrorHandler } from "../lib/errors";
import { PasswordField } from "../components/PasswordField";

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe sua senha atual"),
    newPassword: z
      .string()
      .min(6, "A nova senha deve ter no mínimo 6 caracteres"),
    confirmNewPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "A confirmação da nova senha não confere",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, updateDisplayName, updatePasswordWithConfirmation } =
    useAuthContext();
  const { showSuccess } = useErrorHandler();
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: user?.displayName ?? "" },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onProfileSubmit(data: ProfileFormData) {
    setProfileError("");
    try {
      await updateDisplayName(data.displayName);
      showSuccess("Nome atualizado com sucesso");
    } catch (error) {
      const appError = translateError(error);
      console.error("Profile update error:", appError.code, appError.originalError);
      setProfileError(appError.userMessage);
    }
  }

  async function onPasswordSubmit(data: PasswordFormData) {
    setPasswordError("");
    try {
      await updatePasswordWithConfirmation(
        data.currentPassword,
        data.newPassword,
      );
      passwordForm.reset();
      showSuccess("Senha alterada com sucesso");
    } catch (error: unknown) {
      const appError = translateError(error);
      console.error("Password update error:", appError.code, appError.originalError);
      const message =
        appError.code === "auth/invalid_credentials"
          ? "A senha atual está incorreta."
          : appError.userMessage;
      setPasswordError(message);
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100%",
        overflow: "hidden",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        backgroundImage:
          "radial-gradient(720px 360px at 0% 0%, rgba(168, 85, 247, 0.18), transparent), radial-gradient(620px 320px at 100% 100%, rgba(59, 130, 246, 0.12), transparent)",
      }}
    >
      <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "rgba(20, 21, 30, 0.72)",
            backdropFilter: "blur(14px)",
          }}
        >
          <Chip
            icon={<BadgeRoundedIcon />}
            label="Perfil e segurança"
            color="primary"
            sx={{ mb: 2, fontWeight: 700 }}
          />
          <Typography
            variant="h3"
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.6rem" },
              lineHeight: 1.05,
            }}
          >
            Gerencie os dados da sua conta
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
            Atualize seu nome de exibição e troque sua senha com confirmação da
            senha atual para manter o acesso seguro.
          </Typography>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1fr) minmax(0, 1fr)",
            },
            gap: 2,
          }}
        >
          <Paper
            elevation={0}
            component="form"
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              background:
                "linear-gradient(180deg, rgba(31, 32, 40, 0.96) 0%, rgba(22, 23, 29, 0.96) 100%)",
            }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h5" sx={{ mb: 0.75, fontWeight: 700 }}>
                  Nome do usuário
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Esse nome será exibido no dashboard e nas áreas internas do
                  sistema.
                </Typography>
              </Box>

              {profileError && <Alert severity="error">{profileError}</Alert>}

              <TextField
                fullWidth
                label="Nome completo"
                disabled={profileForm.formState.isSubmitting}
                autoComplete="name"
                error={Boolean(profileForm.formState.errors.displayName)}
                helperText={profileForm.formState.errors.displayName?.message}
                {...profileForm.register("displayName")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <TextField
                fullWidth
                label="Email"
                value={user?.email ?? ""}
                disabled
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                disabled={profileForm.formState.isSubmitting}
                sx={{
                  alignSelf: "flex-start",
                  py: 1.2,
                  px: 2.5,
                  borderRadius: 2.2,
                  fontWeight: 700,
                  boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
                }}
              >
                Salvar nome
              </Button>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            component="form"
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "rgba(20, 21, 30, 0.72)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h5" sx={{ mb: 0.75, fontWeight: 700 }}>
                  Alterar senha
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Confirme sua senha atual antes de definir uma nova senha para
                  a conta.
                </Typography>
              </Box>

              {passwordError && <Alert severity="error">{passwordError}</Alert>}

              <PasswordField
                fullWidth
                label="Senha atual"
                disabled={passwordForm.formState.isSubmitting}
                autoComplete="current-password"
                error={Boolean(passwordForm.formState.errors.currentPassword)}
                helperText={
                  passwordForm.formState.errors.currentPassword?.message
                }
                {...passwordForm.register("currentPassword")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <PasswordField
                fullWidth
                label="Nova senha"
                disabled={passwordForm.formState.isSubmitting}
                autoComplete="new-password"
                error={Boolean(passwordForm.formState.errors.newPassword)}
                helperText={
                  passwordForm.formState.errors.newPassword?.message ??
                  "Mínimo de 6 caracteres"
                }
                {...passwordForm.register("newPassword")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <PasswordField
                fullWidth
                label="Confirmar nova senha"
                disabled={passwordForm.formState.isSubmitting}
                autoComplete="new-password"
                error={Boolean(passwordForm.formState.errors.confirmNewPassword)}
                helperText={
                  passwordForm.formState.errors.confirmNewPassword?.message
                }
                {...passwordForm.register("confirmNewPassword")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <Button
                type="submit"
                variant="outlined"
                startIcon={<LockResetRoundedIcon />}
                disabled={passwordForm.formState.isSubmitting}
                sx={{
                  alignSelf: "flex-start",
                  py: 1.2,
                  px: 2.5,
                  borderRadius: 2.2,
                  fontWeight: 700,
                }}
              >
                Atualizar senha
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
