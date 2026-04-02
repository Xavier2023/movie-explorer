import { fetchMovieDetails } from '@/lib/tmdb';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { imageUrl } from '@/lib/tmdb';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/BreadCrumb';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await fetchMovieDetails(id);
  return {
    title: movie.title,
    description: movie.overview.slice(0, 160),
    openGraph: {
      images: [imageUrl(movie.poster_path, 'w500')],
    },
  };
}

export default async function MovieDetail({ params }: PageProps) {
  const { id } = await params;
  const movie = await fetchMovieDetails(id).catch(() => notFound());

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb movieTitle={movie.title} />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 relative aspect-[2/3]">
          <Image
            src={imageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-600 italic mb-4">{movie.tagline}</p>
          <div className="flex gap-4 text-sm mb-4">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.runtime} min</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((g) => (
              <span key={g.id} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                {g.name}
              </span>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
        </div>
      </div>
    </main>
  );
}