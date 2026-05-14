import { useMemo, useState } from "react";
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
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useConnections } from "../hooks/useConnections";
import { useAuthContext } from "../hooks/useAuthContext";

export default function ConnectionsPage() {
  const { userId } = useAuthContext();
  const {
    connections,
    loading,
    error,
    createConnection,
    updateConnection,
    deleteConnection,
  } = useConnections();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(
    null,
  );
  const [deletingConnectionId, setDeletingConnectionId] = useState<string | null>(
    null,
  );
  const [connectionName, setConnectionName] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const activeConnections = connections.filter(
    (connection) => connection.status?.toLowerCase() === "connected",
  ).length;
  const editingConnection = useMemo(
    () =>
      editingConnectionId
        ? connections.find((connection) => connection.id === editingConnectionId)
        : null,
    [connections, editingConnectionId],
  );
  const deletingConnection = useMemo(
    () =>
      deletingConnectionId
        ? connections.find(
            (connection) => connection.id === deletingConnectionId,
          ) ?? null
        : null,
    [connections, deletingConnectionId],
  );
  const isEditing = Boolean(editingConnectionId);

  function handleOpenCreateModal() {
    setEditingConnectionId(null);
    setConnectionName("");
    setSubmitError("");
    setModalOpen(true);
  }

  function handleOpenEditModal(connectionId: string, name?: string) {
    setEditingConnectionId(connectionId);
    setConnectionName(name ?? "");
    setSubmitError("");
    setModalOpen(true);
  }

  function handleCloseModal(force = false) {
    if (saving && !force) return;
    setModalOpen(false);
    setEditingConnectionId(null);
    setConnectionName("");
    setSubmitError("");
  }

  function handleOpenDeleteDialog(connectionId: string) {
    setDeletingConnectionId(connectionId);
    setDeleteError("");
  }

  function handleCloseDeleteDialog(force = false) {
    if (deleting && !force) return;
    setDeletingConnectionId(null);
    setDeleteError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = connectionName.trim();
    if (trimmedName.length < 2) {
      setSubmitError("Informe um nome com pelo menos 2 caracteres");
      return;
    }

    setSaving(true);
    setSubmitError("");

    try {
      if (editingConnectionId) {
        await updateConnection(editingConnectionId, trimmedName);
      } else {
        await createConnection(trimmedName);
      }

      handleCloseModal(true);
    } catch (submitActionError) {
      console.error("Connection submit error:", submitActionError);
      const message =
        submitActionError instanceof Error
          ? submitActionError.message
          : "Nao foi possivel salvar a conexao";
      setSubmitError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingConnection) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteConnection({
        id: deletingConnection.id,
        clientId: deletingConnection.clientId,
      });
      handleCloseDeleteDialog(true);
    } catch (deleteActionError) {
      console.error("Connection delete error:", deleteActionError);
      const message =
        deleteActionError instanceof Error
          ? deleteActionError.message
          : "Nao foi possivel excluir a conexao";
      setDeleteError(message);
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
          "radial-gradient(720px 360px at 0% 0%, rgba(16, 185, 129, 0.14), transparent), radial-gradient(620px 320px at 100% 100%, rgba(59, 130, 246, 0.12), transparent)",
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
                icon={<HubRoundedIcon />}
                label="Conexoes em tempo real"
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
                Visibilidade instantanea das conexoes do cliente.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 600 }}>
                Esta tela acompanha a colecao <code>connections</code> em tempo
                real com filtro obrigatorio por <code>clientId</code> do usuario
                logado.
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ minWidth: { md: 260 } }}>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleOpenCreateModal}
                sx={{
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  boxShadow: "0 12px 22px rgba(168, 85, 247, 0.25)",
                }}
              >
                Nova conexao
              </Button>
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
              label: "Conexoes listadas",
              value: String(connections.length).padStart(2, "0"),
              icon: <LinkRoundedIcon />,
              tint: "rgba(59, 130, 246, 0.16)",
              color: "#93c5fd",
            },
            {
              label: "Ativas",
              value: String(activeConnections).padStart(2, "0"),
              icon: <CheckCircleRoundedIcon />,
              tint: "rgba(16, 185, 129, 0.16)",
              color: "#6ee7b7",
            },
            {
              label: "Estado do listener",
              value: loading ? "Sync" : error ? "Erro" : "Live",
              icon: loading ? <SyncRoundedIcon /> : error ? <ErrorOutlineRoundedIcon /> : <HubRoundedIcon />,
              tint: error ? "rgba(248, 113, 113, 0.16)" : "rgba(192, 132, 252, 0.16)",
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
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
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
              <Typography variant="h5" fontWeight={700} sx={{ mb: 0.75 }}>
                Lista de conexoes
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Atualizacao em tempo real direto do Firestore com criacao e
                edicao por modal.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.25}>
              <Button
                variant="outlined"
                disabled
                sx={{ borderRadius: 2.5, fontWeight: 700 }}
              >
                Listener ativo
              </Button>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={handleOpenCreateModal}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                  boxShadow: "0 12px 22px rgba(168, 85, 247, 0.22)",
                }}
              >
                Criar conexao
              </Button>
            </Stack>
          </Stack>

          {loading ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
              <CircularProgress />
              <Typography color="text.secondary">
                Carregando conexoes em tempo real...
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
              <Stack direction="row" spacing={1.5} alignItems="center">
                <ErrorOutlineRoundedIcon sx={{ color: "#fca5a5" }} />
                <Typography>{error}</Typography>
              </Stack>
            </Paper>
          ) : connections.length === 0 ? (
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
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Nenhuma conexao encontrada
              </Typography>
              <Typography color="text.secondary">
                Nenhum documento com <code>clientId</code> igual a este usuario
                foi retornado pela colecao <code>connections</code>.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.5}>
              {connections.map((connection) => (
                <Box
                  key={connection.id}
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
                      <Typography variant="body1" fontWeight={700}>
                        {connection.name || connection.phone || "Conexao sem nome"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {connection.id}
                      </Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
                    >
                      <Chip
                        label={connection.status || "Sem status"}
                        color={
                          connection.status?.toLowerCase() === "connected"
                            ? "success"
                            : "default"
                        }
                        variant={
                          connection.status?.toLowerCase() === "connected"
                            ? "filled"
                            : "outlined"
                        }
                        sx={{ fontWeight: 700 }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditRoundedIcon />}
                        onClick={() =>
                          handleOpenEditModal(connection.id, connection.name)
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
                        onClick={() => handleOpenDeleteDialog(connection.id)}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                      >
                        Excluir
                      </Button>
                    </Stack>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    clientId: {connection.clientId}
                  </Typography>
                  {connection.phone && (
                    <Typography variant="body2" color="text.secondary">
                      Telefone: {connection.phone}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(100% - 32px, 520px)",
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
                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.75 }}>
                  {isEditing ? "Editar conexao" : "Nova conexao"}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Apenas os campos <code>name</code> e <code>clientId</code>{" "}
                  serao persistidos na colecao <code>connections</code>.
                </Typography>
              </Box>

              {submitError && <Alert severity="error">{submitError}</Alert>}

              <TextField
                fullWidth
                label="Nome da conexao"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
                disabled={saving}
                autoFocus
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              <TextField
                fullWidth
                label="ClientId"
                value={userId ?? ""}
                disabled
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2 } }}
              />

              {isEditing && editingConnection && (
                <Typography variant="caption" color="text.secondary">
                  Editando o documento {editingConnection.id}
                </Typography>
              )}

              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button
                  variant="text"
                  onClick={handleCloseModal}
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
                  {isEditing ? "Salvar alteracoes" : "Criar conexao"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Modal>

      <Dialog
        open={Boolean(deletingConnectionId)}
        onClose={() => handleCloseDeleteDialog()}
        PaperProps={{
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
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          Confirmar exclusao
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText sx={{ color: "text.secondary" }}>
              {deletingConnection
                ? `Tem certeza que deseja excluir a conexao "${deletingConnection.name || "Sem nome"}"?`
                : "Tem certeza que deseja excluir esta conexao?"}
            </DialogContentText>
            <DialogContentText sx={{ color: "text.secondary" }}>
              Esta acao remove o documento da colecao <code>connections</code> e
              nao pode ser desfeita.
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
              deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteOutlineRoundedIcon />
            }
            sx={{ borderRadius: 2.2, fontWeight: 700 }}
          >
            Excluir conexao
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
