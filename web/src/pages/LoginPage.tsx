import { useState } from "react";
import { Box, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";
import { FirebaseConfigAlert } from "../components/FirebaseConfigAlert";
import { isFirebaseConfigured } from "../firebaseConfig";

export default function LoginPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  if (!isFirebaseConfigured) {
    return <FirebaseConfigAlert />;
  }

  return (
    <Box
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      sx={{
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(900px 480px at 10% 0%, rgba(168, 85, 247, 0.24), transparent), radial-gradient(700px 420px at 90% 100%, rgba(59, 130, 246, 0.14), transparent)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          top: -120,
          left: -80,
          background: "rgba(168, 85, 247, 0.22)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          bottom: -120,
          right: -100,
          background: "rgba(59, 130, 246, 0.2)",
          filter: "blur(72px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "rgba(20, 21, 30, 0.7)",
            backdropFilter: "blur(14px)",
            p: { xs: 3, md: 5 },
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 6 }}
          >
            <Box sx={{ flex: 1, pr: { md: 2 } }}>
              <Chip
                icon={<BoltRoundedIcon />}
                label="SendFlow Broadcast"
                color="primary"
                variant="filled"
                sx={{ mb: 2, fontWeight: 700 }}
              />
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                Mensagens em escala, sem atrito
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 380 }}>
                Centralize campanhas, contatos e performance em um painel único.
                Faça login para continuar seu fluxo.
              </Typography>
            </Box>

            <Box sx={{ width: "100%", maxWidth: 430 }}>
              {showSignUp ? (
                <SignUpForm onSwitchToLogin={() => setShowSignUp(false)} />
              ) : (
                <LoginForm onSwitchToSignUp={() => setShowSignUp(true)} />
              )}
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
