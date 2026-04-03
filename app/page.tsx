"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  fetchMovies,
  fetchGenres,
  setPage,
  setQuery,
  setGenre,
  setYear,
  clearFilters,
} from "@/stores/features/movieSlice";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import Image from "next/image";
import logo from "@/public/android-chrome-192x192.png";

const FilterControls = dynamic(() => import("@/components/FilterControls"), {
  ssr: false,
  loading: () => (
    <div className="h-[100px] animate-pulse bg-gray-800 rounded-lg" />
  ),
});

const Pagination = dynamic(() => import("@/components/Pagination"), {
  ssr: false,
  loading: () => (
    <div className="h-12 animate-pulse bg-gray-800 rounded-lg w-64 mx-auto mt-8" />
  ),
});

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { movies, genres, totalPages, loading, error } = useAppSelector(
    (state) => state.movies,
  );

  const initialFetchDone = useRef(false);

  // Read from URL directly
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlQuery = searchParams.get("query") || "";
  const urlGenre = searchParams.get("genre") || "";
  const urlYear = searchParams.get("year") || "";

  const filtersFromUrl = { query: urlQuery, genre: urlGenre, year: urlYear };
  const genresMap = new Map(genres.map((g) => [g.id, g.name]));

  // Update Redux when URL changes (for filter controls display)
  useEffect(() => {
    dispatch(setQuery(urlQuery));
    dispatch(setGenre(urlGenre));
    dispatch(setYear(urlYear));
    dispatch(setPage(urlPage));
  }, [dispatch, urlQuery, urlGenre, urlYear, urlPage]);

  // Fetch genres once
  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  // Fetch movies using URL values directly (once on mount)
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      dispatch(fetchMovies({ page: urlPage, filters: filtersFromUrl }));
    }
  }, []);

  // When URL changes (user interaction), fetch new movies
  useEffect(() => {
    if (initialFetchDone.current) {
      dispatch(fetchMovies({ page: urlPage, filters: filtersFromUrl }));
    }
  }, [dispatch, urlPage, urlQuery, urlGenre, urlYear]);

  // Preload first movie poster
  useEffect(() => {
    if (movies.length > 0 && movies[0].poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w342${movies[0].poster_path}`;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = posterUrl;
      document.head.appendChild(link);
    }
  }, [movies]);

  // Back/forward cache support
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        dispatch(fetchMovies({ page: urlPage, filters: filtersFromUrl }));
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [dispatch, urlPage, urlQuery, urlGenre, urlYear]);

  // Update URL (called from handlers)
  const updateUrl = (newPage: number, newFilters: typeof filtersFromUrl) => {
    const params = new URLSearchParams();
    if (newFilters.query) params.set("query", newFilters.query);
    if (newFilters.genre) params.set("genre", newFilters.genre);
    if (newFilters.year) params.set("year", newFilters.year);
    if (newPage !== 1) params.set("page", newPage.toString());
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl, { scroll: false });
  };

  const handleSearch = (term: string) => {
    updateUrl(1, { ...filtersFromUrl, query: term });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenreChange = (value: string) => {
    updateUrl(1, { ...filtersFromUrl, genre: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleYearChange = (value: string) => {
    updateUrl(1, { ...filtersFromUrl, year: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    updateUrl(1, { query: "", genre: "", year: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl(newPage, filtersFromUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b-[0.5px] border-[#333] shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <FilterControls
              genres={genres}
              selectedGenre={urlGenre}
              selectedYear={urlYear}
              initialQuery={urlQuery}
              onSearch={handleSearch}
              onGenreChange={handleGenreChange}
              onYearChange={handleYearChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Error: {error}</div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12 text-gray-200">
              No movies found. Try different filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie, idx) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    priority={idx === 0}
                    genresMap={genresMap}
                  />
                ))}
              </div>
              <Pagination
                currentPage={urlPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
