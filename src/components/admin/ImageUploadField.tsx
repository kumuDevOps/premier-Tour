import React, { useState, useEffect } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ImageUploadFieldProps {
  bucket?: string;
  folder?: string;
  tourId?: string;
  currentImageUrl?: string;
  previewUrl?: string | null;
  onFileSelected?: (file: File) => void;
  onUploadSuccess?: (url: string) => void;
  onError?: (msg: string) => void;
  onClear?: () => void;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ 
  bucket = 'tour-images',
  folder = 'uploads',
  tourId,
  currentImageUrl,
  previewUrl: externalPreviewUrl,
  onFileSelected,
  onUploadSuccess,
  onError,
  onClear
}) => {
  const [internalPreview, setInternalPreview] = useState<string | null>(externalPreviewUrl || currentImageUrl || null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (externalPreviewUrl !== undefined) {
      setInternalPreview(externalPreviewUrl);
    }
  }, [externalPreviewUrl]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNotice(null);

    // Validate file type (JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const mime = (file.type || '').toLowerCase();
    if (!validTypes.includes(mime)) {
      const err = 'Invalid file type. Supported formats: JPG, PNG, and WebP.';
      if (onError) onError(err);
      setNotice(err);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      const err = 'File size exceeds 5MB limit.';
      if (onError) onError(err);
      setNotice(err);
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    // Create immediate local object preview for UI
    const localPreviewUrl = URL.createObjectURL(file);
    setInternalPreview(localPreviewUrl);

    if (onFileSelected) {
      onFileSelected(file);
    }

    // If onUploadSuccess is provided, perform direct API upload
    if (onUploadSuccess) {
      setUploading(true);
      try {
        const fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        });

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileData,
              fileName: file.name,
              contentType: file.type,
              bucket,
              folder,
              id: tourId || 'general',
            }),
          });

          const data = await res.json();
          if (res.ok && data.success && data.url) {
            setInternalPreview(data.url);
            onUploadSuccess(data.url);
            return;
          }
        } catch (fetchErr) {
          console.warn('Direct upload fetch notice, falling back to data URL:', fetchErr);
        }

        // Resilient fallback to self-contained Base64
        setInternalPreview(fileData);
        onUploadSuccess(fileData);
      } catch (err: any) {
        console.error('Image upload failed:', err);
        const errMsg = err?.message || 'Image processing failed.';
        setNotice(errMsg);
        if (onError) onError(errMsg);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleClear = () => {
    setInternalPreview(null);
    setFileName('');
    setFileSize('');
    setNotice(null);
    if (onClear) onClear();
  };

  return (
    <div className="space-y-3">
      {notice && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{notice}</span>
        </div>
      )}

      {internalPreview ? (
        <div className="relative border border-emerald-200 dark:border-[var(--border-subtle)] bg-emerald-50/40 dark:bg-[#031812]/20 rounded-2xl p-4 flex items-center gap-4">
          <img 
            src={internalPreview} 
            alt="Upload preview" 
            className="w-16 h-16 rounded-xl object-cover border border-emerald-300 dark:border-emerald-700 bg-white" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546708973-b339540b5162';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[var(--text)] dark:text-white truncate">{fileName || 'Selected Image'}</p>
            <p className="text-xs text-[var(--muted)]">{uploading ? 'Uploading to cloud storage...' : (fileSize || 'Saved & ready')}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {uploading ? 'Processing...' : 'Ready to save'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
            title="Remove image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <label className="relative block cursor-pointer group">
          <div className="w-full py-4 px-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all border-slate-300 dark:border-[var(--border-subtle)] hover:border-[var(--primary)] dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-[#073126]/50">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-[#073126]/40 flex items-center justify-center text-[var(--primary)] dark:text-emerald-400 mb-1 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-[var(--text)] dark:text-white">Click or drag image to upload</span>
              <span className="text-xs text-[var(--muted)]">Supports JPG, PNG, WEBP up to 5MB</span>
            </div>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};
