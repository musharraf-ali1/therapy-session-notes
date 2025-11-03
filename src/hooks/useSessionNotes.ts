/**
 * Custom hook for managing session notes
 * Handles all CRUD operations and state management
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { SessionNote, CreateSessionNoteInput, UseSessionNotesReturn, ValidationResponse } from '../types';

export const useSessionNotes = (): UseSessionNotesReturn => {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all session notes from the database
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('session_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setNotes(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notes';
      setError(errorMessage);
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate note using Supabase edge function
  const validateNote = async (note: CreateSessionNoteInput): Promise<ValidationResponse> => {
    try {
      const { data, error: functionError } = await supabase.functions.invoke('validate-session-note', {
        body: note,
      });

      if (functionError) {
        // Fallback to client-side validation if edge function fails
        console.warn('Edge function validation failed, using client-side validation:', functionError);
        return clientSideValidation(note);
      }

      return data as ValidationResponse;
    } catch (err) {
      // Fallback to client-side validation
      console.warn('Edge function not available, using client-side validation');
      return clientSideValidation(note);
    }
  };

  // Client-side validation fallback
  const clientSideValidation = (note: CreateSessionNoteInput): ValidationResponse => {
    if (note.session_duration < 15) {
      return { valid: false, error: 'Session duration must be at least 15 minutes' };
    }
    if (note.session_duration > 120) {
      return { valid: false, error: 'Session duration cannot exceed 120 minutes' };
    }
    return { valid: true };
  };

  // Create a new session note
  const createNote = async (note: CreateSessionNoteInput): Promise<void> => {
    try {
      setError(null);

      // Validate using edge function (with client-side fallback)
      const validation = await validateNote(note);
      
      if (!validation.valid) {
        throw new Error(validation.error || 'Validation failed');
      }

      const { error: insertError } = await supabase
        .from('session_notes')
        .insert([note]);

      if (insertError) throw insertError;

      // Refresh the notes list
      await fetchNotes();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create note';
      setError(errorMessage);
      throw err; // Re-throw so the component can handle it
    }
  };

  // Delete a session note
  const deleteNote = async (id: string): Promise<void> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('session_notes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state optimistically
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete note';
      setError(errorMessage);
      throw err;
    }
  };

  // Refresh notes manually
  const refreshNotes = useCallback(async () => {
    await fetchNotes();
  }, [fetchNotes]);

  // Initial fetch on mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    createNote,
    deleteNote,
    refreshNotes,
  };
};

