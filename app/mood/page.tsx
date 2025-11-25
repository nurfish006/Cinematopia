"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Send, Film, RefreshCw, Star, Calendar } from "lucide-react"
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
  {
    label: "Cozy night in",
    prompt: "I want something warm and comforting for a cozy night in with blankets and hot cocoa",
  },
  { label: "Need a good cry", prompt: "I'm in the mood for an emotional movie that will make me cry" },
  { label: "Mind-bending", prompt: "I want something that will blow my mind with twists and make me think" },
  { label: "Date night", prompt: "Looking for a romantic but not cheesy movie for date night" },
  { label: "Adrenaline rush", prompt: "I need non-stop action and excitement to get my heart pumping" },
  { label: "Feeling nostalgic", prompt: "I'm feeling nostalgic and want something that reminds me of the 90s" },
  { label: "Laugh out loud", prompt: "I desperately need to laugh until my stomach hurts" },
  { label: "Can't sleep", prompt: "It's 2am and I can't sleep, I want something captivating but not too intense" },
]

export default function MoodMatcherPage() {
  const [mood, setMood] = useState("")
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [aiExplanation, setAiExplanation] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-6">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">AI Mood Matcher</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Tell us how you're feeling, what you're in the mood for, or describe your perfect movie night. Our AI will
              find the perfect films to match your vibe.
            </p>
          </div>

          {/* Input Section */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative bg-card rounded-2xl border border-border p-4 shadow-lg">
              <Textarea
                ref={textareaRef}
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Describe your mood, occasion, or what kind of movie experience you want..."
                className="min-h-[100px] max-h-[200px] resize-none border-0 bg-transparent text-foreground text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Be as descriptive as you like - the more context, the better the matches!
                </p>
                <Button
                  type="submit"
                  disabled={!mood.trim() || isLoading}
                  className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Matching...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Find Movies
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Mood Suggestions */}
          {!hasSearched && (
            <div className="mb-12">
              <p className="text-sm text-muted-foreground mb-4 text-center">Or try one of these:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {moodSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
                <Film className="w-6 h-6 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-muted-foreground animate-pulse">Analyzing your mood and finding perfect matches...</p>
            </div>
          )}

          {/* Results Section */}
          {!isLoading && hasSearched && (
            <div className="space-y-8">
              {aiExplanation && (
                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <p className="text-foreground/90 leading-relaxed">{aiExplanation}</p>
                  </div>
                </div>
              )}

              {recommendations.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Your Personalized Picks</h2>
                    <Button variant="outline" onClick={handleReset} className="rounded-xl gap-2 bg-transparent">
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.map((movie, index) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="group flex gap-4 bg-card rounded-2xl p-4 border border-border hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all"
                      >
                        <div className="relative shrink-0">
                          <span className="absolute -top-2 -left-2 w-7 h-7 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold z-10">
                            {index + 1}
                          </span>
                          <img
                            src={
                              movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/abstract-movie-poster.png"
                            }
                            alt={movie.title}
                            className="w-24 h-36 object-cover rounded-xl ring-1 ring-border group-hover:ring-accent/50 transition-all"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <h3 className="font-semibold text-foreground text-lg line-clamp-1 group-hover:text-accent transition-colors">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-accent fill-accent" />
                              {movie.vote_average?.toFixed(1)}
                            </span>
                            {movie.release_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(movie.release_date).getFullYear()}
                              </span>
                            )}
                          </div>
                          {movie.reason && (
                            <p className="text-sm text-accent font-medium line-clamp-2">{movie.reason}</p>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2">{movie.overview}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No movies found for that mood. Try describing it differently!
                  </p>
                  <Button variant="outline" onClick={handleReset} className="rounded-xl bg-transparent">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
