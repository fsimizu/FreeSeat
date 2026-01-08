import { Box, Typography, Button } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

export function CancelPage() {
  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <CancelIcon color="error" sx={{ fontSize: 80 }} />
      <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
        Checkout Cancelled
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        No worries — you can try again anytime.
      </Typography>

      <Button variant="contained" color="primary" href="/" sx={{ mt: 4 }}>
        Back to home
      </Button>
    </Box>
  );
}
