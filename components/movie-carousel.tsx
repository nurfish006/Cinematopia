"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Star, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

interface MovieCarouselProps {
  title: string
  movies: any[]
  imageBaseUrl: string
}

export default function MovieCarousel({ title, movies, imageBaseUrl }: MovieCarouselProps) {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleImageError = (movieId: number) => {
    setFailedImages((prev) => new Set(prev).add(movieId))
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">{title}</h2>
        <Link href="/explore" className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
          View all
        </Link>
      </div>

      <div className="relative group/container">
        <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => router.push(`/movie/${movie.id}`)}
              className="shrink-0 w-40 md:w-44 group text-left"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-secondary">
                {movie.poster_path && !failedImages.has(movie.id) ? (
                  <img
                    src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => handleImageError(movie.id)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <ImageOff className="w-8 h-8" />
                    <span className="text-xs text-center px-2">{movie.title}</span>
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-xs font-medium">{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                {movie.title}
              </h3>
            </button>
          ))}
        </div>

        <Button
          onClick={() => scroll("left")}
          size="icon"
          className="absolute left-0 top-1/3 -translate-x-3 w-9 h-9 bg-background border border-border shadow-lg rounded-full opacity-0 group-hover/container:opacity-100 transition-opacity hover:bg-secondary"
          variant="ghost"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => scroll("right")}
          size="icon"
          className="absolute right-0 top-1/3 translate-x-3 w-9 h-9 bg-background border border-border shadow-lg rounded-full opacity-0 group-hover/container:opacity-100 transition-opacity hover:bg-secondary"
          variant="ghost"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  )
}
