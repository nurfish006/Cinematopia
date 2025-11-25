"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Star, ArrowLeft, Play, Calendar, Tv } from "lucide-react"

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
        const response = await fetch(`/api/tv/${showId}`, {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }

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

    if (showId) {
      fetchDetails()
    }
  }, [showId])

  if (loading) {
    return (
      <>
        <Header onSearch={() => {}} />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading TV show details...</div>
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
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header onSearch={() => {}} />

      <main className="min-h-screen bg-background">
        <div className="relative h-[50vh] min-h-[400px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${show.backdrop_path ? `${IMAGE_BASE_URL}${show.backdrop_path}` : "/tv-show-backdrop.png"})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>

          <div className="absolute top-4 left-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="rounded-xl bg-background/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 md:w-64 shrink-0 mx-auto md:mx-0">
              <img
                src={show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : "/mystery-town-poster.png"}
                alt={show.name}
                className="w-full rounded-xl shadow-2xl ring-1 ring-white/10"
              />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">{show.name}</h1>

                {show.genres && show.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {show.genres.map((genre) => (
                      <span key={genre.id} className="text-sm px-3 py-1 bg-accent/20 text-accent rounded-full">
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{show.vote_count?.toLocaleString()} votes</span>
                </div>
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
                      {show.number_of_seasons} Season
                      {show.number_of_seasons > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-foreground/80 text-lg leading-relaxed">{show.overview}</p>
            </div>
          </div>

          {selectedVideo && (
            <section className="mt-12 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{selectedVideo.name}</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-card">
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

          {videos.length > 1 && (
            <section className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">More Videos ({videos.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`group relative aspect-video rounded-lg overflow-hidden transition-all ${
                      selectedVideo?.id === video.id
                        ? "ring-2 ring-accent shadow-lg shadow-accent/30"
                        : "ring-1 ring-border hover:ring-accent/50"
                    }`}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                      alt={video.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs text-white line-clamp-1">{video.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {cast.length > 0 && (
            <section className="mt-12 space-y-4 pb-12">
              <h2 className="text-2xl font-bold text-foreground">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.map((actor) => (
                  <div key={actor.id} className="bg-card rounded-xl overflow-hidden ring-1 ring-border">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full aspect-[3/4] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-medium text-foreground line-clamp-1">{actor.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{actor.character}</p>
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
