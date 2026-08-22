import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Camera, Sparkles, PlusCircle, UserCheck, Edit3, Compass, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfilePhotoModal } from './ProfilePhotoModal';
import { ProfileEditModal } from './ProfileEditModal';

export const CustomerDashboardHero: React.FC = () => {
  const { user } = useAuth();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) return null;

  const displayName = user.full_name || user.email?.split('@')[0] || 'Valued Traveler';

  const getInitials = () => {
    if (user.full_name) {
      const parts = user.full_name.trim().split(' ');
      if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0][0].toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || 'T';
  };

  return (
    <>
      <section 
        id="customer-dashboard-hero"
        className="relative overflow-hidden border-b border-emerald-100/80 dark:border-[var(--border-subtle)] bg-gradient-to-b from-[#F2FAF6] via-[#F8FCFA] to-white dark:from-[#061812] dark:via-[#082018] dark:to-[#05140e] transition-colors"
      >
        {/* Subtle Ambient Green Floating Glow Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/15 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-teal-300/15 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          
          {/* Subtle Decorative Geometry */}
          <svg className="absolute right-10 top-0 h-full w-auto opacity-5 dark:opacity-10 text-emerald-800 dark:text-emerald-400" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" />
            <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="1" />
            <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Avatar + Traveler Greeting Info */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              {/* Interactive Profile Photo Container */}
              <div className="relative group shrink-0">
                <button
                  id="change-profile-photo-hero-btn"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-3 ring-emerald-500/30 dark:ring-emerald-400/40 p-0.5 bg-white dark:bg-[var(--surface)] shadow-md hover:shadow-emerald-500/20 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/50 group-hover:scale-103"
                  title="Click to update profile photo"
                  aria-label="Change profile photo"
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-emerald-50 dark:bg-[var(--surface)] flex items-center justify-center relative">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={displayName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                      />
                    ) : (
                      <span className="font-sans text-xl sm:text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                        {getInitials()}
                      </span>
                    )}

                    {/* Hover Camera Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera className="w-5 h-5 drop-shadow" />
                    </div>
                  </div>

                  {/* Camera Badge on corner */}
                  <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#071b14] group-hover:bg-emerald-500 transition-colors">
                    <Camera className="w-3 h-3" />
                  </span>
                </button>
              </div>

              {/* Text Info */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/80 text-emerald-800 dark:bg-[#031812]/80 dark:text-emerald-300 border border-emerald-200/60 dark:border-[var(--border-subtle)]">
                    <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Premier Club Traveler
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-[var(--muted)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Verified Account
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Welcome, <span className="text-emerald-900 dark:text-[var(--text-secondary)]">{displayName}</span>
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-[var(--muted)]">
                  <span className="font-medium text-slate-600 dark:text-[var(--text-secondary)]">{user.email}</span>
                  <span className="hidden sm:inline text-slate-300 dark:text-[#104D39]">•</span>
                  <button
                    id="open-profile-edit-btn"
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold transition-colors hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Edit Profile
                  </button>
                  <span className="hidden sm:inline text-slate-300 dark:text-[#104D39]">•</span>
                  <button
                    id="open-profile-photo-text-btn"
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold transition-colors hover:underline cursor-pointer"
                  >
                    <Camera className="w-3 h-3" /> Change Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center pt-2 lg:pt-0">
              <Link
                id="book-new-experience-cta"
                to="/tours"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-98 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Book New Experience</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Photo Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      {/* Profile Details Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};
