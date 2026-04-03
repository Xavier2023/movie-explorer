export interface TvShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}


export interface TvShowsResponse {
  page: number;
  results: TvShow[];
  total_pages: number;
  total_results: number;
}

export interface TvDetails {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  tagline: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string }[];
  spoken_languages: { english_name: string }[];
  homepage: string | null;
  created_by: { id: number; name: string }[];
  networks: { id: number; name: string; logo_path: string | null }[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
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

export interface TvFilters {
  query: string;
  genre: string;
  year: string; // first air year
}

export interface TvState {
  shows: TvShow[];
  genres: { id: number; name: string }[];
  totalPages: number;
  currentPage: number;
  filters: TvFilters;
  loading: boolean;
  error: string | null;
}