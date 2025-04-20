import React from "react";

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2 items-center">
      <label className="font-semibold text-sm mr-2">Category:</label>
      <button
        className={`px-3 py-1 rounded-full border font-semibold shadow-sm text-xs transition-colors duration-150
          ${selectedCategory === ''
            ? 'bg-primary text-black border-primary'
            : 'bg-gray-200 text-black border-gray-300'}
        `}
        onClick={() => onCategoryChange('')}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          className={`px-3 py-1 rounded-full border font-semibold shadow-sm text-xs transition-colors duration-150
            ${selectedCategory === cat
              ? 'bg-primary text-black border-primary'
              : 'bg-gray-200 text-black border-gray-300'}
          `}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default ProductFilters;
