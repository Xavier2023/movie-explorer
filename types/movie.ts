export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];  // added for listing view
}

export interface Filters {
  query: string;
  genre: string;
  year: string;
}

export interface MovieState {
  movies: Movie[];
  genres: Genre[];
  totalPages: number;
  currentPage: number;
  filters: Filters;
  loading: boolean;
  error: string | null;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path?: string }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;         // e.g., "Released", "Post Production"
  vote_count: number;
  homepage: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}