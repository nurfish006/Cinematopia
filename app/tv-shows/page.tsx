"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

type FilterType = "popular" | "top_rated" | "on_the_air" | "airing_today"

interface TVShow {
  id: number
  name: string
  poster_path: string
  vote_average: number
  vote_count: number
}

interface ApiResponse {
  results: TVShow[]
  total_pages: number
  current_page: number
  total_results: number
}

export default function TVShowsPage() {
  const router = useRouter()
  const [shows, setShows] = useState<TVShow[]>([])
  const [filter, setFilter] = useState<FilterType>("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500"
  const paginationRange = 5

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true)
      try {
        console.log("[v0] Fetching TV shows:", { filter, currentPage })
        const response = await fetch(`/api/tv?type=${filter}&page=${currentPage}`)
        const data: ApiResponse = await response.json()
        console.log("[v0] TV shows fetched:", { results_count: data.results?.length, total_pages: data.total_pages })
        setShows(data.results || [])
        setTotalPages(data.total_pages || 1)
      } catch (error) {
        console.error("[v0] Error fetching TV shows:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [filter, currentPage])

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

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    console.log("[v0] Search:", query)
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-accent mb-12">Explore TV Shows</h1>

          <div className="flex gap-4 md:gap-8 mb-8 border-b border-accent/20 pb-4 flex-wrap">
            <button
              onClick={() => handleFilterChange("popular")}
              className={`text-sm md:text-lg font-semibold transition-colors ${
                filter === "popular"
                  ? "text-accent border-b-2 border-accent pb-2"
                  : "text-foreground/70 hover:text-accent"
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => handleFilterChange("top_rated")}
              className={`text-sm md:text-lg font-semibold transition-colors ${
                filter === "top_rated"
                  ? "text-accent border-b-2 border-accent pb-2"
                  : "text-foreground/70 hover:text-accent"
              }`}
            >
              Top Rated
            </button>
            <button
              onClick={() => handleFilterChange("on_the_air")}
              className={`text-sm md:text-lg font-semibold transition-colors ${
                filter === "on_the_air"
                  ? "text-accent border-b-2 border-accent pb-2"
                  : "text-foreground/70 hover:text-accent"
              }`}
            >
              On The Air
            </button>
            <button
              onClick={() => handleFilterChange("airing_today")}
              className={`text-sm md:text-lg font-semibold transition-colors ${
                filter === "airing_today"
                  ? "text-accent border-b-2 border-accent pb-2"
                  : "text-foreground/70 hover:text-accent"
              }`}
            >
              Airing Today
            </button>
          </div>

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

          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">Loading TV shows...</p>
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">No TV shows found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {shows.map((show) => (
                <div
                  key={show.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/tv/${show.id}`)}
                >
                  <div className="relative rounded-lg overflow-hidden bg-card mb-3 aspect-[2/3]">
                    <img
                      src={
                        show?.poster_path
                          ? `${imageBaseUrl}${show.poster_path}`
                          : "/placeholder.svg?height=400&width=300"
                      }
                      alt={show?.name || "TV Show"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground/90 line-clamp-2 mb-1 text-sm">
                    {show?.name || "Untitled"}
                  </h3>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.round(show?.vote_average / 2) ? "fill-accent text-accent" : "text-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-foreground/60">Total votes: {show?.vote_count?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

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
        </div>
      </main>
      <Footer />
    </>
  )
}
