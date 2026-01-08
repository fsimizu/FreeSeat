// src/pages/Verify.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmEmailCode, startEmailOtpSignIn } from "../../utils/functions";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Stack,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export function AuthVerify() {
  const navigate = useNavigate();

  // Change this to 6 if you switch to a custom 6-digit flow
  const CODE_LENGTH = 8;

  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0); // seconds

  // 60s cooldown after resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const focusNext = (index) => {
    const next = inputsRef.current[index + 1];
    if (next) next.focus();
  };
  const focusPrev = (index) => {
    const prev = inputsRef.current[index - 1];
    if (prev) prev.focus();
  };

  const handleChange = (value, index) => {
    setError("");
    const v = value.replace(/\D/g, ""); // keep only digits
    setCode((prev) => {
      const copy = [...prev];
      copy[index] = v.slice(-1);
      return copy;
    });
    if (v) focusNext(index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      e.preventDefault();
      setCode((prev) => {
        const copy = [...prev];
        copy[index - 1] = "";
        return copy;
      });
      focusPrev(index);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusPrev(index);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusNext(index);
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!text) return;
    e.preventDefault();
    const chars = text.split("");
    setCode((prev) => {
      const copy = [...prev];
      for (let i = 0; i < CODE_LENGTH; i++) copy[i] = chars[i] || "";
      return copy;
    });
    // focus last filled
    const idx = Math.min(text.length, CODE_LENGTH) - 1;
    if (idx >= 0) inputsRef.current[idx]?.focus();
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Missing email. Go back and enter your email again.");
      return;
    }
    const joined = code.join("");
    if (joined.length !== CODE_LENGTH) {
      setError(`Enter the ${CODE_LENGTH}-digit code.`);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await confirmEmailCode(joined);
      if (res?.isSignedIn) {
        navigate("/events");
      } else {
        setError("Could not complete sign-in. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Missing email. Go back and enter your email again.");
      return;
    }
    try {
      setResending(true);
      setError("");
      await startEmailOtpSignIn(email);
      setCooldown(60);
    } catch (err) {
      console.error(err);
      setError("Couldn’t resend the code. Please try again shortly.");
    } finally {
      setResending(false);
    }
  };

  const editEmail = () => navigate("/login");

  return (
    <Container
      maxWidth="xs"
      sx={{
        py: { xs: 4, md: 6 },
        // px: 0,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Verify your email
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            We sent a {CODE_LENGTH}-digit code to{" "}
            <strong>{email || "your email"}</strong>.
          </Typography>
          <IconButton
            aria-label="Use a different email"
            size="small"
            onClick={editEmail}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box component="form" onSubmit={handleConfirm} noValidate>
          <Stack spacing={2}>
            <Box
              onPaste={handlePaste}
              sx={{
                display: "flex",
                gap: { xs: 0.8, sm: 1.5 },
                justifyContent: "center",
                mt: 1,
                mb: 0.5,
              }}
            >
              {code.map((v, i) => (
                <Box
                  key={i}
                  component="input"
                  type="text"
                  inputMode="numeric"
                  aria-label={`Digit ${i + 1}`}
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  // pattern is handled by our own sanitiser; keeping it here for mobile keyboards:
                  pattern="\d{1}"
                  maxLength={1}
                  value={v}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => (inputsRef.current[i] = el)}
                  sx={{
                    // width: { xs: 30, sm: 36, md: 48 },
                    width: "10vw" , 
                    maxWidth: 38,
                    height: { xs: 44, sm: 50 , md: 56 },
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 600,
                    caretColor: "transparent",
                    outline: "none",
                    "&:focus": {
                      borderColor: "primary.main",
                      boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}22`,
                    },
                  }}
                />
              ))}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 0.5 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                height: 44,
                borderRadius: 2,
                fontWeight: 700,
                position: "relative",
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                "Verify & Sign in"
              )}
            </Button>
          </Stack>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent={{ xs: "flex-start", sm: "space-between" }}
        >
          <Button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            {resending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </Button>

          <Button variant="text" onClick={editEmail} sx={{ ml: { sm: 1 } }}>
            Use a different email
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
