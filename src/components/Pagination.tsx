import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        className="px-3 py-1 rounded border text-xs bg-white text-black border-gray-300 disabled:opacity-50"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >First</button>
      <button
        className="px-3 py-1 rounded border text-xs bg-white text-black border-gray-300 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >Prev</button>
      {pageNumbers.map(page => (
        <button
          key={page}
          className={`px-3 py-1 rounded border text-xs font-bold transition-colors duration-150
            ${page === currentPage
              ? 'bg-primary text-black border-primary shadow-sm'
              : 'bg-white text-black border-gray-300'}
          `}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded border text-xs bg-white text-black border-gray-300 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >Next</button>
      <button
        className="px-3 py-1 rounded border text-xs bg-white text-black border-gray-300 disabled:opacity-50"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >Last</button>
    </div>
  );
};

export default Pagination;
