import React, { useEffect, useState } from "react";
import { getEvents } from "../api/getEvents";
import { Box, Typography, CircularProgress, Button, Stack } from "@mui/material";

export function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const list = await getEvents();
        setEvents(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        My Events
      </Typography>

      {events.length === 0 ? (
        <Typography>No events yet. Create your first one!</Typography>
      ) : (
        <Stack spacing={2}>
          {events.map((e) => (
            <Box
              key={e.eventId}
              sx={{
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                background: "#fff",
              }}
            >
              <Typography variant="h6">{e.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                📅 {new Date(e.eventDate).toLocaleString()} <br />
                📍 {e.location || "No location set"}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      <Button variant="contained" sx={{ mt: 3 }}>
        + Add Event
      </Button>
    </Box>
  );
}
