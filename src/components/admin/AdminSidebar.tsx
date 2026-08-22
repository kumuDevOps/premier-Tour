import React from 'react';
import { 
  Home, Map, Hotel, Car, Plane, CalendarCheck, 
  Star, Users, CreditCard, Inbox, BookOpen, Settings, X 
} from 'lucide-react';
import { Logo } from '../Logo';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'bookings', label: 'Bookings & Slips', icon: CalendarCheck },
  { id: 'tours', label: 'Tours', icon: Map },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'cars', label: 'Cars', icon: Car },
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  isOpen,
  onClose
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void; 
  isOpen: boolean;
  onClose?: () => void;
}) => {
  return (
    <aside 
      className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-[var(--background)] border-r border-[#DDEBE5] dark:border-[var(--border-subtle)] transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } shadow-lg lg:shadow-none`}
    >
      <div className="h-full flex flex-col">
        {/* Header brand */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDEBE5] dark:border-[var(--border-subtle)]">
          <Logo to="/" size="sm" />
          <button 
            className="lg:hidden p-1.5 rounded-lg text-[#71817B] hover:text-[#10231D] dark:hover:text-white hover:bg-[#F2F8F5] dark:hover:bg-[#0D281F]" 
            onClick={onClose || (() => setActiveTab(activeTab))}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="space-y-1">
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-xs font-bold ${
                      active
                        ? 'bg-[#0F9D72] text-white shadow-xs'
                        : 'text-[#33453F] dark:text-[#C8DDD5] hover:bg-[#F2F8F5] dark:hover:bg-[#0D281F] hover:text-[#0F9D72] dark:hover:text-[#39D39B]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#0F9D72] dark:text-[#39D39B]'}`} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
