// Supabase Edge Function: validate-session-note
// Validates session note data before insertion

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface SessionNoteInput {
  client_name: string;
  session_date: string;
  quick_notes: string;
  session_duration: number;
}

interface ValidationResponse {
  valid: boolean;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Parse request body
    const note: SessionNoteInput = await req.json();

    // Validate session duration (core requirement)
    if (typeof note.session_duration !== "number") {
      return createResponse({
        valid: false,
        error: "Session duration must be a number",
      });
    }

    if (note.session_duration < 15) {
      return createResponse({
        valid: false,
        error: "Session duration must be at least 15 minutes",
      });
    }

    if (note.session_duration > 120) {
      return createResponse({
        valid: false,
        error: "Session duration cannot exceed 120 minutes (2 hours)",
      });
    }

    // Additional validations
    if (!note.client_name || note.client_name.trim().length === 0) {
      return createResponse({
        valid: false,
        error: "Client name is required",
      });
    }

    if (!note.session_date) {
      return createResponse({
        valid: false,
        error: "Session date is required",
      });
    }

    if (!note.quick_notes || note.quick_notes.trim().length === 0) {
      return createResponse({
        valid: false,
        error: "Quick notes are required",
      });
    }

    if (note.quick_notes.length > 500) {
      return createResponse({
        valid: false,
        error: "Quick notes cannot exceed 500 characters",
      });
    }

    // All validations passed
    return createResponse({ valid: true });
  } catch (error) {
    console.error("Validation error:", error);
    return createResponse(
      {
        valid: false,
        error: "Invalid request format",
      },
      400
    );
  }
});

function createResponse(data: ValidationResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

