import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { createGuest, deleteGuest } from '../../utils/functions';

// --- Helper to create a new, blank row ---
const createNewRow = (id) => ({
  id,
  name: '',
  table: '',
  isNew: true,
});

export function EventGuestGrid({
  eventId,
  initialGuests,
  onSaveSuccess,
  isLoading = false,     // <-- new
  errorText = '',        // <-- new
}) {
  const nextIdRef = useRef(0);

  // rows start with a single blank entry (we'll replace after guests load)
  const [rows, setRows] = useState([createNewRow(nextIdRef.current++)]);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Filtering
  const [combinedFilter, setCombinedFilter] = useState('');

  // When guests finish loading (isLoading === false) update rows accordingly
  useEffect(() => {
    if (isLoading) return;
    if (!Array.isArray(initialGuests)) return;

    if (initialGuests.length > 0) {
      const processed = initialGuests.map((guest) => {
        const id = guest.guestId ?? nextIdRef.current++;
        return {
          id,
          name: guest.guestName ?? '',
          table: guest.table ?? '',
          isNew: false,
        };
      });
      setRows(processed);
    } else {
      // Loaded but empty: keep a single editable blank row
      setRows([createNewRow(nextIdRef.current++)]);
    }
  }, [initialGuests, isLoading]);

  // Handlers
  const handleAddRow = () => {
    const newRow = createNewRow(nextIdRef.current++);
    setRows((oldRows) => [...oldRows, newRow]);
  };

  const handleCellChange = (id, field) => (event) => {
    const { value } = event.target;
    setRows((oldRows) =>
      oldRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  // DELETE GUEST
  const handleDeleteRow = (id) => async () => {
    const rowToDelete = rows.find((row) => row.id === id);

    // If it's a local new row, just remove without API call
    if (rowToDelete && rowToDelete.isNew) {
      setRows((oldRows) => oldRows.filter((row) => row.id !== id));
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      await deleteGuest({ eventId, guestId: id });
      setRows((oldRows) => oldRows.filter((row) => row.id !== id));
    } catch (e) {
      console.error('Delete Failed:', e);
      setSaveError(e.message || 'Failed to delete guest. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // PASTE from Excel/Sheets: "Name \t Table" per line
  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text');
    if (!pastedText) return;

    const newRows = [];
    const lines = pastedText.trim().split('\n');

    for (const line of lines) {
      const columns = line.split('\t').map((col) => col.trim());
      if (columns[0] || columns[1]) {
        const newRow = createNewRow(nextIdRef.current++);
        newRow.name = columns[0] || '';
        newRow.table = columns[1] || '';
        newRows.push(newRow);
      }
    }

    if (newRows.length > 0) {
      setRows((oldRows) => [...oldRows, ...newRows ]);
      setSaveError(null);
    }
  };

  // SAVE new guests
  const handleSaveAll = async () => {
    setSaving(true);
    setSaveError(null);

    const guestsToSave = rows
      .filter((row) => row.isNew && (row.name.trim() || row.table.trim()))
      .map(({ name, table }) => ({ eventId, guestName: name, table }));

    if (guestsToSave.length === 0) {
      setSaveError('No new guests to save');
      setSaving(false);
      return;
    }

    try {
      const savedGuests = await createGuest(guestsToSave);
      const newSavedRows = savedGuests.map((guest) => ({
        id: guest.guestId,
        name: guest.guestName,
        table: guest.table,
        isNew: false,
      }));

      const existingRows = rows.filter((row) => !row.isNew);
      const allGuests = [...existingRows, ...newSavedRows];
      setRows(allGuests);
      onSaveSuccess?.(savedGuests);
    } catch (e) {
      // console.error('Save Failed:', e);
      setSaveError(e.message || "Failed to save guest list");
    } finally {
      setSaving(false);
    }
  };

  // Filtering Logic
  const filteredRows = useMemo(() => {
    const term = (combinedFilter || '').toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => {
      const nameMatch = (row.name || '').toLowerCase().includes(term);
      const tableMatch = (row.table || '').toLowerCase().includes(term);
      return nameMatch || tableMatch;
    });
  }, [rows, combinedFilter]);

  const totalGuestCount = useMemo(
    () =>
      rows.filter((row) => row.name.trim() || row.table.trim() || !row.isNew)
        .length,
    [rows]
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header / Filter */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ mr: 5 }}>
          Guest & Seating
        </Typography>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Filter by name or table"
          value={combinedFilter}
          onChange={(e) => setCombinedFilter(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              paddingLeft: 0,
              // backgroundColor: 'white',
              fontSize: '0.9rem',
              minWidth: '300px',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ pl: 2, color: 'action.active' }}
                >
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />


        
      </Box>

      {/* Error from save/delete or fetch */}
      {saveError && <Alert severity="error" 
        sx={{ mb: 2, maxWidth: 860}}>{saveError}</Alert>}
      {errorText && <Alert severity="error" sx={{ mb: 2 }}>{errorText}</Alert>}
      

      {/* Totals */}
      <Box
        sx={{
          mb: 2,
          textAlign: 'right',
          fontSize: '0.9rem',
          fontWeight: 'bold',
        }}
      >
        <Box component="span" sx={{ mr: 1 }}>
          Total Guests:
        </Box>
        <Box component="span" sx={{ color: 'primary.main' }}>
          {totalGuestCount}
        </Box>
      </Box>


      {/* Main content area: Loading / Empty / Table */}
      {isLoading ? (
        // --- LOADING STATE ---
        <Box
          sx={{
            py: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredRows.length === 0 &&
        rows.length === 1 &&
        rows[0].isNew &&
        !rows[0].name &&
        !rows[0].table &&
        !combinedFilter ? (
        // --- EMPTY STATE (loaded but no guests yet) ---
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            No guests yet
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Add guests manually or paste from Excel (Name[TAB]Table per line).
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            disabled={saving}
            variant="contained"
            size="small"
          >
            Add Guest
          </Button>
        </Paper>
      ) : (
        // --- TABLE (normal state) ---
        <>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 400,
              overflowY: 'auto',
              border: 1,
              borderColor: 'divider',
              // maxWidth: 900,
            }}
          >
            <Table stickyHeader size="small" aria-label="Guest and Seating List">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '55%', fontWeight: 'bold' }}>
                    Guest Name
                  </TableCell>
                  <TableCell sx={{ width: '35%', fontWeight: 'bold' }}>
                    Table/Seat
                  </TableCell>
                  <TableCell
                    sx={{ width: '10%', fontWeight: 'bold', textAlign: 'center' }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="standard"
                        value={row.name}
                        onChange={handleCellChange(row.id, 'name')}
                        disabled={!row.isNew}
                        onPaste={handlePaste}
                        placeholder="Enter guest name (or paste from Excel)"
                        slotProps={{
                          input: { disableUnderline: true },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="standard"
                        value={row.table}
                        onChange={handleCellChange(row.id, 'table')}
                        disabled={!row.isNew}
                        placeholder="Enter table or seat (or paste from Excel)"
                        slotProps={{
                          input: { disableUnderline: true },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="Delete Row">
                        <IconButton
                          onClick={handleDeleteRow(row.id)}
                          size="small"
                          disabled={saving}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredRows.length === 0 && combinedFilter && (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                No guests match your current filters.
              </Box>
            )}
          </TableContainer>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddRow}
                disabled={saving || isLoading}
                variant="outlined"
                size="small"
              >
                Add Guest
              </Button>
            </Box>
            <Button
              startIcon={
                saving ? <CircularProgress size={20} color="inherit" /> : null
              }
              onClick={handleSaveAll}
              disabled={saving || isLoading}
              variant="contained"
              color="primary"
            >
              {saving ? 'Saving...' : 'Save Guest List'}
            </Button>
          </Box>

        </>
      )}
    </Box>
  );
}
