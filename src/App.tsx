/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppConcierge } from './components/WhatsAppConcierge';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { ToursPage } from './pages/ToursPage';
import { TourDetailPage } from './pages/TourDetailPage';
import { HotelsPage } from './pages/HotelsPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { CarsPage } from './pages/CarsPage';
import { FlightsPage } from './pages/FlightsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <Router>
                <div className="flex flex-col min-h-screen bg-[var(--color-bg-primary)] font-sans text-slate-900 dark:text-[var(--text)] antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
                  <Navbar />
                  <main className="flex-1">
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/tours" element={<ToursPage />} />
                        <Route path="/tours/:id" element={<TourDetailPage />} />
                        <Route path="/hotels" element={<HotelsPage />} />
                        <Route path="/hotels/:id" element={<HotelDetailPage />} />
                        <Route path="/cars" element={<CarsPage />} />
                        <Route path="/rent-a-car" element={<Navigate to="/cars" replace />} />
                        <Route path="/flights" element={<FlightsPage />} />
                        <Route path="/contact" element={<ContactUsPage />} />
                        <Route path="/reviews" element={<ReviewsPage />} />
                        <Route path="/about" element={<AboutUsPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:slug" element={<BlogPostPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <CustomerDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/bookings" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute requireAdmin={true}>
                              <AdminDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/*"
                          element={
                            <ProtectedRoute requireAdmin={true}>
                              <AdminDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/login" element={<Navigate to="/auth" replace />} />
                        <Route path="/register" element={<Navigate to="/auth" replace />} />
                        <Route path="/auth/callback" element={<AuthCallbackPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </ErrorBoundary>
                  </main>
                  <WhatsAppConcierge />
                  <Footer />
                </div>
              </Router>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
