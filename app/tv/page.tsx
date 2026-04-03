"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  fetchTvShows,
  fetchTvGenres,
  setTvPage,
  setTvQuery,
  setTvGenre,
  setTvYear,
  clearTvFilters,
} from "@/stores/features/tvShowSlice";
import TvCard from "@/components/TvCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";

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

export default function TvPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { shows, genres, totalPages, loading, error } = useAppSelector(
    (state) => state.tvShows,
  );

  const initialFetchDone = useRef(false);

  // Read from URL directly
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlQuery = searchParams.get("query") || "";
  const urlGenre = searchParams.get("genre") || "";
  const urlYear = searchParams.get("year") || "";

  const filtersFromUrl = { query: urlQuery, genre: urlGenre, year: urlYear };
  const genresMap = new Map(genres.map((g) => [g.id, g.name]));

  // Update Redux when URL changes (for the filter controls display)
  useEffect(() => {
    dispatch(setTvQuery(urlQuery));
    dispatch(setTvGenre(urlGenre));
    dispatch(setTvYear(urlYear));
    dispatch(setTvPage(urlPage));
  }, [dispatch, urlQuery, urlGenre, urlYear, urlPage]);

  // Fetch genres once
  useEffect(() => {
    dispatch(fetchTvGenres());
  }, [dispatch]);

  // Fetch shows using URL values directly
  useEffect(() => {
    // Skip if we already fetched (prevents double fetch on mount)
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      dispatch(fetchTvShows({ page: urlPage, filters: filtersFromUrl }));
    }
  }, []); // Empty array means this runs once on mount

  // When URL changes (user interaction), fetch new shows
  useEffect(() => {
    // Skip the initial mount because we already fetched above
    if (initialFetchDone.current) {
      dispatch(fetchTvShows({ page: urlPage, filters: filtersFromUrl }));
    }
  }, [dispatch, urlPage, urlQuery, urlGenre, urlYear]);

  // Preload first poster
  useEffect(() => {
    if (shows.length > 0 && shows[0].poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w342${shows[0].poster_path}`;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = posterUrl;
      document.head.appendChild(link);
    }
  }, [shows]);

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
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
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

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Error: {error}</div>
          ) : shows.length === 0 ? (
            <div className="text-center py-12 text-gray-200">
              No TV shows found. Try different filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shows.map((show, idx) => (
                  <TvCard
                    key={show.id}
                    show={show}
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
