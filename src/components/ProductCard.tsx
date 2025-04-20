import React from "react";
import { FaFire } from "react-icons/fa";
import { Product } from "../types/product";
import "../styles/firePulse.css";
import DualCurrencyPrice from "./DualCurrencyPrice";

interface ProductCardProps {
  product: Product;
  showCategoryTag?: boolean;
  showOldPrice?: boolean;
  tagLabel?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showCategoryTag = true,
  showOldPrice = false,
  tagLabel,
}) => (
  <div
    className={`group bg-white rounded-2xl flex flex-col items-stretch border border-gray-200 transition-all duration-200 cursor-pointer ${tagLabel === 'Flash Sale' ? 'shadow-lg ring-2 ring-[#7BAE7F]/10 hover:ring-[#7BAE7F]/30 hover:shadow-2xl p-2 sm:p-3 md:p-4 max-w-[90vw]' : 'shadow-md hover:shadow-xl hover:-translate-y-1 p-2 sm:p-3 md:p-4 max-w-[90vw]'}`}
    style={{ minWidth: 0, ...(tagLabel === 'Flash Sale' ? { maxWidth: '90vw', padding: '0.5rem' } : {}) }}
    title={product.title}
  >
    <div className={`relative w-full overflow-hidden rounded-t-2xl flex items-center justify-center bg-gray-50 ${tagLabel === 'Flash Sale' ? 'h-[170px] md:h-[180px]' : 'aspect-square'}`}>
      {/* Discount badge top-right on mobile */}
      {showOldPrice && tagLabel === 'Flash Sale' && (
        <span className="block sm:hidden bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full absolute right-2 top-2 z-10">
          -20%
        </span>
      )}

      {/* Bestseller badge absolute top-left */}
      {product.sold && product.sold >= 1600 && (
        <span
          className="flex items-center absolute left-2 top-2 text-yellow-900 text-xs font-semibold px-3 py-1 shadow-sm bg-yellow-300 z-20"
          style={{
            borderTopLeftRadius: '0.5rem',
            borderBottomLeftRadius: '0',
            borderTopRightRadius: '1rem',
            borderBottomRightRadius: '1rem',
            minWidth: '70px',
            maxWidth: '120px',
            width: 'auto',
            textAlign: 'center',
          }}
        >
          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.782-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
          Bestseller
        </span>
      )}
      {product.image ? (
        <img
          src={product.image}
          alt={product.title}
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          style={{ width: '100%', height: '100%', background: 'white', borderRadius: '1rem', display: 'block', margin: '0 auto' }}
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ width: '100%', height: '100%', background: '#f3f4f6', borderRadius: '1rem' }}>
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm16 0l-8 8-4-4" />
          </svg>
        </div>
      )}
    </div>
    <div className={`flex flex-col flex-1 overflow-hidden ${tagLabel === 'Flash Sale' ? 'px-2 pt-3 pb-3' : 'px-4 pt-4 pb-5'}`}>

      <h3
        className={`font-semibold text-base sm:text-lg mb-2 text-gray-900 ${tagLabel === 'Flash Sale' ? 'whitespace-nowrap overflow-hidden text-ellipsis' : 'text-ellipsis overflow-hidden'}`}
        style={tagLabel === 'Flash Sale' ? {minHeight: '1.3em', lineHeight: '1.3em', maxHeight: '1.3em'} : {display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '1.3em', lineHeight: '1.3em', maxHeight: '2.6em'}}
      >
        {product.title}
      </h3>
      <div className="flex flex-row items-center gap-2 mb-2 min-h-[1.5em] mt-1">
        {(tagLabel || showCategoryTag) && (
          <span
            className={`text-white text-xs px-3 py-1 rounded-full shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[8rem] ${tagLabel === 'Flash Sale' ? '' : 'bg-green-600/90'}`}
            style={tagLabel === 'Flash Sale' ? { backgroundColor: '#4C6B4F' } : {}}
          >
            {tagLabel ? tagLabel : showCategoryTag ? product.category : null}
          </span>
        )}
        {product.freeShipping && (
          <span className="bg-primary/90 text-white text-xs px-3 py-1 rounded-full shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[8rem]" style={{backgroundColor:'#7BAE7F'}}>
            Free Shipping
          </span>
        )}

      </div>
      <div className="flex items-center gap-2 mb-1">
        {showOldPrice ? (
          <DualCurrencyPrice 
            amount={product.price * 1.25}
            currency={product.currency || "USD"}
            salePrice={product.price}
            className={`font-bold ${tagLabel === 'Flash Sale' ? 'text-xl text-[#7BAE7F]' : 'text-primary text-lg sm:text-xl'}`}
          />
        ) : (
          <DualCurrencyPrice 
            amount={product.price}
            currency={product.currency || "USD"}
            className={`font-bold ${tagLabel === 'Flash Sale' ? 'text-xl text-[#7BAE7F]' : 'text-primary text-lg sm:text-xl'}`}
          />
        )}
        {/* Discount badge inline next to price for sm and up */}
        {showOldPrice && tagLabel === 'Flash Sale' && (
          <span className="hidden sm:inline bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full ml-2">
            -20%
          </span>
        )}
      </div>
      {tagLabel === 'Flash Sale' && typeof product.stock === 'number' && (
        <div className="w-full mt-2 mb-1">
          <div className="w-full h-4 sm:h-6 bg-gray-200 rounded-full flex items-center relative" style={{overflow: 'visible'}} >
            {/* Progress fill */}
            <div
              className="h-6 rounded-full bg-gradient-to-r from-[#7BAE7F] to-[#4C6B4F] transition-all duration-500 absolute top-0 left-0"
              style={{ width: `${Math.max(0, Math.min(100, product.stock && product.sold ? (product.sold/(product.stock+product.sold))*100 : 100))}%` }}
            ></div>
            {/* Fire icon overlays and moves with progress */}
            <span
              className="absolute z-20 fire-pulse"
              style={{
                left: `calc(${Math.max(0, Math.min(100, product.stock && product.sold ? (product.sold/(product.stock+product.sold))*100 : 100))}% - 22px)`,
                top: '-6px', // just above the bar
                filter: 'drop-shadow(0 0 0.5px #FF9800) drop-shadow(0 0 0.5px #FFD740)'
              }}
            >
              <FaFire className="text-orange-500 text-base sm:text-lg md:text-2xl" />
            </span>
            {/* Text overlays progress bar - only show when stock < 10 */}
            {product.stock < 10 && (
              <span className="w-full text-xs font-semibold text-center z-10 relative select-none" style={{color: '#fff', textShadow: '0 1px 3px rgba(44,62,80,.5)'}}>
                Stock Left: {product.stock}
              </span>
            )}
          </div>
        </div>
      )}
      {product.seller && (
        <span className="text-xs text-gray-400 mb-1 truncate">by {product.seller}</span>
      )}
      {(typeof product.rating === 'number' && product.sold) && (
        <div className="flex items-center gap-1 mb-1 text-xs text-gray-500">
          <svg className="w-4 h-4 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.782-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
          <span>{product.rating.toFixed(1)}</span>
          <span className="mx-1">&middot;</span>
          <span>{product.sold.toLocaleString()} sold</span>
        </div>
      )}
    </div>
  </div>
);

export default ProductCard;
