/**
 * Main App Component - Therapy Session Quick Notes
 */
import { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NoteForm } from './components/NoteForm';
import { NoteList } from './components/NoteList';
import { useSessionNotes } from './hooks/useSessionNotes';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const { notes, loading, error, createNote, deleteNote } = useSessionNotes();

  const handleCreateNote = async (note: Parameters<typeof createNote>[0]) => {
    try {
      await createNote(note);
      setSnackbarMessage('Session note created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : 'Failed to create note');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      throw err; // Re-throw so the form can handle it
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setSnackbarMessage('Session note deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : 'Failed to delete note');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      throw err;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              Therapy Session Quick Notes
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
            >
              New Session Note
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <NoteList
            notes={notes}
            loading={loading}
            error={null}
            onDeleteNote={handleDeleteNote}
          />
        </Container>

        {/* Create Note Form Dialog */}
        <NoteForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleCreateNote}
        />

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
