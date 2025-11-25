import { generateObject } from "ai"
import { z } from "zod"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

const recommendationSchema = z.object({
  explanation: z
    .string()
    .describe("A warm, personalized 1-2 sentence explanation of why these movies match the user's mood"),
  movieQueries: z
    .array(
      z.object({
        title: z.string().describe("The exact movie title to search for"),
        reason: z.string().describe("A brief, personal reason why this movie fits their mood (1 sentence)"),
      }),
    )
    .min(4)
    .max(6)
    .describe("4-6 movie recommendations that match the mood"),
})

export async function POST(request: Request) {
  try {
    if (!TMDB_API_KEY) {
      return Response.json({ error: "TMDB_API_KEY not configured" }, { status: 500 })
    }

    const { mood } = await request.json()

    if (!mood || typeof mood !== "string") {
      return Response.json({ error: "Please provide a mood description" }, { status: 400 })
    }

    // Use AI to understand the mood and suggest movies
    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4-20250514",
      schema: recommendationSchema,
      prompt: `You are a movie expert and mood analyst. A user described their current mood or what kind of movie experience they want:

"${mood}"

Based on this, recommend 4-6 movies that would be perfect for them. Consider:
- The emotional tone they're seeking
- Any specific themes, genres, or vibes mentioned
- The context (date night, alone time, with friends, etc.)
- Movies that are well-regarded and widely available

Provide a warm, personalized explanation of why you chose these movies, and for each movie, give a brief reason why it specifically matches their mood.

Focus on quality, memorable films that truly match the described experience. Include a mix of popular and perhaps lesser-known gems.`,
    })

    // Search TMDB for each recommended movie
    const moviePromises = object.movieQueries.map(async (query) => {
      try {
        const searchRes = await fetch(
          `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query.title)}&page=1`,
        )
        const searchData = await searchRes.json()

        if (searchData.results && searchData.results.length > 0) {
          const movie = searchData.results[0]
          return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            reason: query.reason,
          }
        }
        return null
      } catch (error) {
        console.error(`[v0] Error searching for movie: ${query.title}`, error)
        return null
      }
    })

    const movies = (await Promise.all(moviePromises)).filter(Boolean)

    return Response.json({
      movies,
      explanation: object.explanation,
    })
  } catch (error) {
    console.error("[v0] Error in mood-match API:", error)
    return Response.json({ error: "Failed to get recommendations", details: String(error) }, { status: 500 })
  }
}
