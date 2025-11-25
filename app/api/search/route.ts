import { NextRequest, NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const page = searchParams.get("page") || "1"

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    )
  }

  try {
    console.log("[v0] Searching movies:", { query, page })

    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
    )

    const data = await response.json()

    console.log("[v0] Search results:", {
      query,
      results_count: data.results?.length,
      total_pages: data.total_pages,
      total_results: data.total_results,
    })

    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
      current_page: parseInt(page),
    })
  } catch (error) {
    console.error("[v0] Error searching movies:", error)
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    )
  }
}
