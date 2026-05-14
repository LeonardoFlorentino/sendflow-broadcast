import { createTheme } from "@mui/material/styles";

/**
 * SendFlow base theme
 *
 * Brand colors:
 *  Primary  — #aa3bff (violet, light mode) / #c084fc (dark mode)
 *  Secondary — #08060d (near-black)
 */
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c084fc",
      light: "#d8b4fe",
      dark: "#aa3bff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9ca3af",
      light: "#f3f4f6",
      dark: "#6b7280",
      contrastText: "#ffffff",
    },
    background: {
      default: "#16171d",
      paper: "#1f2028",
    },
    text: {
      primary: "#f3f4f6",
      secondary: "#9ca3af",
    },
    divider: "#2e303a",
  },
  typography: {
    fontFamily: ["system-ui", "'Segoe UI'", "Roboto", "sans-serif"].join(","),
    h1: {
      fontSize: "3.5rem",
      fontWeight: 500,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.18,
      letterSpacing: "-0.01em",
    },
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
  cssVariables: true,
});

export default theme;
