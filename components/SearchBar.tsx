"use client";
import { forwardRef, useRef, useCallback } from "react";

const SearchBar = forwardRef<
  HTMLInputElement,
  { initialQuery: string; onSearch: (term: string) => void }
>(({ initialQuery, onSearch }, ref) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (term: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onSearch(term);
      }, 300);
    },
    [onSearch],
  );

  return (
    <input
      ref={ref}
      type="text"
      placeholder="Search movies..."
      defaultValue={initialQuery}
      onChange={(e) => handleSearch(e.target.value)}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  );
});

// SearchBar.displayName = "SearchBar";
export default SearchBar;
