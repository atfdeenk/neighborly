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

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const products = await res.json();
  return products.map((product: any) => {
    const price = typeof product.price === 'string' ? parseFloat(product.price.replace(/[^\d.]/g, '')) : product.price;
    return {
      ...product,
      price,
      seller: SELLER_NAMES[Math.floor(Math.random() * SELLER_NAMES.length)],
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
      reviewCount: Math.floor(Math.random() * 500 + 10), // 10 - 510
      freeShipping: price > 20,
      sold: Math.floor(Math.random() * 1951) + 50,
      stock: Math.floor(Math.random() * 91) + 10 // 10-100
    };
  });
}
