"use client";
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/stores/features/tvShowSlice";
import { TvShow } from "@/types/tv";
import { FaStar, FaCalendarAlt, FaTags } from "react-icons/fa";

interface TvCardProps {
  show: TvShow;
  priority?: boolean;
  genresMap?: Map<number, string>;
}

export default function TvCard({ show, priority = false, genresMap }: TvCardProps) {
  const year = new Date(show.first_air_date).getFullYear();
  const rating = show.vote_average.toFixed(1);

  const genreNames = show.genre_ids
    ?.map((id) => genresMap?.get(id))
    .filter(Boolean)
    .join(", ") || "Uncategorized";

  return (
    <Link href={`/tv/${show.id}`} className="group block">
      <div className="relative bg-white/50 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={imageUrl(show.poster_path, "w342")}
            alt={show.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-yellow-400 flex items-center gap-1 shadow-md">
            <FaStar className="w-3 h-3" />
            <span>{rating}</span>
          </div>

          <div className="absolute bottom-2 left-2 bg-white/60 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-black font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3" />
            <span>{year}</span>
          </div>
        </div>

        <div className="p-3 bg-white/50 backdrop-blur-sm">
          <h3 className="font-semibold text-black line-clamp-1 group-hover:text-blue-300 transition-colors">
            {show.name}
          </h3>
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className="flex items-center gap-1 text-black">
              <FaCalendarAlt className="w-3 h-3" />
              {year}
            </span>
            <span className="flex items-center gap-1 truncate max-w-[250px]" title={genreNames}>
              <FaTags className="w-3 h-3 flex-shrink-0 text-black" />
              <span className="text-black truncate">{genreNames}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}