'use client';

import { useRouter, usePathname } from 'next/navigation';


export default function ClearFiltersButton({ searchInputRef }: { searchInputRef?: React.RefObject<HTMLInputElement | null> }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClear = () => {
    // Clear all filter params from URL
    router.replace(pathname);
    
    // Clear search input field if ref provided
    if (searchInputRef?.current) {
      searchInputRef.current.value = '';
    }
  };

  return (
    <button
      onClick={handleClear}
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
    >
      Clear Filters
    </button>
  );
}