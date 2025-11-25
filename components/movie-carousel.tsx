"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MovieCarouselProps {
  title: string
  movies: any[]
  imageBaseUrl: string
}

export default function MovieCarousel({ title, movies, imageBaseUrl }: MovieCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`carousel-${title}`)
    if (container) {
      const scrollAmount = 400
      const newPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
      container.scrollLeft = newPosition
      setScrollPosition(newPosition)
    }
  }

  return (
    <section className="py-12 bg-background px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          <a href="#" className="text-accent hover:text-accent/80 text-sm">
            See all to view more →
          </a>
        </div>

        <div className="relative group">
          {/* Carousel Container */}
          <div
            id={`carousel-${title}`}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-64 h-96 group/card rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={movie?.poster_path ? `${imageBaseUrl}${movie.poster_path}` : "/abstract-movie-poster.png"}
                  alt={movie?.title || "Movie"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <h3 className="text-white font-bold line-clamp-2">{movie?.title || "Untitled"}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={() => scroll("left")}
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-accent text-background hover:bg-accent/90 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => scroll("right")}
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-accent text-background hover:bg-accent/90 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
