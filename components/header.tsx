"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Moon, Sun, X, Menu, Clapperboard, Sparkles } from "lucide-react"
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center transition-transform group-hover:scale-105">
            <Clapperboard className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight hidden sm:block">
            <span className="text-foreground">Cinema</span>
            <span className="text-accent">topia</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "Home" },
            { href: "/explore", label: "Explore" },
            { href: "/tv-shows", label: "TV Shows" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/mood"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive("/mood")
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:text-accent hover:bg-accent/10"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Mood Match
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Search */}
        <div className="flex-1 max-w-sm relative" ref={dropdownRef}>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search films..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-10 px-4 pl-10 bg-secondary/50 border-0 rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-secondary transition-all text-sm"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Search dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden">
              {searchResults.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left"
                >
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-9 h-13 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{movie.title}</p>
                    <p className="text-xs text-muted-foreground">{movie.release_date?.split("-")[0] || "N/A"}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResults && isSearching && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl p-4 text-center">
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <div className="flex items-center">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg w-9 h-9 hover:bg-secondary">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {[
            { href: "/", label: "Home" },
            { href: "/explore", label: "Explore" },
            { href: "/tv-shows", label: "TV Shows" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href) ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/mood"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/mood") ? "bg-accent/15 text-accent" : "text-muted-foreground hover:bg-accent/10"
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
