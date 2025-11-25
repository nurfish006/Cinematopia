# Movie Database Application

## Overview
This is a modern movie database web application built with Next.js 16, React 19, and TypeScript. It displays movies from The Movie Database (TMDB) API with a beautiful, responsive interface featuring dark and light modes.

## Tech Stack
- **Framework**: Next.js 16.0.3 (with Turbopack)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **TypeScript**: TypeScript 5
- **Package Manager**: npm

## Recent Changes (November 25, 2025)
- Initial project setup in Replit environment
- Configured Next.js to run on port 5000 with host 0.0.0.0
- Configured `allowedDevOrigins` to dynamically use `REPLIT_DEV_DOMAIN` environment variable to support Replit's proxy/iframe setup
- Created workflow for development server
- Configured deployment with autoscale target
- Requested TMDB API key from user (pending - will be stored in secrets once provided)

## Project Architecture

### Directory Structure
```
app/
  api/              # API routes (server-side)
    movies/         # Movies API endpoints
    movie/[id]/     # Individual movie details
    tv/             # TV shows endpoints
    search/         # Search functionality
  movie/[id]/       # Movie detail pages
  tv/[id]/          # TV show detail pages
  explore/          # Browse/explore page
  search/           # Search results page
components/
  ui/               # Reusable UI components (Radix UI)
  header.tsx        # Navigation header
  footer.tsx        # Footer component
  movie-grid.tsx    # Grid display for movies
  movie-carousel.tsx # Carousel for featured content
  featured-banner.tsx # Hero banner component
lib/
  utils.ts          # Utility functions
public/             # Static assets (images, icons)
```

### Key Features
- Browse movies by category (Now Playing, Popular, Top Rated, Upcoming)
- Search functionality
- Movie and TV show detail pages
- Responsive design with dark/light mode support
- Featured content carousel
- Integration with TMDB API for real-time movie data

## Configuration

### Environment Variables
- **TMDB_API_KEY**: Required secret for TMDB API access (pending user input - will be stored in Replit secrets once provided)
  - **Note**: API routes will return 500 errors until this key is provided
- **REPLIT_DEV_DOMAIN**: Automatically provided by Replit, used to configure `allowedDevOrigins` for proper HMR/Hot Reload support in the iframe preview

### Development Server
- Runs on port 5000 with host 0.0.0.0
- Command: `npm run dev`
- URL: http://0.0.0.0:5000
- Hot Module Replacement (HMR) and Fast Refresh are enabled and working correctly

### Deployment
- Target: Autoscale (for serverless deployment)
- Build command: `npm run build`
- Start command: `npm start`

## User Preferences

### Color Palette Options
User has requested elegant movie app color palettes for dark and light modes:

**Recommended: Noir Cinema (Dark) + Modern Silver (Light)**

Dark Mode (Noir Cinema):
- Background: #0D0D0F (near-black charcoal)
- Surfaces: #1A1A23 (deep bluish shadows)
- Text: #E4E4EB (soft silver)
- Accent: #6D6DF7 (lavender neon)
- Highlights: #F5C542 (gold for ratings/stars)

Light Mode (Modern Silver):
- Background: #F7F8FA (crisp background)
- Surfaces: #E2E5EA (card surfaces)
- Text: #1C1F26 (primary text)
- Accent: #4754F7 (strong indigo)
- Highlights: #F5C542 (gold)

Alternative palettes available: Velvet Night, Minimal Dark Glass, Soft Cinema Light, Luxe Minimal Light

## Dependencies
All dependencies are installed via npm. See package.json for complete list. Key dependencies:
- Next.js 16.0.3
- React 19.2.0
- Tailwind CSS 4.1.9
- Radix UI components
- Lucide React icons
- Next Themes for dark/light mode

## Notes
- TypeScript build errors are currently ignored (`ignoreBuildErrors: true`)
- Images are unoptimized for Replit environment
- Turbopack is enabled for faster builds
- Anonymous telemetry collection notice appears on first run
