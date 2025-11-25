"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Star, RotateCcw, Sparkles, ImageOff } from "lucide-react"
import Link from "next/link"

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  vote_average: number
  release_date: string
  reason?: string
}

interface MoodSuggestion {
  label: string
  prompt: string
}

const moodSuggestions: MoodSuggestion[] = [
  { label: "Cozy evening", prompt: "I want something warm and comforting for a cozy night in" },
  { label: "Need a cry", prompt: "I'm in the mood for an emotional movie that will make me cry" },
  { label: "Mind-bending", prompt: "I want something that will blow my mind with twists" },
  { label: "Date night", prompt: "Looking for a romantic but not cheesy movie for date night" },
  { label: "Pure thrill", prompt: "I need non-stop action and excitement" },
  { label: "Nostalgic", prompt: "I'm feeling nostalgic and want something classic" },
  { label: "Make me laugh", prompt: "I desperately need to laugh until my stomach hurts" },
  { label: "Late night", prompt: "It's late and I want something captivating but not too intense" },
]

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

export default function MoodMatcherPage() {
  const [mood, setMood] = useState("")
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [aiExplanation, setAiExplanation] = useState("")
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [mood])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mood.trim() || isLoading) return

    setIsLoading(true)
    setHasSearched(true)
    setRecommendations([])
    setAiExplanation("")

    try {
      const response = await fetch("/api/mood-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: mood.trim() }),
      })

      if (!response.ok) throw new Error("Failed to get recommendations")

      const data = await response.json()
      setRecommendations(data.movies || [])
      setAiExplanation(data.explanation || "")
    } catch (error) {
      console.error("Error getting mood recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: MoodSuggestion) => {
    setMood(suggestion.prompt)
    textareaRef.current?.focus()
  }

  const handleReset = () => {
    setMood("")
    setRecommendations([])
    setHasSearched(false)
    setAiExplanation("")
    setFailedImages(new Set())
    textareaRef.current?.focus()
  }

  const handleImageError = (movieId: number) => {
    setFailedImages((prev) => new Set(prev).add(movieId))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSearch={() => {}} />

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-20 pb-10 md:pt-28 md:pb-12">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Mood Match</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-snug text-balance">
              <span className="text-foreground">What are you </span>
              <span className="text-accent">in the mood</span>
              <span className="text-foreground"> for?</span>
            </h1>

            <p className="text-muted-foreground mt-4 text-base max-w-sm mx-auto">
              Describe how you feel and discover your perfect film.
            </p>
          </div>
        </section>

        {/* Input */}
        <section className="container mx-auto px-6 pb-10">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="I'm feeling..."
                  className="w-full min-h-[100px] max-h-[120px] resize-none bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/20 p-5 pb-16 rounded-xl border border-border text-base leading-relaxed transition-shadow"
                  disabled={isLoading}
                />

                <div className="absolute bottom-4 right-4">
                  <Button
                    type="submit"
                    disabled={!mood.trim() || isLoading}
                    size="sm"
                    className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40 gap-2 px-5 h-9 text-sm font-medium"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Find films
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Suggestions */}
            {!hasSearched && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {moodSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/70 transition-colors text-sm"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Loading */}
        {isLoading && (
          <section className="container mx-auto px-6 py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-border border-t-accent animate-spin" />
              <p className="text-sm text-muted-foreground">Finding your perfect match...</p>
            </div>
          </section>
        )}

        {/* Results */}
        {!isLoading && hasSearched && (
          <section className="container mx-auto px-6 py-8 pb-20">
            <div className="max-w-4xl mx-auto">
              {aiExplanation && (
                <div className="mb-10 text-center">
                  <p className="text-muted-foreground max-w-md mx-auto">{aiExplanation}</p>
                </div>
              )}

              {recommendations.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-muted-foreground">{recommendations.length} films found</p>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Start over
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {recommendations.map((movie) => (
                      <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-secondary">
                          {movie.poster_path && !failedImages.has(movie.id) ? (
                            <img
                              src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                              alt={movie.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={() => handleImageError(movie.id)}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                              <ImageOff className="w-8 h-8" />
                              <span className="text-xs text-center px-2">{movie.title}</span>
                            </div>
                          )}
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium">
                            <Star className="w-3 h-3 text-accent fill-accent" />
                            {movie.vote_average?.toFixed(1)}
                          </div>
                        </div>

                        <h3 className="mt-3 text-sm font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                          {movie.title}
                        </h3>

                        {movie.release_date && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(movie.release_date).getFullYear()}
                          </p>
                        )}

                        {movie.reason && (
                          <p className="text-xs text-accent/80 mt-2 line-clamp-2 leading-relaxed">{movie.reason}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No matches found for this mood.</p>
                  <Button variant="outline" size="sm" onClick={handleReset} className="rounded-lg bg-transparent">
                    Try a different mood
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
