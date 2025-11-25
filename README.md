# Movie Database Application

A modern, elegant movie database web application built with Next.js 16, featuring real-time movie data from The Movie Database (TMDB) API, beautiful dark/light mode themes, and a responsive design.

## Features

- **Browse Movies**: Explore movies by category (Now Playing, Popular, Top Rated, Upcoming)
- **Search Functionality**: Find movies quickly with built-in search
- **Movie Details**: View comprehensive information about each movie
- **TV Shows**: Browse and discover TV shows
- **Responsive Design**: Optimized for all screen sizes
- **Dark/Light Mode**: Toggle between elegant dark and light themes
- **Featured Banner**: Carousel showcasing featured movies
- **Real-time Data**: Live movie information from TMDB API

## Tech Stack

- **Framework**: Next.js 16.0.3 (with Turbopack)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Theme Management**: next-themes
- **Package Manager**: npm

## Prerequisites

- Node.js 20 or higher
- TMDB API Key (free - see setup instructions below)

## Getting Started

### 1. Get Your TMDB API Key

1. Create a free account at [The Movie Database](https://www.themoviedb.org/signup)
2. Go to your [API Settings](https://www.themoviedb.org/settings/api)
3. Request an API key (choose "Developer" option)
4. Copy your API key

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your TMDB API key:

```bash
TMDB_API_KEY=your_api_key_here
```

Or if you're using Replit, add `TMDB_API_KEY` as a secret in the Secrets tab.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server on port 5000
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
├── app/
│   ├── api/              # API routes (server-side)
│   │   ├── movies/       # Movies API endpoints
│   │   ├── movie/[id]/   # Individual movie details
│   │   ├── tv/           # TV shows endpoints
│   │   └── search/       # Search functionality
│   ├── movie/[id]/       # Movie detail pages
│   ├── tv/[id]/          # TV show detail pages
│   ├── explore/          # Browse/explore page
│   ├── search/           # Search results page
│   ├── tv-shows/         # TV shows page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # Reusable UI components (Radix UI)
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Footer component
│   ├── movie-grid.tsx    # Grid display for movies
│   ├── movie-carousel.tsx # Carousel for featured content
│   └── featured-banner.tsx # Hero banner component
├── lib/
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Color Palette

### Dark Mode (Noir Cinema)
- Background: `#0D0D0F` (near-black charcoal)
- Surfaces: `#1A1A23` (deep bluish shadows)
- Text: `#E4E4EB` (soft silver)
- Accent: `#6D6DF7` (lavender neon)
- Highlights: `#F5C542` (gold for ratings/stars)

### Light Mode (Modern Silver)
- Background: `#F7F8FA` (crisp background)
- Surfaces: `#E2E5EA` (card surfaces)
- Text: `#1C1F26` (primary text)
- Accent: `#4754F7` (strong indigo)
- Highlights: `#F5C542` (gold)

## API Integration

This application uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) to fetch movie and TV show data. All API calls are made server-side through Next.js API routes for security and performance.

### Key Endpoints

- `/api/movies` - Fetch movies by category
- `/api/movie/[id]` - Get individual movie details
- `/api/tv` - Fetch TV shows
- `/api/tv/[id]` - Get individual TV show details
- `/api/search` - Search movies and TV shows

## Deployment

### Deploy to Replit

This project is pre-configured for Replit deployment:

1. Add your `TMDB_API_KEY` in the Secrets tab
2. Click the "Publish" button in Replit
3. Your app will be deployed with autoscaling

### Deploy to Vercel

```bash
npm run build
```

Then deploy using the Vercel CLI or through the Vercel dashboard.

## Environment Variables

- `TMDB_API_KEY` - Your TMDB API key (required)
- `REPLIT_DEV_DOMAIN` - Automatically set by Replit for proxy configuration

## Features Coming Soon

- User authentication and watchlists
- Movie ratings and reviews
- Advanced filtering and sorting
- Personalized recommendations

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- UI components by [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)

## Support

For issues and questions, please open an issue on the GitHub repository.
