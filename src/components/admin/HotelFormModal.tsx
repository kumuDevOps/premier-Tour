import React, { useState } from 'react';
import { dataService } from '../../lib/supabase';
import { X, Save, Trash2 } from 'lucide-react';
import { Hotel } from '../../types';
import { ImageUploadField } from './ImageUploadField';

interface HotelFormModalProps {
  hotel?: Hotel | null;
  onClose: () => void;
  onSaved: () => void;
}

export const HotelFormModal: React.FC<HotelFormModalProps> = ({ hotel, onClose, onSaved }) => {
  const [formData, setFormData] = useState<Partial<Hotel>>(
    hotel || {
      package_code: `HTL-${Math.floor(1000 + Math.random() * 9000)}`,
      package_status: 'ACTIVE',
      currency: 'USD',
      name: '',
      title: '',
      location: '',
      city: '',
      price_per_night: 0,
      price: 0,
      description: '',
      image_urls: [],
      rating: 4.9,
      review_count: 0,
      amenities: ['Free High-Speed WiFi', 'Infinity Pool', 'Fine Dining Restaurant', 'Private Butler Service']
    }
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await dataService.saveHotel({
        ...formData,
        id: hotel?.id || formData.id,
        name: formData.name || formData.title || 'Luxury Resort',
        title: formData.title || formData.name || 'Luxury Resort',
        location: formData.location || formData.city || 'Sri Lanka',
        city: formData.city || formData.location || 'Sri Lanka',
        price_per_night: Number(formData.price_per_night || formData.price || 0),
        price: Number(formData.price_per_night || formData.price || 0),
        image_urls: formData.image_urls?.length ? formData.image_urls : ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
      });
      onSaved();
    } catch (err: any) {
      setError(err?.message || "Failed to save hotel");
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
              {hotel ? 'Edit Hotel Package' : 'Create New Hotel Package'}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Publish live to database catalog with instant asset storage</p>
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
          <form id="hotel-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Hotel Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name || formData.title || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value, title: e.target.value})} 
                  placeholder="e.g. Cape Weligama Ocean Villa"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Price per Night (USD)</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  value={formData.price_per_night || formData.price || ''} 
                  onChange={e => setFormData({...formData, price_per_night: Number(e.target.value), price: Number(e.target.value)})} 
                  placeholder="280"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Location / City</label>
                <input 
                  required 
                  type="text" 
                  value={formData.location || formData.city || ''} 
                  onChange={e => setFormData({...formData, location: e.target.value, city: e.target.value})} 
                  placeholder="e.g. Galle & Southern Coast, Sri Lanka"
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
                  placeholder="Describe the hotel amenities, ambience, room view, and luxury services..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase mb-1 block">Hotel Image</label>
                <div className="mt-1 space-y-4">
                  {formData.image_urls?.[0] ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-[var(--border-subtle)] group">
                      <img src={formData.image_urls[0]} alt="Hotel" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, image_urls: []})}
                          className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-600 shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" /> Replace Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ImageUploadField 
                      bucket="hotel-images"
                      folder="hotels" 
                      onUploadSuccess={(url) => {
                        setFormData({...formData, image_urls: [url]});
                        setError('');
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
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-[var(--muted)] hover:bg-slate-100 dark:text-[var(--text-secondary)] dark:hover:bg-slate-800 rounded-xl transition-colors">
            Cancel
          </button>
          <button form="hotel-form" type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center gap-2 transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : (hotel ? 'Update Hotel' : 'Create Hotel')}
          </button>
        </div>
      </div>
    </div>
  );
};
