"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGrid from "../../components/ProductGrid";
import { fetchProducts } from "../../lib/api";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts(products);
    } else {
      const q = search.toLowerCase();
      setFilteredProducts(products.filter((p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
      ));
    }
  }, [search, products]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <section className="py-8 px-4 max-w-6xl mx-auto w-full flex-1">
        <h2 className="text-2xl font-bold text-black mb-6">All Products</h2>
        {loading ? (
          <div className="text-center py-20 text-lg text-gray-400">Loading products...</div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            showCategoryTag={true}
            showOldPrice={false}
          />
        )}
      </section>
      <Footer />
    </div>
  );
}
