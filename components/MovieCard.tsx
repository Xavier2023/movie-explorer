import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/tmdb";
import { Movie } from "@/types/movie";

export default function MovieCard({
  movie,
  priority = false,
}: {
  movie: Movie;
  priority?: boolean;
}) {
  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <div className="relative aspect-[2/3]">
          <Image
            src={imageUrl(movie.poster_path, "w342")}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
