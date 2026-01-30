import * as React from "react";
import {
  AppBar,
  Box,
  ButtonBase,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import AccountCircleRounded from "@mui/icons-material/AccountCircleRounded";
import EventNoteRounded from "@mui/icons-material/EventNoteRounded";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext } from "../../main"; // adjust path

// ---- Layout constants ----
export const RAIL_WIDTH = 76;
const APPBAR_HEIGHT = { xs: 56, md: 64 };

// ---- Desktop rail (no top/height baked in; set via sx when used) ----
const RailRoot = styled(Box)(({ theme }) => ({
  position: "fixed",
  left: 0,
  width: RAIL_WIDTH,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background:
    theme.palette.mode === "light"
      ? alpha(theme.palette.secondary.light, 0.1)
      : alpha(theme.palette.background.paper, 0.06),
  zIndex: theme.zIndex.drawer, // under AppBar, above page
  paddingTop: 8,
}));

const RailButton = styled(ListItemButton)(({ theme }) => ({
  justifyContent: "center",
  borderRadius: 12,
  width: 56,
  height: 56,
  marginBottom: theme.spacing(1.25),
  color: theme.palette.text.secondary,

  backgroundColor: "transparent",
  "&:hover": { backgroundColor: "transparent" },
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    backgroundColor: "transparent",
  },
  "&.Mui-selected:hover": { backgroundColor: "transparent" },
}));

export function Navbar({ activeId = "home", onSelect }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const { toggleColorMode } = React.useContext(ColorModeContext);


  const [bump, setBump] = React.useState(false);
  const handleToggle = () => {
    setBump(true);
    toggleColorMode();
    window.setTimeout(() => setBump(false), 220);
  };

  const items = [
    { id: "home", label: "Home", icon: <HomeRounded />, path: "/" },
    { id: "account", label: "Account", icon: <AccountCircleRounded />, path: "/login" },
    { id: "events", label: "Events", icon: <EventNoteRounded />, path: "/events" },
  ];

  const current = items.find((i) => i.id === activeId);
  const title = current?.label ?? "Menu";

  const toggleDrawer = () => setOpen((p) => !p);
  const closeDrawer = () => setOpen(false);

  // Close drawer on route change
  React.useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (isDesktop) {
    // ---- Desktop: permanent rail BELOW the AppBar ----
    return (
      <RailRoot
        sx={{
          top: 0,
          bottom: 0,
          height: "100vh",
          width: 90,
          zIndex: (theme) => theme.zIndex.drawer,
          display: 'flex',
          justifyContent: 'space-between',
          py: 2,
          color: "text.secondary"
        }}
      >
        <List disablePadding sx={{ mt: 0.5 }}>
          {items.map((item) => (
            <Tooltip key={item.id} title={item.label} placement="right" arrow>
              <RailButton
                component={Link}
                to={item.path}
                selected={activeId === item.id}
                onClick={() => onSelect?.(item.id)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  py: 1.25,
                  mb: 2.5,
                  textAlign: "center",

                  "&:hover .iconChip": { bgcolor: "action.hover" },
                  "&:hover .iconSvg": { transform: "scale(1.06)" },

                  "&.Mui-selected .iconChip": { bgcolor: "action.selected" },
                  "&.Mui-selected .iconSvg": { transform: "scale(1.06)" },
                }}
              >
                <Box
                  className="iconChip"
                  sx={{
                    width: 56,
                    p: 0.5,
                    borderRadius: 4,
                    display: "grid",
                    placeItems: "center",
                    transition: (t) => t.transitions.create("background-color"),
                    bgcolor: activeId === item.id ? "action.selected" : "transparent",
                  }}
                >

                  <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>
                    {React.cloneElement(item.icon, {
                      className: "iconSvg",
                      style: { transition: "transform 150ms ease" },
                    })}
                  </ListItemIcon>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    lineHeight: 1,
                    fontSize: 12,
                    color: "inherit", // follows selected color
                  }}
                >
                  {item.label}
                </Typography>
              </RailButton>
            </Tooltip>
          ))}

        </List>

        <IconButton onClick={handleToggle} color="inherit" aria-label="Toggle theme">
          <span
            style={{
              display: "inline-flex",
              transform: bump ? "translateY(6px)" : "translateY(0px)",
              transition: "transform 220ms ease",
            }}
          >


            {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}

            {/* <Typography variant="caption"
                  sx={{
                    lineHeight: 1,
                    fontSize: 12,
                    color: "inherit", // follows selected color
                  }}>
              {theme.palette.mode === "dark" ? "Light mode" : "Dark mode"}
            </Typography> */}

          </span>
        </IconButton>

      </RailRoot>
    );
  }

  // ---- Mobile/Tablet: AppBar + toggleable Drawer (below AppBar) ----
  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          minHeight: APPBAR_HEIGHT.xs,
          bgcolor:
            theme.palette.mode === "light"
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.default, 0.9),
          backdropFilter: "blur(8px)",
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ minHeight: APPBAR_HEIGHT.xs }}>
          <IconButton
            edge="start"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={toggleDrawer}
            sx={{ mr: 1 }}
          >
            {open ? <MenuOpenIcon /> : <MenuRoundedIcon />}
          </IconButton>
          <Typography variant="h5" fontWeight={700} noWrap color='primary'>
            {/* {title */}
            Free
          </Typography>
          <Typography variant="h5" fontWeight={700} noWrap color='secondary'>
            Seat
          </Typography>


        </Toolbar>
      </AppBar>

      {/* Spacer so content doesn't sit under the AppBar */}
      <Box sx={{ height: `${APPBAR_HEIGHT.xs}px` }} />

      <Drawer
        anchor="left"
        open={open}
        onClose={closeDrawer}
        ModalProps={{ keepMounted: true }}
        // Ensure the whole Drawer (root) sits under the AppBar
        sx={{
          zIndex: (t) => t.zIndex.appBar - 1,
        }}
        slotProps={{
          // Backdrop only covers content area (not the AppBar) AND sits under the AppBar, so AppBar buttons remain clickable
          backdrop: {
            sx: {
              top: { xs: `${APPBAR_HEIGHT.xs}px`, md: `${APPBAR_HEIGHT.md}px` },
              height: {
                xs: `calc(100% - ${APPBAR_HEIGHT.xs}px)`,
                md: `calc(100% - ${APPBAR_HEIGHT.md}px)`,
              },
              zIndex: (t) => t.zIndex.appBar - 1,
            },
          },
          // Drawer panel also starts below the AppBar and sits under it
          paper: {
            sx: {
              top: { xs: `${APPBAR_HEIGHT.xs}px`, md: `${APPBAR_HEIGHT.md}px` },
              height: {
                xs: `calc(100% - ${APPBAR_HEIGHT.xs}px)`,
                md: `calc(100% - ${APPBAR_HEIGHT.md}px)`,
              },
              width: 280,
              zIndex: (t) => t.zIndex.appBar - 1,

            },
          },
        }}
      >
        <Box
          role="presentation"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            color: "text.secondary"
          }}
        >
          {/* Top menu */}
          <List>
            {items.map((item) => {
              const selected = activeId === item.id;
              return (
                <ListItemButton
                  key={item.id}
                  component={Link}
                  to={item.path}
                  selected={selected}
                  onClick={() => onSelect?.(item.id)}
                >
                  <ListItemIcon
                    sx={{
                      color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>

          <ButtonBase
            onClick={toggleColorMode}
            aria-label="Toggle theme"
            sx={{
              mt: "auto",
              mb: 2,
              mx: "auto",
              maxWidth: 260,
              borderRadius: 999,
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
              py: 1.25,
              px: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.25,
              transition: (t) =>
                t.transitions.create(["background-color", "border-color", "transform"], {
                  duration: t.transitions.duration.shortest,
                }),
              "&:hover": { bgcolor: "action.hover" },
              "&:active": { transform: "translateY(2px)" },
            }}
          >
            {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}

            <Typography variant="body2" sx={{ color: "inherit" }}>
              {theme.palette.mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            </Typography>
          </ButtonBase>

        </Box>
      </Drawer>
    </>
  );
}
