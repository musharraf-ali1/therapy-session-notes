/**
 * Core TypeScript types for the Session Notes application
 */

export interface SessionNote {
  id: string;
  client_name: string;
  session_date: string;
  quick_notes: string;
  session_duration: number;
  created_at?: string;
}

export interface CreateSessionNoteInput {
  client_name: string;
  session_date: string;
  quick_notes: string;
  session_duration: number;
}

export interface ValidationResponse {
  valid: boolean;
  error?: string;
}

export interface UseSessionNotesReturn {
  notes: SessionNote[];
  loading: boolean;
  error: string | null;
  createNote: (note: CreateSessionNoteInput) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

