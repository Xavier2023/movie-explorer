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
  hydrateTvFilters,
} from "@/stores/features/tvShowSlice";
import TvCard from "@/components/TvCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import Image from "next/image";
import logo from "@/public/android-chrome-192x192.png";

// Dynamic imports for heavy components
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
  const { shows, genres, totalPages, currentPage, filters, loading, error } =
    useAppSelector((state) => state.tvShows);

  const genresMap = new Map(genres.map((g) => [g.id, g.name]));
  const hasHydrated = useRef(false);

  // Hydrate from URL once
  useEffect(() => {
    if (!hasHydrated.current) {
      const page = parseInt(searchParams.get("page") || "1");
      const query = searchParams.get("query") || "";
      const genre = searchParams.get("genre") || "";
      const year = searchParams.get("year") || "";
      dispatch(hydrateTvFilters({ query, genre, year, page }));
      hasHydrated.current = true;
    }
    dispatch(fetchTvGenres());
  }, []);

  // Initial fetch after hydration
  useEffect(() => {
    if (hasHydrated.current) {
      dispatch(fetchTvShows({ page: currentPage, filters }));
    }
  }, []);

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

  // URL sync helper
  const updateUrl = (page: number, newFilters: typeof filters) => {
    const params = new URLSearchParams();
    if (newFilters.query) params.set("query", newFilters.query);
    if (newFilters.genre) params.set("genre", newFilters.genre);
    if (newFilters.year) params.set("year", newFilters.year);
    if (page !== 1) params.set("page", page.toString());
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Handlers
  const handleSearch = (term: string) => {
    dispatch(setTvQuery(term));
    updateUrl(1, { ...filters, query: term });
    dispatch(fetchTvShows({ page: 1, filters: { ...filters, query: term } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenreChange = (value: string) => {
    dispatch(setTvGenre(value));
    updateUrl(1, { ...filters, genre: value });
    dispatch(fetchTvShows({ page: 1, filters: { ...filters, genre: value } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleYearChange = (value: string) => {
    dispatch(setTvYear(value));
    updateUrl(1, { ...filters, year: value });
    dispatch(fetchTvShows({ page: 1, filters: { ...filters, year: value } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    dispatch(clearTvFilters());
    updateUrl(1, { query: "", genre: "", year: "" });
    dispatch(
      fetchTvShows({ page: 1, filters: { query: "", genre: "", year: "" } }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (page: number) => {
    dispatch(setTvPage(page));
    updateUrl(page, filters);
    dispatch(fetchTvShows({ page, filters }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen">
      {/* CSS Gradient Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b-[0.5px] border-[#333] shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <FilterControls
              genres={genres}
              selectedGenre={filters.genre}
              selectedYear={filters.year}
              initialQuery={filters.query}
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
                currentPage={currentPage}
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
