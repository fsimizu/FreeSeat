import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SecurityIcon from "@mui/icons-material/Security";
import TableBarIcon from "@mui/icons-material/TableBar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card, CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  Fab,
  Zoom,
  useScrollTrigger,
  useMediaQuery, useTheme
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import * as React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PricingPage } from "../Pricing";
import { motion } from "framer-motion";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const HeroRoot = styled("section")(({ theme }) => ({
  background: alpha(theme.palette.secondary.light, 0.1),
  borderRadius: 16,
  padding: theme.spacing(6, 4),
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

// ✅ Motion variants (reusable)
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: "easeOut" } },
};

// ✅ Common viewport settings
const viewport = { once: true, amount: 0.25 };

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
    <ScrollTopWrapper>
    <Container maxWidth="lg">

      {/* Hero */}
      <Box
        id="hero"
        component={motion.section}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        sx={{ py: { xs: 4, md: 8 }, bgcolor: "background.paper" }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start">

            {/* LEFT */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                component={motion.div}
                variants={containerStagger}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                spacing={3}
              >
                <Typography
                  component={motion.h2}
                  variants={itemUp}
                  variant={isUpMd ? "h2" : "h3"}
                  fontWeight={800}
                  lineHeight={1.1}
                >
                  Find your seat in seconds
                </Typography>

                <Typography
                  component={motion.p}
                  variants={itemUp}
                  variant="h6"
                  color="text.secondary"
                >
                  Create your event, upload guests, publish a QR code. Attendees scan,
                  type their name, and instantly see their table or seat.
                </Typography>

                <Stack
                  component={motion.div}
                  variants={itemUp}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                >
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
                  component={motion.img}
                  src="/images/hero-image.png"
                  alt="FreeSeat mobile preview"
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={viewport}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  style={{ width: "100%", maxWidth: 290, height: "auto" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box
        id="features"
        component={motion.section}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}
      >
        <Container maxWidth="lg">
          <Stack
            component={motion.div}
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            spacing={1}
            alignItems="center"
            mb={5}
            textAlign="center"
          >
            <Typography component={motion.h2} variants={itemUp} variant="h4" fontWeight={800}>
              Everything you need for a smooth check-in
            </Typography>
            <Typography component={motion.p} variants={itemUp} color="text.secondary">
              Built for weddings, conferences, gala events, and more.
            </Typography>
          </Stack>

          <Grid
            container
            spacing={3}
            component={motion.div}
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
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
                <Card
                  component={motion.div}
                  variants={itemUp}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  variant="outlined"
                  sx={{ height: "100%", borderRadius: 3 }}
                >
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
      <Box
        id="how"
        component={motion.section}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}
      >
        <Container maxWidth="lg">
          <Stack spacing={1} alignItems="center" mb={5} textAlign="center">
            <Typography variant="h4" fontWeight={800}>
              How it works
            </Typography>
          </Stack>

          <Grid
            container
            spacing={3}
            alignItems="flex-start"
            component={motion.div}
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {[
              { n: 1, title: "Create your event", desc: "Sign up and set up your details. A QR code is generated instantly." },
              { n: 2, title: "Add guests", desc: "Paste your sheet or add individually, then assign tables or exact seats." },
              { n: 3, title: "Publish & share", desc: "Print or share your QR. Guests scan and instantly find their spot." },
            ].map((step) => (
              <Grid key={step.n} size={{ xs: 12, md: 4 }}>
              <Stack
                component={motion.div}
                variants={itemUp}
                direction="row"
                spacing={2}
              >
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
      <Box
        component={motion.section}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        sx={{ py: { xs: 10, md: 6 }, bgcolor: "background.paper" }}
      >
        <Container maxWidth="md">
          <Stack spacing={1} alignItems="center" mb={3} textAlign="center">
            <Typography variant="h4" fontWeight={800}>Frequently asked questions</Typography>
          </Stack>
          <Box
            component={motion.div}
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <Accordion component={motion.div} variants={itemUp} defaultExpanded sx={{ "&.Mui-expanded": { margin: 0 }, }}>
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

            <Accordion component={motion.div} variants={itemUp} sx={{ "&.Mui-expanded": { margin: 0 }, }}>
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
            <Accordion component={motion.div} variants={itemUp} sx={{ "&.Mui-expanded": { margin: 0 }, }}>
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
          </Box>
        </Container>
      </Box>

    </Container>
    <BackToTopFab />
    </ScrollTopWrapper>
  );
}

// ---------Helpers

function ScrollTopWrapper({ children }) {
  return (
    <Box id="back-to-top-anchor" sx={{ position: "relative" }}>
      {children}
    </Box>
  );
}

function BackToTopFab() {
  const trigger = useScrollTrigger({
    threshold: 200,
    disableHysteresis: true,
  });

  const handleClick = () => {
    const el = document.scrollingElement || document.documentElement;
    if (el && el.scrollTo) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: (t) => t.zIndex.tooltip + 1,
        }}
      >
        <Fab color="primary" size="medium" aria-label="scroll back to top" onClick={handleClick}>
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
}