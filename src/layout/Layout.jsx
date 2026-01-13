import { Box } from "@mui/material";
import { Navbar, RAIL_WIDTH } from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Analytics } from "@vercel/analytics/react"

export const Layout = ({ children }) => {
  const location = useLocation();
  const getActiveFromPath = (path) => {
    if (path.startsWith("/login")) return "account";
    if (path.startsWith("/page")) return "page";
    if (path.startsWith("/events")) return "events";
    return "home";
  };
  const active = getActiveFromPath(location.pathname);

  return (
    <Box
      sx={{
        minHeight: "100dvh",      
        display: "flex",
        flexDirection: "column", 
      }}
    >
      <Navbar activeId={active} />
      <Analytics />
      <Box sx={{ display: "flex", flex: 1 }}>
        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            pl: { md: `${RAIL_WIDTH}px` },  
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
