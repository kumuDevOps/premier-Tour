import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Trash2, X, AlertCircle, CheckCircle2, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../lib/supabase';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, updateAvatar } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const currentAvatar = user.avatar_url || null;

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // MIME type check
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Invalid image format. Please select a JPG, PNG, or WebP photo.');
      return;
    }

    // Size limit check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    setSelectedFile(file);

    // Create safe client-side preview for the modal display
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedFile || !user) return;

    try {
      setIsUploading(true);
      setErrorMessage(null);

      // Upload to Supabase Storage 'profiles' bucket via resilient dataService pipeline
      const uploadResult = await dataService.uploadProfileAvatar(
        selectedFile,
        user.id,
        user.email
      );

      if (uploadResult && uploadResult.url) {
        // Update user context and active profile state immediately
        await updateAvatar(uploadResult.url);
        setSuccessMessage('Profile photo updated successfully!');
        
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
          setSelectedFile(null);
          setPreviewUrl(null);
          setSuccessMessage(null);
        }, 800);
      } else {
        throw new Error('Could not retrieve public photo URL.');
      }
    } catch (err: any) {
      console.error('PROFILE IMAGE UPLOAD ERROR', {
        bucket: 'profiles',
        userId: user.id,
        error: err,
      });
      setErrorMessage(
        err?.message || 'Failed to update profile photo. Please try again with a valid JPG/PNG.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to remove your profile photo?')) return;

    try {
      setIsRemoving(true);
      setErrorMessage(null);

      await dataService.removeProfileAvatar(user.id, user.email);
      await updateAvatar(null);

      setSuccessMessage('Profile photo removed.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSelectedFile(null);
        setPreviewUrl(null);
        setSuccessMessage(null);
      }, 700);
    } catch (err: any) {
      console.error('AVATAR REMOVAL ERROR', err);
      setErrorMessage(err?.message || 'Could not remove photo. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  const activeDisplayPhoto = previewUrl || currentAvatar;

  const getInitials = () => {
    if (user.full_name) {
      const parts = user.full_name.trim().split(' ');
      if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0][0].toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || 'T';
  };

  return (
    <AnimatePresence>
      <div 
        id="profile-photo-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-modal-title"
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
                <Camera className="w-4 h-4" />
              </div>
              <h3 id="photo-modal-title" className="font-sans font-bold text-lg text-slate-900 dark:text-white">
                Update Profile Photo
              </h3>
            </div>
            <button
              id="close-photo-modal-btn"
              onClick={onClose}
              disabled={isUploading || isRemoving}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Live Avatar Preview */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full ring-4 ring-emerald-500/20 dark:ring-emerald-400/30 overflow-hidden bg-emerald-50 dark:bg-[var(--surface)] flex items-center justify-center shadow-lg transition-transform group-hover:scale-102">
                  {activeDisplayPhoto ? (
                    <img
                      src={activeDisplayPhoto}
                      alt={user.full_name || 'User avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-sans text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                      {getInitials()}
                    </span>
                  )}
                </div>
                {previewUrl && (
                  <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
                    Preview
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-[var(--muted)] mt-2.5 font-medium">
                {selectedFile ? selectedFile.name : 'Square aspect ratio recommended'}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <div className="leading-relaxed">{errorMessage}</div>
              </motion.div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-[#031812]/40 border border-emerald-200 dark:border-[var(--border-subtle)] flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="font-medium">{successMessage}</div>
              </motion.div>
            )}

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-[#031812]/40 scale-101'
                  : 'border-slate-200 dark:border-[var(--border-subtle)] hover:border-emerald-400 dark:hover:border-emerald-500 bg-slate-50/60 dark:bg-[#073126]/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-[#073126]/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2.5">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-[var(--text)]">
                Click to browse or drag & drop photo
              </p>
              <p className="text-xs text-slate-400 dark:text-[var(--muted)] mt-1">
                Supports JPG, PNG, WebP up to 5MB
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-[var(--surface)] border-t border-slate-100 dark:border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <div>
              {currentAvatar && (
                <button
                  id="remove-photo-btn"
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isUploading || isRemoving}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1.5"
                >
                  {isRemoving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Remove Photo
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading || isRemoving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[var(--text-secondary)] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                id="save-photo-btn"
                type="button"
                onClick={handleSavePhoto}
                disabled={!selectedFile || isUploading || isRemoving}
                className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
                  selectedFile && !isUploading
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 cursor-pointer active:scale-98'
                    : 'bg-slate-200 dark:bg-[var(--surface)] text-slate-400 cursor-not-allowed'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
