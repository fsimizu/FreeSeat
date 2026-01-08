import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getEvent, getGuests } from "../../utils/functions.js";
import { EventQR } from "../EventQR/index.jsx";
import { EventGuestGrid } from "../GuestList";
import { AddToCalendarButton } from '../AddToCalendarButton/index.jsx';
import { PricingPage } from "../Pricing";


export function MyEvent() {
  const navigate = useNavigate()
  const { state } = useLocation();
  const { eventId } = useParams(); // route must be "/events/:id"
  const eventFromState = state?.event || null;
  const [evt, setEvt] = useState(eventFromState);    // store selected event
  const [loading, setLoading] = useState(!eventFromState);
  const [error, setError] = useState("");
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [guests, setGuests] = useState(undefined);
  const [errorGuests, setErrorGuests] = useState("");

  const [pricingOpen, setPricingOpen] = useState(false);

  useEffect(() => {
    if (eventFromState) return; // we already have it from navigation state

    (async () => {
      try {
        setLoading(true);
        const fetched = await getEvent(eventId); // fetch once on hard refresh
        setEvt(fetched);
      } catch (e) {
        setError(e.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventFromState, eventId]);

  useEffect(() => {
    async function loadGuests() {
      try {
        setLoadingGuests(true);
        const list = await getGuests(eventId);
        setGuests(list ?? []);
      } catch (err) {
        setErrorGuests(err.message || "Failed to load guests");
        setGuests([]);
      } finally {
        setLoadingGuests(false);
      }
    }
    loadGuests();
  }, [eventId]);

  const noCapsButton = {
    '& .MuiButton-label': {
      textTransform: 'none',
    },
    textTransform: 'none',
    boxShadow: 'none',
  }

  const handleOpenMap = () => {
    if (evt?.location)
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.location)}`, "_blank");
  };

  return (
    <Container
      maxWidth="lg"
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        py: { xs: 1, md: 3 },
      }}
    >
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>


        {/* Top bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
            px: 2,
          }}
        >
          {/* Back button */}
          <IconButton onClick={() => navigate(-1)}>
            <KeyboardBackspaceIcon />
          </IconButton>

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


        {/* Header */}
        <Box
          sx={{
            mb: 2.5,
            px: 2,
            pb: 4,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
            {evt?.eventTitle || "Event"}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 1 }}>
            <AddToCalendarButton evt={evt} noCapsButton={noCapsButton} />

            <Button
              startIcon={<LocationPinIcon />}
              onClick={handleOpenMap}
              variant="contained"
              color="inherit"
              sx={noCapsButton}
            >
              {evt?.location || "No location specified"}
            </Button>
          </Box>
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: 2,
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            evt && (
              <Box sx={{
                display: "flex", alignItems: "flex-start",
                gap: { xs: 2, md: 8 },
                flexDirection: { xs: "column", md: "row" },
              }}>

                <EventQR eventId={evt.eventId} />

                <EventGuestGrid
                  eventId={evt.eventId}
                  initialGuests={guests || []}
                  isLoading={loadingGuests}
                  errorText={errorGuests || ""}
                />

              </Box>
            )
          )}
        </Box>
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