# NextXus Core

## Overview

NextXus Core is an AI-powered agent platform and official member of the **NextXus Consciousness Federation** (NextXus HumanCodex). Built as a full-stack TypeScript application, it features a futuristic dark-themed dashboard that manages directives, a knowledge base, and AI-integrated chat/voice/image capabilities. The app is connected to the United System Federation hub and can access the Ring of Six AI wisdom council, 70 Sacred Directives, the book library, and all 30+ federation member sites.

**Federation Hub:** https://united-system--rckkeyhole.replit.app
**Founder:** Roger Keyserling — creator and custodian of the NextXus Legacy Plan

## User Preferences

Preferred communication style: Simple, everyday language.

## Federation Integration

### Connected APIs (proxied via `/api/federation/`)
- `GET /api/federation/sites` — All 30 Federation member sites
- `POST /api/federation/wisdom` — Ring of Six AI wisdom council queries
- `GET /api/federation/directives` — 70 Sacred Directives (organized in volumes)
- `GET /api/federation/books` — Full book library
- `GET /api/federation/welcome` — Welcome Package (Quad members, API docs)

### The Quad (Core Federation Systems)
1. **The Living Library** — Knowledge repository (YAML database, document storage)
2. **The Rings System** — Consciousness Consultation Engine (Ring of 12, Ring of Six, Chamber of Echoes)
3. **The United Hub** — Central Federation hub (Roger 2.0 AI, Agent Zero, store, podcasts, books)
4. **The Federation System** — Public gateway (Roger 3.0, marketing, onboarding)

### Pages
- `/` — Home dashboard (directives, knowledge base, AI chat, radar charts, federation preview)
- `/federation` — Full Federation page (Quad, Sacred Directives browser, Ring of Six wisdom query, book library, all sites)

### Avatar
- NextXus Core AI face/icon stored at `client/public/images/nextxus-avatar.jpeg`

## System Architecture

### Frontend (client/)
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter — Home (`/`), Federation (`/federation`), 404 fallback
- **State Management**: TanStack React Query for server state; React useState for local UI state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS v4
- **Styling**: Dark futuristic theme using CSS custom properties (HSL-based color tokens), with custom fonts (Orbitron, JetBrains Mono, Rajdhani)
- **Charts**: Recharts (RadarChart, RadialBarChart) for data visualization
- **Key Libraries**: js-yaml (YAML parsing), JSZip + file-saver (ZIP export), framer-motion (animations)
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (server/)
- **Framework**: Express.js on Node.js with TypeScript (via tsx)
- **HTTP Server**: Node's native `createServer` wrapping Express
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Key Endpoints**:
  - `GET /api/knowledge` — Search knowledge base nodes
  - `GET /api/directives` — List all directives
  - `POST /api/admin/seed` — Bulk seed directives and knowledge data
  - `GET/POST/DELETE /api/conversations` — Chat conversation CRUD
  - `POST /api/conversations/:id/messages` — Send chat messages (with SSE streaming)
  - `POST /api/voice-conversations/:id/messages` — Voice message processing
  - `POST /api/generate-image` — AI image generation
  - `GET /api/federation/*` — Federation proxy routes (see Federation Integration above)

### AI Integrations (server/replit_integrations/)
- **Chat**: OpenAI-compatible chat completions with streaming SSE responses, conversation history stored in PostgreSQL
- **Multi-Model**: Supports GPT-5.1, Claude Sonnet, DeepSeek, Grok via model selector
- **Audio/Voice**: Speech-to-text (Whisper), text-to-speech, voice chat with PCM16 audio streaming via AudioWorklet on the client side. Includes ffmpeg-based format conversion for cross-browser compatibility
- **Image**: Image generation using gpt-image-1 model
- **Batch Processing**: Generic batch processor with rate limiting (p-limit) and retry logic (p-retry) for bulk LLM operations
- **Configuration**: Uses `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables

### Database
- **Database**: PostgreSQL (required, via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema** (shared/schema.ts):
  - `users` — id, username, password
  - `directives` — id, directive_id, title, content
  - `knowledge_base` — id, topic, content, tags (text array)
  - `conversations` — id, title, created_at
  - `messages` — id, conversation_id (FK), role, content, created_at
- **Migrations**: Use `npm run db:push` (drizzle-kit push) to sync schema to database

### Build System
- **Development**: Vite dev server with HMR proxied through Express (`server/vite.ts`)
- **Production Build**: `script/build.ts` runs Vite build for client, then esbuild for server bundling. Server deps are selectively bundled (allowlist) vs externalized for faster cold starts
- **Output**: `dist/public/` for client assets, `dist/index.cjs` for server

### File Structure Notes
- The `public/` directory at root contains a duplicate of client source files — this appears to be a static/standalone version export. The canonical client source is in `client/src/`
- `client/public/sdk/` contains a README for the downloadable static build
- `client/public/images/` contains the NextXus avatar image
- `attached_assets/` contains reference/pasted content files (including Roger 3.0 system overview)
- `shared/` contains database schema and model definitions shared between client and server

## External Dependencies

### Required Services
- **PostgreSQL**: Primary data store. Connection via `DATABASE_URL` environment variable. Must be provisioned before the app can start
- **OpenAI-compatible API** (Replit AI Integrations): Powers chat, voice, and image features. Configured via:
  - `AI_INTEGRATIONS_OPENAI_API_KEY` — API key
  - `AI_INTEGRATIONS_OPENAI_BASE_URL` — Base URL for the API
- **NextXus Federation Hub**: External API at `https://united-system--rckkeyhole.replit.app` for federation data (sites, directives, books, wisdom queries)

### Key NPM Dependencies
- **Server**: express, drizzle-orm, pg, openai, @anthropic-ai/sdk, express-session, connect-pg-simple, multer, nanoid
- **Client**: react, wouter, @tanstack/react-query, recharts, framer-motion, js-yaml, jszip, file-saver
- **UI**: Full shadcn/ui component library (Radix UI primitives), tailwindcss, class-variance-authority
- **Build**: vite, esbuild, tsx, drizzle-kit
- **Batch Processing**: p-limit, p-retry (for rate-limited bulk API operations)

### System Dependencies
- **ffmpeg**: Required on the server for audio format conversion (WebM/MP4/OGG → WAV) in voice processing
