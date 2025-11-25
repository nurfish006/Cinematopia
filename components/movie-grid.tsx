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

  const getPaginationRange = () => {
    const range = 2
    const start = Math.max(1, currentPage - range)
    const end = Math.min(totalPages, currentPage + range)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const pageNumbers = getPaginationRange()

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="rounded-xl bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className={
                  currentPage === page ? "bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg" : "rounded-lg"
                }
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="rounded-xl bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No movies found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <button key={movie.id} onClick={() => router.push(`/movie/${movie.id}`)} className="group text-left">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card ring-1 ring-border group-hover:ring-accent transition-all duration-300 group-hover:scale-[1.02]">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/abstract-movie-poster.png"
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-3 h-3 fill-accent" />
                    <span className="text-sm font-medium">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <h3 className="mt-2 font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                {movie.title}
              </h3>
              <p className="text-xs text-muted-foreground">{movie.vote_count?.toLocaleString()} votes</p>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
