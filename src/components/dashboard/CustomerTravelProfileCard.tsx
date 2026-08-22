import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Globe, DollarSign, Sparkles, Edit3, Camera, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProfileEditModal } from './ProfileEditModal';
import { ProfilePhotoModal } from './ProfilePhotoModal';

export const CustomerTravelProfileCard: React.FC = () => {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const { language } = useLanguage();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  if (!user) return null;

  const displayName = user.full_name || user.email?.split('@')[0] || 'Valued Traveler';

  return (
    <>
      <div 
        id="customer-travel-profile-card"
        className="rounded-3xl bg-white dark:bg-[var(--surface)] border border-emerald-100/90 dark:border-[var(--border-subtle)] p-6 shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100 dark:border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-[#073126]/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-sans font-bold text-slate-900 dark:text-white">
                Traveler Profile
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-[var(--muted)]">
                Personalized membership settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPhotoOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Change Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-3 py-1.5 rounded-xl text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 dark:border-[var(--border-subtle)] cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 dark:text-[var(--muted)] font-medium">Full Name</span>
            <p className="font-semibold text-slate-800 dark:text-[var(--text)] text-sm">
              {displayName}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 dark:text-[var(--muted)] font-medium">Account Email</span>
            <p className="font-semibold text-slate-800 dark:text-[var(--text)] text-sm truncate">
              {user.email}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 dark:text-[var(--muted)] font-medium">Phone / WhatsApp</span>
            <p className="font-semibold text-slate-800 dark:text-[var(--text)] text-sm">
              {user.phone || 'Not specified'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 dark:text-[var(--muted)] font-medium">Membership Tier</span>
            <p className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Premier Club Member
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 dark:text-[var(--muted)] font-medium">Display Currency</span>
            <p className="font-semibold text-slate-800 dark:text-[var(--text)] text-sm flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {currency}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 dark:text-[var(--muted)] font-medium">Language</span>
            <p className="font-semibold text-slate-800 dark:text-[var(--text)] text-sm flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {language} (English)
            </p>
          </div>
        </div>
      </div>

      <ProfileEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <ProfilePhotoModal
        isOpen={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
      />
    </>
  );
};
