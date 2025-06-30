import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quote, Category } from '../types';
import { quotes, getDailyQuote } from '../data/quotes';

interface QuoteContextType {
  dailyQuote: Quote;
  allQuotes: Quote[];
  favorites: Quote[];
  selectedCategory: Category;
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  setCategory: (category: Category) => void;
  filteredQuotes: Quote[];
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyQuote, setDailyQuote] = useState<Quote>(getDailyQuote());
  const [allQuotes, setAllQuotes] = useState<Quote[]>(quotes);
  const [favorites, setFavorites] = useState<Quote[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Update local storage when favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter quotes by selected category
  const filteredQuotes = selectedCategory === 'all'
    ? allQuotes
    : allQuotes.filter(quote => quote.category === selectedCategory);

  // Add quote to favorites
  const addToFavorites = (id: string) => {
    const quote = allQuotes.find(q => q.id === id);
    if (quote && !favorites.some(fav => fav.id === id)) {
      setFavorites(prev => [...prev, {...quote, isFavorite: true}]);
      
      // Update allQuotes to reflect favorite status
      setAllQuotes(prev => 
        prev.map(q => q.id === id ? { ...q, isFavorite: true } : q)
      );
      
      // Update daily quote if it's the favorite
      if (dailyQuote.id === id) {
        setDailyQuote({ ...dailyQuote, isFavorite: true });
      }
    }
  };

  // Remove quote from favorites
  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(quote => quote.id !== id));
    
    // Update allQuotes to reflect favorite status
    setAllQuotes(prev => 
      prev.map(q => q.id === id ? { ...q, isFavorite: false } : q)
    );
    
    // Update daily quote if it's the unfavorite
    if (dailyQuote.id === id) {
      setDailyQuote({ ...dailyQuote, isFavorite: false });
    }
  };

  // Set the selected category
  const setCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  return (
    <QuoteContext.Provider 
      value={{ 
        dailyQuote, 
        allQuotes, 
        favorites, 
        selectedCategory,
        addToFavorites, 
        removeFromFavorites, 
        setCategory,
        filteredQuotes 
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuotes = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuoteProvider');
  }
  return context;
};