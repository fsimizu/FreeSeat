import { CssBaseline, ThemeProvider } from "@mui/material";
import { Amplify } from "aws-amplify";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { awsConfig } from "./aws-exports";
import { UserProvider } from "./context/UserContext";
import './index.css';
import { Event } from "./routes/event.jsx";
import { Events } from "./routes/events.jsx";
import { GuestsView } from "./routes/guestsView.jsx";
import { Login } from './routes/login.jsx';
import { PrivateRoute } from './routes/privateRoute.jsx';
import { Root } from './routes/root.jsx';
import { Verify } from './routes/verify.jsx';
import { theme } from "./theme";
import { LegalTerms } from "./routes/legalTerms.jsx";
import { LegalPrivacy } from "./routes/legalPrivacy.jsx";
import { NotFound } from "./components/NotFound";

import { PricingPage } from "./components/Pricing";
import { CheckOutCancel } from "./routes/checkOutCancel.jsx";
import { CheckOutSuccess } from "./routes/checkOutSuccess.jsx";

Amplify.configure(awsConfig);

const router = createBrowserRouter([
  { path: "/", element: <Root /> },
  { path: "/login", element: <Login /> },
  { path: "/verify", element: <Verify /> },
  { path: "/events", element: (<PrivateRoute><Events /></PrivateRoute>) },
  { path: "/events/:eventId", element: (<PrivateRoute><Event /></PrivateRoute>) },
  { path: "/:eventId", element: <GuestsView /> },
  { path: "/terms", element: <LegalTerms /> },
  { path: "/privacy", element: <LegalPrivacy /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/success", element: <CheckOutSuccess /> },
  { path: "/cancel", element: <CheckOutCancel /> },
  { path: "*", element: <NotFound /> }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <UserProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)

// TO DO:
// CORS after deploying?
// buy domain
// put stripe prod details
// any security risks?
// lazy loading en el home. add animation when scrolled

// what happens when autorenewal?
// At checkout (can we add?): Billed annually. Cancel anytime. Access remains until the end of your billing period.

// NICE TO HAVE
// sign in with google/apple
// label in the navbar
// app colors (change to green)
// contact us
// public url with alias, not id
// not found page route
// when pasting from excel in guest list, it leaves the white cell
// be able to extend your plan before it expires
// add subscribe link in error message when reached limit
// be able to choose table or seat in the guest UI
// choosing plan without being logged in
// confirmation when saving guests
// Be able to edit guests
// Be able to select and bulk delete (with quantity selected)

// AFTER Deploying
// In API gateway > CORS > add url to Access-Control-Allow-Origin