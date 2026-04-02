import { MovieDetails, TMDBResponse, Genre } from "@/types/movie";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

// Validate required env vars at runtime (helps debugging)
if (!API_KEY || !BASE_URL || !IMAGE_BASE_URL) {
  console.error("Missing TMDB environment variables");
}

// Data URI fallback for missing images – eliminates need for physical placeholder file
const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect width='500' height='750' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

export const imageUrl = (
  path: string | null,
  size: "w92" | "w342" | "w500" = "w500",
) => (path ? `${IMAGE_BASE_URL}/${size}${path}` : FALLBACK_IMAGE);

// Helper to add cache headers for better Cloudflare / CDN caching
const fetchWithCache = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
};

export async function fetchMovies(params: {
  page?: number;
  query?: string;
  genre?: string;
  year?: string;
}): Promise<TMDBResponse> {
  const { page = 1, query, genre, year } = params;
  let url: string;

  if (query) {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
  } else {
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}&vote_count.gte=100`;
    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&primary_release_year=${year}`;
  }

  // Use force-cache for discover (static-ish) but revalidate every hour
  return fetchWithCache(url, { next: { revalidate: 3600 } });
}

export async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;
  return fetchWithCache(url, { next: { revalidate: 86400 } });
}

export async function fetchGenres(): Promise<Genre[]> {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
  const data = await fetchWithCache(url, { next: { revalidate: 86400 } });
  return data.genres;
}
