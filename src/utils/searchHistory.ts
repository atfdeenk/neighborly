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

// Get recommended products based on search history
export const getRecommendedProducts = (
  allProducts: any[], 
  limit: number = 8
): any[] => {
  if (typeof window === 'undefined' || !allProducts.length) {
    return allProducts.slice(0, limit);
  }
  
  try {
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
        if (product.title.toLowerCase().includes(term)) {
          score += 5;
        }
      });
      
      // Check if product category matches any searched categories
      if (product.category && categories.includes(product.category.toLowerCase())) {
        score += 3;
      }
      
      // Add a small random factor to mix things up a bit
      score += Math.random();
      
      return { product, score };
    });
    
    // Sort by score (highest first) and return the products
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .map(item => item.product)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recommended products:', error);
    return allProducts.slice(0, limit);
  }
};
