import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types'; // Ensure types are compatible or updated
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  selectedInterests: string[];
  setSelectedInterests: React.Dispatch<React.SetStateAction<string[]>>;
  signUp: (data: any) => Promise<void>;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and validate
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser({
            id: res.data._id,
            email: res.data.email,
            username: res.data.username,
            full_name: res.data.full_name
          });
          // Fetch full profile if needed, or map from user object
          const mappedProfile: UserProfile = {
            id: res.data._id,
            username: res.data.username,
            full_name: res.data.full_name,
            avatar_url: res.data.avatar_url,
            selected_interests: res.data.selected_interests || [],
            email: res.data.email
          };
          setProfile(mappedProfile);
          setSelectedInterests(res.data.selected_interests || []);

        } catch (error) {
          console.error('Session validation failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const signUp = async (data: any) => {
    try {
      const res = await api.post('/auth/signup', data);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);

      // Set profile state immediately
      const mappedProfile: UserProfile = {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        selected_interests: user.selected_interests || [],
        email: user.email,
        notification_times: user.notification_times
      };
      setProfile(mappedProfile);
      setSelectedInterests(user.selected_interests || []);

    } catch (error) {
      throw error;
    }
  };

  const signIn = async (data: any) => {
    try {
      const res = await api.post('/auth/signin', data);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);

      // Set profile state immediately
      const mappedProfile: UserProfile = {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        selected_interests: user.selected_interests || [],
        email: user.email,
        notification_times: user.notification_times
      };
      setProfile(mappedProfile);
      setSelectedInterests(user.selected_interests || []);

    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    setSelectedInterests([]);
  };

  return (
    <AuthContext.Provider value={{ user, profile, selectedInterests, setSelectedInterests, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
