'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Genre } from '@/types/movie';

export default function FilterBar({
  genres,
  selectedGenre,
  selectedYear,
}: {
  genres: Genre[];
  selectedGenre: string;
  selectedYear: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  return (
    <div className="flex gap-2">
      <select
        value={selectedGenre}
        onChange={(e) => updateFilter('genre', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => updateFilter('year', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}