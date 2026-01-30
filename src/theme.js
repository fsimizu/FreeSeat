// src/theme.js
import { createTheme } from "@mui/material/styles";


export const getTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#6C63FF" },
      secondary: { main: "#4F46E5" },

      ...(mode === "light"
        ? {
            background: { default: "#F9FAFB", paper: "#FFFFFF", },
            text: { primary: "#111827", secondary: "#374151" },
          }
        : {
            background: { default: "#0B1220", paper: "#111827", },
            text: { primary: "#E5E7EB", secondary: "#9CA3AF", },
          }),
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h4: { fontWeight: 700 },
    },
  });


