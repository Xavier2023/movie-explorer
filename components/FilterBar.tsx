"use client";
import { Genre } from "@/types/movie";
import SimpleSelect, { SelectOption } from "@/components/SimpleSelectField";

export default function FilterBar({
  genres,
  selectedGenre,
  selectedYear,
  onGenreChange,
  onYearChange,
}: {
  genres: Genre[];
  selectedGenre: string;
  selectedYear: string;
  onGenreChange: (value: string) => void;
  onYearChange: (value: string) => void;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1989 },
    (_, i) => currentYear - i,
  );

  const genreOptions: SelectOption[] = [
    { value: "", label: "All Genres" },
    ...genres.map((genre) => ({
      value: genre.id.toString(),
      label: genre.name,
    })),
  ];

  const yearOptions: SelectOption[] = [
    { value: "", label: "All Years" },
    ...years.map((year) => ({
      value: year.toString(),
      label: year.toString(),
    })),
  ];

  return (
    <div className="flex gap-2">
      <div className="w-48">
        <SimpleSelect
          value={selectedGenre}
          onChange={onGenreChange}
          options={genreOptions}
          placeholder="Select Genre"
        />
      </div>
      <div className="w-40">
        <SimpleSelect
          value={selectedYear}
          onChange={onYearChange}
          options={yearOptions}
          placeholder="Select Year"
        />
      </div>
    </div>
  );
}
