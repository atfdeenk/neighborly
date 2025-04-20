import React from "react";
import Link from "next/link";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";

import { useDebounce } from "../hooks/useDebounce";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = (pathname === "/products" && searchParams.get("q")) || "";
  const [searchInput, setSearchInput] = React.useState(initialQuery);
  React.useEffect(() => {
    // Keep input in sync with ?q=... on /products
    if (pathname === "/products") {
      setSearchInput(searchParams.get("q") || "");
    }
    // eslint-disable-next-line
  }, [pathname, searchParams]);
  const debouncedSearch = useDebounce(searchInput, 350);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const [mobileSearchInput, setMobileSearchInput] = React.useState("");
  const debouncedMobileSearch = useDebounce(mobileSearchInput, 350);



  return (
    <nav className="sticky top-0 z-30 bg-white/95 border-b border-accent shadow-sm px-2 sm:px-4 md:px-8 py-2 flex items-center justify-between w-full overflow-x-auto" style={{borderColor:'#D9D4CC'}}>
      <div className="flex items-center gap-1 sm:gap-2 min-w-fit">
        <span className="font-bold text-lg xs:text-xl sm:text-2xl text-primary tracking-tight" style={{color:'#7BAE7F'}}>Neighborly</span>
      </div>
      {/* Search bar: full on sm+, icon only on mobile */}
      <div className="flex-1 mx-4 max-w-xl hidden sm:block">
        <div className="flex items-center bg-accent/70 rounded-full px-4 py-2 border border-accent">
          <FaSearch className="text-secondary mr-2" style={{color:'#A08F79'}}/>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search for products, brands, or categories..."
            className="flex-1 bg-transparent outline-none text-text placeholder:text-gray-500"
            style={{color:'#333333'}}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchInput.trim()) {
                router.push(`/products?q=${encodeURIComponent(searchInput)}`);
              }
            }}
          />
          {searchInput && (
            <button
              aria-label="Clear search"
              className="ml-2 p-1 rounded-full hover:bg-accent/60 active:bg-accent/80 focus:bg-accent/80 transition transform hover:scale-110 active:scale-95 focus:scale-95 duration-150 outline-none ring-0"
              onClick={() => {
                setSearchInput("");
                if (pathname === "/products") {
                  router.push("/products");
                }
              }}
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>
      {/* Mobile search: animated expand/collapse */}
      <button className="block sm:hidden p-2 rounded-full hover:bg-accent/40 transition" title="Search" onClick={() => setMobileSearchOpen(true)}>
        <FaSearch className="text-primary text-xl" />
      </button>
      {mobileSearchOpen && (
        <div className="fixed top-[56px] left-0 w-full z-40 sm:hidden animate-fadeIn">
          <div className="bg-black/30 backdrop-blur-sm w-full h-screen absolute top-0 left-0 z-[-1]" onClick={() => setMobileSearchOpen(false)}></div>
          <div className="flex items-center w-full max-w-md mx-auto mt-2 bg-accent/70 rounded-full px-4 py-2 border border-accent shadow-lg transition-all duration-300">
            <FaSearch className="text-secondary mr-2" style={{color:'#A08F79'}}/>
            <input
              autoFocus
              type="text"
              value={mobileSearchInput}
              onChange={e => setMobileSearchInput(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-text placeholder:text-gray-500 transition-all duration-300"
              style={{color:'#333333'}}
              onKeyDown={e => {
                if (e.key === 'Enter' && mobileSearchInput.trim()) {
                  router.push(`/products?q=${encodeURIComponent(mobileSearchInput)}`);
                  setMobileSearchOpen(false);
                }
              }}
            />
            {mobileSearchInput && (
              <button
                aria-label="Clear search"
                className="ml-2 p-1 rounded-full hover:bg-accent/60 active:bg-accent/80 focus:bg-accent/80 transition transform hover:scale-110 active:scale-95 focus:scale-95 duration-150 outline-none ring-0"
                onClick={() => {
                  setMobileSearchInput("");
                  if (pathname === "/products") {
                    router.push("/products");
                  }
                }}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
            <button onClick={() => setMobileSearchOpen(false)} className="ml-2 p-1 rounded-full hover:bg-accent/60 active:bg-accent/80 focus:bg-accent/80 transition transform hover:scale-110 active:scale-95 focus:scale-95 duration-150 outline-none ring-0">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 sm:gap-4 text-2xl">
        <button title="Cart" className="hover:text-primary transition"><FaShoppingCart /></button>
        <Link href="/signin" className="text-sm sm:text-base px-3 py-1 rounded-full border border-primary text-primary bg-white shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-white hover:border-primary hover:text-primary transition font-semibold ml-2">Sign In</Link>
        <Link href="/register" className="text-sm sm:text-base px-3 py-1 rounded-full border border-success text-success bg-white shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-success hover:bg-white hover:border-success hover:text-success transition font-semibold">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;

