import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmsRoundedIcon from "@mui/icons-material/SmsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  type MessageHistoryItem,
  type MessageHistoryStatus,
  useMessagesHistory,
} from "../hooks/useMessagesHistory";
import { useMessages } from "../hooks/useMessages";
import { useContacts } from "../hooks/useContacts";

function formatScheduledAt(value: Date | null): string {
  if (!value) {
    return "Sem data definida";
  }

  return dayjs(value).format("DD/MM/YYYY HH:mm");
}

export default function MessagesHistoryPage() {
  const [status, setStatus] = useState<MessageHistoryStatus>("scheduled");
  const { messages, loading, error } = useMessagesHistory(status);
  const { contacts } = useContacts();
  const { updateMessage, deleteMessage } = useMessages();

  const [editingMessage, setEditingMessage] =
    useState<MessageHistoryItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editScheduledAt, setEditScheduledAt] = useState<Dayjs | null>(null);
  const [editContactIds, setEditContactIds] = useState<string[]>([]);
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingMessage, setDeletingMessage] =
    useState<MessageHistoryItem | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const contactsById = useMemo(
    () => new Map(contacts.map((contact) => [contact.id, contact])),
    [contacts],
  );

  function handleOpenEdit(message: MessageHistoryItem) {
    setEditingMessage(message);
    setEditContent(message.content);
    setEditScheduledAt(
      message.scheduledAt ? dayjs(message.scheduledAt.toDate()) : dayjs(),
    );
    setEditContactIds(message.contactIds);
    setEditError("");
  }

  function handleCloseEdit(force = false) {
    if (savingEdit && !force) return;
    setEditingMessage(null);
    setEditContent("");
    setEditScheduledAt(null);
    setEditContactIds([]);
    setEditError("");
  }

  function toggleEditContact(contactId: string) {
    setEditContactIds((current) =>
      current.includes(contactId)
        ? current.filter((id) => id !== contactId)
        : [...current, contactId],
    );
  }

  async function handleSaveEdit() {
    if (!editingMessage) return;

    if (editContactIds.length === 0) {
      setEditError("Selecione pelo menos um contato");
      return;
    }

    if (!editContent.trim()) {
      setEditError("Escreva o conteúdo da mensagem");
      return;
    }

    if (!editScheduledAt) {
      setEditError("Defina a data e o horário do agendamento");
      return;
    }

    setSavingEdit(true);
    setEditError("");

    try {
      await updateMessage(editingMessage.id, {
        contactIds: editContactIds,
        content: editContent,
        scheduledAt: editScheduledAt.toDate(),
      });
      handleCloseEdit(true);
    } catch (updateError) {
      console.error("Message update error:", updateError);
      const errorMessage =
        updateError instanceof Error
          ? updateError.message
          : "Não foi possível atualizar a mensagem";
      setEditError(errorMessage);
    } finally {
      setSavingEdit(false);
    }
  }

  function handleOpenDelete(message: MessageHistoryItem) {
    setDeletingMessage(message);
    setDeleteError("");
  }

  function handleCloseDelete(force = false) {
    if (deleting && !force) return;
    setDeletingMessage(null);
    setDeleteError("");
  }

  async function handleConfirmDelete() {
    if (!deletingMessage) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteMessage(deletingMessage.id);
      handleCloseDelete(true);
    } catch (deleteActionError) {
      console.error("Message delete error:", deleteActionError);
      const errorMessage =
        deleteActionError instanceof Error
          ? deleteActionError.message
          : "Não foi possível excluir a mensagem";
      setDeleteError(errorMessage);
    } finally {
      setDeleting(false);
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
            sx={{ justifyContent: "space-between" }}
          >
            <Box sx={{ maxWidth: 700 }}>
              <Chip
                icon={<HistoryRoundedIcon />}
                label="Histórico de mensagens"
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
                Acompanhe envios agendados e mensagens já enviadas.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                Os filtros abaixo consultam o Firestore por <code>status</code>{" "}
                e exibem somente as mensagens do cliente autenticado.
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ minWidth: { md: 260 } }}>
              <Button
                variant={status === "scheduled" ? "contained" : "outlined"}
                startIcon={<ScheduleRoundedIcon />}
                onClick={() => setStatus("scheduled")}
                sx={{
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  boxShadow:
                    status === "scheduled"
                      ? "0 12px 22px rgba(168, 85, 247, 0.25)"
                      : "none",
                }}
              >
                Agendadas
              </Button>
              <Button
                variant={status === "sent" ? "contained" : "outlined"}
                startIcon={<SendRoundedIcon />}
                onClick={() => setStatus("sent")}
                sx={{
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  boxShadow:
                    status === "sent"
                      ? "0 12px 22px rgba(168, 85, 247, 0.25)"
                      : "none",
                }}
              >
                Enviadas
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
          {[
            {
              label: "Mensagens listadas",
              value: String(messages.length).padStart(2, "0"),
              icon: <SmsRoundedIcon />,
              tint: "rgba(59, 130, 246, 0.16)",
              color: "#93c5fd",
            },
            {
              label: "Destinatários totais",
              value: String(
                messages.reduce(
                  (total, message) => total + message.contactIds.length,
                  0,
                ),
              ).padStart(2, "0"),
              icon: <PeopleAltRoundedIcon />,
              tint: "rgba(16, 185, 129, 0.16)",
              color: "#6ee7b7",
            },
            {
              label: "Filtro ativo",
              value: status === "scheduled" ? "Agendadas" : "Enviadas",
              icon:
                status === "scheduled" ? (
                  <ScheduleRoundedIcon />
                ) : (
                  <SendRoundedIcon />
                ),
              tint: "rgba(192, 132, 252, 0.16)",
              color: "#d8b4fe",
            },
          ].map((metric) => (
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
                    bgcolor: metric.tint,
                    color: metric.color,
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
              </Stack>
            </Paper>
          ))}
        </Box>

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
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 0.75, fontWeight: 700 }}>
              {status === "scheduled"
                ? "Mensagens agendadas"
                : "Mensagens enviadas"}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Histórico filtrado com query do Firestore por status e clientId.
            </Typography>
          </Box>

          {loading ? (
            <Stack spacing={2} sx={{ py: 6, alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "rgba(192, 132, 252, 0.18)" }}>
                {status === "scheduled" ? (
                  <ScheduleRoundedIcon />
                ) : (
                  <SendRoundedIcon />
                )}
              </Avatar>
              <Typography color="text.secondary">
                Carregando histórico de mensagens...
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
          ) : messages.length === 0 ? (
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
                Nenhuma mensagem encontrada
              </Typography>
              <Typography color="text.secondary">
                Não há mensagens com status{" "}
                <code>{status === "scheduled" ? "scheduled" : "sent"}</code>{" "}
                para este cliente.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.5}>
              {messages.map((message) => {
                const scheduledDate = message.scheduledAt?.toDate() ?? null;
                const isScheduled = message.status === "scheduled";

                return (
                  <Box
                    key={message.id}
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
                      sx={{ mb: 1.25, justifyContent: "space-between" }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 700, mb: 0.5 }}
                        >
                          {message.content}
                        </Typography>
                      </Box>
                      <Chip
                        label={isScheduled ? "Agendada" : "Enviada"}
                        color={isScheduled ? "primary" : "success"}
                        variant="filled"
                        sx={{
                          fontWeight: 700,
                          alignSelf: { xs: "flex-start", md: "center" },
                        }}
                      />
                    </Stack>

                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      sx={{ color: "text.secondary", mb: 1.5 }}
                    >
                      <Typography variant="body2">
                        Destinatários: {message.contactIds.length}
                      </Typography>
                      <Typography variant="body2">
                        Agendamento: {formatScheduledAt(scheduledDate)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: "wrap", rowGap: 1 }}
                    >
                      {isScheduled && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditRoundedIcon />}
                          onClick={() => handleOpenEdit(message)}
                          sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                          Editar
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineRoundedIcon />}
                        onClick={() => handleOpenDelete(message)}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                      >
                        Excluir
                      </Button>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Paper>
      </Stack>

      <Modal
        open={Boolean(editingMessage)}
        onClose={() => handleCloseEdit()}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(100% - 32px, 640px)",
            outline: "none",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "rgba(20, 21, 30, 0.96)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 32px 64px rgba(0, 0, 0, 0.42)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h5" sx={{ mb: 0.75, fontWeight: 700 }}>
                  Editar mensagem agendada
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Ajuste o conteúdo, destinatários e horário antes do disparo.
                </Typography>
              </Box>

              {editError && <Alert severity="error">{editError}</Alert>}

              <TextField
                fullWidth
                multiline
                minRows={5}
                label="Mensagem"
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                disabled={savingEdit}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <DateTimePicker
                label="Data e horário do agendamento"
                value={editScheduledAt}
                onChange={(value) => setEditScheduledAt(value)}
                disabled={savingEdit}
                minDateTime={dayjs()}
                ampm={false}
                format="DD/MM/YYYY HH:mm"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: 2.2 } },
                  },
                }}
              />

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>
                  Destinatários ({editContactIds.length})
                </Typography>
                {contacts.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum contato disponível para seleção.
                  </Typography>
                ) : (
                  <Stack
                    spacing={0.75}
                    sx={{
                      maxHeight: 220,
                      overflowY: "auto",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 1,
                    }}
                  >
                    {contacts.map((contact) => {
                      const checked = editContactIds.includes(contact.id);
                      return (
                        <Box
                          key={contact.id}
                          onClick={() => toggleEditContact(contact.id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1,
                            borderRadius: 1.5,
                            cursor: "pointer",
                            backgroundColor: checked
                              ? "rgba(192, 132, 252, 0.1)"
                              : "transparent",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.04)",
                            },
                          }}
                        >
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleEditContact(contact.id)}
                            onClick={(event) => event.stopPropagation()}
                            size="small"
                          />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                              noWrap
                            >
                              {contact.name || "Contato sem nome"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                            >
                              {contact.phone || "Telefone não informado"}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
                {editingMessage &&
                  editingMessage.contactIds.some(
                    (id) => !contactsById.has(id),
                  ) && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      Alguns destinatários originais foram excluídos da base.
                    </Typography>
                  )}
              </Box>

              <Stack
                direction="row"
                spacing={1.5}
                sx={{ justifyContent: "flex-end" }}
              >
                <Button
                  variant="text"
                  onClick={() => handleCloseEdit()}
                  disabled={savingEdit}
                  sx={{ fontWeight: 700 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  startIcon={
                    savingEdit ? <CircularProgress size={18} /> : undefined
                  }
                  sx={{
                    borderRadius: 2.2,
                    fontWeight: 700,
                    boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
                  }}
                >
                  Salvar alterações
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Modal>

      <Dialog
        open={Boolean(deletingMessage)}
        onClose={() => handleCloseDelete()}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "rgba(20, 21, 30, 0.96)",
              backdropFilter: "blur(16px)",
              backgroundImage: "none",
              minWidth: { xs: "calc(100% - 32px)", sm: 440 },
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          Confirmar exclusão
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText sx={{ color: "text.secondary" }}>
              Tem certeza que deseja excluir esta mensagem? Esta ação remove o
              documento da coleção <code>messages</code> e não pode ser
              desfeita.
            </DialogContentText>
            {deleteError && <Alert severity="error">{deleteError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => handleCloseDelete()}
            disabled={deleting}
            sx={{ fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <DeleteOutlineRoundedIcon />
              )
            }
            sx={{ borderRadius: 2.2, fontWeight: 700 }}
          >
            Excluir mensagem
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
