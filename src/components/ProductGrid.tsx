import React from "react";

import { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  gridCols?: string; // e.g., "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
  showCategoryTag?: boolean;
  showOldPrice?: boolean;
  tagLabel?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  gridCols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  showCategoryTag = true,
  showOldPrice = false,
  tagLabel,
}) => (
  <div className={`grid ${gridCols} gap-6`}>
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        showCategoryTag={showCategoryTag}
        showOldPrice={showOldPrice}
        tagLabel={tagLabel}
      />
    ))}
  </div>
);

export default ProductGrid;
