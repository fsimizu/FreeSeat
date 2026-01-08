import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";

function formatCalDate(d) {
  // → YYYYMMDDTHHmmssZ
  return d.toISOString().replace(/-|:|\.\d{3}/g, "");
}

function toICSDate(d) {
  // → YYYYMMDDTHHmmssZ (same as above, kept separate for clarity)
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function AddToCalendarButton({ evt, noCapsButton, onClickDate }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Fallback if missing pieces
  const hasDate = !!evt?.eventDate;
  const hasTitle = !!evt?.eventTitle;

  const start = hasDate ? new Date(evt.eventDate) : null;
  // default 2-hour duration; adjust as you like
  const end = hasDate ? new Date(new Date(evt.eventDate).getTime() + 2 * 60 * 60 * 1000) : null;

  const formattedLabel = hasDate
    ? (() => {
      const d = new Date(evt.eventDate);
      return `${d.getDate().toString().padStart(2, "0")} ${d.toLocaleDateString("en-US", { month: "short" })} ${d.getFullYear()}`;
    })()
    : "No date";

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleGoogle = () => {
    if (!hasDate || !hasTitle) return;
    const startStr = formatCalDate(start);
    const endStr = formatCalDate(end);
    const title = encodeURIComponent(evt.eventTitle);
    const location = encodeURIComponent(evt.location || "");
    const details = encodeURIComponent("Event from FreeSeat");

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}&sf=true&output=xml`;
    window.open(url, "_blank");
    handleCloseMenu();
  };

  const handleICS = () => {
    if (!hasDate || !hasTitle) return;
    const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FreeSeat//AddToCalendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${evt.eventTitle.replace(/\r?\n/g, " ")}
DTSTART:${toICSDate(start)}
DTEND:${toICSDate(end)}
DESCRIPTION:${(evt.description || evt.eventTitle || "").replace(/\r?\n/g, " ")}
LOCATION:${(evt.location || "").replace(/\r?\n/g, " ")}
END:VEVENT
END:VCALENDAR`.trim();

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${(evt.eventTitle || "event").replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleCloseMenu();
  };

  const handleOutlookWeb = () => {
    if (!hasDate || !hasTitle) return;
    // Outlook.com supports ICS import via upload UI; there isn’t a great
    // prefill link like Google. Option: open calendar and rely on .ics file.
    // As an alternative, you can still open outlook calendar:
    window.open("https://outlook.live.com/calendar/0/view/month", "_blank");
    handleCloseMenu();
  };

  return (
    <>
      <Button
        startIcon={<CalendarTodayIcon />}
        variant="contained"
        color="inherit"
        sx={noCapsButton}
        onClick={handleOpenMenu}
        disabled={!hasDate}
      >
        {formattedLabel}
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem onClick={handleGoogle} disabled={!hasTitle || !hasDate}>
          <ListItemIcon>
            <MoreTimeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add to Google Calendar" />
          <OpenInNewIcon fontSize="small" />
        </MenuItem>

        <MenuItem onClick={handleICS} disabled={!hasTitle || !hasDate}>
          <ListItemIcon>
            <CloudDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download .ics (Apple/Outlook)" />
        </MenuItem>

        {/* Optional: quick link to Outlook web calendar */}
        <MenuItem onClick={handleOutlookWeb}>
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Open Outlook Calendar" />
        </MenuItem>
      </Menu>
    </>
  );
}
