import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export function SuccessPage() {
  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
      <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
        Subscription Activated!
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Thank you for upgrading. You can now return to your dashboard.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link} to="/events"
        sx={{ mt: 4 }}
      >
        Go to My Events
      </Button>
    </Box>
  );
}
