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
  const [progress, setProgress] = useState(100)
  const CAROUSEL_LIMIT = Math.min(6, movies.length)

  useEffect(() => {
    if (movies.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_LIMIT)
      setProgress(100)
    }, 8000)

    return () => clearInterval(interval)
  }, [CAROUSEL_LIMIT, movies.length])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - 1.25))
    }, 100)

    return () => clearInterval(timer)
  }, [currentIndex])

  const movie = movies[currentIndex] || movies[0]
  const backdropUrl = movie?.backdrop_path ? `${imageBaseUrl}${movie.backdrop_path}` : "/movie-theater-dark-background.jpg"

  if (!movie) return null

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 flex items-end pb-16">
        <div className="flex gap-8 items-end">
          <div className="hidden md:block w-48 lg:w-56 shrink-0">
            <img
              src={movie?.poster_path ? `${imageBaseUrl}${movie.poster_path}` : "/abstract-movie-poster.png"}
              alt={movie?.title}
              className="w-full rounded-xl shadow-2xl ring-1 ring-white/10"
            />
          </div>

          <div className="flex-1 max-w-2xl space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-accent bg-accent/20 px-3 py-1 rounded-full">Featured</span>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {CAROUSEL_LIMIT}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              {movie?.title || "Movie Title"}
            </h1>

            <p className="text-foreground/80 line-clamp-3 text-lg">{movie?.overview || "No description available"}</p>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="font-semibold text-foreground">{movie?.vote_average?.toFixed(1) || "N/A"}</span>
                <span className="text-muted-foreground">/10</span>
              </div>
              <span className="text-muted-foreground">{movie?.vote_count?.toLocaleString() || "0"} votes</span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button
                onClick={() => router.push(`/movie/${movie?.id}`)}
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-6"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Watch Trailer
              </Button>
              <Button variant="outline" onClick={() => router.push(`/movie/${movie?.id}`)} className="rounded-xl px-6">
                <Info className="w-4 h-4 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {[...Array(CAROUSEL_LIMIT)].map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setProgress(100)
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-accent" : "w-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
