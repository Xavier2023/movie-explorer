import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Filters, Genre, MovieState, TMDBResponse, Movie } from "@/types/movie";

const initialState: MovieState = {
  movies: [],
  genres: [],
  totalPages: 1,
  currentPage: 1,
  filters: { query: "", genre: "", year: "" },
  loading: false,
  error: null,
};

export const imageUrl = (
  path: string | null,
  size: "w92" | "w342" | "w500" = "w500",
): string => {
  if (!path) return "/placeholder-poster.png"; // 👈 local fallback image
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ page, filters }: { page: number; filters: Filters }) => {
    const { query, genre, year } = filters;
    const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    let url: string;

    if (query) {
      url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
    } else {
      url = `${baseUrl}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${page}&vote_count.gte=100`;
      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&primary_release_year=${year}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
    const data: TMDBResponse = await res.json();
    return {
      movies: data.results,
      totalPages: data.total_pages,
      currentPage: page,
    };
  },
);

export const fetchGenres = createAsyncThunk("movies/fetchGenres", async () => {
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}`);
  const data = await res.json();
  return data.genres as Genre[];
});

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.filters.query = action.payload;
      state.currentPage = 1;
    },
    setGenre: (state, action: PayloadAction<string>) => {
      state.filters.genre = action.payload;
      state.currentPage = 1;
    },
    setYear: (state, action: PayloadAction<string>) => {
      state.filters.year = action.payload;
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = { query: "", genre: "", year: "" };
      state.currentPage = 1;
    },
    hydrateFilters: (
      state,
      action: PayloadAction<{
        query: string;
        genre: string;
        year: string;
        page: number;
      }>,
    ) => {
      state.filters = {
        query: action.payload.query,
        genre: action.payload.genre,
        year: action.payload.year,
      };
      state.currentPage = action.payload.page;
    },
    hydrateMovies: (
      state,
      action: PayloadAction<
        { movies: Movie[]; totalPages: number; currentPage: number } | undefined
      >,
    ) => {
      // Guard against undefined payload
      if (action.payload) {
        state.movies = action.payload.movies;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch movies";
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      });
  },
});

export const {
  setPage,
  setQuery,
  setGenre,
  setYear,
  clearFilters,
  hydrateFilters,
  hydrateMovies,
} = movieSlice.actions;

export default movieSlice.reducer;
