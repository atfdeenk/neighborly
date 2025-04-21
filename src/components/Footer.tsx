import React from "react";

import { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would connect to a newsletter service
    alert(`Thank you for subscribing with ${email}! You'll receive updates about sustainable products in your community.`);
    setEmail('');
  };
  
  return (
    <footer className="mt-auto bg-[#F9F8F4] text-gray-700 border-t border-[#D9D4CC]">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-[#3E7C59]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-xl font-bold text-[#3E7C59]">Neighborly</span>
            </div>
            <p className="text-sm mb-4">Connecting communities through sustainable, local commerce. Supporting artisans and eco-conscious businesses in your neighborhood.</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-[#3E7C59] transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-[#3E7C59] transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-[#3E7C59] transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><a href="/products" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">All Products</a></li>
              <li><a href="/products?category=food" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">Food & Produce</a></li>
              <li><a href="/products?category=crafts" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">Handmade Crafts</a></li>
              <li><a href="/products?category=home" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">Home & Living</a></li>
              <li><a href="/products?category=beauty" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">Beauty & Wellness</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">About Us</a></li>
              <li><a href="/sellers" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">Our Sellers</a></li>
              <li><a href="/sustainability" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">Sustainability</a></li>
              <li><a href="/blog" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">Blog</a></li>
              <li><a href="/contact" className="text-sm hover:text-[#3E7C59] transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Stay Connected</h3>
            <p className="text-sm mb-4">Subscribe to our newsletter for updates on new products, seller stories, and community events.</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3E7C59] focus:border-[#3E7C59] text-sm"
              />
              <button
                type="submit"
                className="bg-[#3E7C59] text-white px-4 py-2 rounded-md hover:bg-[#2D5B41] transition-colors duration-200 text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-[#D9D4CC]">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-[#3E7C59]">Neighborly</span>. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="/privacy" className="text-xs text-gray-500 hover:text-[#3E7C59] transition-colors duration-200">Privacy Policy</a>
            <a href="/terms" className="text-xs text-gray-500 hover:text-[#3E7C59] transition-colors duration-200">Terms of Service</a>
            <a href="/faq" className="text-xs text-gray-500 hover:text-[#3E7C59] transition-colors duration-200">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
