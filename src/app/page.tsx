'use client';

import { useState, useEffect, useRef, CSSProperties, Suspense } from 'react';
import { fetchProducts } from '@/lib/api';
import { getSearchHistory, getRecommendedProducts, clearSearchHistory, addToViewedProducts } from '@/utils/searchHistory';
import FlashSaleTimer from '@/components/FlashSaleTimer';
import DualCurrencyPrice from '@/components/DualCurrencyPrice';
import "../styles/arrowPulse.css";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import Navbar from "../components/Navbar";


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

function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [hasSearchHistory, setHasSearchHistory] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [flashSaleStartIdx, setFlashSaleStartIdx] = useState(0);
  const [recommendedStartIdx, setRecommendedStartIdx] = useState(0);
  const [recommendationFilter, setRecommendationFilter] = useState<'forYou' | 'searches' | 'viewed' | 'similar'>('forYou');
  const flashSaleVisibleCount = 3;
  const recommendedVisibleCount = 4;


  // Carousel transform styles for different sections
  const [flashSaleCarouselStyle, setFlashSaleCarouselStyle] = useState<CSSProperties>({});
  const [recommendedCarouselStyle, setRecommendedCarouselStyle] = useState<CSSProperties>({});
  
  // Update carousel transform styles when indices change
  useEffect(() => {
    const updateTransform = () => {
      if (window.innerWidth >= 640) { // sm breakpoint
        // sm: 240px + 16px gap, md: 280px + 24px gap
        let cardWidth = 240, gap = 16;
        if (window.innerWidth >= 768) { cardWidth = 280; gap = 24; }
        
        setFlashSaleCarouselStyle({
          transform: `translateX(-${flashSaleStartIdx * (cardWidth + gap)}px)`
        });
        
        setRecommendedCarouselStyle({
          transform: `translateX(-${recommendedStartIdx * (cardWidth + gap)}px)`
        });
      } else {
        // Mobile: native scroll
        setFlashSaleCarouselStyle({});
        setRecommendedCarouselStyle({});
      }
    };
    
    updateTransform();
    window.addEventListener('resize', updateTransform);
    return () => window.removeEventListener('resize', updateTransform);
  }, [flashSaleStartIdx, recommendedStartIdx]);



  const handleFlashSalePrev = () => {
    if (flashSaleStartIdx > 0) {
      setFlashSaleStartIdx(flashSaleStartIdx - 1);
    }
  };

  const handleFlashSaleNext = () => {
    if (flashSaleStartIdx + flashSaleVisibleCount < flashSaleProducts.length) {
      setFlashSaleStartIdx(flashSaleStartIdx + 1);
    }
  };

  const handleRecommendedPrev = () => {
    if (recommendedStartIdx > 0) {
      setRecommendedStartIdx(recommendedStartIdx - 1);
    }
  };

  const handleRecommendedNext = () => {
    if (recommendedStartIdx + recommendedVisibleCount < recommendedProducts.length) {
      setRecommendedStartIdx(recommendedStartIdx + 1);
    }
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
    fetchProducts().then(data => {
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
      
      // Use products for flash sale
      const flashSaleCount = Math.min(20, withFeatured.length);
      setFlashSaleProducts(shuffleArray([...withFeatured]).slice(0, flashSaleCount));
      
      // Check if user has search history and generate recommendations
      if (typeof window !== 'undefined') {
        const searchHistory = getSearchHistory();
        setHasSearchHistory(searchHistory.length > 0);
        
        // Get recommended products based on search history and filter type
        const recommended = getRecommendedProducts(withFeatured, 8, 'forYou');
        setRecommendedProducts(recommended);
      }
    });
  }, []);
  
  // Update recommendations when filter changes
  useEffect(() => {
    if (products.length > 0) {
      const recommended = getRecommendedProducts(products, 8, recommendationFilter);
      setRecommendedProducts(recommended);
      // Reset carousel position when changing filters
      setRecommendedStartIdx(0);
    }
  }, [recommendationFilter, products]);

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

      {/* Hero Section - Modern Etsy-inspired */}
      <section className="w-full mb-6">
        
        {/* Hero Banner with Seasonal Collections */}
        <div className="relative overflow-hidden bg-[#F8F5F2] pt-8 pb-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="md:flex items-center gap-8">
              {/* Left Content */}
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                  Discover Sustainable <span className="text-[#3E7C59]">Local Treasures</span>
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Shop from artisans, farmers, and creators in your community offering eco-friendly, handcrafted goods.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  <a href="/sustainable" className="bg-[#3E7C59] hover:bg-[#2D5B41] text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200">
                    Shop Sustainable
                  </a>
                  <a href="/sellers" className="bg-white text-gray-800 font-medium px-6 py-3 rounded-lg border border-gray-300 hover:border-[#3E7C59] hover:text-[#3E7C59] transition-colors duration-200">
                    Meet Our Sellers
                  </a>
                </div>
                
                {/* Trust Badges */}
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-[#3E7C59]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Local Sellers
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-[#3E7C59]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.8 Marketplace Rating
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-[#3E7C59]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure Transactions
                  </div>
                </div>
              </div>
              
              {/* Right Content - Seasonal Collections */}
              <div className="md:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden group relative">
                      <img 
                        src="https://images.unsplash.com/photo-1556911220-bda9f7b7e482?auto=format&fit=crop&w=600&q=80" 
                        alt="Spring Collection" 
                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-medium">Spring Collection</h3>
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden group relative">
                      <img 
                        src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80" 
                        alt="Summer Essentials" 
                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-medium">Summer Essentials</h3>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 mt-6">
                    <div className="rounded-lg overflow-hidden group relative">
                      <img 
                        src="https://images.unsplash.com/photo-1592921870583-aeafb0639ffe?auto=format&fit=crop&w=600&q=80" 
                        alt="Home Decor" 
                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-medium">Home Decor</h3>
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden group relative">
                      <img 
                        src="https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80" 
                        alt="Sustainable Gifts" 
                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-medium">Sustainable Gifts</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Gifts for Every Occasion - Etsy-inspired */}
      <section id="categories" className="py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Discover Gifts for Every Occasion</h2>
            <p className="text-gray-500">Unique, sustainable treasures for everyone on your list</p>
          </div>
          <a href="/products" className="text-[#3E7C59] hover:text-[#2D5B41] font-medium flex items-center transition-colors duration-200">
            See all categories
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Gift Categories - Etsy-inspired cards */}
          <a href="/products?category=Home%20%26%20Living" className="group relative rounded-lg overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" 
                alt="Home & Living" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-lg">Home & Living</h3>
                <p className="text-white/80 text-sm">Sustainable decor & essentials</p>
              </div>
            </div>
          </a>
          
          <a href="/products?category=Fashion" className="group relative rounded-lg overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=600&q=80" 
                alt="Fashion" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-lg">Fashion</h3>
                <p className="text-white/80 text-sm">Handcrafted, ethical clothing</p>
              </div>
            </div>
          </a>
          
          <a href="/products?category=Groceries" className="group relative rounded-lg overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" 
                alt="Groceries" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-lg">Groceries</h3>
                <p className="text-white/80 text-sm">Local, organic food & produce</p>
              </div>
            </div>
          </a>
          
          <a href="/products?category=Beauty" className="group relative rounded-lg overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=600&q=80" 
                alt="Beauty" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-lg">Beauty</h3>
                <p className="text-white/80 text-sm">Natural, cruelty-free products</p>
              </div>
            </div>
          </a>
        </div>
        
        {/* Occasion-based Categories */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-5">Shop by Occasion</h3>
          <div className="flex overflow-x-auto scrollbar-hide space-x-4 py-2 px-1 -mx-1">
            <a href="/occasion/birthday" className="min-w-[160px] max-w-[160px] rounded-lg overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#F8F5F2]">
                <img 
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80" 
                  alt="Birthday Gifts" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="py-2 text-center">
                <h4 className="font-medium text-gray-800 group-hover:text-[#3E7C59] transition-colors duration-200">Birthday</h4>
              </div>
            </a>
            
            <a href="/occasion/housewarming" className="min-w-[160px] max-w-[160px] rounded-lg overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#F8F5F2]">
                <img 
                  src="https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&w=400&q=80" 
                  alt="Housewarming Gifts" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="py-2 text-center">
                <h4 className="font-medium text-gray-800 group-hover:text-[#3E7C59] transition-colors duration-200">Housewarming</h4>
              </div>
            </a>
            
            <a href="/occasion/wedding" className="min-w-[160px] max-w-[160px] rounded-lg overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#F8F5F2]">
                <img 
                  src="https://images.unsplash.com/photo-1522673607200-164d1b3ce551?auto=format&fit=crop&w=400&q=80" 
                  alt="Wedding Gifts" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="py-2 text-center">
                <h4 className="font-medium text-gray-800 group-hover:text-[#3E7C59] transition-colors duration-200">Wedding</h4>
              </div>
            </a>
            
            <a href="/occasion/holiday" className="min-w-[160px] max-w-[160px] rounded-lg overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#F8F5F2]">
                <img 
                  src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=400&q=80" 
                  alt="Holiday Gifts" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="py-2 text-center">
                <h4 className="font-medium text-gray-800 group-hover:text-[#3E7C59] transition-colors duration-200">Holiday</h4>
              </div>
            </a>
            
            <a href="/occasion/anniversary" className="min-w-[160px] max-w-[160px] rounded-lg overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#F8F5F2]">
                <img 
                  src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80" 
                  alt="Anniversary Gifts" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="py-2 text-center">
                <h4 className="font-medium text-gray-800 group-hover:text-[#3E7C59] transition-colors duration-200">Anniversary</h4>
              </div>
            </a>
          </div>
        </div>
      </section>



      {/* Visual Separator */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-gray-200 my-4"></div>
      </div>

      {/* Picks Inspired by Your Shopping - Based on search history */}
      <section className="py-6 px-4 max-w-6xl mx-auto w-full my-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Picks Inspired by Your Shopping</h2>
            <div className="flex flex-col space-y-2">
              <p className="text-gray-500">
                {recommendationFilter === 'forYou' && (hasSearchHistory 
                  ? "Personalized recommendations based on your activity" 
                  : "Products you might be interested in")}
                {recommendationFilter === 'searches' && (hasSearchHistory 
                  ? "Products matching your search history" 
                  : "Popular products - try searching to see personalized results")}
                {recommendationFilter === 'viewed' && "Products you've recently viewed"}
                {recommendationFilter === 'similar' && "Products similar to what you've viewed or searched"}
              </p>
              
              {hasSearchHistory && (
                <div className="flex items-center">
                  <span className="text-xs text-[#3E7C59] bg-[#3E7C59]/10 px-2 py-1 rounded-full font-medium flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Using search history
                  </span>
                  <button 
                    onClick={() => {
                      if (window.confirm('Clear your search history? This will reset your personalized recommendations.')) {
                        clearSearchHistory();
                        setHasSearchHistory(false);
                        // Refresh recommendations
                        const recommended = getRecommendedProducts(products, 8, recommendationFilter);
                        setRecommendedProducts(recommended);
                      }
                    }}
                    className="ml-3 text-sm text-gray-600 hover:text-[#3E7C59] flex items-center transition-colors duration-200 border border-gray-200 hover:border-[#3E7C59] rounded-md px-2 py-1"
                    aria-label="Clear search history"
                    title="Clear your search history"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear History
                  </button>
                </div>
              )}
            </div>
          </div>
          <a 
            href="/products" 
            className="mt-4 md:mt-0 text-[#3E7C59] hover:text-[#2D5B41] font-medium flex items-center transition-colors duration-200"
            aria-label="View all products"
          >
            See all
            <svg 
              className="w-4 h-4 ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        {/* Recommendation Categories */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto scrollbar-hide space-x-3 py-2 px-1 -mx-1">
              <button 
                onClick={() => setRecommendationFilter('forYou')}
                className={`whitespace-nowrap ${recommendationFilter === 'forYou' ? 'bg-[#3E7C59] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#3E7C59] hover:text-[#3E7C59]'} text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200`}
              >
                For You
              </button>
              <button 
                onClick={() => setRecommendationFilter('searches')}
                className={`whitespace-nowrap ${recommendationFilter === 'searches' ? 'bg-[#3E7C59] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#3E7C59] hover:text-[#3E7C59]'} text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200`}
              >
                Based on Searches
              </button>
              <button 
                onClick={() => setRecommendationFilter('viewed')}
                className={`whitespace-nowrap ${recommendationFilter === 'viewed' ? 'bg-[#3E7C59] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#3E7C59] hover:text-[#3E7C59]'} text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200`}
              >
                Recently Viewed
              </button>
              <button 
                onClick={() => setRecommendationFilter('similar')}
                className={`whitespace-nowrap ${recommendationFilter === 'similar' ? 'bg-[#3E7C59] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#3E7C59] hover:text-[#3E7C59]'} text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200`}
              >
                Similar Items
              </button>
            </div>
            
            <div className="hidden sm:flex gap-2 ml-4">
              <button
                className="bg-white border border-gray-200 shadow-sm rounded-full p-2.5 transition-all duration-200 disabled:opacity-40 hover:border-[#3E7C59] hover:text-[#3E7C59] focus:outline-none focus:border-[#3E7C59] focus:text-[#3E7C59]"
                onClick={handleRecommendedPrev}
                aria-label="Previous"
                disabled={recommendedStartIdx === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                className="bg-white border border-gray-200 shadow-sm rounded-full p-2.5 transition-all duration-200 disabled:opacity-40 hover:border-[#3E7C59] hover:text-[#3E7C59] focus:outline-none focus:border-[#3E7C59] focus:text-[#3E7C59]"
                onClick={handleRecommendedNext}
                aria-label="Next"
                disabled={recommendedStartIdx + recommendedVisibleCount >= recommendedProducts.length}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Recommendations Carousel */}
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div
            className="flex gap-5 transition-transform duration-500 ease-in-out"
            style={recommendedCarouselStyle}
          >
            {recommendedProducts.map((product, idx) => (
              <div 
                key={product.id + '-' + idx} 
                className="min-w-[220px] max-w-[220px] sm:min-w-[260px] sm:max-w-[260px] md:min-w-[280px] md:max-w-[280px] flex-shrink-0 group cursor-pointer"
                onClick={() => {
                  // Track product view when clicked
                  if (product.id) {
                    addToViewedProducts(product.id);
                  }
                  // In a real app, this would navigate to the product page
                  alert(`Viewing ${product.name || product.title}`);
                }}
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-3 aspect-square">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.category && (
                      <span className="bg-white/90 text-xs text-gray-700 px-2 py-1 rounded-full font-medium">
                        {product.category}
                      </span>
                    )}
                  </div>
                  

                  
                  {/* Price tag in bottom left corner */}
                  <div className="absolute bottom-2 left-2 z-10">
                    <span className="bg-white/90 text-xs text-gray-700 px-2 py-1 rounded-full font-medium">
                      <DualCurrencyPrice amount={product.price} currency={product.currency} />
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                  <div className="absolute bottom-3 right-3 flex space-x-2">
                    <button 
                      className="bg-white rounded-full p-2 shadow-md opacity-0 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      aria-label={`Add ${product.name} to favorites`}
                    >
                      <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button 
                      className="bg-white rounded-full p-2 shadow-md opacity-0 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <svg className="w-5 h-5 text-gray-600 hover:text-[#3E7C59] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="font-medium text-gray-800 mb-1 truncate group-hover:text-[#3E7C59] transition-colors duration-200">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {product.seller || 'Local Artisan'}
                    </p>
                    <div className="flex items-center text-amber-400 text-xs">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-xs text-gray-500">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Visual Separator */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-gray-200 my-4"></div>
      </div>

      {/* Today's Big Deals - Etsy-inspired */}
      <section className="py-6 px-4 max-w-6xl mx-auto w-full my-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-gray-800">Today's Big Deals</h2>
                <FlashSaleTimer key={timerKey} onReset={handleTimerReset} />
              </div>
              <p className="text-gray-500">Limited-time offers from local artisans</p>
            </div>
          </div>
          <div>
            <a href="/deals" className="text-[#3E7C59] hover:text-[#2D5B41] font-medium flex items-center transition-colors duration-200">
              See all deals
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Deals Navigation */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto scrollbar-hide space-x-3 py-2 px-1 -mx-1">
              <button className="whitespace-nowrap bg-[#3E7C59] text-white text-sm font-medium px-4 py-2 rounded-full">
                All Deals
              </button>
              <button className="whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:border-[#3E7C59] hover:text-[#3E7C59] text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200">
                Under Rp100.000
              </button>
              <button className="whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:border-[#3E7C59] hover:text-[#3E7C59] text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200">
                Home & Living
              </button>
              <button className="whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:border-[#3E7C59] hover:text-[#3E7C59] text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200">
                Handmade Crafts
              </button>
              <button className="whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:border-[#3E7C59] hover:text-[#3E7C59] text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200">
                Food & Produce
              </button>
            </div>
            
            <div className="hidden sm:flex gap-2 ml-4">
              <button
                className="bg-white border border-gray-200 shadow-sm rounded-full p-2.5 transition-all duration-200 disabled:opacity-40 hover:border-[#3E7C59] hover:text-[#3E7C59] focus:outline-none focus:border-[#3E7C59] focus:text-[#3E7C59]"
                onClick={handleFlashSalePrev}
                aria-label="Previous"
                disabled={flashSaleStartIdx === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                className="bg-white border border-gray-200 shadow-sm rounded-full p-2.5 transition-all duration-200 disabled:opacity-40 hover:border-[#3E7C59] hover:text-[#3E7C59] focus:outline-none focus:border-[#3E7C59] focus:text-[#3E7C59]"
                onClick={handleFlashSaleNext}
                aria-label="Next"
                disabled={flashSaleStartIdx + flashSaleVisibleCount >= flashSaleProducts.length}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Deals Carousel */}
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div
            className="flex gap-5 transition-transform duration-500 ease-in-out"
            style={flashSaleCarouselStyle}
          >
            {flashSaleProducts.map((product: any, idx: number) => (
              <div 
                key={product.id + '-' + idx} 
                className="min-w-[220px] max-w-[220px] sm:min-w-[260px] sm:max-w-[260px] md:min-w-[280px] md:max-w-[280px] flex-shrink-0 group cursor-pointer"
                onClick={() => {
                  // Track product view when clicked
                  if (product.id) {
                    addToViewedProducts(product.id);
                  }
                  // In a real app, this would navigate to the product page
                  alert(`Viewing ${product.name || product.title}`);
                }}
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-3 aspect-square">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.category && (
                      <span className="bg-white/90 text-xs text-gray-700 px-2 py-1 rounded-full font-medium">
                        {product.category}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                  <div className="absolute bottom-3 right-3 flex space-x-2">
                    <button 
                      className="bg-white rounded-full p-2 shadow-md opacity-0 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      aria-label={`Add ${product.name} to favorites`}
                    >
                      <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button 
                      className="bg-white rounded-full p-2 shadow-md opacity-0 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <svg className="w-5 h-5 text-gray-600 hover:text-[#3E7C59] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="font-medium text-gray-800 mb-1 truncate group-hover:text-[#3E7C59] transition-colors duration-200">{product.name}</h3>
                  <div className="flex items-end mb-1">
                    <span className="font-semibold text-gray-900">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                    </span>
                    <span className="text-gray-400 text-sm line-through ml-2">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price * 1.25)}
                    </span>
                    <span className="ml-2 text-[#A61B1B] text-sm font-medium">25% off</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-amber-400 text-xs">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-xs text-gray-500">4.8 (24)</span>
                    </div>
                    {product.seller && (
                      <span className="text-xs text-gray-500">{product.seller}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Visual Separator */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-gray-200 my-4"></div>
      </div>

      {/* Testimonials Section */}
      <section className="py-6 px-4 max-w-6xl mx-auto w-full my-4">
        <Testimonials testimonials={testimonials} />
      </section>
      
      {/* Visual Separator */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-gray-200 my-4"></div>
      </div>
      
      {/* Seller Spotlight Section - Etsy-inspired */}
      <section className="py-6 px-4 max-w-6xl mx-auto w-full my-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Seller Spotlight</h2>
            <p className="text-gray-500">Meet the local entrepreneurs behind our sustainable marketplace</p>
          </div>
          <a href="/sellers" className="text-[#3E7C59] hover:text-[#2D5B41] font-medium flex items-center transition-colors duration-200">
            Discover more sellers
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="md:flex">
            {/* Seller Info */}
            <div className="md:w-1/3 bg-gray-50 p-8 md:p-12 lg:p-16">
              <div className="flex items-start mb-6">
                <img 
                  src={sellerOfTheWeek.image} 
                  alt={sellerOfTheWeek.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                  loading="lazy"
                />
                <div className="ml-4 pt-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{sellerOfTheWeek.name}</h3>
                  <div className="flex items-center">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill={i < Math.floor(sellerOfTheWeek.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">{sellerOfTheWeek.rating} ({sellerOfTheWeek.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {sellerOfTheWeek.location}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-4 text-sm">
                <span className="bg-[#E8F5E9] text-[#388E3C] px-3 py-1 rounded-full font-medium">
                  Eco-friendly
                </span>
                <span className="bg-[#E3F2FD] text-[#1976D2] px-3 py-1 rounded-full font-medium ml-2">
                  Local artisan
                </span>
              </div>
              
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{sellerOfTheWeek.bio}</p>
              
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className="bg-[#3E7C59] text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:bg-[#2D5B41] transition-colors duration-200 text-center flex-grow"
                  aria-label={`Visit ${sellerOfTheWeek.name}'s shop`}
                >
                  Visit Shop
                </a>
                <button 
                  className="border border-gray-300 text-gray-600 font-medium p-3 rounded-lg hover:border-[#3E7C59] hover:text-[#3E7C59] transition-colors duration-200"
                  aria-label="Contact seller"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Featured Products */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-800">Featured Products</h4>
                <a href="#" className="text-[#3E7C59] hover:text-[#2D5B41] text-sm font-medium">View all products</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sellerOfTheWeek.featuredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="group rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <button 
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        aria-label={`Add ${product.name} to favorites`}
                      >
                        <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h5 className="font-medium text-gray-800 mb-2 group-hover:text-[#3E7C59] transition-colors duration-200">{product.name}</h5>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                        </span>
                        <button 
                          className="text-gray-400 hover:text-[#3E7C59] transition-colors duration-200"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Etsy-inspired */}
      <section className="py-6 px-4 max-w-6xl mx-auto w-full my-4">
        <div className="bg-[#F4F3F0] rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3E7C59]/10 to-transparent"></div>
          
          <div className="md:flex items-center relative">
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                Join Our Community of Sustainable Creators
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Connect with local artisans, discover unique sustainable products, and be part of a movement that values community and our planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/signup" 
                  className="bg-[#3E7C59] text-white font-medium px-8 py-3.5 rounded-lg shadow-sm hover:bg-[#2D5B41] transition-colors duration-200 text-center"
                  aria-label="Sign up for Neighborly"
                >
                  Join Neighborly
                </a>
                <a 
                  href="/about" 
                  className="border border-gray-300 bg-white text-gray-700 font-medium px-8 py-3.5 rounded-lg hover:border-[#3E7C59] hover:text-[#3E7C59] transition-colors duration-200 text-center"
                  aria-label="Learn more about Neighborly"
                >
                  Learn More
                </a>
              </div>
            </div>
            
            <div className="md:w-1/2 relative hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=600&q=80" 
                alt="Sustainable community marketplace" 
                className="w-full h-full object-cover object-center"
                style={{ minHeight: '400px' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#3E7C59]/20 to-transparent"></div>
            </div>
          </div>
          
          <div className="bg-[#E8F5E9] py-4 px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="w-5 h-5 text-[#388E3C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-700">Join <span className="font-medium">5,000+</span> members already on Neighborly</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-[#3E7C59] hover:text-[#2D5B41] text-sm font-medium">How it works</a>
              <a href="#" className="text-[#3E7C59] hover:text-[#2D5B41] text-sm font-medium">Success stories</a>
              <a href="#" className="text-[#3E7C59] hover:text-[#2D5B41] text-sm font-medium">FAQs</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;

