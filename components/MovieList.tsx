"use client";
import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";

export default function MovieList({
  movies,
  genresMap,
}: {
  movies: Movie[];
  genresMap: Map<number, string>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          priority={index === 0}
          genresMap={genresMap}
        />
      ))}
    </div>
  );
}
