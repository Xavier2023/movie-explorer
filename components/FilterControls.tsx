"use client";

import { useRef } from "react";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ClearFiltersButton from "./ClearFiltersButton";
import { Genre } from "@/types/movie";

interface FilterControlsProps {
  genres: Genre[];
  selectedGenre: string;
  selectedYear: string;
  initialQuery: string;
  onSearch: (term: string) => void;
  onGenreChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function FilterControls({
  genres,
  selectedGenre,
  selectedYear,
  initialQuery,
  onSearch,
  onGenreChange,
  onYearChange,
  onClearFilters,
}: FilterControlsProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasActiveFilters = !!(initialQuery || selectedGenre || selectedYear);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <SearchBar
        ref={searchInputRef}
        initialQuery={initialQuery}
        onSearch={onSearch}
      />
      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        selectedYear={selectedYear}
        onGenreChange={onGenreChange}
        onYearChange={onYearChange}
      />
      {hasActiveFilters && (
        <ClearFiltersButton
          searchInputRef={searchInputRef}
          onClear={onClearFilters}
        />
      )}
    </div>
  );
}
