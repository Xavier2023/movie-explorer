"use client";
import { forwardRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SearchBar = forwardRef<HTMLInputElement, { initialQuery: string }>(
  ({ initialQuery }, ref) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((term: string) => {
      const params = new URLSearchParams(window.location.search);
      if (term) params.set("query", term);
      else params.delete("query");
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

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
  },
);

SearchBar.displayName = "SearchBar";
export default SearchBar;
