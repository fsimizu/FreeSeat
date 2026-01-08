import * as React from "react";
import {
  AppBar,
  Box,
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
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, 0.12),
  },
  "&.Mui-selected:hover": {
    background: alpha(theme.palette.primary.main, 0.16),
  },
  "&:hover": {
    background: alpha(theme.palette.action.hover, 0.08),
  },
}));

export function Navbar({ activeId = "home", onSelect }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const items = [
    { id: "home", label: "Home", icon: <HomeRounded />, path: "/" },
    { id: "account", label: "Account", icon: <AccountCircleRounded />, path: "/login" },
    { id: "events", label: "Events", icon: <EventNoteRounded />, path: "/events" },
    // { id: "page", label: "Page", icon: <HomeRounded />, path: "/page" },
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
        zIndex: (theme) => theme.zIndex.drawer, // under AppBar, above content
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
                // sx={{
                //   display: 'flex',
                //   flexDirection: 'column',
                //   justifyContent: "flex-start",
                //   px: 1.5,
                //   gap: 1,
                // }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    color:
                      activeId === item.id
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {/* <ListItemText primary={item.label} /> */}
              </RailButton>
            </Tooltip>
          ))}
        </List>
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
        <Box role="presentation" sx={{ mt: 1 }}>
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
                      color: selected
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
