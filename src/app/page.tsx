'use client';


import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Suspense } from "react";
import FlashSaleTimer from "../components/FlashSaleTimer";
import Footer from "../components/Footer";
import CategoryMenu from "../components/CategoryMenu";
import ProductGrid from "../components/ProductGrid";
import ProductCard from "../components/ProductCard";
import Testimonials from "../components/Testimonials";
import { fetchProducts } from "../lib/api";

const bannerImages = [
  // Vibrant farmers market with fresh produce and local sellers
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
  // Organic vegetables in wooden crates at local market
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  // Farmers market with people shopping for fresh local produce
  "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80",
];

const testimonials = [
  {
    name: "Ayu Sari",
    quote: "Neighborly made it so easy to find local, sustainable products. I love supporting my community while discovering unique items I can't find anywhere else!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    location: "Jakarta"
  },
  {
    name: "Rizky Pratama",
    quote: "The marketplace is beautiful, secure, and intuitive. I trust every transaction here and the sellers are incredibly responsive and passionate.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    location: "Bandung"
  },
  {
    name: "Dewi Lestari",
    quote: "I discovered so many eco-friendly items I never knew existed! The quality is outstanding and I feel good knowing I'm supporting local artisans.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4,
    location: "Surabaya"
  }
];

// Mock data for recently viewed products
const recentlyViewedProducts = [
  {
    id: "rv1",
    name: "Organic Honey",
    price: 85000,
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=300&q=80",
    category: "Food"
  },
  {
    id: "rv2",
    name: "Handmade Soap",
    price: 45000,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=300&q=80",
    category: "Beauty"
  },
  {
    id: "rv3",
    name: "Bamboo Utensils",
    price: 120000,
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=300&q=80",
    category: "Home & Living"
  },
  {
    id: "rv4",
    name: "Recycled Notebook",
    price: 35000,
    image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?auto=format&fit=crop&w=300&q=80",
    category: "Stationery"
  }
];

// Mock data for seller of the week
const sellerOfTheWeek = {
  name: "Eco Artisan Collective",
  location: "Yogyakarta",
  bio: "A cooperative of local artisans creating sustainable home goods and accessories using traditional techniques and eco-friendly materials.",
  image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=300&q=80",
  rating: 4.9,
  reviewCount: 127,
  featuredProducts: [
    {
      id: "sp1",
      name: "Woven Bamboo Basket",
      price: 250000,
      image: "https://images.unsplash.com/photo-1595397551849-8330a4577251?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "sp2",
      name: "Natural Dye Scarf",
      price: 180000,
      image: "https://images.unsplash.com/photo-1601370552761-3c14bbc3ecce?auto=format&fit=crop&w=300&q=80",
    }
  ]
};

import { useRef } from "react";
import "../styles/arrowPulse.css";

function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [timerKey, setTimerKey] = useState(0);
  const [flashSaleStartIdx, setFlashSaleStartIdx] = useState(0);
  const flashSaleVisibleCount = 3;
  const [lastUsedArrow, setLastUsedArrow] = useState<'prev' | 'next' | null>(null);

  // Responsive carousel transform effect (must be after flashSaleStartIdx)
  const [carouselTransformStyle, setCarouselTransformStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    function updateTransform() {
      if (typeof window !== 'undefined' && window.innerWidth >= 640) {
        // sm: 240px + 16px gap, md: 280px + 24px gap
        let cardWidth = 240, gap = 16;
        if (window.innerWidth >= 768) { cardWidth = 280; gap = 24; }
        setCarouselTransformStyle({ transform: `translateX(-${flashSaleStartIdx * (cardWidth + gap)}px)` });
      } else {
        setCarouselTransformStyle({}); // Mobile: native scroll
      }
    }
    updateTransform();
    window.addEventListener('resize', updateTransform);
    return () => window.removeEventListener('resize', updateTransform);
  }, [flashSaleStartIdx]);


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
      // Assign 'featured' to a few products if not present
      let featuredCount = 0;
      const withFeatured = data.map((p: any, idx: number) => {
        if (p.featured !== undefined) return p;
        // Randomly mark ~4 products as featured
        if (featuredCount < 4 && Math.random() > 0.7) {
          featuredCount++;
          return { ...p, featured: true };
        }
        return { ...p, featured: false };
      });
      setProducts(withFeatured);
      const flashSaleCount = Math.min(20, withFeatured.length);
      setFlashSaleProducts(shuffleArray(withFeatured).slice(0, flashSaleCount));
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
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      {/* Hero Banner - Fullscreen, Modern, Community & Pro-Local */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden mb-10">
        <img
          src={bannerImages[bannerIdx]}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3E7C59]/80 via-black/50 to-transparent z-10" />
        <div className="relative z-20 w-full flex justify-center items-center min-h-screen px-2">
          <div className="bg-white/90 rounded-3xl shadow-2xl px-6 py-8 sm:px-12 sm:py-14 max-w-2xl mx-auto flex flex-col items-center text-center gap-4 border border-primary/10 backdrop-blur-md">
            {/* Ribbon Badge */}
            <div className="flex justify-center mb-2">
              <span className="inline-flex items-center gap-2 bg-primary/90 text-black font-bold px-4 py-1.5 rounded-full shadow text-xs sm:text-sm uppercase tracking-widest border-2 border-white/80">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 01.894.553l1.382 2.802 3.093.45a1 1 0 01.554 1.706l-2.237 2.182.528 3.08a1 1 0 01-1.451 1.054L10 12.347l-2.773 1.46A1 1 0 015.776 12.76l.528-3.08-2.237-2.182a1 1 0 01.554-1.706l3.093-.45L9.106 2.553A1 1 0 0110 2z" /></svg>
                For Local Sellers & Shoppers
              </span>
            </div>
            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#3E7C59] mb-2 leading-tight tracking-tight drop-shadow-lg">
              Where Community <span className="text-primary">Thrives</span><br className="hidden sm:inline" /> & Locals Shine
            </h1>
            {/* Subheadline */}
            <p className="text-gray-800 text-lg sm:text-xl mb-2 max-w-xl">
              Welcome to Neighborly—your friendly marketplace for discovering unique, eco-friendly products and supporting passionate local sellers.
            </p>
            {/* Avatar Group / Community Icons */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Community member" className="w-8 h-8 rounded-full border-2 border-primary/60 shadow" />
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Community member" className="w-8 h-8 rounded-full border-2 border-primary/60 shadow -ml-2" />
              <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Community member" className="w-8 h-8 rounded-full border-2 border-primary/60 shadow -ml-2" />
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Community member" className="w-8 h-8 rounded-full border-2 border-primary/60 shadow -ml-2" />
              <span className="ml-2 text-xs text-gray-600 font-semibold">+ your neighbors</span>
            </div>
            {/* Principle Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-7">
              <span className="flex items-center gap-2 bg-[#E8F5E9] text-[#388E3C] font-semibold px-4 py-2 rounded-full shadow">
                <svg className="w-5 h-5 text-[#388E3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C7.03 2 2.5 6.03 2.5 11c0 2.5 1.5 5.5 5.5 9 4-3.5 5.5-6.5 5.5-9C21.5 6.03 16.97 2 12 2z" /></svg>
                Sustainable
              </span>
              <span className="flex items-center gap-2 bg-[#E3F2FD] text-[#1976D2] font-semibold px-4 py-2 rounded-full shadow">
                <svg className="w-5 h-5 text-[#1976D2]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 14s1.5 2 4 2 4-2 4-2" /></svg>
                Community
              </span>
              <span className="flex items-center gap-2 bg-[#FFF8E1] text-[#F9A825] font-semibold px-4 py-2 rounded-full shadow">
                <svg className="w-5 h-5 text-[#F9A825]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" /></svg>
                Local
              </span>
            </div>
            {/* CTA Button */}
            <a
              href="#categories"
              className="inline-flex items-center gap-2 bg-primary text-black font-extrabold px-8 py-4 rounded-full shadow-lg hover:bg-success/90 transition text-lg tracking-wide border-2 border-primary/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{ letterSpacing: '.04em' }}
            >
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              Start Exploring Your Community
            </a>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section id="categories" className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-5">Shop by Category</h2>
        <CategoryMenu />
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-8 px-4 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-black mb-6">Featured Products</h2>
        <ProductGrid
          products={products.filter((p: any) => p.featured).length > 0
            ? products.filter((p: any) => p.featured).slice(0,8)
            : products.slice(0,8)
          }
          gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          showCategoryTag={true}
          showOldPrice={false}
        />
        <div className="flex justify-center mt-8">
          <a
            href="/products"
            className="bg-primary text-black font-bold px-8 py-3 rounded-full shadow-lg hover:bg-primary/90 transition text-lg"
          >
            Browse All Products
          </a>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-10 px-4 max-w-6xl mx-auto w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-5">Flash Sale</h2>
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
          {/* Flash Sale Carousel: Transform only on desktop, native scroll on mobile */}
          <div
            className="flex gap-3 sm:gap-4 md:gap-6 py-2 min-h-[210px] sm:min-h-[270px] md:min-h-[330px] transition-transform duration-500 ease-in-out"
            style={carouselTransformStyle}
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
      </section>

      {/* Recently Viewed/Recommended Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto w-full bg-[#F8F7F4] rounded-3xl my-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#3E7C59] mb-2">Recently Viewed</h2>
            <p className="text-gray-600 max-w-xl">Products you've explored that might interest you</p>
          </div>
          <a 
            href="/products" 
            className="mt-4 md:mt-0 text-primary font-semibold flex items-center group transition-all duration-300 hover:text-success focus:outline-none focus:underline"
            aria-label="View all recently viewed products"
          >
            View All
            <svg 
              className="w-5 h-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recentlyViewedProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary"
              tabIndex={0}
            >
              <div className="relative pb-[100%] overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 bg-primary/90 text-xs text-white px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                  </span>
                  <button 
                    aria-label={`Add ${product.name} to cart`}
                    className="text-gray-500 hover:text-primary transition-colors duration-300 focus:outline-none focus:text-primary"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seller Spotlight Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center mb-2">
          <div className="bg-yellow-400 h-8 w-1.5 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Seller Spotlight</h2>
        </div>
        <p className="text-gray-600 mb-8 ml-4">Meet the local entrepreneurs behind our sustainable marketplace</p>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Seller Info */}
            <div className="md:w-1/3 bg-[#F4FBF5] p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <img 
                  src={sellerOfTheWeek.image} 
                  alt={sellerOfTheWeek.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  loading="lazy"
                />
                <div className="ml-4">
                  <h3 className="font-bold text-[#3E7C59] text-lg">{sellerOfTheWeek.name}</h3>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm font-semibold">{sellerOfTheWeek.rating}</span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{sellerOfTheWeek.reviewCount} reviews</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {sellerOfTheWeek.location}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 flex-grow">{sellerOfTheWeek.bio}</p>
              
              <a 
                href="#" 
                className="bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-success transition-colors duration-300 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Visit ${sellerOfTheWeek.name}'s shop`}
              >
                Visit Shop
              </a>
            </div>
            
            {/* Featured Products */}
            <div className="md:w-2/3 p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Featured Products</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sellerOfTheWeek.featuredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex bg-gray-50 rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow hover:bg-gray-100 focus-within:ring-2 focus-within:ring-primary"
                    tabIndex={0}
                  >
                    <div className="w-1/3 relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">{product.name}</h5>
                      <p className="text-primary font-bold">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                      </p>
                      <button 
                        className="mt-2 text-sm text-gray-600 hover:text-primary transition-colors duration-300 flex items-center focus:outline-none focus:text-primary"
                        aria-label={`View details of ${product.name}`}
                      >
                        View Details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <Testimonials testimonials={testimonials} />
      </section>

      {/* Call to Action Section */}
      <section className="py-12 px-4 bg-secondary text-white flex flex-col items-center" style={{backgroundColor: '#A08F79'}}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Ready to join your neighborhood market?</h2>
        <p className="mb-6 text-center max-w-xl">
          Sign up today and start making a positive impact in your community!
        </p>
        <a
          href="#"
          className="bg-primary text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-success transition"
          style={{backgroundColor:'#7BAE7F'}}>
          Get Started
        </a>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;

