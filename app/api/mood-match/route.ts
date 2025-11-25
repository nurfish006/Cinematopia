const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

const moodMappings: Record<string, { genres: number[]; keywords: string[]; vibe: string }> = {
  // Relaxing / Comfort
  cozy: { genres: [35, 10751, 16], keywords: ["comfort", "warm", "feel-good"], vibe: "Something warm and comforting" },
  relaxed: { genres: [35, 10751, 18], keywords: ["easy", "light"], vibe: "Easy-watching comfort" },
  tired: { genres: [35, 16, 10751], keywords: ["light", "fun"], vibe: "Light entertainment to unwind" },
  exhausted: { genres: [35, 16], keywords: ["simple", "fun"], vibe: "No-brainer fun" },
  comfort: { genres: [10751, 35, 14], keywords: ["heartwarming"], vibe: "Heartwarming stories" },
  nostalgic: { genres: [10751, 12, 14], keywords: ["classic", "retro"], vibe: "A trip down memory lane" },

  // Emotional / Deep
  sad: { genres: [18, 10749], keywords: ["emotional", "tearjerker"], vibe: "A cathartic emotional journey" },
  cry: { genres: [18, 10749], keywords: ["emotional", "moving"], vibe: "Movies that move you deeply" },
  emotional: { genres: [18, 10749, 10751], keywords: ["touching"], vibe: "Deeply touching stories" },
  reflective: { genres: [18, 9648], keywords: ["thoughtful", "meaningful"], vibe: "Thought-provoking cinema" },
  melancholy: { genres: [18, 10749], keywords: ["bittersweet"], vibe: "Beautifully melancholic" },

  // Exciting / Energetic
  excited: { genres: [28, 12, 878], keywords: ["thrilling", "action"], vibe: "High-energy thrills" },
  adventurous: { genres: [12, 28, 14], keywords: ["epic", "journey"], vibe: "Epic adventures await" },
  energetic: { genres: [28, 35, 12], keywords: ["fast-paced"], vibe: "Fast-paced excitement" },
  pumped: { genres: [28, 80, 53], keywords: ["intense", "action"], vibe: "Adrenaline-pumping action" },

  // Scary / Thrilling
  scared: { genres: [27, 53], keywords: ["horror", "scary"], vibe: "Spine-tingling scares" },
  spooky: { genres: [27, 9648, 53], keywords: ["creepy", "supernatural"], vibe: "Delightfully creepy" },
  thrilling: { genres: [53, 80, 9648], keywords: ["suspense", "tension"], vibe: "Edge-of-your-seat suspense" },
  tense: { genres: [53, 80, 18], keywords: ["gripping"], vibe: "Gripping tension throughout" },

  // Romantic
  romantic: { genres: [10749, 35, 18], keywords: ["love", "romance"], vibe: "Love stories that captivate" },
  love: { genres: [10749, 18], keywords: ["passionate", "romantic"], vibe: "Tales of passion and love" },
  date: { genres: [10749, 35], keywords: ["romantic", "charming"], vibe: "Perfect for date night" },

  // Intellectual / Mind-bending
  curious: { genres: [878, 99, 9648], keywords: ["fascinating", "discovery"], vibe: "Curiosity-sparking films" },
  intellectual: { genres: [878, 18, 36], keywords: ["thought-provoking"], vibe: "Intellectually stimulating" },
  mind: { genres: [878, 53, 9648], keywords: ["twist", "complex"], vibe: "Mind-bending narratives" },
  philosophical: { genres: [878, 18], keywords: ["existential", "deep"], vibe: "Philosophically rich" },

  // Fun / Social
  fun: { genres: [35, 12, 16], keywords: ["entertaining", "fun"], vibe: "Pure entertainment" },
  funny: { genres: [35], keywords: ["hilarious", "comedy"], vibe: "Laugh-out-loud comedy" },
  party: { genres: [35, 10402], keywords: ["fun", "wild"], vibe: "Party vibes" },
  friends: { genres: [35, 12, 28], keywords: ["group", "fun"], vibe: "Great with friends" },

  // Inspiring
  motivated: { genres: [18, 36, 10752], keywords: ["inspiring", "triumph"], vibe: "Stories of triumph" },
  inspired: { genres: [18, 99], keywords: ["uplifting", "motivational"], vibe: "Uplifting inspiration" },
  hopeful: { genres: [18, 10751, 14], keywords: ["hope", "optimistic"], vibe: "Stories full of hope" },
}

// Genre ID to name mapping for TMDB
const genreNames: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
}

function analyzeMood(mood: string): { genres: number[]; explanation: string } {
  const lowerMood = mood.toLowerCase()
  const matchedMoods: { genres: number[]; vibe: string }[] = []

  // Find all matching mood keywords
  for (const [keyword, mapping] of Object.entries(moodMappings)) {
    if (lowerMood.includes(keyword)) {
      matchedMoods.push(mapping)
    }
  }

  // If no direct matches, use default feel-good selection
  if (matchedMoods.length === 0) {
    // Check for some common phrases
    if (lowerMood.includes("alone") || lowerMood.includes("solo")) {
      matchedMoods.push(moodMappings.reflective)
    } else if (lowerMood.includes("family") || lowerMood.includes("kids")) {
      matchedMoods.push(moodMappings.fun)
      matchedMoods.push({ genres: [16, 10751], keywords: [], vibe: "Family-friendly fun" })
    } else if (lowerMood.includes("night") || lowerMood.includes("evening")) {
      matchedMoods.push(moodMappings.cozy)
    } else {
      // Default to a mix of popular genres
      matchedMoods.push({ genres: [18, 35, 28], keywords: [], vibe: "crowd-pleasers" })
    }
  }

  // Combine all matched genres (prioritize first matches)
  const allGenres = matchedMoods.flatMap((m) => m.genres)
  const uniqueGenres = [...new Set(allGenres)].slice(0, 3)

  const vibes = matchedMoods
    .map((m) => m.vibe)
    .slice(0, 2)
    .join(" and ")
  const explanation = `Based on your mood, I've selected ${vibes.toLowerCase()}. These films should hit just the right spot for what you're looking for.`

  return { genres: uniqueGenres, explanation }
}

export async function POST(request: Request) {
  try {
    if (!TMDB_API_KEY) {
      return Response.json({ error: "TMDB_API_KEY not configured" }, { status: 500 })
    }

    const { mood } = await request.json()

    if (!mood || typeof mood !== "string") {
      return Response.json({ error: "Please provide a mood description" }, { status: 400 })
    }

    const { genres, explanation } = analyzeMood(mood)

    // Fetch movies from TMDB using discovered genres
    const genreParam = genres.join(",")
    const discoverRes = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreParam}&sort_by=vote_average.desc&vote_count.gte=1000&page=1`,
    )
    const discoverData = await discoverRes.json()

    // Also get some popular movies in these genres for variety
    const popularRes = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreParam}&sort_by=popularity.desc&vote_count.gte=500&page=1`,
    )
    const popularData = await popularRes.json()

    // Combine and dedupe results, taking top 6
    const allMovies = [...(discoverData.results || []), ...(popularData.results || [])]
    const uniqueMovies = allMovies
      .filter((movie, index, self) => index === self.findIndex((m) => m.id === movie.id))
      .slice(0, 6)

    // Generate personalized reasons based on mood and genres
    const movies = uniqueMovies.map((movie: any) => {
      const movieGenres = movie.genre_ids || []
      const matchedGenreNames = movieGenres
        .filter((g: number) => genres.includes(g))
        .map((g: number) => genreNames[g])
        .filter(Boolean)

      let reason = "A highly-rated film that matches your vibe."
      if (matchedGenreNames.length > 0) {
        reason = `This ${matchedGenreNames[0]?.toLowerCase() || ""} gem fits perfectly with what you're looking for.`
      }
      if (movie.vote_average >= 8) {
        reason = `A critically acclaimed masterpiece that's perfect for your current mood.`
      }

      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        reason,
      }
    })

    return Response.json({
      movies,
      explanation,
    })
  } catch (error) {
    console.error("[v0] Error in mood-match API:", error)
    return Response.json({ error: "Failed to get recommendations", details: String(error) }, { status: 500 })
  }
}
