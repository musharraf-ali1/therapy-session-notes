/**
 * DeleteConfirmDialog Component - Confirmation dialog for deleting notes
 */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';

interface DeleteConfirmDialogProps {
  open: boolean;
  clientName: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  clientName,
  onConfirm,
  onCancel,
  deleting = false,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Session Note?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the session note for <strong>{clientName}</strong>?
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={deleting}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

