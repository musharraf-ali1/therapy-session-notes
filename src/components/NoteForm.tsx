/**
 * NoteForm Component - Modal dialog for creating new session notes
 */
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { CreateSessionNoteInput } from '../types';

interface NoteFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: CreateSessionNoteInput) => Promise<void>;
}

const MAX_NOTES_LENGTH = 500;

export const NoteForm: React.FC<NoteFormProps> = ({ open, onClose, onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [sessionDate, setSessionDate] = useState<Date | null>(new Date());
  const [quickNotes, setQuickNotes] = useState('');
  const [sessionDuration, setSessionDuration] = useState<number>(60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validation
    if (!clientName.trim()) {
      setError('Client name is required');
      return;
    }

    if (!sessionDate) {
      setError('Session date is required');
      return;
    }

    if (!quickNotes.trim()) {
      setError('Quick notes are required');
      return;
    }

    if (quickNotes.length > MAX_NOTES_LENGTH) {
      setError(`Notes cannot exceed ${MAX_NOTES_LENGTH} characters`);
      return;
    }

    if (sessionDuration < 15 || sessionDuration > 120) {
      setError('Session duration must be between 15 and 120 minutes');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const note: CreateSessionNoteInput = {
        client_name: clientName.trim(),
        session_date: sessionDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        quick_notes: quickNotes.trim(),
        session_duration: sessionDuration,
      };

      await onSubmit(note);

      // Reset form and close
      setClientName('');
      setSessionDate(new Date());
      setQuickNotes('');
      setSessionDuration(60);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setError(null);
      onClose();
    }
  };

  const remainingChars = MAX_NOTES_LENGTH - quickNotes.length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Session Note</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <TextField
              label="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              fullWidth
              required
              disabled={submitting}
            />

            <DatePicker
              label="Session Date"
              value={sessionDate}
              onChange={(newValue) => setSessionDate(newValue)}
              disabled={submitting}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />

            <TextField
              label="Session Duration (minutes)"
              type="number"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(Number(e.target.value))}
              fullWidth
              required
              disabled={submitting}
              inputProps={{ min: 15, max: 120 }}
              helperText="Duration must be between 15 and 120 minutes"
            />

            <Box>
              <TextField
                label="Quick Notes"
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                fullWidth
                required
                multiline
                rows={4}
                disabled={submitting}
                inputProps={{ maxLength: MAX_NOTES_LENGTH }}
              />
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5,
                  color: remainingChars < 50 ? 'error.main' : 'text.secondary',
                }}
              >
                {remainingChars} characters remaining
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Note'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

