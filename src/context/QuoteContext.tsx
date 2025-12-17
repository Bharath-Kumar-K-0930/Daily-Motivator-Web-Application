import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quote, Category } from '../types';
import { getDailyQuote } from '../data/quotes';
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
  const [dailyQuote, setDailyQuote] = useState<Quote>(getDailyQuote()); // Init with static for immediate render
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all quotes from API
        const { data: quotesData } = await api.get('/quotes');
        const dbQuotes = quotesData.map((q: any) => ({
          ...q,
          id: q._id // Ensure we use _id as id
        }));
        setAllQuotes(dbQuotes);

        // Determine Daily Quote from DB Data to replace static one
        if (dbQuotes.length > 0) {
          const today = new Date();
          const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
          const index = seed % dbQuotes.length;
          setDailyQuote(dbQuotes[index]);
        }

      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch favorites when user logs in (or whenever user changes)
  useEffect(() => {
    if (user && allQuotes.length > 0) {
      fetchFavorites();
    } else if (!user) {
      setFavorites([]);
    }
  }, [user, allQuotes.length]); // Depend on length to trigger after load

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data || []);

      // Update allQuotes isFavorite status based on fetched favorites
      if (data && data.length > 0) {
        const favIds = new Set(data.map((fav: any) => fav.id || fav._id));
        setAllQuotes(prev => prev.map(q => ({
          ...q,
          isFavorite: favIds.has(q.id)
        })));

        // Also update daily quote if needed
        setDailyQuote(prev => {
          if (prev && favIds.has(prev.id)) return { ...prev, isFavorite: true };
          return prev;
        });
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
      setDailyQuote(prev => (prev && prev.id === id ? { ...prev, isFavorite: true } : prev));

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
    setDailyQuote(prev => (prev && prev.id === id ? { ...prev, isFavorite: false } : prev));

    try {
      await api.delete(`/favorites/${id}`);
    } catch (error) {
      console.error('Error removing favorite:', error);
      fetchFavorites();
    }
  };

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
      {!loading && children}
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