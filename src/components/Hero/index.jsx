import * as React from "react";
import {
  AppBar, Toolbar, Container, Box, Stack, Button, IconButton, Typography, Link,
  Card, CardContent, CardActions, Chip, Divider, Grid, Accordion, AccordionSummary,
  AccordionDetails, useMediaQuery, useTheme
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import heroPhone from "/images/hero-phone.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TableBarIcon from "@mui/icons-material/TableBar";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SecurityIcon from "@mui/icons-material/Security";
import { PricingPage } from "../Pricing";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HeroRoot = styled("section")(({ theme }) => ({
  background: alpha(theme.palette.secondary.light, 0.1),
  borderRadius: 16,
  padding: theme.spacing(6, 4),
  // marginLeft: 80,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    textAlign: "center",
  },
}));


export function Hero() {
  const theme = useTheme();
  const isUpMd = useMediaQuery("(min-width:900px)");

  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <Container maxWidth="lg">


      {/* Hero */}
      <Box component="section" sx={{ py: { xs: 4, md: 8 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start">

            {/* LEFT */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Typography
                  variant={isUpMd ? "h2" : "h3"}
                  fontWeight={800}
                  lineHeight={1.1}
                >
                  Find your seat in seconds
                </Typography>

                <Typography variant="h6" color="text.secondary">
                  Create your event, upload guests, publish a QR code. Attendees scan,
                  type their name, and instantly see their table or seat.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button size="large" variant="contained" href="/login" endIcon={<ArrowForwardIcon />}>
                    Get started
                  </Button>

                  <Button size="large" variant="outlined" href="#pricing">
                    View pricing
                  </Button>

                </Stack>
              </Stack>
            </Grid>

            {/* RIGHT */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%"
                }}
              >
                <Box
                  component="img"
                  src="/images/hero-image.png"
                  alt="FreeSeat mobile preview"
                  sx={{
                    width: "100%",
                    maxWidth: 290,
                    height: "auto",
                  }}
                />
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>



      {/* Features */}
      <Box id="features" component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Stack spacing={1} alignItems="center" mb={5} textAlign="center">
            <Typography variant="h4" fontWeight={800}>Everything you need for a smooth check-in</Typography>
            <Typography color="text.secondary">Built for weddings, conferences, gala events, and more.</Typography>
          </Stack>

          <Grid container spacing={3}>
            {[
              {
                icon: <TableBarIcon />,
                title: "Create events fast",
                desc: "Name, date, venue - and you’re ready. A shareable QR is generated instantly."
              },
              {
                icon: <CloudDownloadIcon />,
                title: "Bulk guest import",
                desc: "Just paste your sheet and update the guest list in seconds."
              },
              {
                icon: <CheckCircleIcon />,
                title: "Offline-friendly",
                desc: "Guests search locally from a CDN-cached JSON. Works on spotty venue Wi-Fi."
              },
              {
                icon: <SecurityIcon />,
                title: "Secure & private",
                desc: "Public page only shows display name + seating. Organizer data stays private."
              }
            ].map((f, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: 2, bgcolor: "action.hover",
                      display: "grid", placeItems: "center", mb: 1.5
                    }}>
                      {f.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>{f.title}</Typography>
                    <Typography color="text.secondary">{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Box id="how" component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Stack spacing={1} alignItems="center" mb={5} textAlign="center">
            <Typography variant="h4" fontWeight={800}>How it works</Typography>
          </Stack>
          <Grid container spacing={3} alignItems="flex-start">
            {[
              { n: 1, title: "Create your event", desc: "Sign up and set up your details. A QR code is generated instantly." },
              { n: 2, title: "Add guests", desc: "Paste your sheet or add individually, then assign tables or exact seats." },
              { n: 3, title: "Publish & share", desc: "Print or share your QR. Guests scan and instantly find their spot." }
            ].map(step => (
              <Grid key={step.n} size={{ xs: 12, md: 4 }}>
                <Stack direction="row" spacing={2}>
                  <Chip color="primary" label={step.n} sx={{ borderRadius: "999px" }} />
                  <Box>
                    <Typography variant="h6">{step.title}</Typography>
                    <Typography color="text.secondary">{step.desc}</Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <PricingPage />

      {/* FAQ */}
      <Box component="section" sx={{ py: { xs: 10, md: 6 }, bgcolor: "background.paper" }}>
        <Container maxWidth="md">
          <Stack spacing={1} alignItems="center" mb={3} textAlign="center">
            <Typography variant="h4" fontWeight={800}>Frequently asked questions</Typography>
          </Stack>

          <Accordion defaultExpanded sx={{ "&.Mui-expanded": { margin: 0 }, }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="faq1-content" id="faq1-header" sx={{
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: "12px 0",
              },
              "&.Mui-expanded": {
                minHeight: "48px",
              },
            }}>
              <Typography>Do guests need to create an account?</Typography>
            </AccordionSummary >
            <AccordionDetails>
              <Typography color="text.secondary">
                No. Guests just scan your QR and type their name to see their seat/table.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ "&.Mui-expanded": { margin: 0 }, }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="faq2-content" id="faq2-header" sx={{
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: "12px 0",
              },
              "&.Mui-expanded": {
                minHeight: "48px",
              },
            }}>
              <Typography>Can I update the guest list after publishing?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                Yes. Republish anytime; the public page fetches the latest versioned JSON automatically.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ "&.Mui-expanded": { margin: 0 }, }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="faq3-content" id="faq3-header" sx={{
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: "12px 0",
              },
              "&.Mui-expanded": {
                minHeight: "48px",
              },
            }}>
              <Typography>Is the public page secure?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                Yes. The public page only shows display name + seating. Organizer data stays private.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>

    </Container>
  );
}
