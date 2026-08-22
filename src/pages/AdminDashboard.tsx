import { AdminOverview } from "../components/admin/AdminOverview";
import { TourManager } from "../components/admin/TourManager";
import { BookingManager } from "../components/admin/BookingManager";
import { ReviewManager } from "../components/admin/ReviewManager";
import { CustomerManager } from "../components/admin/CustomerManager";
import { HotelManager } from "../components/admin/HotelManager";
import { CarManager } from "../components/admin/CarManager";
import { FlightManager } from "../components/admin/FlightManager";
import { DatabaseManager } from "../components/admin/DatabaseManager";
import { PaymentsManager } from "../components/admin/PaymentsManager";
import { InboxManager } from "../components/admin/InboxManager";
import { BlogManager } from "../components/admin/BlogManager";
import { SettingsManager } from "../components/admin/SettingsManager";
import React, { useState } from 'react';
import { SEOHelmet } from '../components/SEOHelmet';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminTopbar } from '../components/admin/AdminTopbar';
import { useSearchParams } from 'react-router-dom';

// Placeholder sub-components









export const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSetTab = (tab: string) => {
    setSearchParams({ tab });
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminOverview />;
      case 'tours': return <TourManager />;
      case 'hotels': return <HotelManager />;
      case 'cars': return <CarManager />;
      case 'flights': return <FlightManager />;
      case 'bookings': return <BookingManager />;
      case 'reviews': return <ReviewManager />;
      case 'customers': return <CustomerManager />;
      case 'payments': return <PaymentsManager />;
      case 'inbox': return <InboxManager />;
      case 'blog': return <BlogManager />;
      case 'settings': return <SettingsManager />;
      case 'database': return <DatabaseManager />;
      default: return <div className="p-6"><h2 className="text-2xl font-bold">Under Construction</h2><p>This module is being built.</p></div>;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] flex flex-col md:flex-row">
      <SEOHelmet title="Admin Panel | Premier Tour Booking" description="Management portal" />
      
      <AdminSidebar activeTab={activeTab} setActiveTab={handleSetTab} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full transition-all duration-300">
        <AdminTopbar toggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
