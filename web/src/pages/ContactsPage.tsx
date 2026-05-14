import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useAuthContext } from "../hooks/useAuthContext";
import { useContacts } from "../hooks/useContacts";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function ContactsPage() {
  const { userId } = useAuthContext();
  const { contacts, loading, error, createContact, updateContact } =
    useContacts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const editingContact = useMemo(
    () =>
      editingContactId
        ? contacts.find((contact) => contact.id === editingContactId) ?? null
        : null,
    [contacts, editingContactId],
  );
  const isEditing = Boolean(editingContactId);

  function handleOpenCreateModal() {
    setEditingContactId(null);
    setContactName("");
    setContactPhone("");
    setSubmitError("");
    setModalOpen(true);
  }

  function handleOpenEditModal(contactId: string, name: string, phone: string) {
    setEditingContactId(contactId);
    setContactName(name);
    setContactPhone(formatPhone(phone));
    setSubmitError("");
    setModalOpen(true);
  }

  function handleCloseModal(force = false) {
    if (saving && !force) return;
    setModalOpen(false);
    setEditingContactId(null);
    setContactName("");
    setContactPhone("");
    setSubmitError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = contactName.trim();
    const trimmedPhone = contactPhone.trim();
    const phoneDigits = trimmedPhone.replace(/\D/g, "");

    if (trimmedName.length < 2) {
      setSubmitError("Informe um nome com pelo menos 2 caracteres");
      return;
    }

    if (phoneDigits.length < 10) {
      setSubmitError("Informe um telefone valido com DDD");
      return;
    }

    setSaving(true);
    setSubmitError("");

    try {
      const payload = {
        name: trimmedName,
        phone: trimmedPhone,
      };

      if (editingContactId) {
        await updateContact(editingContactId, payload);
      } else {
        await createContact(payload);
      }

      handleCloseModal(true);
    } catch (submitActionError) {
      console.error("Contact submit error:", submitActionError);
      const message =
        submitActionError instanceof Error
          ? submitActionError.message
          : "Nao foi possivel salvar o contato";
      setSubmitError(message);
    } finally {
      setSaving(false);
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
                icon={<PeopleAltRoundedIcon />}
                label="Contatos em tempo real"
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
                Sua base de contatos acompanhada ao vivo.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 600 }}>
                Esta tela acompanha a colecao <code>contacts</code> em tempo
                real e lista apenas os contatos vinculados ao{" "}
                <code>clientId</code> do usuario logado.
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ minWidth: { md: 260 } }}>
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
                <Typography variant="caption" color="text.secondary">
                  ClientId ativo
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.75, fontFamily: "monospace", wordBreak: "break-all" }}
                >
                  {userId}
                </Typography>
              </Paper>

              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleOpenCreateModal}
                sx={{
                  py: 1.2,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  boxShadow: "0 12px 22px rgba(168, 85, 247, 0.22)",
                }}
              >
                Novo contato
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
              label: "Contatos listados",
              value: String(contacts.length).padStart(2, "0"),
              icon: <PeopleAltRoundedIcon />,
              tint: "rgba(59, 130, 246, 0.16)",
              color: "#93c5fd",
            },
            {
              label: "Com telefone",
              value: String(
                contacts.filter((contact) => contact.phone.trim()).length,
              ).padStart(2, "0"),
              icon: <ContactPhoneRoundedIcon />,
              tint: "rgba(96, 165, 250, 0.16)",
              color: "#93c5fd",
            },
            {
              label: "Estado do listener",
              value: loading ? "Sync" : error ? "Erro" : "Live",
              icon:
                loading ? (
                  <SyncRoundedIcon />
                ) : error ? (
                  <ErrorOutlineRoundedIcon />
                ) : (
                  <PersonRoundedIcon />
                ),
              tint: error
                ? "rgba(248, 113, 113, 0.16)"
                : "rgba(192, 132, 252, 0.16)",
              color: error ? "#fca5a5" : "#d8b4fe",
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
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" sx={{ mb: 0.75, fontWeight: 700 }}>
                Lista de contatos
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Atualizacao em tempo real direto do Firestore.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleOpenCreateModal}
              sx={{
                alignSelf: { xs: "flex-start", md: "center" },
                borderRadius: 2.5,
                fontWeight: 700,
                boxShadow: "0 12px 22px rgba(168, 85, 247, 0.22)",
              }}
            >
              Criar contato
            </Button>
          </Stack>

          {loading ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
              <CircularProgress />
              <Typography color="text.secondary">
                Carregando contatos em tempo real...
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
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <ErrorOutlineRoundedIcon sx={{ color: "#fca5a5" }} />
                <Typography>{error}</Typography>
              </Stack>
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
                Nenhum contato encontrado
              </Typography>
              <Typography color="text.secondary">
                Nenhum documento com <code>clientId</code> igual a este usuario
                foi retornado pela colecao <code>contacts</code>.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.5}>
              {contacts.map((contact) => (
                <Box
                  key={contact.id}
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
                    spacing={1.5}
                    sx={{ mb: 1 }}
                  >
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {contact.name || "Contato sem nome"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {contact.id}
                      </Typography>
                    </Box>
                    <Chip
                      label={contact.phone || "Sem telefone"}
                      color={contact.phone ? "primary" : "default"}
                      variant={contact.phone ? "filled" : "outlined"}
                      sx={{
                        fontWeight: 700,
                        alignSelf: { xs: "flex-start", md: "center" },
                      }}
                    />
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    clientId: {contact.clientId}
                  </Typography>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={1.5}
                    sx={{ mt: 1.25 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Telefone: {contact.phone || "Nao informado"}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditRoundedIcon />}
                      onClick={() =>
                        handleOpenEditModal(
                          contact.id,
                          contact.name,
                          contact.phone,
                        )
                      }
                      sx={{
                        alignSelf: { xs: "flex-start", md: "center" },
                        borderRadius: 2,
                        fontWeight: 700,
                      }}
                    >
                      Editar
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>

      <Modal open={modalOpen} onClose={() => handleCloseModal()}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(100% - 32px, 560px)",
            outline: "none",
          }}
        >
          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "rgba(20, 21, 30, 0.96)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 32px 64px rgba(0, 0, 0, 0.42)",
            }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h5" sx={{ mb: 0.75, fontWeight: 700 }}>
                  {isEditing ? "Editar contato" : "Novo contato"}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Cada contato salva apenas <code>name</code>, <code>phone</code>{" "}
                  e <code>clientId</code>, mantendo o isolamento por cliente.
                </Typography>
              </Box>

              {submitError && <Alert severity="error">{submitError}</Alert>}

              <TextField
                fullWidth
                label="Nome do contato"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                disabled={saving}
                autoFocus
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <TextField
                fullWidth
                label="Telefone"
                value={contactPhone}
                onChange={(e) => setContactPhone(formatPhone(e.target.value))}
                disabled={saving}
                placeholder="(11) 99999-9999"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <TextField
                fullWidth
                label="ClientId"
                value={userId ?? ""}
                disabled
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              {isEditing && editingContact && (
                <Typography variant="caption" color="text.secondary">
                  Editando o documento {editingContact.id}
                </Typography>
              )}

              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button
                  variant="text"
                  onClick={() => handleCloseModal()}
                  disabled={saving}
                  sx={{ fontWeight: 700 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={18} /> : undefined}
                  sx={{
                    borderRadius: 2.2,
                    fontWeight: 700,
                    boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
                  }}
                >
                  {isEditing ? "Salvar alteracoes" : "Criar contato"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
}
