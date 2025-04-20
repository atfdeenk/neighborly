import React from "react";
const categories = [
  { name: "Groceries", image: "https://img.icons8.com/color/96/000000/grocery-bag.png" },
  { name: "Fashion", image: "https://img.icons8.com/color/96/000000/clothes.png" },
  { name: "Home & Living", image: "https://img.icons8.com/color/96/000000/sofa.png" },
  { name: "Electronics", image: "https://img.icons8.com/color/96/000000/laptop.png" },
  { name: "Beauty", image: "https://img.icons8.com/color/96/000000/lipstick.png" },
  { name: "Toys", image: "https://img.icons8.com/color/96/000000/teddy-bear.png" },
  { name: "More", image: "https://img.icons8.com/color/96/000000/more.png" },
];

const CategoryMenu: React.FC = () => (
  <div className="w-full flex justify-center bg-accent/40 border-b border-accent" style={{borderColor:'#D9D4CC'}}>
    <div className="flex gap-6 px-4 sm:px-8 py-3">
      {categories.map((cat, idx) => (
        <button
          key={idx}
          className="flex flex-col items-center group focus:outline-none"
        >
          {/* Glassmorphic rounded-square containing both icon and title */}
          <span className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl transition-all duration-300 relative z-10 group-hover:bg-white/40 group-hover:backdrop-blur-md group-hover:shadow-2xl">
            <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white border border-accent shadow mb-3 overflow-hidden" style={{borderColor:'#D9D4CC'}}>
              <img src={cat.image} alt={cat.name} className="w-14 h-14 object-contain" />
            </span>
            <span className="text-base font-semibold text-secondary group-hover:text-primary transition-colors duration-200">
              {cat.name}
            </span>
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default CategoryMenu;
