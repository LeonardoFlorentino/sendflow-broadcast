import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

const contactMetrics = [
  {
    label: "Base total",
    value: "2.4k",
    description: "Contatos organizados e prontos para campanhas segmentadas.",
    icon: <PeopleAltRoundedIcon />,
  },
  {
    label: "Qualificados",
    value: "840",
    description: "Leads com maior propensao de resposta e recompra.",
    icon: <VerifiedRoundedIcon />,
  },
  {
    label: "Novos hoje",
    value: "126",
    description: "Entradas recentes aguardando enriquecimento e tags.",
    icon: <GroupAddRoundedIcon />,
  },
];

const segments = [
  { name: "Clientes VIP", count: "320 contatos", tone: "Alta recorrencia de compra" },
  { name: "Leads mornos", count: "780 contatos", tone: "Precisam de reativacao" },
  { name: "Novos cadastros", count: "126 contatos", tone: "Entrada nas ultimas 24 horas" },
];

export default function ContactsPage() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100%",
        overflow: "hidden",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        backgroundImage:
          "radial-gradient(720px 360px at 0% 0%, rgba(59, 130, 246, 0.14), transparent), radial-gradient(620px 320px at 100% 100%, rgba(168, 85, 247, 0.14), transparent)",
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
            <Box sx={{ maxWidth: 680 }}>
              <Chip
                icon={<StarRoundedIcon />}
                label="People intelligence"
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
                Uma base de contatos mais viva e acionavel.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 600 }}>
                Visualize crescimento, segmentos principais e oportunidades de
                importacao sem cair em uma tela vazia ou burocratica.
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ minWidth: { md: 250 } }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<GroupAddRoundedIcon />}
                sx={{
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
                }}
              >
                Novo contato
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<FileUploadRoundedIcon />}
                sx={{ py: 1.25, borderRadius: 2.5, fontWeight: 700 }}
              >
                Importar lista
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
          {contactMetrics.map((metric) => (
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
                    bgcolor: "rgba(96, 165, 250, 0.16)",
                    color: "#93c5fd",
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
            gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.35fr) minmax(320px, 0.9fr)" },
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
              Segmentos em foco
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Grupos com maior valor operacional para suas proximas campanhas.
            </Typography>

            <Stack spacing={1.5}>
              {segments.map((segment) => (
                <Box
                  key={segment.name}
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
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ mb: 0.75 }}
                  >
                    <Typography variant="body1" fontWeight={700}>
                      {segment.name}
                    </Typography>
                    <Chip
                      label={segment.count}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 700, alignSelf: { xs: "flex-start", md: "center" } }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {segment.tone}
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
              Higiene da base
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 2.5 }}>
              Acoes simples para melhorar segmentacao e entregabilidade.
            </Typography>

            <Stack spacing={1.5}>
              {[
                "Padronizar tags dos contatos importados nesta semana.",
                "Validar duplicidades antes da proxima campanha de reativacao.",
                "Criar um grupo exclusivo para novos cadastros do dia.",
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
                      bgcolor: "rgba(96, 165, 250, 0.18)",
                      color: "#93c5fd",
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
