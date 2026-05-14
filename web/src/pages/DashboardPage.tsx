import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { useAuthContext } from "../hooks/useAuthContext";

export default function DashboardPage() {
  const { user, userId } = useAuthContext();
  const displayName = user?.displayName?.trim() || "";

  const highlights = [
    {
      title: "Campanhas",
      value: "12",
      description: "Estruture disparos por jornada e acompanhe entregas.",
      icon: <CampaignRoundedIcon />,
    },
    {
      title: "Contatos",
      value: "2.4k",
      description: "Mantenha sua base pronta para segmentar e reengajar.",
      icon: <PeopleAltRoundedIcon />,
    },
    {
      title: "Performance",
      value: "98.2%",
      description: "Visualize qualidade operacional e ritmo da operação.",
      icon: <InsightsRoundedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100%",
        overflow: "hidden",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        backgroundImage:
          "radial-gradient(720px 360px at 0% 0%, rgba(168, 85, 247, 0.2), transparent), radial-gradient(680px 320px at 100% 100%, rgba(59, 130, 246, 0.14), transparent)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(168, 85, 247, 0.16)",
          filter: "blur(72px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -140,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(59, 130, 246, 0.12)",
          filter: "blur(72px)",
          pointerEvents: "none",
        }}
      />

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
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ justifyContent: "space-between" }}
          >
            <Box sx={{ maxWidth: 640 }}>
              <Chip
                icon={<BoltRoundedIcon />}
                label="Painel operacional"
                color="primary"
                sx={{ mb: 2, fontWeight: 700 }}
              />
              <Typography
                variant="h3"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  lineHeight: 1.05,
                }}
              >
                {displayName
                  ? `Bem-vindo de volta, ${displayName}.`
                  : "Bem-vindo de volta."}
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                Organize campanhas, acompanhe sua base e mantenha a operação de
                broadcast com uma visão mais clara do que importa hoje.
              </Typography>
            </Box>

            <Stack
              spacing={1.5}
              sx={{
                minWidth: { md: 260 },
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={{
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
                }}
              >
                Nova campanha
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ py: 1.25, borderRadius: 2.5, fontWeight: 700 }}
              >
                Importar contatos
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {highlights.map((item) => (
            <Paper
              key={item.title}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                background:
                  "linear-gradient(180deg, rgba(31, 32, 40, 0.96) 0%, rgba(22, 23, 29, 0.96) 100%)",
              }}
            >
              <Stack spacing={2}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: "rgba(192, 132, 252, 0.16)",
                    color: "primary.light",
                    borderRadius: 2.5,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {item.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ mt: 0.5, fontWeight: 700, letterSpacing: "-0.03em" }}
                  >
                    {item.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.6fr) minmax(320px, 0.9fr)",
            },
            gap: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "rgba(20, 21, 30, 0.72)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
              Ritmo da operação
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Use esse painel para manter o time focado nas próximas ações do
              fluxo de broadcast.
            </Typography>

            <Stack spacing={1.5}>
              {[
                "Criar uma campanha com mensagem e janela de envio.",
                "Atualizar sua base com novos contatos segmentados.",
                "Revisar performance e ajustar horários de disparo.",
              ].map((item, index) => (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "rgba(192, 132, 252, 0.18)",
                      color: "primary.light",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    0{index + 1}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              background:
                "linear-gradient(180deg, rgba(34, 36, 47, 0.96) 0%, rgba(24, 25, 34, 0.98) 100%)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              Identidade da sessão
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 2.5 }}>
              Referência rápida do usuário autenticado neste workspace.
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Usuário
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {displayName || "Nome não definido"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body2">
                  {user?.email || "Não informado"}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mb: 0.75,
                    color: "text.secondary",
                  }}
                >
                  UID
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {userId}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
