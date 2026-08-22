import React from 'react';
import { Menu, Bell, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminTopbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#031812]/90 backdrop-blur-md border-b border-[#DDEBE5] dark:border-[var(--border-subtle)] h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-[#33453F] dark:text-[#C8DDD5] hover:text-[#0F9D72] dark:hover:text-white rounded-xl hover:bg-[#F2F8F5] dark:hover:bg-[#0D281F] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="hidden sm:inline-block text-xs font-bold text-[#71817B] dark:text-[#8FA9A0] uppercase tracking-wider">
          Premier Tours Admin Management
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="btn-glass px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-[#33453F] dark:text-white"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Live Website</span>
        </Link>

        <Link 
          to="/dashboard" 
          className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#031812]/60 border border-emerald-200 dark:border-[var(--border-subtle)] flex items-center justify-center text-[#0F9D72] dark:text-[#39D39B] transition-transform hover:scale-105"
          title="Switch to Traveler Dashboard"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
