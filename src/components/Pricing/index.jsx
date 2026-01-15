import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import { fetchAuthSession } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const viewport = { once: true, amount: 0.25 };
const containerStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};
const itemUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const PLANS = [
  {
    code: "free",
    label: "Free",
    annualPrice: 0,
    description: "Perfect for trying FreeSeat with a small event.",
    features: [
      "Up to 1 event",
      "Up to 50 guests per event",
      "QR table finder",
      "Limited support",
    ],
    highlight: false,
  },
  {
    code: "pro",
    label: "Pro",
    annualPrice: 29.99,
    description: "Great for regular events, parties and small weddings.",
    features: ["Up to 10 events", "Up to 300 guests per event", "Priority support"],
    highlight: true,
  },
  {
    code: "business",
    label: "Business",
    annualPrice: 149.99,
    description: "For planners and venues running many events.",
    features: [
      "Up to 50 events",
      "Up to 1,000 guests per event",
      "All Pro features",
      "Premium support",
    ],
    highlight: false,
  },
];

function formatAud(amount, isFree = false) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: isFree ? 0 : 2,
  }).format(amount);
}

function formatMonthlyFromAnnual(annualPrice) {
  const monthly = annualPrice / 12;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(monthly);
}

export function PricingPage() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  // Load subscription (if logged in)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingPlan(true);

        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) {
          if (!alive) return;
          setIsAuthed(false);
          setPlan(null);
          return;
        }

        setIsAuthed(true);

        const res = await fetch(`${API_BASE}/subscription`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!res.ok) throw new Error("Failed to load subscription");

        const data = await res.json();
        if (alive) setPlan(data);
      } catch (e) {
        console.error(e);
        if (alive) {
          setIsAuthed(false);
          setPlan(null);
        }
      } finally {
        alive && setLoadingPlan(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const currentPlanCode = isAuthed ? plan?.plan || "free" : null;
  const currentPlanLabel =
    PLANS.find((p) => p.code === currentPlanCode)?.label || "Free";

  // Start checkout
  const handleSelectPlan = async (planCode) => {
    if (!isAuthed) {
      navigate("/login?redirect=/pricing");
      return;
    }
    if (planCode === currentPlanCode || planCode === "free") return;

    try {
      setCheckoutLoading(planCode);

      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/billing/checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ plan: planCode }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      console.error(e);
      setError(e.message);
      setCheckoutLoading(null);
    }
  };

  return (
    <Box
      id="pricing"
      sx={{
        minHeight: "80vh",
        py: { xs: 10, md: 6 },
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={4}>
          <Stack spacing={1} alignItems="center" mb={1} textAlign="center">
            <Typography variant="h4" fontWeight={800}>
              Simple, scalable pricing
            </Typography>
            <Typography color="text.secondary">
              Prices in AUD. Upgrade as your guest list grows. All plans include QR publishing and instant search.
            </Typography>
          </Stack>

          {loadingPlan ? (
            <Stack mt={2} direction="row" justifyContent="center" spacing={1}>
              <CircularProgress size={20} />
              <Typography>Loading your plan…</Typography>
            </Stack>
          ) : isAuthed ? (
            <Chip
              icon={<StarIcon />}
              label={`Current plan: ${currentPlanLabel}`}
              sx={{ mt: 2 }}
            />
          ) : (
            <></>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Plans */}
        <Grid
          container
          spacing={3}
          alignItems="stretch"
          justifyContent="center"
          component={motion.div}
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {PLANS.map((p) => {
            const isFree = p.code === "free";
            const freeCta = !isAuthed && isFree;
            const isCurrent = isAuthed && p.code === currentPlanCode;
            const isLoading = checkoutLoading === p.code;

            const label = isCurrent
              ? "Current plan"
              : isLoading
                ? "Redirecting…"
                : isFree
                  ? freeCta
                    ? "Start for free"
                    : "Included"
                  : "Select plan";

            const onClick = () => {
              if (freeCta) navigate("/login?redirect=/pricing");
              else handleSelectPlan(p.code);
            };

            const showBillingLine = !isFree;

            return (
              <Grid size={{ xs: 12, md: 4 }} key={p.code}>
                <Card
                  component={motion.div}
                  variants={itemUp}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: "2px solid",
                    borderColor: p.highlight ? "primary.main" : "divider",
                    boxSizing: "border-box",
                    boxShadow: p.highlight ? 6 : "none",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <Typography variant="h5" fontWeight={800}>
                        {p.label}
                      </Typography>
                      {p.highlight && <Chip size="small" color="primary" label="Popular" />}
                    </Stack>

                    {/* Price display */}
                    {isFree ? (
                      <>
                        <Typography variant="h4" fontWeight={800}>
                          {formatAud(0, p.code === "free")}
                          <Typography
                            component="span"
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            forever
                          </Typography>
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="h4"
                          fontWeight={800}
                          sx={{ display: "flex", alignItems: "baseline", gap: 1 }}
                        >
                          {formatMonthlyFromAnnual(p.annualPrice)}
                          <Typography component="span" variant="subtitle2" color="text.secondary">
                            /month
                          </Typography>
                        </Typography>

                        {showBillingLine && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Billed annually ({formatAud(p.annualPrice)} AUD/year)
                          </Typography>
                        )}
                      </>
                    )}

                    <Typography mt={1} color="text.secondary">
                      {p.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box component="ul" sx={{ pl: 0, listStyle: "none", m: 0 }}>
                      {p.features.map((f) => (
                        <Box
                          component="li"
                          key={f}
                          sx={{
                            display: "flex",
                            gap: 1,
                            mb: 0.75,
                            alignItems: "center",
                          }}
                        >
                          <CheckIcon fontSize="small" />
                          <Typography variant="body2">{f}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2 }}>
                    {/* Small policy reminder under buttons */}
                    {!isFree && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", textAlign: "center", mt: 1 }}
                      >
                        Cancel anytime • Access until period end
                      </Typography>
                    )}
                    <Button
                      fullWidth
                      variant={p.highlight ? "contained" : "outlined"}
                      disabled={!freeCta && (isCurrent || isLoading)}
                      onClick={onClick}
                    >
                      {label}
                    </Button>

                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}