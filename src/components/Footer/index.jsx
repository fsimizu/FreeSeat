import {
  Box,
  Container,
  Link,
  Stack,
  Typography
} from "@mui/material";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToHomeSection = (hash) => {
    if (location.pathname === "/") {
      navigate({ hash });
    } else {
      navigate(`/${hash}`);
    }
  };

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 1, md: 3 }, pl: { md: 11 } }}>
      <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
        <Box
          component="footer"
          sx={{
            py: 3,
            bgcolor: "background.default",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            {/* Top row: columns */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 3, sm: 6 }}
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 2 }}
            >

              {/* Column 1: Brand + back to top */}
              <Stack spacing={1}>
                {/* <Link
                  variant="button"
                  onClick={backToTop}
                  sx={{ cursor: "pointer", textAlign: "left" }}
                >
                  Back to top
                </Link> */}
                <Typography variant="body" color="text.secondary">
                  © {new Date().getFullYear()} FreeSeat
                </Typography>
              </Stack>

              {/* Column 2: Product */}
              <Stack spacing={1}>
                <Typography variant="subtitle2">SITEMAP</Typography>
                <Link
                  component="button"
                  onClick={() => goToHomeSection("#hero")}
                  color="text.secondary"
                  underline="hover"
                  sx={{ cursor: "pointer", textAlign: "left" }}
                >
                  Home
                </Link>
                <Link
                  component="button"
                  onClick={() => goToHomeSection("#features")}
                  color="text.secondary"
                  underline="hover"
                  sx={{ cursor: "pointer", textAlign: "left" }}
                >
                  Features
                </Link>
                <Link
                  component="button"
                  onClick={() => goToHomeSection("#pricing")}
                  color="text.secondary"
                  underline="hover"
                  sx={{ cursor: "pointer", textAlign: "left" }}
                >
                  Pricing
                </Link>
              </Stack>

              {/* Column 3: Legal */}
              <Stack spacing={1}>
                <Typography variant="subtitle2">LEGAL</Typography>
                <Link
                  component="button"
                  onClick={() => navigate("/terms")}
                  color="text.secondary"
                  underline="hover"
                  sx={{ textAlign: "left" }}
                >
                  Terms
                </Link>
                <Link
                  component="button"
                  onClick={() => navigate("/privacy")}
                  color="text.secondary"
                  underline="hover"
                  sx={{ textAlign: "left" }}
                >
                  Privacy
                </Link>
              </Stack>

              {/* Column 4: Contact */}
              <Stack spacing={1}>
                <Typography variant="subtitle2">CONTACT INFO</Typography>
                <Link
                  href="mailto:support@freeseat.com"
                  color="text.secondary"
                  underline="hover"
                  sx={{ textAlign: "left" }}
                >
                  admin@vizarsolutions.com
                </Link>
              </Stack>
            </Stack>

          </Container>
        </Box>
      </Box>
    </Container>
  );
};