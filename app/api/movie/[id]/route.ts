import { NextRequest, NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: movieId } = await params

  try {
    const [movieRes, videosRes, creditsRes] = await Promise.all([
      fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
      ),
      fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      ),
      fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
      ),
    ])

    const movie = await movieRes.json()
    const videos = await videosRes.json()
    const credits = await creditsRes.json()

    console.log("[v0] Movie details fetched:", { movieId, has_videos: !!videos.results?.length })

    return NextResponse.json({
      movie,
      videos: videos.results || [],
      cast: credits.cast?.slice(0, 10) || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching movie details:", error)
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    )
  }
}
