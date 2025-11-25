"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Star, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  vote_count: number
}

interface SearchResponse {
  results: Movie[]
  total_pages: number
  current_page: number
  total_results: number
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [movies, setMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&page=${currentPage}`)
        const data: SearchResponse = await response.json()
        setMovies(data.results || [])
        setTotalPages(data.total_pages || 1)
        setTotalResults(data.total_results || 0)
      } catch (error) {
        console.error("Error searching:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, currentPage])

  const getPageNumbers = () => {
    const pages = []
    const range = 2
    let start = Math.max(1, currentPage - range)
    const end = Math.min(totalPages, start + 4)

    if (end - start < 4) {
      start = Math.max(1, end - 4)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const handleImageError = (movieId: number) => {
    setFailedImages((prev) => new Set(prev).add(movieId))
  }

  return (
    <>
      <Header onSearch={() => {}} />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Search Results</h1>
            {query && (
              <p className="text-muted-foreground mt-2 text-sm">
                {loading
                  ? "Searching..."
                  : `Found ${totalResults} result${totalResults !== 1 ? "s" : ""} for "${query}"`}
              </p>
            )}
          </div>

          {!query ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Enter a search term to find movies</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-secondary rounded-xl animate-pulse" />
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No results found for "{query}"</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((movie) => (
                  <Link key={movie.id} href={`/movie/${movie.id}`} className="group text-left">
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
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg w-8 h-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {getPageNumbers().map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant="ghost"
                      size="sm"
                      className={`rounded-lg w-8 h-8 text-xs ${
                        currentPage === page
                          ? "bg-accent text-accent-foreground hover:bg-accent/90"
                          : "hover:bg-secondary"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg w-8 h-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-10">
            <div className="h-8 w-48 bg-secondary rounded-lg animate-pulse mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-secondary rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
