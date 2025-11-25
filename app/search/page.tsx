"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

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

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Search Results</h1>
          {query && (
            <p className="text-muted-foreground mt-2">
              {loading ? "Searching..." : `Found ${totalResults} result${totalResults !== 1 ? "s" : ""} for "${query}"`}
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Enter a search term to find movies</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No results found for &quot;{query}&quot;</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-muted"
                >
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-medium text-sm line-clamp-2">{movie.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-primary text-xs">★</span>
                        <span className="text-white/80 text-xs">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-muted text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/80 transition-colors"
                >
                  Previous
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-muted text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/80 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
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
