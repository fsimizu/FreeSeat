// src/components/NotFound/index.jsx
import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";

// A simple inline SVG so you don’t rely on external assets
function NotFoundArt(props) {
  const theme = useTheme();
  const stroke = theme.palette.mode === "light" ? "#111827" : "#e5e7eb";
  const accent = theme.palette.primary.main;

  return (
    <Box
      aria-hidden
      sx={{ width: "100%", maxWidth: 420, mx: "auto" }}
      {...props}
    >
      <svg viewBox="0 0 600 360" width="100%" role="img">
        <title>404 illustration</title>
        <defs>
          <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={alpha(accent, 0.15)} />
            <stop offset="100%" stopColor={alpha(accent, 0.0)} />
          </linearGradient>
        </defs>

        {/* Soft background blob */}
        <ellipse cx="300" cy="180" rx="240" ry="120" fill="url(#glow)" />

        {/* 4 0 4 */}
        <g fill="none" strokeWidth="10" strokeLinecap="round" stroke={stroke}>
          <path d="M160 250 L160 130 L110 200 L210 200" />
          <circle cx="300" cy="200" r="48" stroke={accent} />
          <path d="M440 250 L440 130 L390 200 L490 200" />
        </g>

        {/* Little sparkle accents */}
        <g stroke={accent} strokeWidth="6" strokeLinecap="round">
          <path d="M60 70 L60 70" />
          <path d="M540 60 L540 60" />
          <path d="M520 300 L520 300" />
          <path d="M80 290 L80 290" />
        </g>
      </svg>
    </Box>
  );
}

export function NotFound() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        // Take available height in your <main> (which already flexes in your Layout)
        minHeight: { xs: "72dvh", md: "78dvh" },
        display: "grid",
        placeItems: "center",
        py: { xs: 4, md: 6 },
      }}
    >
      <Stack
        direction={isMdUp ? "row" : "column"}
        spacing={{ xs: 3, md: 6 }}
        alignItems="center"
        justifyContent="center"
        sx={{
          width: "100%",
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          bgcolor:
            theme.palette.mode === "light"
              ? alpha(theme.palette.grey[50], 0.9)
              : alpha(theme.palette.background.paper, 0.6),
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          boxShadow:
            theme.palette.mode === "light"
              ? "0 10px 30px rgba(0,0,0,0.05)"
              : "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <NotFoundArt />

        <Stack spacing={1.25} sx={{ textAlign: { xs: "center", md: "left" }, maxWidth: 520 }}>
          <Typography variant="overline" color="text.secondary" letterSpacing={1}>
            Error 404
          </Typography>

          <Typography variant="h4" fontWeight={800}>
            Page not found
          </Typography>

          <Typography color="text.secondary">
            The page you’re looking for doesn’t exist, moved, or the link is broken.
            You can go back or head home.
          </Typography>

          <ButtonGroup
            variant="contained"
            sx={{
              display: 'flex',
              gap: 1,
              boxShadow:'none',
              
              mt: 2,
              alignSelf: { xs: "center", md: "flex-start" },
              "& .MuiButton-root": { textTransform: "none", borderRadius: 2 },
            }}
          >
            <Button color="inherit" onClick={() => navigate(-1)} sx={{border: 'none',}}>
              Go back
            </Button>
            <Button component={Link} to="/" color="primary">
              Go home
            </Button>
            {/* <Button component={Link} to="/events" color="primary" variant="outlined">
              My events
            </Button> */}
          </ButtonGroup>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>
            If you think this is an error, please check the URL or try again later.
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
