"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

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

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [movies, setMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500"
  const paginationRange = 5

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        console.log("[v0] Searching for:", { query, page: currentPage })
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&page=${currentPage}`)
        const data: SearchResponse = await response.json()
        console.log("[v0] Search results received:", { results_count: data.results?.length })
        setMovies(data.results || [])
        setTotalPages(data.total_pages || 1)
        setTotalResults(data.total_results || 0)
      } catch (error) {
        console.error("[v0] Error searching:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, currentPage])

  const getPageNumbers = () => {
    const pages = []
    let start = Math.max(1, currentPage - Math.floor(paginationRange / 2))
    const end = Math.min(totalPages, start + paginationRange - 1)

    if (end - start < paginationRange - 1) {
      start = Math.max(1, end - paginationRange + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(newQuery)}`)
      setCurrentPage(1)
    }
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-accent mb-4">Search Results</h1>
          {query && (
            <p className="text-lg text-foreground/70 mb-8">
              {loading ? "Searching..." : `Found ${totalResults} result${totalResults !== 1 ? "s" : ""} for "${query}"`}
            </p>
          )}

          {!query ? (
            <div className="text-center py-12">
              <p className="text-foreground/70 text-lg">Enter a search query to find movies</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">Searching...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">No movies found for "{query}"</p>
            </div>
          ) : (
            <>
              {/* Pagination - Top */}
              <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                <Button onClick={handlePrevious} disabled={currentPage === 1} variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {getPageNumbers().map((page) => (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/movie/${movie.id}`)}
                  >
                    <div className="relative rounded-lg overflow-hidden bg-card mb-3 aspect-[2/3]">
                      <img
                        src={
                          movie?.poster_path
                            ? `${imageBaseUrl}${movie.poster_path}`
                            : "/placeholder.svg?height=400&width=300"
                        }
                        alt={movie?.title || "Movie"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground/90 line-clamp-2 mb-1 text-sm">
                      {movie?.title || "Untitled"}
                    </h3>
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

              {/* Pagination - Bottom */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Button onClick={handlePrevious} disabled={currentPage === 1} variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {getPageNumbers().map((page) => (
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
