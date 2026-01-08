// LandingPageMUI.jsx
import * as React from "react";
import {
  AppBar, Toolbar, Container, Box, Stack, Button, IconButton, Typography, Link,
  Card, CardContent, CardActions, Chip, Divider, Accordion, AccordionSummary,
  AccordionDetails, useMediaQuery
} from "@mui/material";
import { Grid } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TableBarIcon from "@mui/icons-material/TableBar";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SecurityIcon from "@mui/icons-material/Security";

export function Page({ onGetStarted }) {
  const isUpMd = useMediaQuery("(min-width:900px)");
  const handleGetStarted = () => (onGetStarted ? onGetStarted() : (window.location.href = "/signup"));

  return (
    <div className="ms-5 ps-5">
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>

      {/* Hero */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Typography variant={isUpMd ? "h2" : "h3"} fontWeight={800} lineHeight={1.1}>
                  Find your seat in seconds.
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Create your event, upload guests, publish a QR code. Attendees scan, type their name, and instantly see their table or seat.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button size="large" variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleGetStarted}>
                    Create free event
                  </Button>
                  <Button size="large" variant="outlined" href="#pricing">View pricing</Button>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  No credit card required • Cancel anytime
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 1 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography fontWeight={600}>Karla &amp; Pat — Reception</Typography>
                      <Typography variant="caption" color="text.secondary">Sydney • 21 Sep 2025</Typography>
                    </Box>
                    <Box
                      aria-label="QR code preview"
                      role="img"
                      sx={{ p: 1.5, borderRadius: 2, border: 1, borderColor: "divider" }}
                    >
                      <QrCode2Icon fontSize="large" />
                    </Box>
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        flexGrow: 1,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        bgcolor: "background.default",
                        opacity: 0.7,
                      }}
                    >
                      <Typography color="text.secondary">Type your name…</Typography>
                    </Box>
                  </Stack>
                  <Box mt={2}>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        bgcolor: "background.default",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography fontWeight={600}>Juan Dela Cruz</Typography>
                        <Typography variant="caption" color="text.secondary">Match preview</Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Chip label="Table 7" color="primary" size="small" />
                        <Chip label="Seat 7B" variant="outlined" size="small" />
                      </Stack>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1.5}>
                Instant client-side lookups from a cached JSON — no slow APIs during the event.
              </Typography>
            </Grid>
            
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box id="features" component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Stack spacing={1} alignItems="center" mb={5} textAlign="center">
            <Typography variant="h4" fontWeight={800}>Everything you need for a smooth check-in</Typography>
            <Typography color="text.secondary">Built for weddings, conferences, and gala events.</Typography>
          </Stack>

          <Grid container spacing={3}>
            {[
              {
                icon: <TableBarIcon />,
                title: "Create events fast",
                desc: "Name, date, venue — and you’re ready. A shareable QR is generated instantly."
              },
              {
                icon: <CloudDownloadIcon />,
                title: "Bulk guest import",
                desc: "Upload a CSV, then assign tables and seats in seconds."
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
              { n: 2, title: "Add guests", desc: "Import a CSV or add individually, then assign tables or exact seats." },
              { n: 3, title: "Publish & share", desc: "Print or share your QR. Guests scan and instantly find their spot." }
            ].map(step => (
              <Grid key={step.n}  size={{ xs: 12, md: 4 }}>
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

      {/* Pricing */}
      <Box id="pricing" component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Stack spacing={1} alignItems="center" mb={5} textAlign="center">
            <Typography variant="h4" fontWeight={800}>Simple, scalable pricing</Typography>
            <Typography color="text.secondary">Upgrade as your guest list grows. All plans include QR publishing and instant search.</Typography>
          </Stack>

          <Grid container spacing={3}>
            {[
              {
                title: "Basic", price: "$0", period: "/ event",
                bullets: ["Up to 100 guests/event", "1 active event", "QR code & public page", "Email support"],
                cta: "Start free", variant: "outlined"
              },
              {
                title: "Plus", price: "$19", period: "/ month", highlight: true,
                bullets: ["Up to 500 guests/event", "5 active events", "CSV import", "Priority support"],
                cta: "Choose Plus", variant: "contained"
              },
              {
                title: "Pro", price: "$49", period: "/ month",
                bullets: ["Up to 3,000 guests/event", "50 active events", "Advanced analytics", "Premium support"],
                cta: "Choose Pro", variant: "outlined"
              }
            ].map((p, i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Card
                  variant={p.highlight ? "elevation" : "outlined"}
                  elevation={p.highlight ? 2 : 0}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    borderColor: p.highlight ? "primary.main" : "divider",
                    position: "relative"
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <Typography variant="h6">{p.title}</Typography>
                      {p.highlight && <Chip size="small" color="primary" label="Popular" />}
                    </Stack>
                    <Stack direction="row" alignItems="baseline" spacing={1} mb={1}>
                      <Typography variant="h3" fontWeight={800}>{p.price}</Typography>
                      <Typography color="text.secondary">{p.period}</Typography>
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
                      {p.bullets.map((b, bi) => (
                        <Typography key={bi} component="li" color="text.secondary">{b}</Typography>
                      ))}
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button fullWidth variant={p.variant} onClick={handleGetStarted}>
                      {p.cta}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={3}>
            Pricing is indicative — wire to your Stripe products/plans.
          </Typography>
        </Container>
      </Box>

      {/* FAQ */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}>
        <Container maxWidth="md">
          <Stack spacing={1} alignItems="center" mb={3} textAlign="center">
            <Typography variant="h4" fontWeight={800}>Frequently asked questions</Typography>
          </Stack>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="faq1-content" id="faq1-header">
              <Typography>Do guests need to create an account?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                No. Guests just scan your QR and type their name to see their seat/table.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="faq2-content" id="faq2-header">
              <Typography>Can I update the guest list after publishing?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                Yes. Republish anytime; the public page fetches the latest versioned JSON automatically.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="faq3-content" id="faq3-header">
              <Typography>Is the public page secure?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                The public page only shows display name + seating. You can add a PIN gate if required.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, bgcolor: "background.default", borderTop: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} SeatFinder
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href="#features" color="text.secondary" underline="hover">Features</Link>
              <Link href="#pricing" color="text.secondary" underline="hover">Pricing</Link>
              <Link href="/terms" color="text.secondary" underline="hover">Terms</Link>
              <Link href="/privacy" color="text.secondary" underline="hover">Privacy</Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
    </div>
  );
}
