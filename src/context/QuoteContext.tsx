import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quote, Category } from '../types';
import { quotes, getDailyQuote } from '../data/quotes';
import api from '../lib/api';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [dailyQuote, setDailyQuote] = useState<Quote>(getDailyQuote());
  const [allQuotes, setAllQuotes] = useState<Quote[]>(quotes);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Fetch favorites from API when user logs in
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data || []);

      // Sync local allQuotes state with favorite status
      if (data && data.length > 0) {
        const favIds = new Set(data.map((fav: any) => fav.id));
        setAllQuotes(prev => prev.map(q => ({
          ...q,
          isFavorite: favIds.has(q.id)
        })));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Filter quotes by selected category
  const filteredQuotes = selectedCategory === 'all'
    ? allQuotes
    : allQuotes.filter(quote => quote.category === selectedCategory);

  // Add quote to favorites
  const addToFavorites = async (id: string) => {
    if (!user) return; // Or prompt login

    // Optimistic update
    const quote = allQuotes.find(q => q.id === id);
    if (quote && !favorites.some(fav => fav.id === id)) {
      setFavorites(prev => [...prev, { ...quote, isFavorite: true }]);
      setAllQuotes(prev => prev.map(q => q.id === id ? { ...q, isFavorite: true } : q));
      if (dailyQuote.id === id) setDailyQuote({ ...dailyQuote, isFavorite: true });

      try {
        await api.post('/favorites', { quoteId: id });
      } catch (error) {
        console.error('Error adding favorite:', error);
        fetchFavorites(); // Revert on error
      }
    }
  };

  // Remove quote from favorites
  const removeFromFavorites = async (id: string) => {
    if (!user) return;

    // Optimistic update
    setFavorites(prev => prev.filter(quote => quote.id !== id));
    setAllQuotes(prev => prev.map(q => q.id === id ? { ...q, isFavorite: false } : q));
    if (dailyQuote.id === id) setDailyQuote({ ...dailyQuote, isFavorite: false });

    try {
      await api.delete(`/favorites/${id}`);
    } catch (error) {
      console.error('Error removing favorite:', error);
      fetchFavorites();
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