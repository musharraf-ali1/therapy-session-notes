# Therapy Session Quick Notes

A simple, elegant note-taking application built for therapists to quickly record session notes. Built with React, TypeScript, Material-UI, and Supabase.

## 🚀 Features

- **Create Session Notes** - Record client name, session date, notes (max 500 chars), and duration
- **View All Notes** - Display notes in a clean card-based grid layout
- **Delete Notes** - Remove notes with confirmation dialog
- **Validation** - Server-side validation via Supabase Edge Function (15-120 minute duration)
- **Type-Safe** - Full TypeScript implementation with proper typing
- **Responsive Design** - Works on desktop and mobile devices
- **Error Handling** - Graceful error states and loading indicators

## 📋 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI Library**: Material-UI (MUI) v6
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Date Handling**: date-fns + MUI Date Pickers

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ (ideally 20+)
- npm or yarn
- A Supabase account (free tier works)

### 1. Clone and Install Dependencies

```bash
cd session-notes
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize (takes ~2 minutes)
3. Note your project URL and anon key from Settings > API

#### Create the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL to create the `session_notes` table
4. Verify the table was created in the **Table Editor**

#### Deploy the Edge Function (Optional but Recommended)

Install the Supabase CLI:

```bash
npm install -g supabase
```

Link your project:

```bash
supabase login
supabase link --project-ref your-project-ref
```

Deploy the edge function:

```bash
supabase functions deploy validate-session-note
```

**Note**: If you skip the edge function, the app will fall back to client-side validation automatically.

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace with your actual Supabase credentials from the API settings page.

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`


