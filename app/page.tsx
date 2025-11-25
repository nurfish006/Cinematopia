"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import FeaturedBanner from "@/components/featured-banner"
import MovieGrid from "@/components/movie-grid"
import MovieCarousel from "@/components/movie-carousel"
import Footer from "@/components/footer"

export default function Home() {
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([])
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
        if (data.topRated) {
          setTopRatedMovies(data.topRated)
        }
      } catch (error) {
        console.error("[nurfish006] Error fetching movies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />

      {!isLoading && featuredMovies.length > 0 && (
        <FeaturedBanner movies={featuredMovies} imageBaseUrl={IMAGE_BASE_URL} />
      )}

      <main className="container mx-auto px-6 py-12 space-y-16">
        {!isLoading && topRatedMovies.length > 0 && (
          <MovieCarousel title="Top Rated" movies={topRatedMovies} imageBaseUrl={IMAGE_BASE_URL} />
        )}

        <MovieGrid title="Now Playing" filter="now_playing" imageBaseUrl={IMAGE_BASE_URL} />

        <MovieGrid title="Popular" filter="popular" imageBaseUrl={IMAGE_BASE_URL} />
      </main>

      <Footer />
    </div>
  )
}
