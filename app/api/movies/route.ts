export async function GET(request: Request) {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = "https://api.themoviedb.org/3"

    if (!TMDB_API_KEY) {
      return Response.json(
        { error: "TMDB_API_KEY not configured. Please add your TMDB API key in the Vars section." },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const filterType = searchParams.get("type")
    const page = searchParams.get("page") || "1"

    if (filterType) {
      const endpointMap = {
        popular: "movie/popular",
        top_rated: "movie/top_rated",
        upcoming: "movie/upcoming",
        now_playing: "movie/now_playing",
      }

      const endpoint = endpointMap[filterType as keyof typeof endpointMap] || "movie/popular"

      const response = await fetch(`${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&page=${page}`)

      if (!response.ok) {
        console.error("[v0] TMDB API error:", response.status, response.statusText)
        return Response.json({ error: "Failed to fetch from TMDB" }, { status: 500 })
      }

      const data = await response.json()

      return Response.json({
        results: data.results || [],
        total_pages: data.total_pages || 1,
        current_page: data.page || 1,
        total_results: data.total_results || 0,
      })
    }

    const [nowPlayingRes, topRatedRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`),
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=1`),
    ])

    if (!nowPlayingRes.ok || !topRatedRes.ok) {
      console.error("[v0] TMDB API error")
      return Response.json({ error: "Failed to fetch from TMDB" }, { status: 500 })
    }

    const [nowPlayingData, topRatedData] = await Promise.all([nowPlayingRes.json(), topRatedRes.json()])

    return Response.json({
      nowPlaying: nowPlayingData.results || [],
      topRated: topRatedData.results || [],
    })
  } catch (error) {
    console.error("[v0] Error in movies API route:", error)
    return Response.json({ error: "Failed to fetch movies", details: String(error) }, { status: 500 })
  }
}
