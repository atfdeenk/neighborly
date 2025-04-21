// Utility for tracking and managing user search history

const SEARCH_HISTORY_KEY = 'neighborly_search_history';
const MAX_HISTORY_ITEMS = 10;

// Interface for search history items
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  category?: string;
}

// Get search history from localStorage
export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return [];
  }
};

// Add a search query to history
export const addToSearchHistory = (query: string, category?: string): void => {
  if (typeof window === 'undefined' || !query.trim()) {
    return;
  }
  
  try {
    const history = getSearchHistory();
    
    // Check if this query already exists
    const existingIndex = history.findIndex(item => 
      item.query.toLowerCase() === query.toLowerCase() && 
      item.category === category
    );
    
    // If it exists, remove it (we'll add it back at the top)
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    
    // Add the new search to the beginning
    history.unshift({
      query,
      timestamp: Date.now(),
      category
    });
    
    // Limit the history size
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    // Save back to localStorage
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

// Clear search history
export const clearSearchHistory = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};

// Interface for viewed product
export interface ViewedProduct {
  id: string;
  timestamp: number;
}

// Key for storing viewed products
const VIEWED_PRODUCTS_KEY = 'neighborly_viewed_products';

// Get viewed products from localStorage
export const getViewedProducts = (): ViewedProduct[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const viewed = localStorage.getItem(VIEWED_PRODUCTS_KEY);
    return viewed ? JSON.parse(viewed) : [];
  } catch (error) {
    console.error('Error retrieving viewed products:', error);
    return [];
  }
};

// Add a product to viewed products
export const addToViewedProducts = (productId: string): void => {
  if (typeof window === 'undefined' || !productId) {
    return;
  }
  
  try {
    const viewed = getViewedProducts();
    
    // Check if this product already exists
    const existingIndex = viewed.findIndex(item => item.id === productId);
    
    // If it exists, remove it (we'll add it back at the top)
    if (existingIndex !== -1) {
      viewed.splice(existingIndex, 1);
    }
    
    // Add the new product to the beginning
    viewed.unshift({
      id: productId,
      timestamp: Date.now()
    });
    
    // Limit the history size
    const limitedViewed = viewed.slice(0, MAX_HISTORY_ITEMS);
    
    // Save back to localStorage
    localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(limitedViewed));
  } catch (error) {
    console.error('Error saving viewed product:', error);
  }
};

// Get recommended products based on search history
export const getRecommendedProducts = (
  allProducts: any[], 
  limit: number = 8,
  filterType: 'forYou' | 'searches' | 'viewed' | 'similar' = 'forYou'
): any[] => {
  if (typeof window === 'undefined' || !allProducts.length) {
    return allProducts.slice(0, limit);
  }
  
  try {
    switch (filterType) {
      case 'searches':
        return getSearchBasedRecommendations(allProducts, limit);
      case 'viewed':
        return getViewedBasedRecommendations(allProducts, limit);
      case 'similar':
        return getSimilarItemsRecommendations(allProducts, limit);
      case 'forYou':
      default:
        return getPersonalizedRecommendations(allProducts, limit);
    }
  } catch (error) {
    console.error('Error getting recommended products:', error);
    return allProducts.slice(0, limit);
  }
};

// Get personalized recommendations (combines search history, viewed products, and popular items)
const getPersonalizedRecommendations = (allProducts: any[], limit: number): any[] => {
  const history = getSearchHistory();
  
  // If no search history, return random popular products
  if (!history.length) {
    return [...allProducts]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
  
  // Get unique search terms from history
  const searchTerms = Array.from(new Set(
    history.map(item => item.query.toLowerCase())
  ));
  
  // Get unique categories from history
  const categories = Array.from(new Set(
    history.filter(item => item.category)
      .map(item => item.category!.toLowerCase())
  ));
  
  // Score products based on relevance to search history
  const scoredProducts = allProducts.map(product => {
    let score = 0;
    
    // Check if product title matches any search terms
    searchTerms.forEach(term => {
      if ((product.title || product.name || '').toLowerCase().includes(term)) {
        score += 5;
      }
    });
    
    // Check if product category matches any searched categories
    if (product.category && categories.includes(product.category.toLowerCase())) {
      score += 3;
    }
    
    // Boost score for popular products
    score += (product.rating || 0) * 0.5;
    
    // Add a small random factor to mix things up a bit
    score += Math.random();
    
    return { product, score };
  });
  
  // Sort by score (highest first) and return the products
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .map(item => item.product)
    .slice(0, limit);
};

// Get recommendations based purely on search history
const getSearchBasedRecommendations = (allProducts: any[], limit: number): any[] => {
  const history = getSearchHistory();
  
  // If no search history, return random products
  if (!history.length) {
    return [...allProducts]
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
  }
  
  // Get unique search terms from history
  const searchTerms = Array.from(new Set(
    history.map(item => item.query.toLowerCase())
  ));
  
  // Score products based on relevance to search terms
  const scoredProducts = allProducts.map(product => {
    let score = 0;
    
    // Check if product title matches any search terms
    searchTerms.forEach(term => {
      if ((product.title || product.name || '').toLowerCase().includes(term)) {
        score += 10;
      }
    });
    
    // Add a small random factor
    score += Math.random();
    
    return { product, score };
  });
  
  // Sort by score (highest first) and return the products
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .map(item => item.product)
    .slice(0, limit);
};

// Get recommendations based on recently viewed products
const getViewedBasedRecommendations = (allProducts: any[], limit: number): any[] => {
  const viewed = getViewedProducts();
  
  // If no viewed products, return popular products
  if (!viewed.length) {
    return [...allProducts]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
  
  // First, include the actually viewed products
  const viewedIds = viewed.map(v => v.id);
  const viewedProducts = allProducts.filter(p => viewedIds.includes(p.id));
  
  // If we have enough viewed products, return them
  if (viewedProducts.length >= limit) {
    return viewedProducts.slice(0, limit);
  }
  
  // Otherwise, find similar products to the viewed ones
  const remainingLimit = limit - viewedProducts.length;
  const categories = Array.from(new Set(
    viewedProducts.map(p => p.category?.toLowerCase()).filter(Boolean)
  ));
  
  // Score remaining products based on category similarity
  const scoredProducts = allProducts
    .filter(p => !viewedIds.includes(p.id))
    .map(product => {
      let score = 0;
      
      // Check if product category matches any viewed product categories
      if (product.category && categories.includes(product.category.toLowerCase())) {
        score += 5;
      }
      
      // Add a small random factor
      score += Math.random();
      
      return { product, score };
    });
  
  // Sort by score and get the top remaining products
  const similarProducts = scoredProducts
    .sort((a, b) => b.score - a.score)
    .map(item => item.product)
    .slice(0, remainingLimit);
  
  // Combine viewed products with similar products
  return [...viewedProducts, ...similarProducts];
};

// Get recommendations for similar items
const getSimilarItemsRecommendations = (allProducts: any[], limit: number): any[] => {
  const viewed = getViewedProducts();
  const history = getSearchHistory();
  
  // If no history at all, return popular products
  if (!viewed.length && !history.length) {
    return [...allProducts]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
  
  // Get the most recent viewed product or searched category
  let targetCategory = '';
  
  if (viewed.length) {
    const mostRecentViewedId = viewed[0].id;
    const recentProduct = allProducts.find(p => p.id === mostRecentViewedId);
    if (recentProduct && recentProduct.category) {
      targetCategory = recentProduct.category.toLowerCase();
    }
  }
  
  // If no category from viewed products, try search history
  if (!targetCategory && history.length && history[0].category) {
    targetCategory = history[0].category.toLowerCase();
  }
  
  // If we have a target category, find similar products
  if (targetCategory) {
    const similarProducts = allProducts
      .filter(p => p.category && p.category.toLowerCase() === targetCategory)
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
    
    // If we have enough similar products, return them
    if (similarProducts.length >= limit) {
      return similarProducts;
    }
    
    // Otherwise, supplement with other products
    const remainingLimit = limit - similarProducts.length;
    const otherProducts = allProducts
      .filter(p => !p.category || p.category.toLowerCase() !== targetCategory)
      .sort(() => 0.5 - Math.random())
      .slice(0, remainingLimit);
    
    return [...similarProducts, ...otherProducts];
  }
  
  // If no target category, return random products
  return [...allProducts]
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
};
