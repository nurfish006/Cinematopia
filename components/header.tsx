"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, Star, Moon, Sun, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
}

interface HeaderProps {
  onSearch: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search).get("q")
      return query || ""
    }
    return ""
  })
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchRef = useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = localStorage.getItem("theme") === "dark" || !localStorage.getItem("theme")
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Sync search value from URL whenever it changes
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q")
    if (query) {
      setSearchValue(decodeURIComponent(query))
    }
  }, [pathname])

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      if (searchRef.current) clearTimeout(searchRef.current)
      
      searchRef.current = setTimeout(async () => {
        try {
          setIsSearching(true)
          const response = await fetch(`/api/search?query=${encodeURIComponent(searchValue)}&page=1`)
          const data = await response.json()
          setSearchResults(data.results?.slice(0, 5) || [])
          setShowResults(true)
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsSearching(false)
        }
      }, 300)
    } else {
      setShowResults(false)
      setSearchResults([])
    }

    return () => {
      if (searchRef.current) clearTimeout(searchRef.current)
    }
  }, [searchValue])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`)
      setShowResults(false)
    }
  }

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`)
    setSearchValue("")
    setShowResults(false)
  }

  const handleClear = () => {
    setSearchValue("")
    setShowResults(false)
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-accent/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition" onClick={() => router.push("/")}>
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Star className="w-6 h-6 text-background" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-accent">Cinematopia</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className={`transition ${isActive("/") ? "text-accent font-semibold" : "text-foreground/80 hover:text-accent"}`}>
            Home
          </a>
          <a href="/explore" className={`transition ${isActive("/explore") ? "text-accent font-semibold" : "text-foreground/80 hover:text-accent"}`}>
            Explore
          </a>
          <a href="/tv-shows" className={`transition ${isActive("/tv-shows") ? "text-accent font-semibold" : "text-foreground/80 hover:text-accent"}`}>
            TV Shows
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-foreground/10 rounded transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <form onSubmit={handleSearch} className="flex items-center gap-2 order-3 md:order-none w-full md:w-auto md:flex-none sm:w-64 sm:order-none">
          <div className="relative w-full sm:w-64" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-accent/30 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-accent transition"
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-10 top-2.5 text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {!searchValue && (
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-foreground/50 pointer-events-none" />
            )}

            {/* Search Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-accent/30 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.map((movie: any) => (
                  <div
                    key={movie.id}
                    className="flex gap-3 px-4 py-3 border-b border-foreground/10 last:border-b-0 hover:bg-background/80 transition"
                  >
                    {/* Poster Image */}
                    {movie.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-12 h-16 rounded object-cover flex-shrink-0"
                      />
                    )}
                    
                    {/* Movie Info */}
                    <button
                      onClick={() => handleMovieClick(movie.id)}
                      className="flex-1 text-left"
                    >
                      <h3 className="text-sm font-semibold text-foreground mb-1">{movie.title}</h3>
                      <p className="text-xs text-foreground/70 line-clamp-2 mb-2">
                        {movie.overview || "No description available"}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-foreground/60">
                          Release Date: {movie.release_date || "N/A"}
                        </p>
                        <a
                          href={`/movie/${movie.id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            handleMovieClick(movie.id)
                          }}
                          className="text-xs text-accent hover:underline ml-2"
                        >
                          more
                        </a>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showResults && isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-accent/30 rounded-lg shadow-lg p-4 z-50 text-center">
                <p className="text-xs text-foreground/60">Searching...</p>
              </div>
            )}

            {showResults && !isSearching && searchResults.length === 0 && searchValue.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-accent/30 rounded-lg shadow-lg p-4 z-50 text-center">
                <p className="text-xs text-foreground/60">No results found</p>
              </div>
            )}
          </div>
          <Button type="submit" size="sm" className="bg-accent text-background hover:bg-accent/90">
            <Search className="w-4 h-4" />
          </Button>
          {mounted && (
            <Button
              onClick={toggleTheme}
              size="sm"
              variant="outline"
              className="ml-2 bg-transparent"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
        </form>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-background border-t border-accent/20 px-4 py-4 flex flex-col gap-4">
          <a
            href="/"
            className={`block py-2 transition ${isActive("/") ? "text-accent font-semibold" : "text-foreground/80 hover:text-accent"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/explore"
            className={`block py-2 transition ${isActive("/explore") ? "text-accent font-semibold" : "text-foreground/80 hover:text-accent"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore
          </a>
          <a
            href="/tv-shows"
            className={`block py-2 transition ${isActive("/tv-shows") ? "text-accent font-semibold" : "text-foreground/80 hover:text-accent"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            TV Shows
          </a>
        </nav>
      )}
    </header>
  )
}
