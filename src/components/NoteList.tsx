/**
 * NoteList Component - Displays all session notes in a grid layout
 */
import { useState } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { NoteCard } from './NoteCard';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import type { SessionNote } from '../types';

interface NoteListProps {
  notes: SessionNote[];
  loading: boolean;
  error: string | null;
  onDeleteNote: (id: string) => Promise<void>;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  loading,
  error,
  onDeleteNote,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (id: string, clientName: string) => {
    setNoteToDelete({ id, name: clientName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    try {
      setDeleting(true);
      await onDeleteNote(noteToDelete.id);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error('Error deleting note:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!deleting) {
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (notes.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No session notes yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click "New Session Note" to create your first note
        </Typography>
      </Box>
    );
  }

  // Notes grid
  return (
    <>
      <Grid container spacing={3}>
        {notes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <NoteCard note={note} onDelete={handleDeleteClick} />
          </Grid>
        ))}
      </Grid>

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        clientName={noteToDelete?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        deleting={deleting}
      />
    </>
  );
};

