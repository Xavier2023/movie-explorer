import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TvShowsResponse, TvDetails, Credits, TvState, TvFilters } from "@/types/tv";



const initialState: TvState = {
  shows: [],
  genres: [],
  totalPages: 1,
  currentPage: 1,
  filters: { query: "", genre: "", year: "" },
  loading: false,
  error: null,
};

// Helper image URL (same as movies)
export const imageUrl = (path: string | null, size: "w92" | "w342" | "w500" = "w500") => {
  if (!path) return "/placeholder-poster.png";
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Fetch TV shows (discover or search)
export const fetchTvShows = createAsyncThunk(
  "tvShows/fetchTvShows",
  async ({ page, filters }: { page: number; filters: TvFilters }) => {
    const { query, genre, year } = filters;
    const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    let url: string;
    if (query) {
      url = `${baseUrl}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
    } else {
      url = `${baseUrl}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&page=${page}&vote_count.gte=20`;
      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&first_air_date_year=${year}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
    const data: TvShowsResponse = await res.json();
    return {
      shows: data.results,
      totalPages: data.total_pages,
      currentPage: page,
    };
  }
);

// Fetch TV genres
export const fetchTvGenres = createAsyncThunk("tvShows/fetchTvGenres", async () => {
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await fetch(`${baseUrl}/genre/tv/list?api_key=${apiKey}`);
  const data = await res.json();
  return data.genres as { id: number; name: string }[];
});

// Fetch TV show details
export const fetchTvDetails = createAsyncThunk(
  "tvShows/fetchTvDetails",
  async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await fetch(`${baseUrl}/tv/${id}?api_key=${apiKey}`);
    if (!res.ok) throw new Error("TV show not found");
    return res.json() as Promise<TvDetails>;
  }
);

// Fetch TV show credits
export const fetchTvCredits = createAsyncThunk(
  "tvShows/fetchTvCredits",
  async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await fetch(`${baseUrl}/tv/${id}/credits?api_key=${apiKey}`);
    if (!res.ok) return { id: Number(id), cast: [], crew: [] };
    return res.json() as Promise<Credits>;
  }
);

const tvShowSlice = createSlice({
  name: "tvShows",
  initialState,
  reducers: {
    setTvPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTvQuery: (state, action: PayloadAction<string>) => {
      state.filters.query = action.payload;
      state.currentPage = 1;
    },
    setTvGenre: (state, action: PayloadAction<string>) => {
      state.filters.genre = action.payload;
      state.currentPage = 1;
    },
    setTvYear: (state, action: PayloadAction<string>) => {
      state.filters.year = action.payload;
      state.currentPage = 1;
    },
    clearTvFilters: (state) => {
      state.filters = { query: "", genre: "", year: "" };
      state.currentPage = 1;
    },
    hydrateTvFilters: (state, action: PayloadAction<{ query: string; genre: string; year: string; page: number }>) => {
      state.filters = {
        query: action.payload.query,
        genre: action.payload.genre,
        year: action.payload.year,
      };
      state.currentPage = action.payload.page;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTvShows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTvShows.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload.shows;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchTvShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch TV shows";
      })
      .addCase(fetchTvGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      });
  },
});

export const {
  setTvPage,
  setTvQuery,
  setTvGenre,
  setTvYear,
  clearTvFilters,
  hydrateTvFilters,
} = tvShowSlice.actions;

export default tvShowSlice.reducer;