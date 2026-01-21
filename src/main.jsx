import { CssBaseline, ThemeProvider } from "@mui/material";
import { Amplify } from "aws-amplify";
import React, { StrictMode } from 'react';
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
import { getTheme } from "./theme";
import { LegalTerms } from "./routes/legalTerms.jsx";
import { LegalPrivacy } from "./routes/legalPrivacy.jsx";
import { NotFound } from "./components/NotFound";
import { PricingPage } from "./components/Pricing";
import { CheckOutCancel } from "./routes/checkOutCancel.jsx";
import { CheckOutSuccess } from "./routes/checkOutSuccess.jsx";

Amplify.configure(awsConfig);

export const ColorModeContext = React.createContext({
  mode: "light",
  toggleColorMode: () => {},
});

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

function AppProviders() {
  const [mode, setMode] = React.useState(() => localStorage.getItem("mode") || "light");

  const toggleColorMode = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("mode", next);
      return next;
    });
  }, []);

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </UserProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <ThemeProvider theme={theme}>
//       <UserProvider>
//         <CssBaseline />
//         <RouterProvider router={router} />
//       </UserProvider>
//     </ThemeProvider>
//   </StrictMode>,
// )

// TO DO:
// put stripe prod details
    // pk_test, 
    // sk_test (lambda: events, webhook, checkout) - DONE
    // webhook secret (lambda: webhook) - DONE
    // price ids (lambda: checkout) - DONE, 

// allowed ulrs (lambda: webhook, checkout)
// validate stripe
// any security risks?
// CORS after deploying?
// buy domain
// SEO



// what happens when autorenewal?
// At checkout (can we add?): Billed annually. Cancel anytime. Access remains until the end of your billing period.

// NICE TO HAVE
// sign in with google/apple
// app colors (change to green)
// contact us form
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
// dark mode
// be able to choose fonts, backgrounds, etc
// be able to paste the MFA 

// AFTER Deploying
// In API gateway > CORS > add url to Access-Control-Allow-Origin