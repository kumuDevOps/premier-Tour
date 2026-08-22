import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Building, Car, Plane, BookOpen, Headphones } from 'lucide-react';

export const CustomerQuickActions: React.FC = () => {
  const actions = [
    {
      id: 'action-explore-tours',
      title: 'Luxury Tours',
      subtitle: 'Curated itineraries & expeditions',
      to: '/tours',
      icon: Compass,
    },
    {
      id: 'action-browse-hotels',
      title: 'Boutique Hotels',
      subtitle: 'Sanctuaries, villas & retreats',
      to: '/hotels',
      icon: Building,
    },
    {
      id: 'action-rent-cars',
      title: 'Private Chauffeur',
      subtitle: 'Mercedes & luxury Land Cruisers',
      to: '/cars',
      icon: Car,
    },
    {
      id: 'action-find-flights',
      title: 'Scenic Flights',
      subtitle: 'Seaplane charters & air transfers',
      to: '/flights',
      icon: Plane,
    },
    {
      id: 'action-read-blog',
      title: 'Travel Journal',
      subtitle: 'Insider destination guides',
      to: '/blog',
      icon: BookOpen,
    },
    {
      id: 'action-vip-concierge',
      title: 'VIP Concierge',
      subtitle: '24/7 bespoke travel support',
      to: '/contact',
      icon: Headphones,
    },
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Quick Travel Access</span>
        </h3>
        <span className="text-xs text-slate-400 dark:text-[var(--muted)]">
          Premier Services
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {actions.map((action, idx) => {
          const IconComponent = action.icon;
          return (
            <motion.div
              key={action.id}
              id={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                to={action.to}
                className="group flex flex-col p-4 rounded-2xl bg-white dark:bg-[var(--surface)] border border-emerald-100/80 dark:border-[var(--border-subtle)] hover:border-emerald-300 dark:hover:border-emerald-600 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#031812]/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-[var(--border-subtle)] flex items-center justify-center mb-3 group-hover:scale-108 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {action.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-[var(--muted)] mt-0.5 line-clamp-2 leading-tight">
                  {action.subtitle}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
