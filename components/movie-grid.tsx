"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MovieGridProps {
  title: string
  filter: "popular" | "top_rated" | "upcoming" | "in_cinemas" | "now_playing"
  imageBaseUrl: string
}

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  vote_count: number
}

interface ApiResponse {
  results: Movie[]
  total_pages: number
  current_page: number
  total_results: number
}

export default function MovieGrid({ title, filter, imageBaseUrl }: MovieGridProps) {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/movies?type=${filter}&page=${currentPage}`)
        const data: ApiResponse = await response.json()
        setMovies(data.results || [])
        setTotalPages(data.total_pages || 1)
      } catch (error) {
        console.error("[v0] Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [filter, currentPage])

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  // Generate page numbers around current page (show 5 pages max)
  const getPaginationRange = () => {
    const range = 2
    const start = Math.max(1, currentPage - range)
    const end = Math.min(totalPages, currentPage + range)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const pageNumbers = getPaginationRange()
  const displayedMovies = movies

  return (
    <section className="py-8 md:py-12 bg-card/50 px-4">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{title}</h2>

        {/* Pagination - Top */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <Button onClick={handlePrevious} disabled={currentPage === 1} variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-1">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={currentPage === page ? "bg-accent text-background hover:bg-accent/90" : ""}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button onClick={handleNext} disabled={currentPage === totalPages} variant="outline" size="sm">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">Loading movies...</p>
          </div>
        ) : displayedMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">No movies found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {displayedMovies.map((movie) => (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/movie/${movie.id}`)}
              >
                <div className="relative rounded-lg overflow-hidden bg-card mb-3 aspect-[2/3]">
                  <img
                    src={movie?.poster_path ? `${imageBaseUrl}${movie.poster_path}` : "/placeholder.svg?height=400&width=300"}
                    alt={movie?.title || "Movie"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-foreground/90 line-clamp-2 mb-1 text-sm">{movie?.title || "Untitled"}</h3>
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(movie?.vote_average / 2) ? "fill-accent text-accent" : "text-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-foreground/60">Total votes: {movie?.vote_count?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Bottom */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button onClick={handlePrevious} disabled={currentPage === 1} variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-1">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={currentPage === page ? "bg-accent text-background hover:bg-accent/90" : ""}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button onClick={handleNext} disabled={currentPage === totalPages} variant="outline" size="sm">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}
