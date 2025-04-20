import { Product } from "../types/product";

const SELLER_NAMES = [
  "GreenLeaf Market",
  "EcoGoods",
  "Urban Artisan",
  "Crafted Co.",
  "Nature's Best",
  "Local Roots",
  "Handmade Hub",
  "Purely Eco",
  "Sunrise Sellers",
  "Sustainable Finds"
];

// Available currencies for products
const CURRENCIES = [
  "USD", // US Dollar
  "IDR", // Indonesian Rupiah
  "EUR", // Euro
  "GBP"  // British Pound
];

// Currency conversion rates (simplified for demo)
const CURRENCY_MULTIPLIERS: {[key: string]: number} = {
  "USD": 1,
  "IDR": 15500, // 1 USD = 15,500 IDR
  "EUR": 0.92,  // 1 USD = 0.92 EUR
  "GBP": 0.79   // 1 USD = 0.79 GBP
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://api.escuelajs.co/api/v1/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const products = await res.json();
  return products.map((product: any) => {
    // Platzi API fields: id, title, price, description, images (array), category {id, name, ...}
    const basePriceUSD = typeof product.price === 'string' ? parseFloat(product.price.replace(/[^\d.]/g, '')) : product.price;
    
    // Randomly assign a currency to each product
    const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)];
    
    // Convert the price to the selected currency
    const price = currency === "USD" 
      ? basePriceUSD 
      : Math.round(basePriceUSD * CURRENCY_MULTIPLIERS[currency] * 100) / 100;
    
    return {
      id: product.id,
      title: product.title,
      image: Array.isArray(product.images) && product.images.length ? product.images[0] : '',
      price,
      currency,
      category: product.category?.name || 'Other',
      seller: SELLER_NAMES[Math.floor(Math.random() * SELLER_NAMES.length)],
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
      reviewCount: Math.floor(Math.random() * 500 + 10), // 10 - 510
      freeShipping: basePriceUSD > 20,
      sold: Math.floor(Math.random() * 1951) + 50,
      stock: Math.floor(Math.random() * 91) + 10 // 10-100
    };
  });
}
