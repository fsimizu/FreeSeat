import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress, Alert, Stack
} from "@mui/material";
import { updateEvent } from "../../utils/functions";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export function EditEventDialog({ open, onClose, event, onUpdated }) {
  const [eventTitle, setEventTitle] = React.useState(event?.eventTitle ?? "");
  const [location, setLocation] = React.useState(event?.location ?? "");
  const [eventDateInput, setEventDateInput] = React.useState(
    event?.eventDate ? safeDate(event.eventDate) : null
  );
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");


  React.useEffect(() => {
    setEventTitle(event?.eventTitle ?? "");
    setLocation(event?.location ?? "");
    setEventDateInput(event?.eventDate ? safeDate(event.eventDate) : null);
    setError("");
  }, [event, open]);

  const handleSave = async () => {
    setError("");
    if (!eventTitle.trim()) return setError("Title is required.");
    if (!eventDateInput || isNaN(eventDateInput.getTime()))
      return setError("Please select a valid date & time.");

    try {
      setSaving(true);
      const isoDate = eventDateInput.toISOString();

      await updateEvent({
        eventId: event.eventId,
        eventTitle,
        eventDate: isoDate,
        location,
      });

      onUpdated?.({
        ...event,
        eventTitle,
        eventDate: isoDate,
        location,
        updatedAt: new Date().toISOString(),
      });
      onClose?.();
    } catch (e) {
      setError(e?.message || "Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit event</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Event title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            fullWidth
            required
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Event date"
              value={eventDateInput}                         
              onChange={(newValue) => setEventDateInput(newValue)} 
              format="dd/MM/yyyy hh:mm a"              
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </LocalizationProvider>

          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function safeDate(input) {
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
}
