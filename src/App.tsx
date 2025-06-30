import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import FavoritesPage from './pages/FavoritesPage';
import TrackerPage from './pages/TrackerPage';
import ProfilePage from './pages/ProfilePage';
import ChallengesPage from './pages/ChallengesPage';
import ChallengeDetailsPage from './pages/ChallengeDetailsPage';
import BadgesPage from './pages/BadgesPage';
import NotificationsPage from './pages/NotificationsPage';
import DetailsPage from './pages/DetailsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { useAuth } from './context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/signin" />;
};

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-20 md:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/home" />} />
          <Route path="/signin" element={!user ? <SignInPage /> : <Navigate to="/home" />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/home" />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <HomePage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          <Route path="/explore" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <ExplorePage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          <Route path="/favorites" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <FavoritesPage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          <Route path="/tracker" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <TrackerPage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <ProfilePage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          <Route path="/challenges" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <ChallengesPage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          <Route path="/challenges/new" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <ChallengeDetailsPage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          <Route path="/badges" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <BadgesPage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <NotificationsPage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          <Route path="/details" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <DetailsPage />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;