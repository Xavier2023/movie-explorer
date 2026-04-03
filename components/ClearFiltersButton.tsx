"use client";

import { useRef } from "react";

export default function ClearFiltersButton({
  searchInputRef,
  onClear,
}: {
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onClear: () => void;
}) {
  const handleClear = () => {
    onClear();
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  return (
    <button
      onClick={handleClear}
      aria-label="Clear all filters"
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
    >
      Clear Filters
    </button>
  );
}
