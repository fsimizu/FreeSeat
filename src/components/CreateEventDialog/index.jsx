import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, Alert, Slide
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { createEvent } from "../../utils/functions.js";

export function CreateEventDialog({ open, onClose, onCreated }) {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canSave = eventTitle.trim().length > 1 && !!eventDate;

  const handleCreate = async () => {
    if (!canSave) return;
    setSaving(true);
    setError("");

    try {
      const event = await createEvent({
        eventTitle: eventTitle.trim(),
        eventDate, // converts to ISO inside API helper
        location: location.trim() || null,
      });

      // reset
      setEventTitle("");
      setLocation("");
      setEventDate(new Date());

      onCreated?.(event);   // let parent refresh list
      onClose?.();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const handleExited = () => {
    // clear transient state when dialog fully closes
    setError("");
    setSaving(false);
  };

  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slots={{ transition: Slide }}
    slotProps={{
      transition: {
        direction: "up",
        onExited: handleExited,
      },
    }}>
      <DialogTitle>Create new event</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} mt={0.5}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Event title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            autoFocus
            fullWidth
            required
          /> 

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Event date"
              value={eventDate}
              onChange={(val) => setEventDate(val)}
              format="dd/MM/yyyy hh:mm a"
              slotProps={{ textField: { fullWidth: true } }}
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
          variant="contained"
          onClick={handleCreate}
          disabled={!canSave || saving}
        >
          {saving ? "Creating…" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
