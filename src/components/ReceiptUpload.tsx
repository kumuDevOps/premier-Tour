import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, FileText, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { dataService } from '../services/dataService';

interface ReceiptUploadProps {
  bookingId: string;
  currentReceiptUrl?: string | null;
  onUploadSuccess?: (newReceiptUrl: string) => void;
  compact?: boolean;
}

export const ReceiptUpload: React.FC<ReceiptUploadProps> = ({
  bookingId,
  currentReceiptUrl,
  onUploadSuccess,
  compact = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentReceiptUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (selectedFile: File) => {
    setErrorMsg(null);
    setUploadSuccess(false);

    // File type validation (images and pdfs)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMsg('Please upload a valid JPG, PNG, WEBP screenshot or PDF document.');
      return;
    }

    // Size limit (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10MB limit.');
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg('Please select a bank receipt image or PDF first.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const uploadedUrl = await dataService.uploadReceiptFile(file);
      await dataService.updateBookingReceipt(bookingId, uploadedUrl);

      setUploadSuccess(true);
      setPreviewUrl(uploadedUrl);
      if (onUploadSuccess) {
        onUploadSuccess(uploadedUrl);
      }
    } catch (err: any) {
      console.error('Receipt upload error:', err);
      setErrorMsg(err?.message || 'Failed to upload receipt.');
    } finally {
      setIsUploading(false);
    }
  };

  if (compact) {
    return (
      <div id={`receipt-upload-compact-${bookingId}`} className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id={`compact-file-input-${bookingId}`}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2 px-3 bg-slate-100 dark:bg-[var(--surface)] hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text)] dark:text-[var(--text)] rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300 dark:border-[var(--border-subtle)]"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[var(--muted)] dark:text-[var(--muted)]" />
            {file ? file.name.slice(0, 20) : 'Choose Bank Transfer Slip'}
          </button>

          {file && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="emerald-btn py-2 px-3 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Submit Slip
                </>
              )}
            </button>
          )}
        </div>

        {uploadSuccess && (
          <p className="text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-dark)] dark:text-emerald-400" />
            Receipt submitted for booking verification!
          </p>
        )}
        {errorMsg && <p className="text-rose-600 dark:text-rose-400 text-xs">{errorMsg}</p>}
      </div>
    );
  }

  return (
    <div id={`receipt-upload-card-${bookingId}`} className="glass-card luxury-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-sans font-semibold text-[var(--text)] dark:text-white">Upload Bank Transfer Receipt</h4>
          <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] mt-0.5">
            Submit your deposit slip for quick booking confirmation
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 bg-emerald-50 dark:bg-[#031812]/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-[var(--border-subtle)] rounded-lg">
          Booking: #{bookingId}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleFileChange}
        className="hidden"
        id={`full-file-input-${bookingId}`}
      />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[var(--primary)] bg-emerald-50/50 dark:bg-[#031812]/30 scale-[0.99]'
            : previewUrl
            ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-[#031812]/20'
            : 'border-slate-300 dark:border-[var(--border-subtle)] hover:border-emerald-400 dark:hover:border-[var(--primary)] bg-[var(--background)]/60 dark:bg-[#073126]/40 hover:bg-[var(--background)] dark:hover:bg-slate-800/70'
        }`}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center">
            <div className="relative group max-w-xs mb-3 overflow-hidden rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] shadow-sm glass-card">
              <img
                src={previewUrl}
                alt="Bank Receipt Preview"
                className="max-h-48 w-auto object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-medium">
                <Eye className="w-4 h-4" /> Change Image
              </div>
            </div>
            <p className="text-xs font-medium text-[var(--text)] dark:text-[var(--text)] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400" />
              {file ? file.name : 'Receipt Attached (Ready for Verification)'}
            </p>
            <p className="text-[11px] text-[var(--muted)] dark:text-[var(--muted)] mt-0.5">Click or drag another image to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-[#031812]/60 text-[var(--primary-dark)] dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 border border-emerald-100 dark:border-[var(--border-subtle)]">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-[var(--text)] dark:text-[var(--text)] mb-1">
              Click to select or drag & drop bank transfer screenshot
            </p>
            <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] max-w-sm">
              Supports JPG, PNG, WEBP, or PDF up to 10MB. Include clear transaction reference and date.
            </p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="mt-3 p-3 bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200 dark:border-[var(--border-subtle)] rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-[var(--text-secondary)] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[var(--primary-dark)] shrink-0" />
          <span>Transfer receipt uploaded successfully! Our booking team will review and confirm your reservation within 1-2 hours.</span>
        </div>
      )}

      {file && !uploadSuccess && (
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPreviewUrl(currentReceiptUrl || null);
            }}
            className="px-4 py-2 text-xs font-medium text-[var(--muted)] dark:text-[var(--muted)] hover:text-[var(--text)] dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            id={`submit-receipt-btn-${bookingId}`}
            onClick={handleUpload}
            disabled={isUploading}
            className="emerald-btn py-2.5 px-5 text-white font-medium rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Upload & Submit for Verification
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
