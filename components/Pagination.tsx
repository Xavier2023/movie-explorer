"use client";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,      // 👈 add this prop
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      }
    }
    const result: (number | string)[] = [];
    let prev: number | null = null;
    for (const page of pages) {
      if (prev !== null && page - prev > 1) result.push("...");
      result.push(page);
      prev = page;
    }
    return result;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-1 mt-12 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>
      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-400">
            {page}
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}