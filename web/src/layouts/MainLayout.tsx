import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { useAuthContext } from "../hooks/useAuthContext";

const DRAWER_WIDTH = 286;
const COLLAPSED_DRAWER_WIDTH = 88;

const pageMeta: Record<string, { title: string; caption: string }> = {
  "/": { title: "Dashboard", caption: "Visão geral da operação" },
  "/broadcasts": {
    title: "Broadcasts",
    caption: "Campanhas, janelas e performance",
  },
  "/broadcasts/history": {
    title: "Histórico de mensagens",
    caption: "Envios recentes e status de entrega",
  },
  "/contacts": {
    title: "Contatos",
    caption: "Base, segmentos e importação",
  },
  "/connections": {
    title: "Conexões",
    caption: "Integrações e estado em tempo real",
  },
  "/settings": {
    title: "Configurações",
    caption: "Perfil, segurança e preferências",
  },
};

const navItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: <DashboardOutlinedIcon />,
    caption: "Visão geral da operação",
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
    caption: "Base, segmentos e importação",
  },
  {
    label: "Conexões",
    to: "/connections",
    icon: <HubOutlinedIcon />,
    caption: "Integrações e estado em tempo real",
  },
];

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage =
    pageMeta[location.pathname] ?? {
      title: "SendFlow",
      caption: "Central de broadcasts",
    };
  const displayName = user?.displayName?.trim() || "Operador";
  const isCollapsed = isMobile || isMediumScreen || desktopCollapsed;
  const drawerWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, rgba(23, 24, 34, 0.995) 0%, rgba(15, 16, 24, 1) 100%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Box
        sx={{
          px: isCollapsed ? 1.25 : 2,
          pt: 2,
          pb: 1.25,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          {!isMobile && (
            <Tooltip title={isCollapsed ? "Expandir menu" : "Recolher menu"}>
              <IconButton
                onClick={() => setDesktopCollapsed((current) => !current)}
                aria-label="Alternar menu"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  color: "text.secondary",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List component="nav" sx={{ flex: 1, px: 1, py: 1.25 }}>
        {navItems.map(({ label, to, icon, caption }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className="no-underline"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (
              <Tooltip
                title={isCollapsed ? label : ""}
                placement="right"
                disableHoverListener={!isCollapsed}
              >
                <ListItemButton
                  selected={isActive}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    mb: 0.75,
                    minHeight: 56,
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    alignItems: "center",
                    px: isCollapsed ? 0 : 1.25,
                    py: 1.1,
                    borderRadius: 1,
                    color: isActive ? "common.white" : "text.secondary",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: "text.primary",
                    },
                    "&.Mui-selected": {
                      bgcolor: "rgba(192, 132, 252, 0.16)",
                      color: "common.white",
                      borderLeft: "3px solid rgba(192, 132, 252, 0.85)",
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "rgba(192, 132, 252, 0.2)",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? "auto" : 38,
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={label}
                      secondary={caption}
                      slotProps={{
                        primary: {
                          sx: {
                            fontWeight: 700,
                            fontSize: 15,
                          },
                        },
                        secondary: {
                          sx: {
                            mt: 0.3,
                            color: isActive
                              ? "rgba(255,255,255,0.72)"
                              : "text.secondary",
                            fontSize: 12.5,
                            lineHeight: 1.35,
                          },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            )}
          </NavLink>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <Box sx={{ px: 1, py: 1.25 }}>
        <NavLink
          to="/settings"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {({ isActive }) => (
            <Tooltip
              title={isCollapsed ? "Configurações" : ""}
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <ListItemButton
                selected={isActive}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  mb: 0.75,
                  minHeight: 56,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  px: isCollapsed ? 0 : 1.25,
                  borderRadius: 1,
                  color: isActive ? "common.white" : "text.secondary",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.05)",
                    color: "text.primary",
                  },
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "common.white",
                    borderLeft: "3px solid rgba(255,255,255,0.42)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? "auto" : 38,
                    justifyContent: "center",
                    color: "inherit",
                  }}
                >
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary="Configurações"
                    secondary="Perfil, segurança e preferências"
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: 700,
                        },
                      },
                      secondary: {
                        sx: {
                          color: "text.secondary",
                          fontSize: 12.5,
                        },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          )}
        </NavLink>

        <Tooltip
          title={isCollapsed ? "Sair" : ""}
          placement="right"
          disableHoverListener={!isCollapsed}
        >
          <ButtonBase
            onClick={handleSignOut}
            sx={{
              width: "100%",
              justifyContent: isCollapsed ? "center" : "flex-start",
              px: isCollapsed ? 0 : 1.25,
              py: 1.4,
              borderRadius: 1,
              color: "text.secondary",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.05)",
                color: "text.primary",
              },
            }}
          >
            <Stack
              direction="row"
              spacing={isCollapsed ? 0 : 1.25}
              sx={{ alignItems: "center" }}
            >
              <LogoutOutlinedIcon fontSize="small" />
              {!isCollapsed && (
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Sair
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Encerrar a sessão atual
                  </Typography>
                </Box>
              )}
            </Stack>
          </ButtonBase>
        </Tooltip>
      </Box>

      {user && (
        <>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
          <Box sx={{ p: isCollapsed ? 1 : 1.5 }}>
            <Tooltip
              title={isCollapsed ? `${displayName} • ${user.email}` : ""}
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <Box
                sx={{
                  minHeight: 56,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  px: isCollapsed ? 0 : 1,
                  py: isCollapsed ? 0 : 0.5,
                  backgroundColor: "rgba(255,255,255,0.025)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={isCollapsed ? 0 : 1.25}
                  sx={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                  }}
                >
                  <Avatar
                    src={user.photoURL ?? undefined}
                    alt={user.displayName ?? user.email ?? ""}
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: "primary.main",
                      boxShadow: "0 10px 20px rgba(168, 85, 247, 0.24)",
                      mx: isCollapsed ? "auto" : 0,
                    }}
                  >
                    {(user.displayName ?? user.email ?? "?")[0].toUpperCase()}
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ fontWeight: 700 }}
                        >
                          {displayName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <ArrowOutwardRoundedIcon
                        sx={{ color: "text.secondary", fontSize: 18 }}
                      />
                    </>
                  )}
                </Stack>
              </Box>
            </Tooltip>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #12131a 0%, #0d0e15 100%)",
      }}
    >
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          transition: "width 0.22s ease",
        }}
      >
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
              background: "rgba(15, 16, 24, 1)",
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
              width: drawerWidth,
              boxSizing: "border-box",
              border: 0,
              background: "rgba(15, 16, 24, 1)",
              transition: "width 0.22s ease",
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        sx={{
          display: "flex",
          minWidth: 0,
          flex: 1,
          flexDirection: "column",
        }}
      >
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            backdropFilter: "blur(16px)",
            backgroundColor: "rgba(13, 14, 21, 0.88)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Toolbar
            sx={{
              minHeight: { xs: 76, lg: 82 },
              px: { xs: 2, md: 3, lg: 4 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, md: 2, lg: 3 },
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ minWidth: 0, alignItems: "center", flexShrink: 0 }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "rgba(192, 132, 252, 0.16)",
                  color: "primary.light",
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              >
                <BoltRoundedIcon fontSize="small" />
              </Avatar>
              <Box sx={{ minWidth: 0, display: { xs: "none", sm: "block" } }}>
                <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
                  SendFlow
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  Central de broadcasts
                </Typography>
              </Box>
            </Stack>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                my: 1.5,
                borderColor: "rgba(255,255,255,0.08)",
              }}
            />

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="subtitle1"
                noWrap
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {currentPage.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {currentPage.caption}
              </Typography>
            </Box>

            {isMobile && (
              <Tooltip title="Abrir menu">
                <IconButton
                  edge="end"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Abrir menu"
                  sx={{ flexShrink: 0 }}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>

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
