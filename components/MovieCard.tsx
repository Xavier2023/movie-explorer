import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { imageUrl } from "@/stores/features/movieSlice"; // 👈 import from Redux slice
import { FaStar, FaCalendarAlt, FaTags } from "react-icons/fa";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  genresMap?: Map<number, string>;
}

export default function MovieCard({
  movie,
  priority = false,
  genresMap,
}: MovieCardProps) {
  const year = new Date(movie.release_date).getFullYear();
  const rating = movie.vote_average.toFixed(1);

  // Map all genre IDs to names, join with comma
  const genreNames =
    movie.genre_ids
      ?.map((id) => genresMap?.get(id))
      .filter(Boolean)
      .join(", ") || "Uncategorized";

  const displayGenres = genreNames;

  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="relative bg-white/40 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={imageUrl(movie.poster_path, "w342")}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={75}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge - top right */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-yellow-400 flex items-center gap-1 shadow-md">
            <FaStar className="w-3 h-3" />
            <span>{rating}</span>
          </div>

          {/* Year badge - bottom left on hover */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-black font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3" />
            <span>{year}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 bg-white/30 backdrop-blur-sm">
          <h3 className="font-semibold text-black line-clamp-1 group-hover:text-blue-300 transition-colors">
            {movie.title}
          </h3>
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className="flex items-center gap-1 text-black">
              <FaCalendarAlt className="w-3 h-3" />
              {year}
            </span>
            <span
              className="flex items-center gap-1 truncate max-w-[250px]"
              title={genreNames}
            >
              <FaTags className="w-3 h-3 flex-shrink-0 text-black" />
              <span className="text-black truncate">{displayGenres}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
