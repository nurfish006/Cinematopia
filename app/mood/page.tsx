"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Star, RotateCcw, Sparkles } from "lucide-react"
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
  { label: "Cozy evening in", prompt: "I want something warm and comforting for a cozy night in" },
  { label: "Need a good cry", prompt: "I'm in the mood for an emotional movie that will make me cry" },
  { label: "Mind-bending", prompt: "I want something that will blow my mind with twists" },
  { label: "Date night", prompt: "Looking for a romantic but not cheesy movie for date night" },
  { label: "Pure excitement", prompt: "I need non-stop action and excitement" },
  { label: "Feeling nostalgic", prompt: "I'm feeling nostalgic and want something classic" },
  { label: "Make me laugh", prompt: "I desperately need to laugh until my stomach hurts" },
  { label: "Quiet late night", prompt: "It's late and I want something captivating but not too intense" },
]

export default function MoodMatcherPage() {
  const [mood, setMood] = useState("")
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [aiExplanation, setAiExplanation] = useState("")
  const [focusedInput, setFocusedInput] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
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
    textareaRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSearch={() => {}} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="container mx-auto px-4 pt-20 pb-8 md:pt-32 md:pb-12">
            <div className="max-w-2xl mx-auto text-center">
              {/* Subtle badge */}
              <div className="inline-flex items-center gap-1.5 mb-8">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Mood Matcher</span>
              </div>

              {/* Main headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-foreground mb-4 tracking-tight leading-tight text-balance">
                What are you in the mood for?
              </h1>

              <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                Describe your mood and we'll find the perfect film.
              </p>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="container mx-auto px-4 pb-8">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div
                className={`relative rounded-xl transition-all duration-200 ${
                  focusedInput ? "ring-2 ring-accent/20" : ""
                }`}
              >
                <textarea
                  ref={textareaRef}
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  placeholder="I'm feeling..."
                  className="w-full min-h-[100px] max-h-[140px] resize-none bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none p-5 pb-14 rounded-xl border border-border text-base leading-relaxed"
                  disabled={isLoading}
                />

                <div className="absolute bottom-3 right-3">
                  <Button
                    type="submit"
                    disabled={!mood.trim() || isLoading}
                    size="sm"
                    className="rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30 gap-1.5 px-4 h-9 text-sm font-medium"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        Find films
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Mood Suggestions */}
            {!hasSearched && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {moodSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3.5 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors duration-150 text-sm"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="container mx-auto px-4 py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-border border-t-accent animate-spin" />
              <p className="text-sm text-muted-foreground">Finding your perfect match...</p>
            </div>
          </section>
        )}

        {/* Results Section */}
        {!isLoading && hasSearched && (
          <section className="container mx-auto px-4 py-8 pb-20">
            <div className="max-w-4xl mx-auto">
              {/* Explanation */}
              {aiExplanation && (
                <div className="mb-10 text-center">
                  <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">{aiExplanation}</p>
                </div>
              )}

              {recommendations.length > 0 ? (
                <>
                  {/* Results Header */}
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

                  {/* Movie Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {recommendations.map((movie) => (
                      <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
                        {/* Poster */}
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-3">
                          <img
                            src={
                              movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/abstract-movie-poster.png"
                            }
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Rating */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm text-xs font-medium">
                            <Star className="w-3 h-3 text-accent fill-accent" />
                            {movie.vote_average?.toFixed(1)}
                          </div>
                        </div>

                        {/* Info */}
                        <h3 className="font-medium text-foreground text-sm leading-snug line-clamp-1 group-hover:text-accent transition-colors">
                          {movie.title}
                        </h3>

                        {movie.release_date && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(movie.release_date).getFullYear()}
                          </p>
                        )}

                        {movie.reason && (
                          <p className="text-xs text-accent mt-2 line-clamp-2 leading-relaxed">{movie.reason}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                /* Empty State */
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
