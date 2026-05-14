import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { type Dayjs } from "dayjs";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import { useContacts } from "../hooks/useContacts";
import { useMessages } from "../hooks/useMessages";

type DeliveryMode = "now" | "schedule";

export default function BroadcastsPage() {
  const navigate = useNavigate();
  const { contacts, loading, error } = useContacts();
  const { createMessage } = useMessages();
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Dayjs | null>(null);
  const [scheduledTime, setScheduledTime] = useState<Dayjs | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const messageInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const scheduledAtInputRef = useRef<HTMLInputElement>(null);

  const scheduledAt = useMemo(() => {
    if (!scheduledDate || !scheduledTime) return null;
    return scheduledDate
      .hour(scheduledTime.hour())
      .minute(scheduledTime.minute())
      .second(0)
      .millisecond(0);
  }, [scheduledDate, scheduledTime]);

  function focusComposer(field: "message" | "schedule") {
    const target =
      field === "message"
        ? messageInputRef.current
        : scheduledAtInputRef.current;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.focus({ preventScroll: true });
  }

  const selectedContacts = useMemo(
    () => contacts.filter((contact) => selectedContactIds.includes(contact.id)),
    [contacts, selectedContactIds],
  );

  const metrics = [
    {
      label: "Contatos elegíveis",
      value: String(contacts.length).padStart(2, "0"),
      description: "Base disponível para montar o próximo disparo.",
      icon: <PeopleAltRoundedIcon />,
    },
    {
      label: "Selecionados",
      value: String(selectedContactIds.length).padStart(2, "0"),
      description: "Público atual escolhido para receber esta mensagem.",
      icon: <CheckCircleRoundedIcon />,
    },
    {
      label: "Com telefone",
      value: String(
        contacts.filter((contact) => contact.phone.trim()).length,
      ).padStart(2, "0"),
      description: "Contatos prontos para envio com número preenchido.",
      icon: <ContactPhoneRoundedIcon />,
    },
  ];

  function toggleContact(contactId: string) {
    setSelectedContactIds((current) =>
      current.includes(contactId)
        ? current.filter((id) => id !== contactId)
        : [...current, contactId],
    );
  }

  function toggleAllContacts() {
    setSelectedContactIds((current) =>
      current.length === contacts.length
        ? []
        : contacts.map((contact) => contact.id),
    );
  }

  async function saveMessage(mode: DeliveryMode) {
    if (selectedContactIds.length === 0) {
      setSubmitSuccess("");
      setSubmitError("Selecione pelo menos um contato");
      return;
    }

    if (!message.trim()) {
      setSubmitSuccess("");
      setSubmitError("Escreva o conteúdo da mensagem");
      return;
    }

    if (mode === "schedule" && !scheduledAt) {
      setSubmitSuccess("");
      setSubmitError("Defina a data e o horário do agendamento");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const scheduledDate =
        mode === "schedule" && scheduledAt
          ? scheduledAt.toDate()
          : new Date();

      await createMessage({
        contactIds: selectedContactIds,
        content: message,
        scheduledAt: scheduledDate,
      });

      setSubmitSuccess(
        mode === "schedule"
          ? "Mensagem agendada com sucesso"
          : "Mensagem salva para envio imediato",
      );
      setMessage("");
      setScheduledDate(null);
      setScheduledTime(null);
      setSelectedContactIds([]);
    } catch (submitActionError) {
      console.error("Message save error:", submitActionError);
      const errorMessage =
        submitActionError instanceof Error
          ? submitActionError.message
          : "Não foi possível salvar a mensagem";
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
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
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
            }}
          >
            <Box sx={{ maxWidth: 700 }}>
              <Chip
                icon={<AutoAwesomeRoundedIcon />}
                label="Envio de mensagens"
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
                Monte seu disparo com seleção múltipla e agenda flexível.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                Escolha contatos da base, escreva o conteúdo da mensagem e
                defina se o broadcast deve sair agora ou em um horário agendado.
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ minWidth: { md: 280 } }}>
              <Button
                variant="contained"
                startIcon={<SendRoundedIcon />}
                onClick={() => focusComposer("message")}
                sx={{
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
                }}
              >
                Enviar Agora
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarMonthRoundedIcon />}
                onClick={() => focusComposer("schedule")}
                sx={{
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 700,
                }}
              >
                Agendar
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/broadcasts/history")}
                sx={{
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 700,
                }}
              >
                Ver histórico
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
          {metrics.map((metric, index) => (
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
                    bgcolor:
                      index === 0
                        ? "rgba(59, 130, 246, 0.16)"
                        : index === 1
                          ? "rgba(16, 185, 129, 0.16)"
                          : "rgba(192, 132, 252, 0.16)",
                    color:
                      index === 0
                        ? "#93c5fd"
                        : index === 1
                          ? "#6ee7b7"
                          : "#d8b4fe",
                    borderRadius: 2.5,
                  }}
                >
                  {metric.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 700 }}>
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
            gridTemplateColumns: {
              xs: "1fr",
              xl: "minmax(0, 1.1fr) minmax(360px, 0.9fr)",
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
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ mb: 3, justifyContent: "space-between" }}
            >
              <Box>
                <Typography variant="h5" sx={{ mb: 0.75, fontWeight: 700 }}>
                  Seleção de contatos
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Marque múltiplos contatos da lista para compor o público do
                  envio.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={toggleAllContacts}
                disabled={loading || contacts.length === 0}
                sx={{
                  alignSelf: { xs: "flex-start", md: "center" },
                  fontWeight: 700,
                }}
              >
                {selectedContactIds.length === contacts.length &&
                contacts.length > 0
                  ? "Limpar seleção"
                  : "Selecionar todos"}
              </Button>
            </Stack>

            {loading ? (
              <Stack spacing={2} sx={{ py: 6, alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "rgba(192, 132, 252, 0.18)" }}>
                  <ScheduleRoundedIcon />
                </Avatar>
                <Typography color="text.secondary">
                  Carregando contatos disponíveis...
                </Typography>
              </Stack>
            ) : error ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "rgba(248, 113, 113, 0.06)",
                }}
              >
                <Typography>{error}</Typography>
              </Paper>
            ) : contacts.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: "1px dashed",
                  borderColor: "divider",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  Nenhum contato disponível
                </Typography>
                <Typography color="text.secondary">
                  Cadastre contatos primeiro para iniciar um envio de mensagens.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={1.25}>
                {contacts.map((contact) => {
                  const checked = selectedContactIds.includes(contact.id);

                  return (
                    <Box
                      key={contact.id}
                      onClick={() => toggleContact(contact.id)}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: checked ? "primary.main" : "divider",
                        backgroundColor: checked
                          ? "rgba(192, 132, 252, 0.1)"
                          : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: checked
                            ? "rgba(192, 132, 252, 0.14)"
                            : "rgba(255,255,255,0.04)",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                      >
                        <Checkbox
                          checked={checked}
                          onChange={() => toggleContact(contact.id)}
                          onClick={(event) => event.stopPropagation()}
                        />
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: "rgba(59, 130, 246, 0.16)",
                            color: "#93c5fd",
                          }}
                        >
                          {(contact.name || "?")[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            {contact.name || "Contato sem nome"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {contact.phone || "Telefone não informado"}
                          </Typography>
                        </Box>
                        <Chip
                          label={checked ? "Selecionado" : "Disponível"}
                          color={checked ? "primary" : "default"}
                          variant={checked ? "filled" : "outlined"}
                          sx={{ fontWeight: 700 }}
                        />
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            )}
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
            <Typography variant="h5" sx={{ mb: 0.75, fontWeight: 700 }}>
              Conteúdo da mensagem
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 2.5 }}>
              Escreva a mensagem e defina como este broadcast deve ser enviado.
            </Typography>

            <Stack spacing={2}>
              {submitError && <Alert severity="error">{submitError}</Alert>}
              {submitSuccess && (
                <Alert severity="success">{submitSuccess}</Alert>
              )}

              <TextField
                fullWidth
                multiline
                minRows={8}
                label="Mensagem"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (submitError) setSubmitError("");
                  if (submitSuccess) setSubmitSuccess("");
                }}
                placeholder="Escreva a mensagem que será enviada para os contatos selecionados..."
                inputRef={messageInputRef}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
              >
                <DatePicker
                  label="Data (opcional)"
                  value={scheduledDate}
                  onChange={(value) => {
                    setScheduledDate(value);
                    if (submitError) setSubmitError("");
                    if (submitSuccess) setSubmitSuccess("");
                  }}
                  minDate={dayjs().startOf("day")}
                  format="DD/MM/YYYY"
                  inputRef={scheduledAtInputRef}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        "& .MuiPickersInputBase-root": { borderRadius: 2.2 },
                        "& .MuiPickersSectionList-root": { cursor: "text" },
                      },
                    },
                  }}
                />
                <TimePicker
                  label="Horário"
                  value={scheduledTime}
                  onChange={(value) => {
                    setScheduledTime(value);
                    if (submitError) setSubmitError("");
                    if (submitSuccess) setSubmitSuccess("");
                  }}
                  ampm={false}
                  format="HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        "& .MuiPickersInputBase-root": { borderRadius: 2.2 },
                        "& .MuiPickersSectionList-root": { cursor: "text" },
                      },
                    },
                  }}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Preencha data e horário para agendar. Deixe em branco para
                usar o botão Enviar Agora.
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              >
                <Stack spacing={1.25}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Resumo do envio
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Destinatários: {selectedContacts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conteúdo: {message.trim().length} caracteres
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agendamento:{" "}
                    {scheduledAt
                      ? scheduledAt.format("DD/MM/YYYY HH:mm")
                      : "Envio imediato"}
                  </Typography>
                </Stack>
              </Paper>

              <Divider />

              <Stack spacing={1.5}>
                <Button
                  variant="contained"
                  startIcon={<SendRoundedIcon />}
                  onClick={() => saveMessage("now")}
                  disabled={
                    submitting ||
                    selectedContacts.length === 0 ||
                    !message.trim()
                  }
                  sx={{
                    py: 1.2,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
                  }}
                >
                  Enviar Agora
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CalendarMonthRoundedIcon />}
                  onClick={() => saveMessage("schedule")}
                  disabled={
                    submitting ||
                    selectedContacts.length === 0 ||
                    !message.trim() ||
                    !scheduledAt
                  }
                  sx={{
                    py: 1.2,
                    borderRadius: 2.5,
                    fontWeight: 700,
                  }}
                >
                  Agendar
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
