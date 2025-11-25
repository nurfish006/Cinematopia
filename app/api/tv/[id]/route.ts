import { NextRequest, NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: showId } = await params

  try {
    const [showRes, videosRes, creditsRes] = await Promise.all([
      fetch(
        `${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&language=en-US`
      ),
      fetch(
        `${TMDB_BASE_URL}/tv/${showId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      ),
      fetch(
        `${TMDB_BASE_URL}/tv/${showId}/aggregate_credits?api_key=${TMDB_API_KEY}&language=en-US`
      ),
    ])

    const show = await showRes.json()
    const videos = await videosRes.json()
    const credits = await creditsRes.json()

    console.log("[v0] TV show details fetched:", { showId, has_videos: !!videos.results?.length })

    return NextResponse.json({
      show,
      videos: videos.results || [],
      cast: credits.cast?.slice(0, 10) || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching TV show details:", error)
    return NextResponse.json(
      { error: "Failed to fetch TV show details" },
      { status: 500 }
    )
  }
}
