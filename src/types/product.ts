export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  currency?: string; // Currency code (USD, IDR, EUR, etc.)
  category: string;
  seller?: string;
  rating?: number; // 0-5
  reviewCount?: number;
  freeShipping?: boolean;
  sold?: number;
  stock?: number; // remaining stock
}
