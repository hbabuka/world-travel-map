# Stamped — World Travel Map

Track every country you've set foot in on an interactive world map. Pin countries, watch your stats grow, and climb through passport ranks from *Blank Page* to *World Atlas*.

## Features

- **Interactive map** — click any country to pin it; pan and zoom freely
- **Country search** — find countries by name or alias (e.g. "USA", "UK", "South Korea")
- **Live stats** — total count, % of the world, continents covered, breakdown per continent
- **Passport rank** — 8 tiers that unlock as you explore more of the world
- **Visited / Remaining** — browse all pinned countries or see what's left, grouped by continent
- **Multi-provider auth** — sign in with Google, GitHub, or a magic-link email
- **Mobile ready** — collapsible sidebar, expanding search, responsive chip bar

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (custom design tokens) |
| Map | D3 v7 + topojson-client + world-atlas (50m, 203 countries) |
| Auth & DB | Supabase |
| Fonts | Archivo, JetBrains Mono, Space Mono |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with Google and/or GitHub OAuth configured

### 1. Clone and install

```bash
git clone https://github.com/your-username/world-travel-map.git
cd world-travel-map
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your Supabase credentials in `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/
│   ├── AppHeader.jsx       # Search, nav, account menu
│   ├── SidePanel.jsx       # Stats, continent breakdown, rank
│   ├── MapColumn.jsx       # Map wrapper, zoom controls, chips bar
│   ├── Logo.jsx            # Animated stamp logo (SVG)
│   ├── map/                # D3 world map + tooltip
│   ├── auth/               # Login and loading screens
│   ├── modals/             # Visited / remaining countries modal
│   └── ui/                 # CountUp, Clock, Chip, etc.
├── hooks/
│   ├── useAuth.js          # Supabase auth (Google, GitHub, magic link)
│   └── useTrips.js         # Visited countries state + Supabase sync
├── lib/
│   ├── continents.js       # Country → continent mapping (203 countries)
│   ├── ranks.js            # Passport rank tiers and thresholds
│   └── supabase.js         # Supabase client
└── App.jsx                 # Root — state composition and layout
```

## Passport Ranks

| Rank | Countries |
|---|---|
| Blank Page | 0 |
| First Ink | 1–9 |
| Dog-Eared | 10–24 |
| Full Passport | 25–49 |
| Second Passport | 50–74 |
| Diplomat | 75–99 |
| Cartographer | 100–149 |
| World Atlas | 150+ |
