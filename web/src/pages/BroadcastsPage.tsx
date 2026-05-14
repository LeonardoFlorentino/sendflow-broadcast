import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";

const broadcastMetrics = [
  {
    label: "Campanhas ativas",
    value: "08",
    description: "Disparos com janela aberta e monitoramento em tempo real.",
    icon: <CampaignRoundedIcon />,
  },
  {
    label: "Taxa media",
    value: "94%",
    description: "Conversao consolidada das ultimas campanhas em execucao.",
    icon: <TrendingUpRoundedIcon />,
  },
  {
    label: "Proximo envio",
    value: "17:30",
    description: "Horario reservado para o bloco prioritario de hoje.",
    icon: <ScheduleRoundedIcon />,
  },
];

const pipeline = [
  {
    name: "Black Friday VIP",
    status: "Agendada",
    audience: "1.280 contatos",
    window: "Hoje, 17:30 - 19:00",
  },
  {
    name: "Reativacao leads mornos",
    status: "Em revisao",
    audience: "840 contatos",
    window: "Amanha, 09:00 - 12:00",
  },
  {
    name: "Pos-venda premium",
    status: "Rodando",
    audience: "320 contatos",
    window: "Agora - 16:40",
  },
];

export default function BroadcastsPage() {
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
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="space-between"
          >
            <Box sx={{ maxWidth: 700 }}>
              <Chip
                icon={<AutoAwesomeRoundedIcon />}
                label="Broadcast design"
                color="primary"
                sx={{ mb: 2, fontWeight: 700 }}
              />
              <Typography
                variant="h3"
                sx={{
                  mb: 1.25,
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "2.7rem" },
                  lineHeight: 1.05,
                }}
              >
                Campanhas com mais leitura, ritmo e controle.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 600 }}>
                Estruture seus broadcasts com uma visao que destaca prioridade,
                janelas de disparo e a proxima melhor acao para o time.
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ minWidth: { md: 250 } }}>
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
                Criar broadcast
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ py: 1.25, borderRadius: 2.5, fontWeight: 700 }}
              >
                Ver historico
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {broadcastMetrics.map((metric) => (
            <Paper
              key={metric.label}
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
                  {metric.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                    {metric.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {metric.description}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.45fr) minmax(320px, 0.8fr)" },
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
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              Pipeline de campanhas
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Uma leitura mais executiva do que esta em andamento no momento.
            </Typography>

            <Stack spacing={1.5}>
              {pipeline.map((item) => (
                <Box
                  key={item.name}
                  sx={{
                    p: 2.25,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                    sx={{ mb: 1.25 }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight={700}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.audience}
                      </Typography>
                    </Box>
                    <Chip
                      label={item.status}
                      color={item.status === "Rodando" ? "success" : "primary"}
                      variant={item.status === "Em revisao" ? "outlined" : "filled"}
                      sx={{ fontWeight: 700, alignSelf: { xs: "flex-start", md: "center" } }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Janela operacional: {item.window}
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
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Proximos ajustes
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 2.5 }}>
              Pontos rapidos para elevar a consistencia dos disparos.
            </Typography>

            <Stack spacing={1.5}>
              {[
                "Revisar textos da campanha VIP antes da janela das 17:30.",
                "Separar contatos com ultima interacao acima de 30 dias.",
                "Monitorar a campanha pos-venda durante o pico de respostas.",
              ].map((item, index) => (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "rgba(255,255,255,0.03)",
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
        </Box>
      </Stack>
    </Box>
  );
}
