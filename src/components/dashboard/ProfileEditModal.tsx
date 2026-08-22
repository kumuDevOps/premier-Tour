import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, X, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
      });

      setSuccessMessage('Profile details updated successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 700);
    } catch (err: any) {
      console.error('PROFILE UPDATE ERROR', err);
      setErrorMessage(err?.message || 'Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="profile-edit-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md bg-white dark:bg-[var(--surface)] border border-emerald-100 dark:border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden text-slate-800 dark:text-[var(--text)]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-emerald-100/80 dark:border-[var(--border-subtle)] flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/20 dark:from-[#0c241c] dark:via-[#071b14] dark:to-[#092018]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-[#073126]/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h3 id="profile-edit-title" className="font-sans font-bold text-lg text-slate-900 dark:text-white">
                Edit Travel Profile
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <div className="leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-[#031812]/40 border border-emerald-200 dark:border-[var(--border-subtle)] flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div className="font-medium">{successMessage}</div>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[var(--muted)] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-50/50 dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Email (Read only) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[var(--muted)] mb-1.5">
                  Account Email
                </label>
                <div className="relative opacity-80">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-100 dark:bg-[var(--surface)] text-sm cursor-not-allowed text-slate-600 dark:text-[var(--muted)]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-[var(--muted)] mt-1 block">
                  Email is linked to your luxury traveler credentials.
                </span>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[var(--muted)] mb-1.5">
                  Contact Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-slate-50/50 dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-[var(--surface)] border-t border-slate-100 dark:border-[var(--border-subtle)] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[var(--text-secondary)] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                id="save-profile-btn"
                type="submit"
                disabled={isSaving || !fullName.trim()}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
