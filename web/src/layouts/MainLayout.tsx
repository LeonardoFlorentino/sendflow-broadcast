import { useMemo, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { useAuthContext } from "../hooks/useAuthContext";

const DRAWER_WIDTH = 308;

const navItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: <DashboardOutlinedIcon />,
    caption: "Visao geral da operacao",
  },
  {
    label: "Broadcasts",
    to: "/broadcasts",
    icon: <CampaignOutlinedIcon />,
    caption: "Campanhas, janelas e performance",
  },
  {
    label: "Contatos",
    to: "/contacts",
    icon: <PeopleOutlinedIcon />,
    caption: "Base, segmentos e importacao",
  },
];

const pageMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  "/": {
    eyebrow: "Resumo do dia",
    title: "Sua operacao em movimento",
    description: "Acompanhe campanhas, contatos e ajustes em um painel mais claro e estrategico.",
  },
  "/broadcasts": {
    eyebrow: "Centro de campanhas",
    title: "Broadcasts em destaque",
    description: "Gerencie disparos com mais contexto, leitura rapida e proximos passos visiveis.",
  },
  "/contacts": {
    eyebrow: "Base ativa",
    title: "Relacionamento pronto para crescer",
    description: "Organize contatos, identifique segmentos quentes e mantenha a base sempre utilizavel.",
  },
  "/settings": {
    eyebrow: "Conta e seguranca",
    title: "Preferencias do workspace",
    description: "Atualize seu perfil e proteja o acesso com a mesma linguagem visual do painel.",
  },
};

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.displayName?.trim() || "Operador";
  const pageInfo = pageMeta[location.pathname] ?? pageMeta["/"];
  const currentSection = useMemo(
    () => navItems.find((item) => location.pathname === item.to)?.label ?? "Painel",
    [location.pathname],
  );

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        p: 2,
        background:
          "linear-gradient(180deg, rgba(18, 19, 27, 0.98) 0%, rgba(12, 13, 20, 0.98) 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(30, 31, 43, 0.94) 0%, rgba(18, 19, 27, 0.98) 100%)",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.32)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "relative",
            px: 2.5,
            pt: 2.5,
            pb: 2,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -44,
              right: -36,
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: "rgba(168, 85, 247, 0.2)",
              filter: "blur(28px)",
              pointerEvents: "none",
            }}
          />
          <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                variant="rounded"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "rgba(192, 132, 252, 0.16)",
                  color: "primary.light",
                  borderRadius: 3,
                }}
              >
                <BoltRoundedIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  SendFlow
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Broadcast control center
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                p: 1.75,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              <Chip
                size="small"
                label="Workspace ativo"
                color="primary"
                sx={{ mb: 1.25, fontWeight: 700 }}
              />
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
                {pageInfo.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {pageInfo.description}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <List component="nav" sx={{ flex: 1, p: 1.5 }}>
          {navItems.map(({ label, to, icon, caption }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className="no-underline"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {({ isActive }) => (
                <ListItemButton
                  selected={isActive}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    mb: 1,
                    minHeight: 64,
                    alignItems: "flex-start",
                    borderRadius: 3,
                    px: 1.5,
                    py: 1.25,
                    color: isActive ? "common.white" : "text.secondary",
                    transition: "all 0.22s ease",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: "text.primary",
                    },
                    "&.Mui-selected": {
                      bgcolor: "rgba(192, 132, 252, 0.18)",
                      color: "common.white",
                      border: "1px solid rgba(192, 132, 252, 0.26)",
                      boxShadow: "0 18px 36px rgba(168, 85, 247, 0.18)",
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "rgba(192, 132, 252, 0.22)",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.25 }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={label}
                    secondary={caption}
                    primaryTypographyProps={{ fontWeight: 700, fontSize: 15 }}
                    secondaryTypographyProps={{
                      sx: {
                        mt: 0.35,
                        color: isActive ? "rgba(255,255,255,0.74)" : "text.secondary",
                        fontSize: 12.5,
                        lineHeight: 1.35,
                      },
                    }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          ))}
        </List>

        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <NavLink
            to="/settings"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (
              <ListItemButton
                selected={isActive}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  mb: 1,
                  borderRadius: 3,
                  color: isActive ? "common.white" : "text.secondary",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)", color: "text.primary" },
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "common.white",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Configuracoes"
                  secondary="Perfil, seguranca e preferencias"
                  primaryTypographyProps={{ fontWeight: 700 }}
                  secondaryTypographyProps={{ color: "text.secondary", fontSize: 12.5 }}
                />
              </ListItemButton>
            )}
          </NavLink>

          <ButtonBase
            onClick={handleSignOut}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              borderRadius: 3,
              px: 1.75,
              py: 1.5,
              color: "text.secondary",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.05)",
                color: "text.primary",
              },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LogoutOutlinedIcon fontSize="small" />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body2" fontWeight={700}>
                  Sair
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Encerrar a sessao atual
                </Typography>
              </Box>
            </Stack>
          </ButtonBase>
        </Box>

        {user && (
          <Box
            sx={{
              mt: "auto",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              p: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                p: 1.25,
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              <Avatar
                src={user.photoURL ?? undefined}
                alt={user.displayName ?? user.email ?? ""}
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "primary.main",
                  boxShadow: "0 10px 20px rgba(168, 85, 247, 0.24)",
                }}
              >
                {(user.displayName ?? user.email ?? "?")[0].toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.email}
                </Typography>
              </Box>
              <ArrowOutwardRoundedIcon sx={{ color: "text.secondary", fontSize: 18 }} />
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #12131a 0%, #0d0e15 100%)",
      }}
    >
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              border: 0,
              background: "transparent",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              border: 0,
              background: "transparent",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box sx={{ display: "flex", minWidth: 0, flex: 1, flexDirection: "column" }}>
        {isMobile && (
          <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{
              backdropFilter: "blur(16px)",
              backgroundColor: "rgba(13, 14, 21, 0.78)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Toolbar sx={{ minHeight: 72 }}>
              <Tooltip title="Abrir menu">
                <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Box sx={{ ml: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {pageInfo.eyebrow}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {currentSection}
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: "auto",
            backgroundImage:
              "radial-gradient(680px 340px at 100% 0%, rgba(168, 85, 247, 0.08), transparent), radial-gradient(620px 300px at 0% 100%, rgba(59, 130, 246, 0.07), transparent)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
