"use client";

import { useRef } from "react";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ClearFiltersButton from "./ClearFiltersButton";
import { Genre } from "@/types/movie";

export default function FilterControls({
  genres,
  selectedGenre,
  selectedYear,
  initialQuery,
}: {
  genres: Genre[];
  selectedGenre: string;
  selectedYear: string;
  initialQuery: string;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Determine if any filter is active
  const hasActiveFilters = !!(initialQuery || selectedGenre || selectedYear);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <SearchBar ref={searchInputRef} initialQuery={initialQuery} />
      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        selectedYear={selectedYear}
      />
      {hasActiveFilters && (
        <ClearFiltersButton searchInputRef={searchInputRef} />
      )}
    </div>
  );
}
