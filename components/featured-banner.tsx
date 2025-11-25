"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import CountdownCircle from "@/components/countdown-circle"

interface FeaturedBannerProps {
  movies: any[]
  imageBaseUrl: string
}

export default function FeaturedBanner({ movies, imageBaseUrl }: FeaturedBannerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(100)
  const CAROUSEL_LIMIT = 6

  useEffect(() => {
    if (movies.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_LIMIT)
      setProgress(100)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - 1.25))
    }, 100)

    return () => clearInterval(timer)
  }, [currentIndex])

  const movie = movies[currentIndex] || movies[0]
  const backdropUrl = movie?.backdrop_path ? `${imageBaseUrl}${movie.backdrop_path}` : "/movie-backdrop.png"

  return (
    <section className="relative w-full h-96 md:h-screen bg-card overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(20,20,30,0.5)), url('${backdropUrl}')`,
        }}
      />

      {/* Numbered indicator at top */}
      <div className="absolute top-6 left-6 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg">
        <p className="text-sm font-semibold text-accent">
          {currentIndex + 1} / {CAROUSEL_LIMIT}
        </p>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="flex gap-8 w-full max-w-3xl">
          {/* Poster */}
          <div className="hidden md:block flex-shrink-0 w-48">
            <img
              src={movie?.poster_path ? `${imageBaseUrl}${movie.poster_path}` : "/abstract-movie-poster.png"}
              alt={movie?.title || "Movie"}
              className="w-full h-auto rounded-lg shadow-2xl object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
              {movie?.title || "Movie Title"}
            </h1>
            <p className="text-foreground/80 line-clamp-4 mb-6 max-w-xl leading-relaxed">
              {movie?.overview || "No description available"}
            </p>

            <div className="flex items-center gap-6 mb-6">
              <div>
                <p className="text-foreground/60 text-sm">Vote</p>
                <p className="text-xl font-bold text-accent">{movie?.vote_average?.toFixed(1) || "N/A"}/10</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm">Total votes</p>
                <p className="text-xl font-bold text-accent">{movie?.vote_count?.toLocaleString() || "0"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                className="bg-accent text-background hover:bg-accent/90 px-8"
                onClick={() => router.push(`/movie/${movie?.id}`)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {[...Array(CAROUSEL_LIMIT)].map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setProgress(100)
            }}
            className={`w-6 h-6 rounded-full transition text-xs font-semibold flex items-center justify-center ${
              index === currentIndex
                ? "bg-accent text-background"
                : "bg-foreground/30 text-foreground/60 hover:bg-foreground/50"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <CountdownCircle progress={progress} />
    </section>
  )
}
