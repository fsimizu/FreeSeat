import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Card,
  CardActionArea,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteEvent } from '../../utils/functions';
import { EditEventDialog } from "../EditEventDialog";
import { useTheme } from "@mui/material/styles";

function useCountdown(targetDate) {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(countDownDate - Date.now());
  useEffect(() => {
    const id = setInterval(() => setCountDown(countDownDate - Date.now()), 1000);
    return () => clearInterval(id);
  }, [countDownDate]);
  const days = Math.max(0, Math.floor(countDown / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((countDown % (1000 * 60)) / 1000));
  return { days, hours, minutes, seconds };
}

export function MyEventsCard({ event, onClick, onDeleted, onUpdated }) {
  const [evt, setEvt] = useState(event);
  const { days } = useCountdown(evt.eventDate);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const theme = useTheme();
  // xs or sm -> use menu; md+ -> show icon buttons
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  // menu state (small screens)
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);
  const openMenu = (e) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };
  const closeMenu = (e) => {
    // If invoked from MenuItem, stop bubbling to CardActionArea
    e?.stopPropagation?.();
    setMenuAnchor(null);
  };

  const openConfirm = (e) => { e.stopPropagation(); setConfirmOpen(true); };
  const closeConfirm = () => setConfirmOpen(false);

  const openEdit = (e) => { e.stopPropagation(); setEditOpen(true); };
  const closeEdit = () => setEditOpen(false);

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteEvent({ eventId: evt.eventId });
      setDeleting(false);
      setConfirmOpen(false);
      onDeleted?.(evt.eventId);
    } catch (err) {
      setDeleting(false);
      console.error('Failed to delete event:', err);
    }
  };

  const handleEdited = (updatedEvent) => {
    setEvt(updatedEvent);
    onUpdated?.(updatedEvent);
  };

  const eventDateLabel = (() => {
    const d = new Date(evt.eventDate);
    if (isNaN(d)) return "Invalid date";
    return `${d.getDate().toString().padStart(2, "0")} ${d.toLocaleDateString("en-US", { month: "short" })} ${d.getFullYear()}`;
  })();

  const chip = {
    display: 'inline-flex',
    alignItems: 'center',
    px: 2,
    py: 0.75,
    borderRadius: 1,
    bgcolor: (t) => t.palette.action.selected,
    color: 'text.primary',
    textTransform: 'none',
    minWidth: 0,
    maxWidth: '100%',
  };
  const iconBtn = {
    width: { xs: 44, sm: 40 },
    height: { xs: 44, sm: 40 },
    borderRadius: 1,
    bgcolor: (t) => t.palette.action.selected,
    // '&:hover': { backgroundColor: 'grey.300' },
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, border: "none", overflow: "hidden", bgcolor: "transparent" }}>
      <Stack divider={<Divider />} sx={{ p: 0 }}>
        <CardActionArea
          component="div"
          onClick={onClick}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Left section */}
          <Box sx={{ p: 2, flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, wordBreak: 'break-word' }}
              >
                {evt.eventTitle}
              </Typography>

              {/* xs/sm: 3-dots menu */}
              {isSmall && (
                <>
                  <IconButton
                    aria-label="More actions"
                    onClick={openMenu}
                    sx={{ ml: 1, p: 0 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={menuOpen}
                    onClose={closeMenu}
                    // prevent card click when interacting with menu
                    onClick={(e) => e.stopPropagation()}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem
                      onClick={(e) => { closeMenu(e); openEdit(e); }}
                    >
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => { closeMenu(e); openConfirm(e); }}
                    >
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 1,
                rowGap: 1,
                mt: 1,
              }}
            >
              <Box sx={chip}>
                <CalendarTodayIcon sx={{ mr: 1, fontSize: 20, flex: '0 0 auto' }} />
                <Typography variant="button" component="span" sx={{ lineHeight: 1.6, textTransform: 'none' }}>
                  {eventDateLabel}
                </Typography>
              </Box>

              <Box sx={chip}>
                <LocationPinIcon sx={{ mr: 1, fontSize: 20, flex: '0 0 auto' }} />
                <Typography
                  variant="button"
                  component="span"
                  sx={{
                    lineHeight: 1.6,
                    textTransform: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: { xs: '70vw', sm: '45vw', md: 260 },
                  }}
                  title={evt.location}
                >
                  {evt.location || 'No location'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right section: show icon buttons only on md+ */}
          <Box
            sx={{
              p: 2,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 1,
              width: 'auto',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {days} {days === 1 ? 'day' : 'days'} to go
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Delete event">
                <IconButton onClick={openConfirm} sx={iconBtn} aria-label="Delete event">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit event">
                <IconButton onClick={openEdit} sx={iconBtn} aria-label="Edit event">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardActionArea>
      </Stack>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={deleting ? undefined : closeConfirm}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Delete event?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{evt.eventTitle}</strong>? This action can’t be undone and all guests for this event will be removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <EditEventDialog
        open={editOpen}
        onClose={closeEdit}
        event={evt}
        onUpdated={handleEdited}
      />
    </Card>
  );
}
