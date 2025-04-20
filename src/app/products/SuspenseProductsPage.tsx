"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGrid from "../../components/ProductGrid";
import ProductFilters from "../../components/ProductFilters";
import Pagination from "../../components/Pagination";
import { fetchProducts } from "../../lib/api";
import { useSearchParams } from "next/navigation";

export default function SuspenseProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  // Get unique categories from products (category is a string)
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Reset to first page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Filter products by search and category
  useEffect(() => {
    let filtered = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    setFilteredProducts(filtered);
  }, [search, products, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const pagedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <section className="py-8 px-4 max-w-6xl mx-auto w-full flex-1">
        <h2 className="text-2xl font-bold text-black mb-6">All Products</h2>
        {loading ? (
          <div className="text-center py-20 text-lg text-gray-400">Loading products...</div>
        ) : (
          <>
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <ProductGrid
              products={pagedProducts}
              gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              showCategoryTag={true}
              showOldPrice={false}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
