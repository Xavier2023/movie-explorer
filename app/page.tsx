import { Suspense } from "react";
import { fetchMovies, fetchGenres } from "@/lib/tmdb";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import Pagination from "@/components/Pagination";
import MovieList from "@/components/MovieList";
import FilterControls from "@/components/FilterControls";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    genre?: string;
    year?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const query = params.query || "";
  const genre = params.genre || "";
  const year = params.year || "";

  const [moviesData, genres] = await Promise.all([
    fetchMovies({ page, query, genre, year }),
    fetchGenres(),
  ]);

  const { results: movies, total_pages } = moviesData;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Movie Explorer</h1>

      <FilterControls
        genres={genres}
        selectedGenre={genre}
        selectedYear={year}
        initialQuery={query}
      />

      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No movies found. Try different filters.
          </p>
        </div>
      ) : (
        <>
          <Suspense fallback={<MovieGridSkeleton />}>
            <MovieList movies={movies} />
          </Suspense>
          <Pagination currentPage={page} totalPages={total_pages} />
        </>
      )}
    </main>
  );
}

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
      {Array.from({ length: 20 }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
