export async function GET(request: Request) {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = "https://api.themoviedb.org/3"

    if (!TMDB_API_KEY) {
      return Response.json({ error: "TMDB_API_KEY not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const filterType = searchParams.get("type")
    const page = searchParams.get("page") || "1"

    if (filterType) {
      const endpointMap = {
        popular: "tv/popular",
        top_rated: "tv/top_rated",
        on_the_air: "tv/on_the_air",
        airing_today: "tv/airing_today",
      }

      const endpoint = endpointMap[filterType as keyof typeof endpointMap] || "tv/popular"

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

    return Response.json({ results: [] })
  } catch (error) {
    console.error("[v0] Error in TV API route:", error)
    return Response.json({ error: "Failed to fetch TV shows", details: String(error) }, { status: 500 })
  }
}
