import React, { useState } from 'react';
import { dataService } from '../../lib/supabase';
import { X, Save, Trash2 } from 'lucide-react';
import { Tour } from '../../types';
import { ImageUploadField } from './ImageUploadField';

interface TourFormModalProps {
  tour?: Tour | null;
  onClose: () => void;
  onSaved: () => void;
}

export const TourFormModal: React.FC<TourFormModalProps> = ({ tour, onClose, onSaved }) => {
  const existingImg = tour?.image_url || tour?.image_urls?.[0] || '';
  const [formData, setFormData] = useState<Partial<Tour>>(
    tour || {
      package_code: `TRN-${Math.floor(1000 + Math.random() * 9000)}`,
      package_status: 'ACTIVE',
      currency: 'USD',
      title: '',
      category: 'Cultural Heritage Expedition',
      duration_days: 3,
      duration: '3 Days / 2 Nights',
      location: '',
      price: 450,
      max_group_size: 6,
      description: '',
      image_urls: [],
      image_url: '',
      rating: 5.0,
      review_count: 14,
      itinerary: [],
      highlights: ['Private Chauffeur Guide', 'UNESCO Heritage Access', 'Curated Boutique Stays', 'Authentic Dining Included'],
      included: ['Private Luxury Transport', 'Daily Gourmet Breakfast', 'Site Entrance Passes', 'Senior English Naturalist Guide'],
      excluded: ['International Flights', 'Travel Insurance', 'Personal Expenses']
    }
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImg || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dataService.saveTour(
        {
          ...formData,
          id: tour?.id || formData.id,
          title: formData.title || 'Signature Ceylon Heritage Tour',
          category: formData.category || 'Cultural Expedition',
          location: formData.location || 'Sri Lanka',
          price: Number(formData.price || 450),
          duration_days: Number(formData.duration_days || 3),
          duration: `${formData.duration_days || 3} Days / ${(formData.duration_days || 3) - 1} Nights`,
          image_url: existingImg && !selectedFile && previewUrl ? existingImg : (formData.image_url || ''),
        },
        selectedFile
      );
      onSaved();
      onClose();
    } catch (err: any) {
      console.error('Save tour form error:', err);
      setError(err?.message || "Failed to save tour package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="glass-card rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-[var(--border-subtle)]">
        <div className="p-6 border-b border-slate-200 dark:border-[var(--border-subtle)] flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)] dark:text-white">
              {tour ? 'Edit Tour Package' : 'Create New Tour Package'}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Publish live tour itineraries to catalog with media assets</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-[var(--muted)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-200">
              {error}
            </div>
          )}
          <form id="tour-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Tour Title</label>
                <input 
                  required 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Ella Scenic Mist & Mountain Train Journey"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Category</label>
                <input 
                  required 
                  type="text" 
                  value={formData.category || ''} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  placeholder="e.g. Wildlife Safari & Nature"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Price per Person (USD)</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  value={formData.price || ''} 
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                  placeholder="450"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Duration (Days)</label>
                <input 
                  required 
                  type="number" 
                  min="1" 
                  value={formData.duration_days || ''} 
                  onChange={e => setFormData({...formData, duration_days: Number(e.target.value)})} 
                  placeholder="3"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Location / Region</label>
                <input 
                  required 
                  type="text" 
                  value={formData.location || ''} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  placeholder="e.g. Sigiriya & Cultural Triangle, Sri Lanka"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Description</label>
                <textarea 
                  rows={4} 
                  required 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Detailed highlights, day-by-day expedition route, and luxury features..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase mb-1 block">Tour Cover Image</label>
                <div className="mt-1 space-y-4">
                  {previewUrl && !selectedFile ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-[var(--border-subtle)] group">
                      <img 
                        src={previewUrl} 
                        alt="Primary Tour Image" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546708973-b339540b5162';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          type="button" 
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setFormData({...formData, image_urls: [], image_url: ''});
                          }}
                          className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-600 shadow-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> Replace Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ImageUploadField 
                      bucket="tour-images"
                      folder="tours" 
                      tourId={tour?.id || formData.id}
                      previewUrl={previewUrl}
                      onFileSelected={(file) => {
                        setSelectedFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                        setError('');
                      }}
                      onClear={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setFormData({...formData, image_urls: [], image_url: ''});
                      }}
                      onError={(msg) => setError(msg)} 
                    />
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-[var(--border-subtle)] flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-[var(--muted)] hover:bg-slate-100 dark:text-[var(--text-secondary)] dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
            Cancel
          </button>
          <button form="tour-form" type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : (tour ? 'Update Tour' : 'Create Tour')}
          </button>
        </div>
      </div>
    </div>
  );
};
