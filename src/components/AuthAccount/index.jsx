import { fetchAuthSession, updateUserAttributes } from "@aws-amplify/auth";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UserContext";
import { cancelSubscription } from "../../utils/functions.js";


const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function AuthAccount() {
  const navigate = useNavigate();
  const { user, attributes, loading, signOut, refreshAttributes } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [originalFirstName, setOriginalFirstName] = useState("");
  const [originalLastName, setOriginalLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // subscription info from FreeSeat_Subscriptions via GET /subscription
  const [subInfo, setSubInfo] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError] = useState("");

  // States for cancelling subscription
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);


  // Redirect if no user once loading is done
  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  // Always refresh attributes when this screen mounts/returns
  useEffect(() => {
    (async () => {
      const fresh = await refreshAttributes({ force: true });
      if (fresh) {
        setFirstName(fresh.given_name || "");
        setLastName(fresh.family_name || "");
        setOriginalFirstName(fresh.given_name || "");
        setOriginalLastName(fresh.family_name || "");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once per mount

  // Sync local fields whenever context attributes change
  useEffect(() => {
    if (!attributes) return;
    setFirstName(attributes.given_name || "");
    setLastName(attributes.family_name || "");
    setOriginalFirstName(attributes.given_name || "");
    setOriginalLastName(attributes.family_name || "");
  }, [attributes]);

  // Fetch subscription from your backend (FreeSeat_Subscriptions)
  useEffect(() => {
    if (!user) return;

    let alive = true;

    (async () => {
      try {
        setSubLoading(true);
        setSubError("");

        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) {
          throw new Error("You must be signed in to view your subscription.");
        }

        const res = await fetch(`${API_BASE}/subscription`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Subscription load failed (${res.status}): ${text}`);
        }

        const data = await res.json();
        if (!alive) return;

        // data shape from your lambda:
        // { user_id, plan, priceId, limits, status, currentPeriodEnd }
        setSubInfo(data);
      } catch (err) {
        console.error(err);
        if (!alive) return;
        setSubError(err.message || "Failed to load subscription info.");
        setSubInfo(null);
      } finally {
        alive && setSubLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user]);

  const norm = (s = "") => s.trim().replace(/\s+/g, " ");
  const hasChanges =
    norm(firstName) !== norm(originalFirstName) ||
    norm(lastName) !== norm(originalLastName);

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    setMessage("");

    try {
      await updateUserAttributes({
        userAttributes: {
          given_name: norm(firstName),
          family_name: norm(lastName),
        },
      });

      // Force-refresh session + attributes
      const fresh = await refreshAttributes({ force: true });

      if (fresh) {
        setFirstName(fresh.given_name || "");
        setLastName(fresh.family_name || "");
        setOriginalFirstName(fresh.given_name || "");
        setOriginalLastName(fresh.family_name || "");
      }

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

  if (loading || !user) {
    return (
      <Box sx={{ minHeight: "60dvh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // ------------- Membership info from subscription table -------------

  // Plan label (capitalize free / pro / business)
  const membershipTier = (() => {
    const code = subInfo?.plan; // "free" | "pro" | "business" from lambda
    if (!code) return "Free";
    return code.charAt(0).toUpperCase() + code.slice(1);
  })();

  // Expiry date: ISO → nice date
  const membershipExpiration = (() => {
    if (!subInfo?.currentPeriodEnd) return "—";
    try {
      const d = new Date(subInfo.currentPeriodEnd);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return subInfo.currentPeriodEnd;
    }
  })();

  const membershipStatus = subInfo?.status || "inactive";

  // Handler to cancel subscription
  const isCancelling = membershipStatus === "cancelling";
  const isPaidPlan = membershipStatus === "active" || membershipStatus === "cancelling";

  const handleCancelSubscription = async () => {
    try {
      if (cancelLoading || isCancelling) return;

      setCancelLoading(true);
      setCancelMessage("");

      const result = await cancelSubscription();

      setCancelMessage(
        `Your subscription will end on ${membershipExpiration}.`
      );

      // Refresh subscription info
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      const res = await fetch(`${API_BASE}/subscription`, {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (res.ok) setSubInfo(await res.json());

    } catch (e) {
      setCancelMessage(e.message || "Failed to cancel subscription.");
    } finally {
      setCancelLoading(false);
    }
  };

  const statusLabel = (() => {
    switch (membershipStatus) {
      // case "active":
      //   return "Active";
      case "cancelling":
        return "Active (until expiration)";
      case "canceled":
        return "Canceled";
      default:
        return "Active";
    }
  })();

  return (
    <Box
      sx={(theme) => ({
        minHeight: "80dvh",
        display: "grid",
        placeItems: "center",
      })}
    >
      <Card
        elevation={5}
        sx={{
          width: "100%",
          minWidth: { sm: 500 },
          maxWidth: 600,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { sm: 3, md: 4 } }}>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={800}>
              My Account
            </Typography>
            <Divider />

            {message && (
              <Alert
                severity={
                  message.toLowerCase().includes("success") ? "success" : "error"
                }
              >
                {message}
              </Alert>
            )}

            {subError && (
              <Alert severity="warning">
                {subError}
              </Alert>
            )}

            <TextField
              label="Email"
              value={attributes?.email || ""}
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />

            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Membership Tier"
              value={
                subLoading
                  ? "Loading…"
                  : membershipTier
              }
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />

            <TextField
              label="Membership Status"
              value={subLoading ? "Loading…" : statusLabel}
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />

            <TextField
              label="Membership Expiration"
              value={
                subLoading
                  ? "Loading…"
                  : membershipExpiration
              }
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />

            {/* Subscription actions */}
            {isPaidPlan && !isCancelling && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirmOpen(true)}
                disabled={cancelLoading}
              >
                Cancel Subscription
              </Button>
            )}



            {isCancelling && (
              <Alert severity="info">
                Your subscription will end on{" "}
                <strong>{membershipExpiration}</strong>.
              </Alert>
            )}


            {cancelMessage && (
              <Alert severity="info">
                {cancelMessage}
              </Alert>
            )}


            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={1}>
              <Button variant="outlined" color="error" onClick={handleSignOut}>
                Sign out
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving || !hasChanges}
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </Stack>
          </Stack>

          <Dialog
            open={confirmOpen}
            onClose={cancelLoading ? undefined : () => setConfirmOpen(false)}
          >
            <DialogTitle id="cancel-subscription-title">
              Cancel subscription?
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                Your <strong>{membershipTier}</strong> plan will remain active until{" "}
                <strong>{membershipExpiration}</strong>.
                <br /><br />
                You won’t be charged again, but you’ll lose access to paid features after
                this date.
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => setConfirmOpen(false)}
                disabled={cancelLoading}
              >
                Keep subscription
              </Button>

              <Button
                color="error"
                variant="contained"
                onClick={async () => {
                  setConfirmOpen(false);
                  await handleCancelSubscription();
                }}
                disabled={cancelLoading}
              >
                {cancelLoading ? "Cancelling…" : "Yes, cancel"}
              </Button>
            </DialogActions>
          </Dialog>



        </CardContent>
      </Card>
    </Box>
  );
}
