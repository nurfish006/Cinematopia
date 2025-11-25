"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Star, ArrowLeft, Play, Calendar, Tv, ImageOff } from "lucide-react"

const TMDB_ORIGINAL = "https://image.tmdb.org/t/p/original"
const TMDB_W500 = "https://image.tmdb.org/t/p/w500"
const TMDB_W300 = "https://image.tmdb.org/t/p/w300"

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
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/tv/${showId}`, { cache: "no-store" })

        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)

        const data = await response.json()

        setShow(data.show)
        setVideos(data.videos || [])
        setCast(data.cast || [])

        const trailer = data.videos?.find((v: Video) => v.type === "Trailer" && v.site === "YouTube")
        if (trailer) {
          setSelectedVideo(trailer)
        } else if (data.videos && data.videos.length > 0) {
          setSelectedVideo(data.videos[0])
        }
      } catch (error) {
        console.error("[v0] Error fetching TV show details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (showId) fetchDetails()
  }, [showId])

  const handleImageError = (id: string) => {
    setFailedImages((prev) => new Set(prev).add(id))
  }

  if (loading) {
    return (
      <>
        <Header onSearch={() => {}} />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
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
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">TV show not found</p>
            <Button onClick={() => router.back()} variant="outline" className="rounded-lg">
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const backdropUrl = show.backdrop_path ? `${TMDB_ORIGINAL}${show.backdrop_path}` : "/tv-show-backdrop.png"
  const posterUrl = show.poster_path ? `${TMDB_W500}${show.poster_path}` : "/mystery-town-poster.png"

  return (
    <>
      <Header onSearch={() => {}} />

      <main className="min-h-screen bg-background">
        {/* Hero backdrop */}
        <div className="relative h-[55vh] min-h-[400px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
          </div>

          <div className="absolute top-6 left-6">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="rounded-lg bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 -mt-40 relative z-10">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Poster */}
            <div className="w-52 md:w-64 shrink-0 mx-auto md:mx-0">
              <img
                src={posterUrl || "/placeholder.svg"}
                alt={show.name}
                className="w-full rounded-xl shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/generic-tv-poster.png"
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
                  {show.name}
                </h1>

                {show.genres && show.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {show.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="text-xs font-medium px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent fill-accent" />
                  <span className="font-semibold text-foreground text-lg">{show.vote_average?.toFixed(1)}</span>
                  <span className="text-muted-foreground">/10</span>
                </div>
                <span className="text-muted-foreground">{show.vote_count?.toLocaleString()} votes</span>
                {show.first_air_date && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(show.first_air_date).getFullYear()}</span>
                  </div>
                )}
                {show.number_of_seasons && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tv className="w-4 h-4" />
                    <span>
                      {show.number_of_seasons} Season{show.number_of_seasons > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-foreground/70 text-base leading-relaxed max-w-2xl">{show.overview}</p>
            </div>
          </div>

          {/* Video player */}
          {selectedVideo && (
            <section className="mt-14 space-y-4">
              <h2 className="text-xl font-semibold text-foreground tracking-tight">{selectedVideo.name}</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=0&rel=0`}
                  title={selectedVideo.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </section>
          )}

          {/* More videos */}
          {videos.length > 1 && (
            <section className="mt-10 space-y-4">
              <h3 className="text-lg font-medium text-foreground">More Videos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`group relative aspect-video rounded-lg overflow-hidden transition-all ${
                      selectedVideo?.id === video.id ? "ring-2 ring-accent" : "hover:ring-2 hover:ring-border"
                    }`}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                      alt={video.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <section className="mt-14 space-y-4 pb-16">
              <h2 className="text-xl font-semibold text-foreground tracking-tight">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.map((actor) => (
                  <div key={actor.id} className="bg-card rounded-xl overflow-hidden border border-border/50">
                    {actor.profile_path && !failedImages.has(`cast-${actor.id}`) ? (
                      <img
                        src={`${TMDB_W300}${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full aspect-[3/4] object-cover"
                        onError={() => handleImageError(`cast-${actor.id}`)}
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-secondary flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <ImageOff className="w-6 h-6" />
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-medium text-foreground text-sm line-clamp-1">{actor.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
