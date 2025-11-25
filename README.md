# Cinematopia

A modern, elegant movie and TV show discovery platform built with Next.js 15, featuring a unique AI-powered Mood Matcher that recommends films based on your current mood.

---

## Features

- **Home Page** - Featured banner carousel with now-playing movies, top-rated sections, and movie grids
- **Explore** - Browse movies by category (Popular, Top Rated, Upcoming, Now Playing)
- **TV Shows** - Discover TV series with filters for Popular, Top Rated, On The Air, and Airing Today
- **Movie/TV Details** - Full details with trailers, cast information, and video galleries
- **Search** - Live search with dropdown suggestions and full results page
- **Mood Match** - Describe your mood in natural language and get personalized movie recommendations
- **Dark/Light Mode** - Elegant theme switching with carefully designed color palettes

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **TMDB API** | Movie and TV show data |
| **Lucide React** | Icon library |
| **Geist Font** | Typography |

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- TMDB API Key (get one free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/nurfish006/Cinematopia.git
   cd Cinematopia
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   # Create .env.local file
   TMDB_API_KEY=your_tmdb_api_key_here
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

\`\`\`
├── app/
│   ├── api/                    # API routes
│   │   ├── mood-match/         # Mood matcher endpoint
│   │   ├── movies/             # Movies endpoints
│   │   ├── movie/[id]/         # Single movie details
│   │   ├── search/             # Search endpoint
│   │   ├── tv/                 # TV shows endpoints
│   │   └── tv/[id]/            # Single TV show details
│   ├── explore/                # Explore movies page
│   ├── mood/                   # Mood matcher page
│   ├── movie/[id]/             # Movie details page
│   ├── search/                 # Search results page
│   ├── tv/[id]/                # TV show details page
│   ├── tv-shows/               # TV shows listing page
│   ├── globals.css             # Global styles & design tokens
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── featured-banner.tsx     # Hero banner carousel
│   ├── footer.tsx              # Site footer
│   ├── header.tsx              # Navigation header
│   ├── movie-carousel.tsx      # Horizontal movie carousel
│   └── movie-grid.tsx          # Movie grid display
└── public/                     # Static assets
\`\`\`

---

## Customizing the UI

### Color Palette

All colors are defined in `app/globals.css` using CSS custom properties with OKLCH color format for better color accuracy.

#### Key Color Tokens

| Token | Purpose | Location |
|-------|---------|----------|
| `--background` | Main background color | Line 10 (light), Line 44 (dark) |
| `--foreground` | Primary text color | Line 11 (light), Line 45 (dark) |
| `--accent` | Brand accent color (copper/orange) | Line 21 (light), Line 55 (dark) |
| `--muted` | Muted backgrounds | Line 17 (light), Line 51 (dark) |
| `--muted-foreground` | Secondary text | Line 18 (light), Line 52 (dark) |
| `--card` | Card backgrounds | Line 12 (light), Line 46 (dark) |
| `--border` | Border colors | Line 24 (light), Line 58 (dark) |

#### How to Change Colors

1. **Change the accent color** (currently copper/orange):
   \`\`\`css
   /* In app/globals.css */
   
   /* Light mode - Line 21 */
   --accent: oklch(0.62 0.14 45);
   
   /* Dark mode - Line 55 */  
   --accent: oklch(0.72 0.15 50);
   \`\`\`
   
   OKLCH format: `oklch(lightness chroma hue)`
   - Lightness: 0-1 (0 = black, 1 = white)
   - Chroma: 0-0.4 (color saturation)
   - Hue: 0-360 (color wheel degree)
   
   Common hue values:
   - Red: 25-30
   - Orange: 45-60
   - Yellow: 90-100
   - Green: 140-160
   - Blue: 240-260
   - Purple: 300-320

2. **Change the background**:
   \`\`\`css
   /* Light mode - warm ivory */
   --background: oklch(0.985 0.005 80);
   
   /* Dark mode - deep charcoal */
   --background: oklch(0.12 0.015 280);
   \`\`\`

3. **Adjust text colors**:
   \`\`\`css
   /* Primary text */
   --foreground: oklch(0.18 0.015 50);  /* Light mode */
   --foreground: oklch(0.92 0.005 80);  /* Dark mode */
   \`\`\`

### Typography

Fonts are configured in two places:

1. **Font imports** - `app/layout.tsx`:
   \`\`\`tsx
   import { Geist, Geist_Mono } from 'next/font/google'
   \`\`\`

2. **Font variables** - `app/globals.css`:
   \`\`\`css
   @theme inline {
     --font-sans: "Geist", "Geist Fallback", system-ui, sans-serif;
     --font-mono: "Geist Mono", "Geist Mono Fallback", monospace;
   }
   \`\`\`

### Component Styling

| Component | File | Key Classes |
|-----------|------|-------------|
| Header | `components/header.tsx` | `bg-background/95`, `border-border/50` |
| Footer | `components/footer.tsx` | `bg-secondary/30`, `border-border/50` |
| Movie Cards | `components/movie-grid.tsx` | `bg-secondary`, `rounded-xl` |
| Buttons | Uses shadcn/ui | `bg-accent`, `text-accent-foreground` |
| Banner | `components/featured-banner.tsx` | Gradient overlays |

### Branding

The "Cinematopia" brand uses a split color design:
- "Cinema" - uses `text-foreground` (white in dark mode, dark in light mode)
- "topia" - uses `text-accent` (copper/orange accent color)

To change this, search for `Cinematopia` in:
- `components/header.tsx`
- `components/footer.tsx`

---

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/movies` | GET | Fetch movies by category |
| `/api/movie/[id]` | GET | Get movie details |
| `/api/search` | GET | Search movies |
| `/api/tv` | GET | Fetch TV shows by category |
| `/api/tv/[id]` | GET | Get TV show details |
| `/api/mood-match` | POST | Get mood-based recommendations |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TMDB_API_KEY` | Yes | Your TMDB API key |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie and TV data API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vercel](https://vercel.com/) for hosting and deployment
