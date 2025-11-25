"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play, Info, Star } from "lucide-react"

interface FeaturedBannerProps {
  movies: any[]
  imageBaseUrl: string
}

export default function FeaturedBanner({ movies, imageBaseUrl }: FeaturedBannerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const CAROUSEL_LIMIT = Math.min(6, movies.length)

  useEffect(() => {
    if (movies.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_LIMIT)
    }, 8000)

    return () => clearInterval(interval)
  }, [CAROUSEL_LIMIT, movies.length])

  const movie = movies[currentIndex] || movies[0]
  const backdropUrl = movie?.backdrop_path ? `${imageBaseUrl}${movie.backdrop_path}` : "/movie-theater-dark.jpg"

  if (!movie) return null

  return (
    <section className="relative h-[75vh] min-h-[550px] overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 flex items-end pb-20">
        <div className="flex gap-10 items-end">
          {/* Poster */}
          <div className="hidden md:block w-52 lg:w-60 shrink-0">
            <img
              src={movie?.poster_path ? `${imageBaseUrl}${movie.poster_path}` : "/abstract-movie-poster.png"}
              alt={movie?.title}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 max-w-xl space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium tracking-wide uppercase text-accent">Now Playing</span>
              <span className="text-xs text-muted-foreground">
                {currentIndex + 1} / {CAROUSEL_LIMIT}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight text-balance">
              {movie?.title || "Movie Title"}
            </h1>

            <p className="text-foreground/70 line-clamp-2 text-base leading-relaxed">
              {movie?.overview || "No description available"}
            </p>

            <div className="flex items-center gap-5 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="font-semibold text-foreground">{movie?.vote_average?.toFixed(1) || "N/A"}</span>
                <span className="text-muted-foreground">/10</span>
              </div>
              <span className="text-muted-foreground">{movie?.vote_count?.toLocaleString() || "0"} votes</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={() => router.push(`/movie/${movie?.id}`)}
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg h-11 px-6"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Watch Trailer
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/movie/${movie?.id}`)}
                className="rounded-lg h-11 px-6 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80"
              >
                <Info className="w-4 h-4 mr-2" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {[...Array(CAROUSEL_LIMIT)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-accent" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
