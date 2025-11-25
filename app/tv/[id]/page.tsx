"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Star, ArrowLeft, Play } from "lucide-react"

interface TVShowDetails {
  id: number
  name: string
  overview: string
  backdrop_path: string
  poster_path: string
  vote_average: number
  vote_count: number
  first_air_date: string
  number_of_seasons: number
  number_of_episodes: number
  genres: Array<{ id: number; name: string }>
}

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

interface Cast {
  id: number
  name: string
  character: string
  profile_path: string
}

export default function TVShowDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const showId = params.id as string

  const [show, setShow] = useState<TVShowDetails | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [cast, setCast] = useState<Cast[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        console.log("[v0] Fetching TV show details for:", showId)
        const response = await fetch(`/api/tv/${showId}`, {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] TV show data received:", {
          name: data.show?.name,
          videosCount: data.videos?.length,
          castCount: data.cast?.length,
        })

        setShow(data.show)
        setVideos(data.videos || [])
        setCast(data.cast || [])

        // Set first trailer or video as default
        const trailer = data.videos?.find(
          (v: Video) => v.type === "Trailer" && v.site === "YouTube"
        )
        if (trailer) {
          console.log("[v0] Trailer found:", trailer.name)
          setSelectedVideo(trailer)
        } else if (data.videos && data.videos.length > 0) {
          console.log("[v0] No trailer, using first video:", data.videos[0].name)
          setSelectedVideo(data.videos[0])
        } else {
          console.log("[v0] No videos found for this TV show")
        }
      } catch (error) {
        console.error("[v0] Error fetching TV show details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (showId) {
      fetchDetails()
    }
  }, [showId])

  if (loading) {
    return (
      <>
        <Header onSearch={() => {}} />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground/70">Loading TV show details...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!show) {
    return (
      <>
        <Header onSearch={() => {}} />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground/70">TV show not found</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header onSearch={() => {}} />
      <main className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="pt-4 px-4">
          <Button onClick={() => router.back()} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Backdrop */}
        <div className="relative w-full h-96 md:h-screen bg-card overflow-hidden mb-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(20,20,30,0.5)), url('${
                show.backdrop_path ? `${IMAGE_BASE_URL}${show.backdrop_path}` : ""
              }')`,
            }}
          />

          {/* Show Info Overlay */}
          <div className="relative h-full container mx-auto px-4 flex items-end pb-12">
            <div className="flex gap-8 w-full max-w-4xl">
              <div className="hidden md:block flex-shrink-0 w-48">
                <img
                  src={
                    show.poster_path
                      ? `${IMAGE_BASE_URL}${show.poster_path}`
                      : "/placeholder.svg"
                  }
                  alt={show.name}
                  className="w-full h-auto rounded-lg shadow-2xl object-cover"
                />
              </div>

              <div className="flex-1 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{show.name}</h1>
                <p className="text-foreground/80 line-clamp-3 mb-4 leading-relaxed">
                  {show.overview}
                </p>

                <div className="flex items-center gap-8 mb-6">
                  <div>
                    <p className="text-foreground/60 text-sm">Rating</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-accent text-accent" />
                      <p className="text-xl font-bold text-accent">
                        {show.vote_average?.toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm">Votes</p>
                    <p className="text-xl font-bold text-accent">
                      {show.vote_count?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm">Started</p>
                    <p className="text-xl font-bold text-accent">
                      {show.first_air_date
                        ? new Date(show.first_air_date).getFullYear()
                        : "N/A"}
                    </p>
                  </div>
                  {show.number_of_seasons && (
                    <div>
                      <p className="text-foreground/60 text-sm">Seasons</p>
                      <p className="text-xl font-bold text-accent">
                        {show.number_of_seasons}
                      </p>
                    </div>
                  )}
                  {show.number_of_episodes && (
                    <div>
                      <p className="text-foreground/60 text-sm">Episodes</p>
                      <p className="text-xl font-bold text-accent">
                        {show.number_of_episodes}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="container mx-auto px-4 max-w-7xl mb-12">
          {selectedVideo && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {selectedVideo.name}
              </h2>
              <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.key}`}
                  title={selectedVideo.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Videos List */}
          {videos.length > 1 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6">More Videos ({videos.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`group relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer ${
                      selectedVideo?.id === video.id
                        ? "ring-2 ring-accent shadow-lg shadow-accent/50"
                        : "hover:ring-2 hover:ring-accent/50"
                    }`}
                  >
                    {/* Thumbnail Background */}
                    <div className="relative w-full bg-gradient-to-br from-card to-background/50 aspect-video flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
                      <Play className="w-12 h-12 text-accent opacity-70 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Selected Indicator */}
                      {selectedVideo?.id === video.id && (
                        <div className="absolute top-2 right-2 bg-accent text-background rounded-full p-1">
                          <Play className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4 bg-card/80 backdrop-blur-sm border border-foreground/10 group-hover:border-accent/50 transition-colors">
                      <p className="font-semibold text-foreground text-sm line-clamp-2 mb-2 text-left">
                        {video.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-accent font-medium">{video.type}</span>
                        {video.site && (
                          <span className="text-xs text-foreground/50">{video.site}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cast Section */}
          {cast.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6">Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.map((actor) => (
                  <div key={actor.id} className="text-center">
                    {actor.profile_path && (
                      <img
                        src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full rounded-lg mb-3 aspect-[2/3] object-cover"
                      />
                    )}
                    <p className="font-semibold text-foreground text-sm line-clamp-1">
                      {actor.name}
                    </p>
                    <p className="text-xs text-foreground/60 line-clamp-1">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
