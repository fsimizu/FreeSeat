import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, TextField, Alert } from "@mui/material";
import { getGuests, getEvent } from "../../utils/functions.js";
import "./publicView.css";
import { NotFound } from "../NotFound";

export function PublicView() {
  const { eventId } = useParams();

  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guestData, setGuestData] = useState([]);
  const [event, setEvent] = useState({});

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);


  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const [fetchedEvent, fetchedGuests] = await Promise.all([
          getEvent(eventId),   // normalize this to return null on 404 if you can
          getGuests(eventId),
        ]);
        if (!alive) return;

        if (!fetchedEvent) {
          // not found case
          setEvent(null);
          setGuestData([]);
          return;
        }

        setEvent(fetchedEvent);
        setGuestData(Array.isArray(fetchedGuests) ? fetchedGuests : []);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Failed to load event or guests");
        setEvent(undefined);
        setGuestData([]);
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [eventId]);

  const flatGuests = useMemo(() => {
    return guestData
      .map(g => ({
        key: g.SK || g.guestId || `${g.guestName}-${g.table}`,
        fullName: g.guestName ?? "",
        tableNumber: String(g.table ?? "").trim(),
      }))
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [guestData]);

  const norm = (s) =>
    (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const matches = useMemo(() => {
    const q = norm(input.trim());
    if (!q) return [];
    return flatGuests.filter(g => norm(g.fullName).includes(q));
  }, [flatGuests, input]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const choose = (g) => {
    setInput(g.fullName);
    setOpen(false);
    setResult(`TABLE ${g.tableNumber || "—"}`);
    inputRef.current?.blur();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult("");
    const q = input.trim();
    if (!q) return setResult("Please enter your name.");

    const exact = flatGuests.find(g => norm(g.fullName) === norm(q));
    if (exact) return choose(exact);
    if (matches.length === 1) return choose(matches[0]);
    if (matches.length > 1) {
      setOpen(true);
      return setResult("Multiple matches found — please select your full name.");
    }
    setResult("Guest not found");
  };

  const onKeyDown = (e) => {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight(i => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight(i => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      if (matches[highlight]) {
        e.preventDefault();
        choose(matches[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // ---- Render (no hooks below this line) ----
  if (!loading && event === null && !error) {
    // not found branch is safe here because all hooks already ran
    return <NotFound />;
  }


  return (
    <div className="publicView__container">
      <Box sx={{ minWidth: 275 }}>
        <form
          onSubmit={handleSubmit}
          ref={wrapperRef}
          style={{
            padding: "0px 20px 100px",
            fontFamily: "sans-serif",
            maxWidth: 520,
            position: "relative",
            height: "60%",
          }}
        >
          <h1 className="alex-brush-regular" style={{ color: "#d19f61", textAlign: "center", margin: 0, marginBottom: 8 }}>
            {event.eventTitle}
          </h1>
          <h1 className="font" style={{ textAlign: "center", marginTop: 0, letterSpacing: "0.0001em" }}>
            FIND YOUR TABLE
          </h1>

          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(255, 255, 255, 0.4)", 
                zIndex: 10,
              }}
            >
              <CircularProgress size={60} thickness={4} color="success" />
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <div style={{ position: "relative" }}>
            <TextField
              id="guest-name"
              label="Your name"
              variant="outlined"
              inputRef={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setResult("");
                setOpen(true);
                setHighlight(0);
              }}
              onFocus={() => input && setOpen(true)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              disabled={loading}
              sx={{
                width: "100%",
                "& .MuiInputBase-input": { fontFamily: "Cormorant Garamond", fontSize: "1.5rem" },
                "& .MuiInputLabel-root": { fontFamily: "Cormorant Garamond", fontSize: "1.5rem" },
                "& .MuiInputLabel-root.Mui-focused": { color: "green" },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": { transform: "translate(14px, -14px) scale(0.75)" },
                "& .MuiOutlinedInput-root": {
                  "& legend": { fontSize: "1rem" },
                  "&.Mui-focused fieldset": { borderColor: "#7a8e84" },
                },
              }}
            />

            {open && !loading && matches.length > 0 && (
              <ul
                role="listbox"
                aria-label="Guest matches"
                className="font"
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "100%",
                  zIndex: 10,
                  background: "white",
                  border: "1px solid #ddd",
                  borderTop: "none",
                  maxHeight: 200,
                  overflowY: "auto",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                {matches.map((m, idx) => (
                  <li
                    key={m.key}
                    role="option"
                    aria-selected={idx === highlight}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(m)}
                    onMouseEnter={() => setHighlight(idx)}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      background: idx === highlight ? "#f2f2f2" : "transparent",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      fontSize: "1.5rem",
                    }}
                  >
                    <span>{m.fullName}</span>
                    <span style={{ opacity: 0.7 }}>Table {m.tableNumber || "—"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {result && (
            <h3 className="font" style={{ marginTop: 12, textAlign: "center", fontSize: "1.5rem" }}>
              {result}
            </h3>
          )}
        </form>
      </Box>
    </div>
  );
}
