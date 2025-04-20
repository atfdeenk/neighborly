import React from "react";
import Link from "next/link";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";

const Navbar: React.FC = () => (
  <nav className="sticky top-0 z-30 bg-white/95 border-b border-accent shadow-sm px-4 sm:px-8 py-2 flex items-center justify-between" style={{borderColor:'#D9D4CC'}}>
    <div className="flex items-center gap-2">
      <span className="font-bold text-2xl text-primary tracking-tight" style={{color:'#7BAE7F'}}>Neighborly</span>
    </div>
    <div className="flex-1 mx-4 max-w-xl">
      <div className="flex items-center bg-accent/70 rounded-full px-4 py-2 border border-accent">
        <FaSearch className="text-secondary mr-2" style={{color:'#A08F79'}}/>
        <input
          type="text"
          placeholder="Search for products, brands, or categories..."
          className="flex-1 bg-transparent outline-none text-text placeholder:text-gray-500"
          style={{color:'#333333'}}
        />
      </div>
    </div>
    <div className="flex items-center gap-4 text-2xl">
      <button title="Cart" className="hover:text-primary transition"><FaShoppingCart /></button>
      <button title="Account" className="hover:text-primary transition"><FaUserCircle /></button>
    </div>
  </nav>
);

export default Navbar;
