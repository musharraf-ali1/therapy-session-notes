/**
 * NoteCard Component - Displays a single session note in card format
 */
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { SessionNote } from '../types';

interface NoteCardProps {
  note: SessionNote;
  onDelete: (id: string, clientName: string) => void;
}

const TRUNCATE_LENGTH = 100;

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Truncate notes to first 100 characters
  const truncatedNotes =
    note.quick_notes.length > TRUNCATE_LENGTH
      ? `${note.quick_notes.substring(0, TRUNCATE_LENGTH)}...`
      : note.quick_notes;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Delete button */}
        <IconButton
          aria-label="delete"
          onClick={() => onDelete(note.id, note.client_name)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          size="small"
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        {/* Client Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pr: 4 }}>
          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="h2" noWrap>
            {note.client_name}
          </Typography>
        </Box>

        {/* Session Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(note.session_date)}
          </Typography>
        </Box>

        {/* Duration */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Chip
            label={`${note.session_duration} min`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Notes (truncated) */}
        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
          {truncatedNotes}
        </Typography>
      </CardContent>
    </Card>
  );
};

