import { Container, Box, Alert, Button, Typography, Link } from "@mui/material";

export function FirebaseConfigAlert() {
  return (
    <Box
      className="flex min-h-screen items-center justify-center"
      sx={{ bgcolor: "background.default" }}
    >
      <Container maxWidth="sm">
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Firebase não configurado
          </Typography>
          <Typography variant="body2" paragraph>
            Para usar a autenticação, você precisa configurar as variáveis de
            ambiente do Firebase.
          </Typography>
          <ol style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
            <li>
              <Typography variant="body2">
                Acesse o{" "}
                <Link
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener"
                >
                  Firebase Console
                </Link>
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Vá para Configurações do projeto → Geral
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Copie o objeto firebaseConfig da seção "Seus aplicativos"
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Preencha o arquivo web/.env.local com os valores correspondentes
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Reinicie o servidor de desenvolvimento com npm run dev
              </Typography>
            </li>
          </ol>
        </Alert>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => window.location.reload()}
        >
          Recarregar página
        </Button>
      </Container>
    </Box>
  );
}
