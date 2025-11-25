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
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-foreground">Explore TV Shows</h1>

            <div className="flex flex-wrap items-center gap-4">
              {(["popular", "top_rated", "on_the_air", "airing_today"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`text-sm md:text-base font-semibold transition-colors ${
                    filter === f ? "text-accent border-b-2 border-accent pb-1" : "text-foreground/70 hover:text-accent"
                  }`}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((page) => (
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

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-card rounded-xl animate-pulse" />
              ))}
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No TV shows found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {shows.map((show) => (
                <button key={show.id} onClick={() => router.push(`/tv/${show.id}`)} className="group text-left">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card ring-1 ring-border group-hover:ring-accent transition-all duration-300 group-hover:scale-[1.02]">
                    <img
                      src={
                        show.poster_path
                          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                          : "/mystery-town-poster.png"
                      }
                      alt={show.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="w-3 h-3 fill-accent" />
                        <span className="text-sm font-medium">{show.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                    {show.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{show.vote_count?.toLocaleString()} votes</p>
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
