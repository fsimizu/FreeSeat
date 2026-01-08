// LegalPages.jsx
import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  List,
  ListItem,
  Divider,
  Fab,
  Zoom,
  useScrollTrigger,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { BackButton } from "../BackButton";

/**
 * Shared defaults — override via component props if needed.
 */
const DEFAULTS = {
  brandName: "FreeSeat",
  businessName: "Vizar Business & Talent Solutions Pty Ltd ATF VIZAR828 Trust Fund",
  abn: "42 294 208 084",
  cityState: "Sydney, NSW, Australia",
  supportEmail: "admin@vizarsolutions.com",
  lastUpdated: "29 October 2025",
};

/* -------------------------- Terms & Conditions -------------------------- */

export function TermsAndConditions(props) {
  const cfg = { ...DEFAULTS, ...props };

  return (
    <ScrollTopWrapper>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>

      <BackButton/>

        <Typography variant="h3" fontWeight={800} gutterBottom>
          Terms & Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Last updated: {cfg.lastUpdated}
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Welcome to <strong>{cfg.brandName}</strong>, provided by{" "}
          <strong>
            {cfg.businessName} (ABN {cfg.abn})
          </strong>{" "}
          (“we”, “us”, “our”). By accessing or using {cfg.brandName} (the
          “Service”), you agree to these Terms. If you don’t agree, please do
          not use the Service.
        </Typography>

        <Section title="1. About the Service">
          <Typography>
            {cfg.brandName} helps guests, wedding planners and event managers
            find seats and manage seating via QR codes. We aim to make check-ins
            and seating simple and enjoyable.
          </Typography>
        </Section>

        <Section title="2. Eligibility">
          <Typography>
            You must be at least 18 years old (or have a parent/guardian’s
            consent) to create an account or make purchases.
          </Typography>
        </Section>

        <Section title="3. Accounts">
          <List dense sx={{ listStyle: "disc", pl: 3 }}>
            <Bullet>Keep your login details secure.</Bullet>
            <Bullet>Provide accurate, up-to-date information.</Bullet>
            <Bullet>
              We may suspend/terminate accounts that breach these Terms, misuse
              the Service or attempt to harm other users/our systems.
            </Bullet>
          </List>
        </Section>

        <Section title="4. Payments & Subscriptions">
          <List dense sx={{ listStyle: "disc", pl: 3 }}>
            <Bullet>
              Payments are processed securely by third-party providers (e.g.
              Stripe). Prices are in AUD and may change with notice.
            </Bullet>
            <Bullet>
              Fees may be non-refundable once services commence, except as
              required by Australian Consumer Law.
            </Bullet>
            <Bullet>
              You are responsible for any internet or mobile data charges.
            </Bullet>
          </List>
        </Section>

        <Section title="5. Your Content">
          <Typography>
            You retain ownership of event information, guest lists and other
            data you upload. You grant us a non-exclusive licence to host,
            process and display that content solely to operate and improve{" "}
            {cfg.brandName}. Do not upload unlawful, infringing or misleading
            material.
          </Typography>
        </Section>

        <Section title="6. Intellectual Property">
          <Typography>
            All trademarks, logos, text, graphics and software in the Service
            are owned by or licensed to us. You may not copy, modify, distribute
            or reverse engineer any part of the Service without permission.
          </Typography>
        </Section>

        <Section title="7. Privacy">
          <Typography>
            We respect your privacy. Our practices are explained in our{" "}
            <Link href="/privacy" underline="hover">
              Privacy Policy
            </Link>
            . By using {cfg.brandName}, you consent to our collection and use of
            your data as described there.
          </Typography>
        </Section>

        <Section title="8. Availability & Changes">
          <Typography>
            We aim for smooth, secure operation but do not guarantee
            uninterrupted or error-free access. We may update, suspend or modify
            features at any time.
          </Typography>
        </Section>

        <Section title="9. Limitation of Liability">
          <Typography>
            To the extent permitted by law, we are not liable for indirect or
            consequential loss, or loss of data, revenue or opportunity arising
            from use of the Service. Our total liability is limited to the
            amount you paid us (if any) in the preceding 12 months.
          </Typography>
        </Section>

        <Section title="10. Termination">
          <Typography>
            You can delete your account at any time. We may suspend or close
            your account if you breach these Terms or misuse the Service.
          </Typography>
        </Section>

        <Section title="11. Governing Law">
          <Typography>
            These Terms are governed by the laws of New South Wales, Australia.
            Disputes are subject to the courts of NSW.
          </Typography>
        </Section>

        <Section title="12. Contact">
          <Typography>
            Questions? Email us at{" "}
            <Link href={`mailto:${cfg.supportEmail}`} underline="hover">
              {cfg.supportEmail}
            </Link>
            . Postal: {cfg.cityState}.
          </Typography>
        </Section>
      </Container>

      <BackToTopFab />
    </ScrollTopWrapper>
  );
}

/* ----------------------------- Privacy Policy ---------------------------- */

export function PrivacyPolicy(props) {
  const cfg = { ...DEFAULTS, ...props };

  return (
    <ScrollTopWrapper>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <BackButton/>
      
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Last updated: {cfg.lastUpdated}
        </Typography>

        <Typography sx={{ mb: 2 }}>
          This policy explains how <strong>{cfg.businessName}</strong> (ABN{" "}
          {cfg.abn}) (“we”, “us”, “our”) collects, uses and protects personal
          information when you use <strong>{cfg.brandName}</strong>. We comply
          with the <em>Privacy Act 1988 (Cth)</em> and the Australian Privacy
          Principles (APPs).
        </Typography>

        <Section title="1. Information We Collect">
          <List dense sx={{ listStyle: "disc", pl: 3 }}>
            <Bullet>
              <strong>Account details:</strong> name, email address, password.
            </Bullet>
            <Bullet>
              <strong>Payment info:</strong> billing details processed by
              third-party providers (e.g. Stripe). We do not store full card
              numbers.
            </Bullet>
            <Bullet>
              <strong>Event data:</strong> guest lists, seating plans, QR codes
              you create.
            </Bullet>
            <Bullet>
              <strong>Usage data:</strong> pages visited, device/browser info,
              cookies and similar technologies.
            </Bullet>
          </List>
        </Section>

        <Section title="2. How We Use Your Information">
          <List dense sx={{ listStyle: "disc", pl: 3 }}>
            <Bullet>Create and manage your account.</Bullet>
            <Bullet>Process payments and bookings.</Bullet>
            <Bullet>Provide features and personalise your experience.</Bullet>
            <Bullet>
              Send updates, transactional emails and support responses.
            </Bullet>
            <Bullet>
              Improve security, prevent fraud and ensure compliance.
            </Bullet>
            <Bullet>Meet legal obligations (e.g. tax, record-keeping).</Bullet>
          </List>
          <Typography sx={{ mt: 1 }}>
            We <strong>do not sell</strong> your personal information.
          </Typography>
        </Section>

        <Section title="3. Sharing Information">
          <Typography>We share data only as needed to provide {cfg.brandName}:</Typography>
          <List dense sx={{ listStyle: "disc", pl: 3 }}>
            <Bullet>Payment processors, cloud hosting and analytics partners.</Bullet>
            <Bullet>Law enforcement or regulators when legally required.</Bullet>
            <Bullet>
              If our business is sold or merged, we will notify you before your data is transferred.
            </Bullet>
          </List>
        </Section>

        <Section title="4. Cookies & Analytics">
          <Typography>
            We use cookies to keep you signed in, remember preferences and
            analyse usage. You can control cookies in your browser; some
            features may not work if you disable them.
          </Typography>
        </Section>

        <Section title="5. Data Storage & Security">
          <Typography>
            We store data on secure, encrypted infrastructure (primarily in
            Australia or regions with adequate protections) and apply reasonable
            technical/organisational safeguards against unauthorised access,
            loss or misuse.
          </Typography>
        </Section>

        <Section title="6. Access & Correction">
          <Typography>
            You may request access to, or correction of, your personal
            information by emailing{" "}
            <Link href={`mailto:${cfg.supportEmail}`} underline="hover">
              {cfg.supportEmail}
            </Link>
            . We will respond within a reasonable time in line with the APPs.
          </Typography>
        </Section>

        <Section title="7. Marketing Choices">
          <Typography>
            If you opt in to updates, you can unsubscribe anytime using the link
            in our emails or by contacting us.
          </Typography>
        </Section>

        <Section title="8. Retention">
          <Typography>
            We retain personal information only as long as needed for the
            purposes described or as required by law. When no longer needed, we
            delete or de-identify it.
          </Typography>
        </Section>

        <Section title="9. Children">
          <Typography>
            {cfg.brandName} is not intended for children under 13. We do not
            knowingly collect data from children. Parents/guardians may contact
            us to request deletion.
          </Typography>
        </Section>

        <Section title="10. Changes to This Policy">
          <Typography>
            We may update this Privacy Policy. The new version will be posted
            here with an updated date.
          </Typography>
        </Section>

        <Section title="11. Contact & Complaints">
          <Typography>
            Questions or complaints:{" "}
            <Link href={`mailto:${cfg.supportEmail}`} underline="hover">
              {cfg.supportEmail}
            </Link>
            . Postal: {cfg.cityState}. If you are unsatisfied with our response,
            you may contact the Office of the Australian Information
            Commissioner (OAIC) at{" "}
            <Link
              href="https://www.oaic.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              www.oaic.gov.au
            </Link>
            .
          </Typography>
        </Section>
      </Container>

      <BackToTopFab />
    </ScrollTopWrapper>
  );
}

/* --------------------------------- Helpers -------------------------------- */

function Section({ title, children }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      {children}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}

function Bullet({ children }) {
  return (
    <ListItem sx={{ display: "list-item", pl: 0 }}>
      <Typography variant="body1">{children}</Typography>
    </ListItem>
  );
}

/* ----------------------------- Back to Top ----------------------------- */

function ScrollTopWrapper({ children }) {
  return (
    <Box
      id="back-to-top-anchor"
      sx={{ position: "relative" }}
    >
      {children}
    </Box>
  );
}

function BackToTopFab() {
  // Show FAB after user scrolls a bit (window-based)
  const trigger = useScrollTrigger({
    threshold: 200,
    disableHysteresis: true,
  });

  const handleClick = () => {
    // Scroll the real page scroller to top (cross-browser)
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
        <Fab
          color="primary"
          size="medium"
          aria-label="scroll back to top"
          onClick={handleClick}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
}
