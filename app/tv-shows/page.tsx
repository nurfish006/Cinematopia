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

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/tv?type=${filter}&page=${currentPage}`)
        const data: ApiResponse = await response.json()
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

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const filterLabels: Record<FilterType, string> = {
    popular: "Popular",
    top_rated: "Top Rated",
    on_the_air: "On The Air",
    airing_today: "Airing Today",
  }

  return (
    <>
      <Header onSearch={() => {}} />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">TV Shows</h1>

            {/* Filter tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-secondary/50 rounded-lg">
              {(["popular", "top_rated", "on_the_air", "airing_today"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === f
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1.5 mb-8">
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
                  currentPage === page ? "bg-accent text-accent-foreground hover:bg-accent/90" : "hover:bg-secondary"
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

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-secondary rounded-xl animate-pulse" />
              ))}
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No TV shows found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {shows.map((show) => (
                <button key={show.id} onClick={() => router.push(`/tv/${show.id}`)} className="group text-left">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-secondary">
                    <img
                      src={
                        show.poster_path
                          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                          : "/mystery-town-poster.png"
                      }
                      alt={show.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                        <span className="text-sm font-medium text-white">{show.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                    {show.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{show.vote_count?.toLocaleString()} votes</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
