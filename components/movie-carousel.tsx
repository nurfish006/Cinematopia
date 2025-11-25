"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MovieCarouselProps {
  title: string
  movies: any[]
  imageBaseUrl: string
}

export default function MovieCarousel({ title, movies, imageBaseUrl }: MovieCarouselProps) {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <Link href="/explore" className="text-sm text-accent hover:underline font-medium">
          See all
        </Link>
      </div>

      <div className="relative group">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => router.push(`/movie/${movie.id}`)}
              className="shrink-0 w-40 md:w-48 group/card text-left"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card ring-1 ring-border group-hover/card:ring-accent transition-all duration-300">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/abstract-movie-poster.png"
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-xs font-medium">{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
              <h3 className="mt-2 font-medium text-foreground line-clamp-1 group-hover/card:text-accent transition-colors">
                {movie.title}
              </h3>
            </button>
          ))}
        </div>

        <Button
          onClick={() => scroll("left")}
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-accent text-accent-foreground hover:bg-accent/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => scroll("right")}
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-accent text-accent-foreground hover:bg-accent/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  )
}
