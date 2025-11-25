"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Moon, Sun, X, Menu, Film, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string
}

interface HeaderProps {
  onSearch: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(() => {
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Film className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:block">Cinematopia</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`font-medium transition-colors ${
              isActive("/") ? "text-accent" : "text-foreground/70 hover:text-accent"
            }`}
          >
            Home
          </Link>
          <Link
            href="/explore"
            className={`font-medium transition-colors ${
              isActive("/explore") ? "text-accent" : "text-foreground/70 hover:text-accent"
            }`}
          >
            Explore
          </Link>
          <Link
            href="/tv-shows"
            className={`font-medium transition-colors ${
              isActive("/tv-shows") ? "text-accent" : "text-foreground/70 hover:text-accent"
            }`}
          >
            TV Shows
          </Link>
          <Link
            href="/mood"
            className={`font-medium transition-colors flex items-center gap-1.5 ${
              isActive("/mood") ? "text-accent" : "text-foreground/70 hover:text-accent"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Mood Match
          </Link>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-foreground/10 rounded-lg transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex-1 max-w-md relative" ref={dropdownRef}>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-card border border-border rounded-xl text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              {searchResults.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent/10 transition text-left"
                >
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{movie.title}</p>
                    <p className="text-sm text-muted-foreground">{movie.release_date?.split("-")[0] || "N/A"}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResults && isSearching && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl p-4 text-center">
              <span className="text-muted-foreground">Searching...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2 rounded-lg font-medium ${isActive("/") ? "bg-accent text-accent-foreground" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isActive("/explore") ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            Explore
          </Link>
          <Link
            href="/tv-shows"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isActive("/tv-shows") ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            TV Shows
          </Link>
          <Link
            href="/mood"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isActive("/mood") ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Mood Match
          </Link>
        </nav>
      )}
    </header>
  )
}
