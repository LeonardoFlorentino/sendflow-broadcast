import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Alert,
  Avatar,
  Box,
  Button,
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
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useContacts } from "../hooks/useContacts";
import { translateError, useErrorHandler } from "../lib/errors";
import { ListSkeleton } from "../components/ListSkeleton";

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

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres"),
  phone: z
    .string()
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Informe um telefone válido com DDD",
    ),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactsPage() {
  const {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
  } = useContacts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [deletingContactId, setDeletingContactId] = useState<string | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const { showSuccess } = useErrorHandler();

  const {
    control,
    register,
    handleSubmit: rhfHandleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "" },
  });

  const deletingContact = useMemo(
    () =>
      deletingContactId
        ? (contacts.find((contact) => contact.id === deletingContactId) ?? null)
        : null,
    [contacts, deletingContactId],
  );

  const isEditing = Boolean(editingContactId);

  function handleOpenCreateModal() {
    setEditingContactId(null);
    reset({ name: "", phone: "" });
    setSubmitError("");
    setModalOpen(true);
  }

  function handleOpenEditModal(contactId: string, name: string, phone: string) {
    setEditingContactId(contactId);
    reset({ name, phone: formatPhone(phone) });
    setSubmitError("");
    setModalOpen(true);
  }

  function handleCloseModal(force = false) {
    if (isSubmitting && !force) return;
    setModalOpen(false);
    setEditingContactId(null);
    reset({ name: "", phone: "" });
    setSubmitError("");
  }

  async function onSubmit(data: ContactFormData) {
    setSubmitError("");
    try {
      const payload = { name: data.name, phone: data.phone.trim() };

      if (editingContactId) {
        await updateContact(editingContactId, payload);
        showSuccess("Contato atualizado com sucesso");
      } else {
        await createContact(payload);
        showSuccess("Contato criado com sucesso");
      }

      handleCloseModal(true);
    } catch (submitActionError) {
      const appError = translateError(submitActionError);
      console.error("Contact submit error:", appError.code, appError.originalError);
      setSubmitError(appError.userMessage);
    }
  }

  function handleOpenDeleteDialog(contactId: string) {
    setDeletingContactId(contactId);
    setDeleteError("");
  }

  function handleCloseDeleteDialog(force = false) {
    if (deleting && !force) return;
    setDeletingContactId(null);
    setDeleteError("");
  }

  async function handleConfirmDelete() {
    if (!deletingContact) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteContact(deletingContact.id);
      showSuccess("Contato excluído com sucesso");
      handleCloseDeleteDialog(true);
    } catch (deleteActionError) {
      const appError = translateError(deleteActionError);
      console.error("Contact delete error:", appError.code, appError.originalError);
      setDeleteError(appError.userMessage);
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
            sx={{ justifyContent: "space-between" }}
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
                Esta tela acompanha a coleção <code>contacts</code> em tempo
                real e lista apenas os contatos vinculados ao{" "}
                <code>clientId</code> do usuário logado.
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ minWidth: { md: 260 } }}>
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
              icon: loading ? (
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
            spacing={2}
            sx={{ mb: 3, justifyContent: "space-between" }}
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
            <ListSkeleton rows={4} height={80} />
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
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
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
                Nenhum documento com <code>clientId</code> igual a este usuário
                foi retornado pela coleção <code>contacts</code>.
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
                    spacing={1.5}
                    sx={{ mb: 1, justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {contact.name || "Contato sem nome"}
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

                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    sx={{ mt: 1.25, justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Telefone: {contact.phone || "Não informado"}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
                    >
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
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineRoundedIcon />}
                        onClick={() => handleOpenDeleteDialog(contact.id)}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                      >
                        Excluir
                      </Button>
                    </Stack>
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
            onSubmit={rhfHandleSubmit(onSubmit)}
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
                  Cada contato salva apenas <code>name</code>,{" "}
                  <code>phone</code> e <code>clientId</code>, mantendo o
                  isolamento por cliente.
                </Typography>
              </Box>

              {submitError && <Alert severity="error">{submitError}</Alert>}

              <TextField
                fullWidth
                label="Nome do contato"
                disabled={isSubmitting}
                autoFocus
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                {...register("name")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={field.value}
                    onChange={(e) => field.onChange(formatPhone(e.target.value))}
                    onBlur={field.onBlur}
                    name={field.name}
                    inputRef={field.ref}
                    disabled={isSubmitting}
                    placeholder="(11) 99999-9999"
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
                  />
                )}
              />

              <Stack
                direction="row"
                spacing={1.5}
                sx={{ justifyContent: "flex-end" }}
              >
                <Button
                  variant="text"
                  onClick={() => handleCloseModal()}
                  disabled={isSubmitting}
                  sx={{ fontWeight: 700 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size={18} /> : undefined
                  }
                  sx={{
                    borderRadius: 2.2,
                    fontWeight: 700,
                    boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
                  }}
                >
                  {isEditing ? "Salvar alterações" : "Criar contato"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Modal>

      <Dialog
        open={Boolean(deletingContactId)}
        onClose={() => handleCloseDeleteDialog()}
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
              {deletingContact
                ? `Tem certeza que deseja excluir o contato "${deletingContact.name || "Sem nome"}"?`
                : "Tem certeza que deseja excluir este contato?"}
            </DialogContentText>
            <DialogContentText sx={{ color: "text.secondary" }}>
              Esta ação remove o documento da coleção <code>contacts</code> e
              não pode ser desfeita.
            </DialogContentText>
            {deleteError && <Alert severity="error">{deleteError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => handleCloseDeleteDialog()}
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
            Excluir contato
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
