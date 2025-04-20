'use client';


import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FlashSaleTimer from "../components/FlashSaleTimer";
import Footer from "../components/Footer";
import CategoryMenu from "../components/CategoryMenu";
import ProductGrid from "../components/ProductGrid";
import ProductCard from "../components/ProductCard";
import Testimonials from "../components/Testimonials";
import { fetchProducts } from "../lib/api";

const bannerImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=900&q=80",
];

const testimonials = [
  {
    name: "Ayu S.",
    quote: "Neighborly made it so easy to find local, sustainable products. I love supporting my community!"
  },
  {
    name: "Rizky P.",
    quote: "The marketplace is beautiful and secure. I trust every transaction here."
  },
  {
    name: "Dewi L.",
    quote: "I discovered so many eco-friendly items I never knew existed! Highly recommended."
  }
];

import { useRef } from "react";
import "../styles/arrowPulse.css";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [timerKey, setTimerKey] = useState(0);
  const [flashSaleStartIdx, setFlashSaleStartIdx] = useState(0);
  const flashSaleVisibleCount = 3;
  const [lastUsedArrow, setLastUsedArrow] = useState<'prev' | 'next' | null>(null);

  // Banner carousel state (MUST be inside component)
  const [bannerIdx, setBannerIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIdx(idx => (idx + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleFlashSalePrev = () => {
    setFlashSaleStartIdx((idx) => Math.max(0, idx - flashSaleVisibleCount));
    setLastUsedArrow('prev');
  };
  const handleFlashSaleNext = () => {
    setFlashSaleStartIdx((idx) => Math.min(flashSaleProducts.length - flashSaleVisibleCount, idx + flashSaleVisibleCount));
    setLastUsedArrow('next');
  };


  useEffect(() => {
    setFlashSaleStartIdx(0);
  }, [flashSaleProducts]);

  // Fisher-Yates shuffle
  function shuffleArray(array: any[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      const flashSaleCount = Math.min(20, data.length);
      setFlashSaleProducts(shuffleArray(data).slice(0, flashSaleCount));
    });
  }, []);

  // Listen for timer resets (FlashSaleTimer will accept a prop to notify parent)
  const handleTimerReset = () => {
    const flashSaleCount = Math.min(20, products.length);
    setFlashSaleProducts(shuffleArray(products).slice(0, flashSaleCount));
    setTimerKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Category Menu */}
      {/* <CategoryMenu /> */}

      {/* Banner/Carousel */}
      <section className="w-full flex justify-center bg-white py-3 border-b border-accent" style={{borderColor:'#D9D4CC'}}>
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-[#F6F5EC] to-white relative min-h-[180px] md:min-h-[220px]">
            {/* Left: Text Content */}
            <div className="flex-1 flex flex-col items-start justify-center py-4 md:py-6 pl-4 md:pl-8 pr-4 z-10">
              <span className="inline-block mb-2 px-3 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wider shadow-sm">Sustainable Community Market</span>
              <h1 className="text-xl md:text-3xl font-extrabold text-black mb-3 leading-tight max-w-xl">
                Empower <span className="text-primary">Local</span> Connections, Shop <span className="text-primary">Sustainably</span>
              </h1>
              <p className="text-sm md:text-base text-gray-700 mb-3 max-w-lg">
                Discover unique products from <span className="text-primary font-semibold">local producers</span> and artisans.
              </p>
              {/* Search Bar */}
              <form className="w-full max-w-sm mb-3 flex" onSubmit={e => { e.preventDefault(); const q = (e.target as any).search.value; if(q) window.location.href = `#products?q=${encodeURIComponent(q)}`; }}>
                <input
                  type="text"
                  name="search"
                  placeholder="Search local products..."
                  className="flex-1 px-3 py-2 rounded-l-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm shadow-sm"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-r-full shadow-sm transition-all duration-200"
                  style={{backgroundColor:'#3E7C59'}}
                >
                  Search
                </button>
              </form>
              <a
                href="#products"
                className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2 rounded-full shadow-lg text-base transition-all duration-200"
                style={{backgroundColor:'#3E7C59'}}
              >
                Shop Local Now
              </a>
            </div>
            {/* Right: Banner Image Carousel */}
            <div className="flex-1 h-full w-full relative hidden md:flex items-center justify-end">
              <div className="absolute inset-y-0 right-0 w-full md:w-4/5 lg:w-3/5 xl:w-1/2 overflow-hidden flex items-center">
                {bannerImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Banner ${i+1}`}
                    className={`object-cover h-full w-full rounded-l-2xl scale-105 shadow-2xl transition-opacity duration-700 absolute top-0 left-0 ${bannerIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    style={{minHeight:'180px', maxHeight:'240px'}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Display */}
      <section className="w-full py-6 border-b border-accent" style={{borderColor:'#D9D4CC'}}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-black mb-4 text-center">Discover Your Choices</h2>
          <CategoryMenu />
        </div>
      </section>

      {/* Flash Sale / Featured Deals */}
      <section className="w-full py-10 mb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span
                className="flex items-center bg-[#4C6B4F] text-white text-base px-5 py-2 rounded-full font-bold shadow-md tracking-wide uppercase"
                style={{ letterSpacing: "0.08em" }}
              >
                <svg
                  className="w-5 h-5 mr-2 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11.3 1.046a1 1 0 00-1.8 0l-7 14A1 1 0 003.3 17h5.1l-1.4 2.8a1 1 0 001.8 1l7-14A1 1 0 0016.7 3h-5.1l1.4-2.8z" />
                </svg>
                FLASH SALE
              </span>
              <FlashSaleTimer key={timerKey} onReset={handleTimerReset} />
            </div>
            <div className="hidden sm:flex gap-2">
              <button
                className={`arrow-pulse bg-white border border-[#7BAE7F]/50 shadow-lg rounded-full p-3 transition-all duration-300 disabled:opacity-40 active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] hover:ring-2 hover:ring-[#7BAE7F]/40 hover:bg-[#F4FBF5] ${lastUsedArrow === 'prev' ? 'scale-125 z-10' : 'scale-100'}`}
                onClick={handleFlashSalePrev}
                aria-label="Previous"
                disabled={flashSaleStartIdx === 0}
              >
                <svg className="arrow-svg w-7 h-7 text-primary transition-transform duration-200 active:-translate-x-1 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                className={`arrow-pulse bg-white border border-[#7BAE7F]/50 shadow-lg rounded-full p-3 transition-all duration-300 disabled:opacity-40 active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] hover:ring-2 hover:ring-[#7BAE7F]/40 hover:bg-[#F4FBF5] ${lastUsedArrow === 'next' ? 'scale-125 z-10' : 'scale-100'}`}
                onClick={handleFlashSaleNext}
                aria-label="Next"
                disabled={flashSaleStartIdx + flashSaleVisibleCount >= flashSaleProducts.length}
              >
                <svg className="arrow-svg w-7 h-7 text-primary transition-transform duration-200 active:translate-x-1 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
          {/* Flash Sale Horizontal Carousel */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div
              className="flex gap-3 sm:gap-4 md:gap-6 py-2 min-h-[210px] sm:min-h-[270px] md:min-h-[330px] transition-transform duration-500 ease-in-out"
              style={
                typeof window !== 'undefined' && window.innerWidth >= 640
                  ? { transform: `translateX(-${flashSaleStartIdx * (window.innerWidth < 768 ? 240 + 16 : 280 + 24)}px)` }
                  : {} // No transform on mobile, allow scroll
              }
            >
              {flashSaleProducts.map((product: any, idx: number) => (
                <div key={product.id + '-' + idx} className="min-w-[180px] max-w-[180px] sm:min-w-[240px] sm:max-w-[240px] md:min-w-[280px] md:max-w-[280px] flex-shrink-0">
                  <ProductCard
                    product={product}
                    showCategoryTag={true}
                    showOldPrice={true}
                    tagLabel="Flash Sale"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="py-8 px-4 max-w-6xl mx-auto w-full">
        <h2
          className="text-2xl font-bold text-black mb-6"
        >
          Featured Products
        </h2>
        <ProductGrid
          products={products}
          gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          showCategoryTag={true}
          showOldPrice={false}
        />
      </section>

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Call to Action Section */}
      <section className="py-12 px-4 bg-secondary text-white flex flex-col items-center" style={{backgroundColor: '#A08F79'}}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Ready to join your neighborhood market?</h2>
        <p className="mb-6 text-center max-w-xl">
          Sign up today and start making a positive impact in your community!
        </p>
        <a
          href="#"
          className="bg-primary text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-success transition"
          style={{backgroundColor:'#7BAE7F'}}
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
