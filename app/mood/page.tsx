"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Film, Loader2, Star, RotateCcw } from "lucide-react"
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
  icon: string
}

const moodSuggestions: MoodSuggestion[] = [
  { label: "Cozy Evening", prompt: "I want something warm and comforting for a cozy night in", icon: "🌙" },
  { label: "Emotional", prompt: "I'm in the mood for an emotional movie that will make me cry", icon: "💫" },
  { label: "Mind-Bending", prompt: "I want something that will blow my mind with twists", icon: "🌀" },
  { label: "Date Night", prompt: "Looking for a romantic but not cheesy movie for date night", icon: "✨" },
  { label: "Thrilling", prompt: "I need non-stop action and excitement", icon: "⚡" },
  { label: "Nostalgic", prompt: "I'm feeling nostalgic and want something classic", icon: "🎞" },
  { label: "Comedy", prompt: "I desperately need to laugh until my stomach hurts", icon: "😄" },
  { label: "Late Night", prompt: "It's late and I want something captivating but not too intense", icon: "🌃" },
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
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
        <section className="relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent pointer-events-none" />

          <div className="container mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16">
            <div className="max-w-3xl mx-auto text-center">
              {/* Elegant label */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent mb-8">
                <span className="text-xs font-medium tracking-widest uppercase">Mood Matcher</span>
              </div>

              {/* Main headline - elegant serif-inspired weight */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 tracking-tight text-balance leading-[1.1]">
                Find Films That
                <span className="block font-normal text-accent">Match Your Mood</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
                Describe how you're feeling, and we'll curate the perfect selection for your moment.
              </p>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div
                className={`relative bg-card rounded-2xl border transition-all duration-300 ${
                  focusedInput ? "border-accent/40 shadow-lg shadow-accent/5" : "border-border shadow-sm"
                }`}
              >
                <textarea
                  ref={textareaRef}
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  placeholder="I'm in the mood for..."
                  className="w-full min-h-[120px] max-h-[160px] resize-none bg-transparent text-foreground text-lg placeholder:text-muted-foreground/60 focus:outline-none p-6 pb-16"
                  disabled={isLoading}
                />

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground/60 hidden sm:block">
                    The more you share, the better the match
                  </span>
                  <Button
                    type="submit"
                    disabled={!mood.trim() || isLoading}
                    className="ml-auto rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 gap-2 px-6 h-10 font-medium transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Finding...</span>
                      </>
                    ) : (
                      <>
                        <span>Find Films</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Mood Suggestions */}
            {!hasSearched && (
              <div className="mt-8">
                <p className="text-sm text-muted-foreground mb-4 text-center">Quick suggestions</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {moodSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-all duration-200 text-sm border border-transparent hover:border-border"
                    >
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">{suggestion.icon}</span>
                      <span>{suggestion.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-accent/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
                <Film className="absolute inset-0 m-auto w-6 h-6 text-accent/60" />
              </div>
              <p className="text-muted-foreground text-center">Curating your personalized selection...</p>
            </div>
          </section>
        )}

        {/* Results Section */}
        {!isLoading && hasSearched && (
          <section className="container mx-auto px-4 pb-20">
            <div className="max-w-5xl mx-auto">
              {/* AI Explanation */}
              {aiExplanation && (
                <div className="mb-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/[0.02] border border-accent/10">
                  <p className="text-foreground/80 leading-relaxed text-center text-lg italic">"{aiExplanation}"</p>
                </div>
              )}

              {recommendations.length > 0 ? (
                <>
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-light text-foreground">Your Curated Selection</h2>
                      <p className="text-muted-foreground mt-1">{recommendations.length} films matched to your mood</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleReset}
                      className="rounded-xl gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">Start Over</span>
                    </Button>
                  </div>

                  {/* Movie Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((movie, index) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5"
                      >
                        {/* Poster */}
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <img
                            src={
                              movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/abstract-movie-poster.png"
                            }
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Rank badge */}
                          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-sm font-semibold text-foreground border border-border/50">
                            {index + 1}
                          </div>

                          {/* Rating badge */}
                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground border border-border/50">
                            <Star className="w-3 h-3 text-accent fill-accent" />
                            {movie.vote_average?.toFixed(1)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-medium text-foreground text-lg line-clamp-1 group-hover:text-accent transition-colors">
                            {movie.title}
                          </h3>

                          {movie.release_date && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(movie.release_date).getFullYear()}
                            </p>
                          )}

                          {movie.reason && (
                            <p className="text-sm text-accent/80 mt-3 line-clamp-2 leading-relaxed">{movie.reason}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                    <Film className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-light text-foreground mb-2">No matches found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try describing your mood differently, or explore one of our suggestions.
                  </p>
                  <Button variant="outline" onClick={handleReset} className="rounded-xl bg-transparent">
                    Try Again
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
