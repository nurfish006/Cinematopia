"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import FeaturedBanner from "@/components/featured-banner"
import MovieGrid from "@/components/movie-grid"
import Footer from "@/components/footer"

export default function Home() {
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true)

        const res = await fetch("/api/movies")
        const data = await res.json()

        if (data.nowPlaying) {
          setFeaturedMovies(data.nowPlaying)
        }
      } catch (error) {
        console.error("[v0] Error fetching movies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onSearch={setSearchQuery} />
      {!isLoading && featuredMovies.length > 0 && (
        <FeaturedBanner movies={featuredMovies} imageBaseUrl={IMAGE_BASE_URL} />
      )}
      <MovieGrid title="Now Playing" filter="now_playing" imageBaseUrl={IMAGE_BASE_URL} />
      <MovieGrid title="Popular" filter="popular" imageBaseUrl={IMAGE_BASE_URL} />
      <MovieGrid title="Top Rated" filter="top_rated" imageBaseUrl={IMAGE_BASE_URL} />
      <MovieGrid title="Upcoming" filter="upcoming" imageBaseUrl={IMAGE_BASE_URL} />
      <Footer />
    </div>
  )
}
