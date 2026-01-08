import {
    Box,
    Container,
    Link,
    Stack,
    Typography,
  } from "@mui/material";
  import * as React from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  
  export const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    const goToHomeSection = (hash) => {
      // Already on home → just update hash
      if (location.pathname === "/") {
        navigate({ hash });
      } else {
        // Navigate to home WITH hash
        navigate(`/${hash}`);
      }
    };
  
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 1, md: 3 }, pl: { md: 11 } }}>
        <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
          <Box
            component="footer"
            sx={{
              py: 2,
              bgcolor: "background.default",
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Container maxWidth="lg">
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.secondary">
                  © {new Date().getFullYear()} FreeSeat
                </Typography>
  
                <Stack direction="row" spacing={2}>
                  <Link
                    component="button"
                    onClick={() => goToHomeSection("#features")}
                    color="text.secondary"
                    underline="hover"
                    sx={{ cursor: "pointer" }}
                  >
                    Features
                  </Link>
  
                  <Link
                    component="button"
                    onClick={() => goToHomeSection("#pricing")}
                    color="text.secondary"
                    underline="hover"
                    sx={{ cursor: "pointer" }}
                  >
                    Pricing
                  </Link>
  
                  <Link
                    component="button"
                    onClick={() => navigate("/terms")}
                    color="text.secondary"
                    underline="hover"
                  >
                    Terms
                  </Link>
  
                  <Link
                    component="button"
                    onClick={() => navigate("/privacy")}
                    color="text.secondary"
                    underline="hover"
                  >
                    Privacy
                  </Link>
                </Stack>
              </Stack>
            </Container>
          </Box>
        </Box>
      </Container>
    );
  };
  