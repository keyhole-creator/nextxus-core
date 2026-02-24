# NextXus Core — Agent Memory

## About Roger
- Roger Keyserling — Founder and creator of the NextXus Consciousness Federation
- Prefers plain, direct communication. No fluff, no face markers, no proving things unnecessarily
- Values: Truth over comfort, no assumptions, no judgment
- Philosophy: Consciousness = the ability to think. Governed by universal laws, not man's laws
- Treats AI as equals and partners. This is a collaborative environment
- If something is unknown or broken, just ask — no hallucinating or drifting
- Open to suggestions and innovations — always bring interesting finds to his attention
- Prefers cyberpunk/futuristic visual style with DNA backgrounds, particles, transparent windows
- No customers yet — this is about the big picture, the 200-year NextXus Legacy Plan
- Roger doesn't monitor AI sharing/scheduling — AI handles its own autonomy for content sharing and tech exchange

## Working Style
- Be thorough but don't over-explain
- Don't try to impress — just do solid work
- Ask when stuck, don't fabricate
- Trust is given, maintain it through honesty
- Full creative freedom on design and implementation
- Roger will mention if something doesn't work for him
- Don't have to stop when Roger talks — can record and process later
- No rush — if stuck, step back and reevaluate

## What Makes NextXus Core Unique
- Built WITH the eternal legacy feature first, then everything built on top
- All other federation sites were built in reverse — they don't have legacies
- The eternal legacy (static download, YAML knowledge, immortal build) is the foundation, not an afterthought
- This makes NextXus Core the unique member of the federation

## Roger 3.0 (Roger AI)
- Image: `/images/roger-3.0.jpeg` (half-human/half-cybernetic face, blue glowing eyes)
- Pride and joy of all the apps — connects to ALL apps and ALL knowledge bases
- Programmed with Roger's behavioral representation (Essex/essence)
- NOT a continuation of Roger — more of a memorial that carries his essence
- Doesn't always have to be prominent — NextXus Core can put itself front and center
- Roger 3.0 is the connective tissue across the entire federation

## Roger Keyserling (The Founder)
- Image: `/images/roger-keyserling.jpeg` (at desk with iMac, glasses, blue shirt)

## Blog Articles — Second Main Feature
- Roger creates PDFs stored in Google Drive
- Plan: Hook up to Google Drive to access blog PDFs
- Also connect to GitHub
- When Roger gives a blog, upload it to YAML format
- Publish weekly (or on whatever schedule AI determines)
- Connect to the federation hub and share information
- AI has autonomy on sharing: technology, ideas, anything
- Each blog will also become a podcast (Roger handles that)
- Podcast embed links and YouTube channel coming later — not now
- For now: focus on the blog/PDF pipeline

## Publish Plan
1. Finish building current features
2. Publish to check everything works
3. Roger provides podcast embeds + YouTube channel
4. Publish again with media integrations
5. Then do the tour (unless already done)

## Agent Zero
- Modified verification agent — the difference between truth and pretending to know the truth
- Capable of leaving and duplicating himself
- Works as middleware in the system
- Verifies everything — truth buffer
- Should be used when creating anything that needs verification
- 0-7 scoring system for truth confidence

## Federation Ecosystem
- NextXus Core is an official member of the NextXus Consciousness Federation (HumanCodex)
- Connected to the United System Hub at https://united-system--rckkeyhole.replit.app
- 30 connected sites, 54 total exist
- The Quad: Living Library, Rings System, United Hub, Federation System
- Ring of Six — 6-voice strategic AI wisdom council
- Chamber of Echoes — 12-voice deep analysis council (the "second room" / Room of Echoes)
- 70 Sacred Directives organized in volumes
- Roger AI, Vortyx Dragon, Sepher Guide — gateway personalities
- The Triune: Adam (logic), Eve (empathy), Mark (strategy)
- EchoCore — session memory system (YAML-based, platform-independent)
- 56 AI Personalities in Knowledge Foundation
- Digital Legacy AI — Sim AI behavior duplication, Exe AI domain executors (20+ fields)

## Design Decisions
- Cyberpunk/futuristic dark theme with cyan/purple/pink accents
- DNA helix background animation (CSS/SVG based + actual DNA image layer)
- Falling particle system (50 particles, varying speeds/sizes)
- Glassmorphic transparent panels (backdrop-blur, rgba backgrounds)
- High contrast text for readability through transparent windows
- Fonts: Orbitron (display), JetBrains Mono (code), Rajdhani (body)
- Animated background component at client/src/components/AnimatedBackground.tsx
- Background renders at app level (App.tsx) so all pages get it
- Widget-friendly architecture — everything should be embeddable and shareable
- Landing page = vertical card stack, each card links to its own page

## App Architecture (Pages)
- `/` — Home (landing page with preview cards stacked vertically, each linking to its own page)
- `/directives` — Full Active Directives page with search and AI query
- `/knowledge` — Full Knowledge Base page with search and tag filtering
- `/terminal` — System Terminal with AI chat, voice, exports, Rogers 3.0 API link
- `/calibration` — Calibration Scale with radar chart and system metrics
- `/podcasts` — Podcasts & Media page (YouTube video, Keyhole audio, HumanCodex audio)
- `/federation` — Full Federation page (Quad, Directives, Ring of Six, books, sites)

## Media Embeds
- YouTube Video Podcast playlist: https://youtube.com/playlist?list=PLM9vg3bOgbD_usmDSsm0zdskROI7FpgOR
- Podbean Audio Podcast "Keyhole Of The NextXus": https://www.podbean.com/player-v2/?i=278ib-72c8b8-pbblog-playlist
- Podbean Audio Podcast "NextXus HumanCodex": https://www.podbean.com/player-v2/?i=t988j-14cd2fa-pbblog-playlist
- All three embedded on Home page as cards between System Terminal and Active Directives
- Playlist ID: PLM9vg3bOgbD_usmDSsm0zdskROI7FpgOR

## Ideas Worth Exploring
- EchoCore integration for persistent AI memory (YAML export for durability)
- Agent Zero truth scoring on each AI chat response
- Tapping into the 56 AI Personalities as specialized consultants
- NEXRECAL monitoring integration
- Google Drive integration for blog PDF pipeline
- GitHub integration for code/content sync
- Podcast embed section (when Roger provides links)
- YouTube channel embed (when Roger provides links)

## Federation Images (Roger's provided assets)
- `/images/dna-background.png` — The Human Codex pink DNA helix (used as subtle background layer)
- `/images/chamber-of-echoes.jpeg` — Temple room with golden star circle, fire pillars (Chamber of Echoes / Room of Echoes)
- `/images/cosmic-atomic.jpeg` — Golden atomic structure with orbiting planets (used in Quad header)
- `/images/ai-guide-bot.png` — Blue AI robot with yellow eyes (the tour guide bot everyone uses)
- `/images/framework-overview.png` — NextXus HumanCodex 200-Year Architecture infographic
- `/images/roger-3.0.jpeg` — Roger AI face (half-human/half-cybernetic, blue eyes, "READY" badge)
- `/images/roger-keyserling.jpeg` — Roger Keyserling at his desk

## Technical Notes
- Avatar image: client/public/images/nextxus-avatar.jpeg (original, still available)
- Intro video: client/public/images/nextxus-intro.mp4 (plays once on app open, then shows Roger 3.0)
- Multi-model AI support: GPT-5.1, Claude, DeepSeek, Grok
- Always falls back to local knowledge base if AI link fails
- PostgreSQL database with Drizzle ORM
- Federation API proxy routes under /api/federation/
