import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useAuth } from "../hooks/useAuth";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Dashboard", to: "/", icon: <DashboardOutlinedIcon /> },
  { label: "Broadcasts", to: "/broadcasts", icon: <CampaignOutlinedIcon /> },
  { label: "Contatos", to: "/contacts", icon: <PeopleOutlinedIcon /> },
];

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  const drawerContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Toolbar className="gap-2">
        <Typography variant="h6" fontWeight={700} color="primary">
          SendFlow
        </Typography>
      </Toolbar>

      <Divider />

      {/* Navigation */}
      <List component="nav" className="flex-1 px-2 py-2">
        {navItems.map(({ label, to, icon }) => (
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
                  borderRadius: 2,
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { bgcolor: "primary.dark" },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Divider />

      {/* Bottom: settings + user */}
      <List className="px-2 py-2">
        <NavLink
          to="/settings"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {({ isActive }) => (
            <ListItemButton
              selected={isActive}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SettingsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Configurações" />
            </ListItemButton>
          )}
        </NavLink>

        <ListItemButton sx={{ borderRadius: 2 }} onClick={handleSignOut}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </List>

      {/* User info */}
      {user && (
        <Box className="flex items-center gap-2 border-t px-4 py-3">
          <Avatar
            src={user.photoURL ?? undefined}
            alt={user.displayName ?? user.email ?? ""}
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: 14,
            }}
          >
            {(user.displayName ?? user.email ?? "?")[0].toUpperCase()}
          </Avatar>
          <Box className="min-w-0 flex-1">
            <Typography variant="body2" fontWeight={600} noWrap>
              {user.displayName ?? user.email}
            </Typography>
            {user.displayName && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </div>
  );

  return (
    <Box className="flex h-screen overflow-hidden">
      {/* Sidebar — permanent on md+, temporary on mobile */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
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
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main content area */}
      <Box className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        {isMobile && (
          <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Toolbar>
              <Tooltip title="Abrir menu">
                <IconButton
                  edge="start"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Abrir menu"
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Typography
                variant="h6"
                fontWeight={700}
                color="primary"
                sx={{ ml: 1 }}
              >
                SendFlow
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        <Box
          component="main"
          className="flex-1 overflow-y-auto"
          sx={{ bgcolor: "background.default" }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
