"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Star, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

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
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/movies?type=${filter}&page=${currentPage}`)
        const data: ApiResponse = await response.json()
        setMovies(data.results || [])
        setTotalPages(data.total_pages || 1)
      } catch (error) {
        console.error("[nurfish006] Error fetching movies:", error)
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

  const handleImageError = (movieId: number) => {
    setFailedImages((prev) => new Set(prev).add(movieId))
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">{title}</h2>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="rounded-lg w-8 h-8 hover:bg-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="hidden sm:flex items-center gap-0.5">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant="ghost"
                size="sm"
                className={`rounded-lg w-8 h-8 text-xs ${
                  currentPage === page ? "bg-accent text-accent-foreground hover:bg-accent/90" : "hover:bg-secondary"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="rounded-lg w-8 h-8 hover:bg-secondary"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-secondary rounded-xl animate-pulse" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No movies found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <button key={movie.id} onClick={() => router.push(`/movie/${movie.id}`)} className="group text-left">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-secondary">
                {movie.poster_path ? (
                  <img
                    src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <ImageOff className="w-8 h-8" />
                    <span className="text-xs text-center px-2">{movie.title}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <span className="text-sm font-medium text-white">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                {movie.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{movie.vote_count?.toLocaleString()} votes</p>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
