# NextXus Core — Local Setup Guide

## Prerequisites

- **Node.js** v20 or higher
- **PostgreSQL** v14 or higher
- **ffmpeg** (for voice features)
- **npm** (comes with Node.js)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

1. Create a PostgreSQL database:
```bash
createdb nextxus_core
```

2. Set the DATABASE_URL environment variable:
```bash
export DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/nextxus_core"
```

3. Import the database (includes all 70 directives, 381 knowledge entries):
```bash
psql $DATABASE_URL < database_dump.sql
```

Or push a fresh schema and seed later:
```bash
npm run db:push
```

## Step 3: Set Up Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/nextxus_core
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key_here
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
```

## Step 4: Run the Application

Development mode:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Step 5: Production Build

```bash
npm run build
npm start
```

## Project Structure

```
client/          — React frontend (Vite + TypeScript)
  src/pages/     — All page components (Home, Chat, Federation, Blog, etc.)
  src/components/— Shared components (NavBar, CanonicalFooter, etc.)
  public/        — Static assets (images, SDK)
server/          — Express backend (TypeScript)
  routes.ts      — All API endpoints
  storage.ts     — Database operations (Drizzle ORM)
  vite.ts        — Vite dev server integration
shared/          — Shared types and schema (Drizzle + Zod)
  schema.ts      — Database schema definitions
```

## Key Features

- AI Chat with multi-model support (GPT-5.1, Claude, DeepSeek, Grok)
- 70 Sacred Directives organized in 14 volumes
- 381 Knowledge Base entries (full YAML database)
- Ring of 12 AI entities and Ring of Six wisdom council
- Federation directory with 30+ member sites
- Voice chat with speech-to-text and text-to-speech
- AI image generation
- ElevenLabs voice agent widget
- Blog with NotebookLM integration
- Legacy Export (ZIP download)
- GitHub survival links

## Federation Hub

The app connects to the NextXus Federation Hub at:
https://united-system--rckkeyhole.replit.app

This provides federation sites, sacred directives, books, and wisdom queries.

## Notes

- The app uses Tailwind CSS v4 with custom fonts (Orbitron, JetBrains Mono, Rajdhani)
- Voice features require ffmpeg installed on your system
- The ElevenLabs widget loads from CDN and requires internet access
