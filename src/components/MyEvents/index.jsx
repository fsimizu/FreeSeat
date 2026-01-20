import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Fab,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../utils/functions.js";
import { CreateEventDialog } from "../CreateEventDialog/index.jsx";
import { MyEventsCard } from "../MyEventsCard/index.jsx";
import { PricingPage } from "../Pricing";

export function MyEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await getEvents();
      setEvents(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDeleted = useCallback((deletedId) => {
    setEvents((prev) => prev.filter((e) => e.eventId !== deletedId));
  }, []);

  const handleUpdated = useCallback((updated) => {
    setEvents((prev) =>
      prev.map((e) => (e.eventId === updated.eventId ? { ...e, ...updated } : e))
    );
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 2,
        py: { xs: 1, md: 3 }
      }}
    >
      <Box>
        {/* Hero */}
        <Box
          sx={{
            mb: 1,
            overflow: "hidden",
            display: "flex",
            px: 2,
            pb: 3,
            borderBottom: 1,
            borderColor: "divider",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            color="text.primary"
          >
            My Events
          </Typography>

          {/* Upgrade button */}
          <Button
            variant="outlined"
            size="small"
            sx={{
              height: 40,
              textTransform: "none",
            }}
            onClick={() => setPricingOpen(true)}
          >
            Upgrade plan
          </Button>


        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4, minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {events.length === 0 ? (
              <Box sx={{ p: 3 }}>
                <Typography color="text.secondary">
                  You don’t have any events yet. Click “Add event” to create one.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                {events.map((event) => (
                  <MyEventsCard
                    key={event.eventId}
                    event={event}
                    onClick={() => navigate(`./${event.eventId}`, { state: { event } })}
                    onDeleted={handleDeleted}
                    onUpdated={handleUpdated}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ textAlign: "right" }}>
              <Fab
                color="primary"
                variant="extended"
                onClick={() => setOpenCreate(true)}
                sx={{ px: 2.5, boxShadow: "none", borderRadius: 2 }}
              >
                <AddIcon sx={{ mr: 1 }} />
                Add event
              </Fab>

              <CreateEventDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={load}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >

        <DialogContent dividers sx={{ p: 0 }}>
          <PricingPage />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPricingOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
