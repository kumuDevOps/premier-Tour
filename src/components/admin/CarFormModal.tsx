import React, { useState, useEffect, useRef } from 'react';
import { dataService } from '../../lib/supabase';
import { X, Save, Trash2, UploadCloud, AlertCircle } from 'lucide-react';
import { Car } from '../../types';

interface CarFormModalProps {
  isOpen?: boolean;
  car?: Car | null;
  onClose: () => void;
  onSave?: (data: Partial<Car>, file?: File | null) => Promise<void>;
  onSaved?: () => void;
}

export const CarFormModal: React.FC<CarFormModalProps> = ({ isOpen = true, car, onClose, onSave, onSaved }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialFormData = (existingCar?: Car | null): Partial<Car> => {
    if (existingCar) {
      return {
        ...existingCar,
        name: existingCar.vehicle_name || existingCar.name || '',
        vehicle_name: existingCar.vehicle_name || existingCar.name || '',
        category: existingCar.category || existingCar.vehicle_type || 'Luxury Sedan',
        vehicle_type: existingCar.vehicle_type || existingCar.category || 'Luxury Sedan',
        brand: existingCar.brand || 'Mercedes-Benz',
        model: existingCar.model || 'E-Class',
        year: existingCar.year || 2024,
        daily_rate: existingCar.daily_rate || existingCar.daily_rate_self_drive || 140,
        daily_rate_self_drive: existingCar.daily_rate_self_drive || existingCar.daily_rate || 140,
        daily_rate_chauffeur: existingCar.daily_rate_chauffeur || (Number(existingCar.daily_rate || 140) + 50),
        seats: existingCar.seats || existingCar.passenger_capacity || 4,
        passenger_capacity: existingCar.passenger_capacity || existingCar.seats || 4,
        luggage_capacity: existingCar.luggage_capacity || existingCar.luggage || 3,
        transmission: existingCar.transmission || 'Automatic',
        fuel_type: existingCar.fuel_type || 'Hybrid',
        image_urls: existingCar.image_urls || (existingCar.image_url ? [existingCar.image_url] : []),
        features: existingCar.features || ['Leather Seating', 'Climate Control', 'GPS Navigation', 'Refreshment Cooler', 'Complimentary WiFi'],
        description: existingCar.description || 'Chauffeur-driven luxury mobility with English-speaking private escort and comprehensive insurance.',
        pickup_location: existingCar.pickup_location || 'Bandaranaike International Airport (CMB)',
        dropoff_location: existingCar.dropoff_location || 'Colombo / Islandwide',
        package_status: existingCar.package_status || 'ACTIVE',
        package_code: existingCar.package_code || `CAR-${Math.floor(1000 + Math.random() * 9000)}`,
        currency: existingCar.currency || 'USD',
      };
    }
    return {
      package_code: `CAR-${Math.floor(1000 + Math.random() * 9000)}`,
      package_status: 'ACTIVE',
      currency: 'USD',
      name: '',
      vehicle_name: '',
      category: 'Luxury Sedan',
      vehicle_type: 'Luxury Sedan',
      brand: 'Mercedes-Benz',
      model: 'E-Class',
      year: 2024,
      daily_rate: 140,
      daily_rate_self_drive: 140,
      daily_rate_chauffeur: 190,
      seats: 4,
      passenger_capacity: 4,
      luggage_capacity: 3,
      transmission: 'Automatic',
      fuel_type: 'Hybrid',
      image_urls: [],
      features: ['Leather Seating', 'Climate Control', 'GPS Navigation', 'Refreshment Cooler', 'Complimentary WiFi'],
      description: 'Chauffeur-driven luxury mobility with English-speaking private escort and comprehensive insurance.',
      pickup_location: 'Bandaranaike International Airport (CMB)',
      dropoff_location: 'Colombo / Islandwide',
    };
  };

  const [formData, setFormData] = useState<Partial<Car>>(() => getInitialFormData(car));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  // Reset state on open or car change
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(car));
      setSelectedFile(null);
      setError('');
      setWarning('');
      if (car?.image_urls?.[0]) {
        setPreviewUrl(car.image_urls[0]);
      } else if (car?.image_url) {
        setPreviewUrl(car.image_url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError('');
      setWarning('');
    }
  }, [isOpen, car]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleFileChange = (file: File | null) => {
    setError('');
    if (!file) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      setError('Vehicle image must be an image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Vehicle image must be smaller than 5MB.');
      return;
    }

    // Revoke previous blob URL if any
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({ ...formData, image_urls: [], image_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWarning('');

    try {
      const vName = formData.vehicle_name || formData.name || 'Executive Vehicle';

      // Ensure no temporary blob URLs leak into the payload
      const sanitizedImageUrls = (formData.image_urls || []).filter((u: string) => typeof u === 'string' && !u.startsWith('blob:'));
      const sanitizedImageUrl = formData.image_url && !formData.image_url.startsWith('blob:') ? formData.image_url : (sanitizedImageUrls[0] || '');

      const payload: Partial<Car> = {
        ...formData,
        id: car?.id || formData.id,
        name: vName,
        vehicle_name: vName,
        category: formData.category || formData.vehicle_type || 'Luxury Sedan',
        vehicle_type: formData.vehicle_type || formData.category || 'Luxury Sedan',
        daily_rate: Number(formData.daily_rate || formData.daily_rate_self_drive || 140),
        daily_rate_self_drive: Number(formData.daily_rate_self_drive || formData.daily_rate || 140),
        daily_rate_chauffeur: Number(formData.daily_rate_chauffeur || (Number(formData.daily_rate || 140) + 50)),
        seats: Number(formData.seats || formData.passenger_capacity || 4),
        passenger_capacity: Number(formData.passenger_capacity || formData.seats || 4),
        luggage_capacity: Number(formData.luggage_capacity || formData.luggage || 3),
        transmission: formData.transmission || 'Automatic',
        available: formData.available !== undefined ? Boolean(formData.available) : true,
        image_url: sanitizedImageUrl,
        image_urls: sanitizedImageUrls,
      };

      console.log('[Car Form Modal] Submitting vehicle record:', {
        hasSelectedFile: Boolean(selectedFile),
        fileName: selectedFile?.name,
        fileSize: selectedFile?.size,
        isFileInstance: selectedFile instanceof File,
        vehicleName: vName,
        payload,
      });

      if (onSave) {
        await onSave(payload, selectedFile);
      } else {
        await dataService.saveCar(payload, selectedFile);
      }

      console.log('[Car Form Modal] Vehicle successfully saved!');
      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      console.error('[Car Form Modal] Save vehicle error:', err);
      const errMsg = err?.message || 'Failed to save vehicle';
      if (errMsg.includes('Vehicle was created')) {
        setWarning(errMsg);
      } else {
        setError(errMsg);
      }
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
              {car ? 'Edit Chauffeur Vehicle' : 'Add Luxury Vehicle'}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Manage premium private transport fleet and chauffeur rates</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-[var(--muted)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {warning && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium border border-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{warning}</span>
            </div>
          )}

          <form id="car-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Vehicle Name / Model</label>
                <input
                  required
                  type="text"
                  value={formData.vehicle_name || formData.name || ''}
                  onChange={e => setFormData({ ...formData, vehicle_name: e.target.value, name: e.target.value })}
                  placeholder="e.g. Mercedes-Benz E-Class Executive"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Category</label>
                <select
                  value={formData.category || formData.vehicle_type || 'Luxury Sedan'}
                  onChange={e => setFormData({ ...formData, category: e.target.value, vehicle_type: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                >
                  <option value="Luxury Sedan">Luxury Sedan</option>
                  <option value="Executive SUV">Executive SUV</option>
                  <option value="VIP Premium Van">VIP Premium Van</option>
                  <option value="Vintage Classic">Vintage Classic</option>
                  <option value="Supercar">Supercar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Daily Rate Self-Drive (USD)</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formData.daily_rate_self_drive || formData.daily_rate || ''}
                  onChange={e => setFormData({ ...formData, daily_rate: Number(e.target.value), daily_rate_self_drive: Number(e.target.value) })}
                  placeholder="140"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Daily Rate with Chauffeur (USD)</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formData.daily_rate_chauffeur || ''}
                  onChange={e => setFormData({ ...formData, daily_rate_chauffeur: Number(e.target.value) })}
                  placeholder="190"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Seats (Passengers)</label>
                <input
                  required
                  type="number"
                  min="1"
                  max="50"
                  value={formData.seats || formData.passenger_capacity || ''}
                  onChange={e => setFormData({ ...formData, seats: Number(e.target.value), passenger_capacity: Number(e.target.value) })}
                  placeholder="4"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Transmission & Fuel</label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={formData.transmission || 'Automatic'}
                    onChange={e => setFormData({ ...formData, transmission: e.target.value as any })}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                  <select
                    value={formData.fuel_type || 'Hybrid'}
                    onChange={e => setFormData({ ...formData, fuel_type: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe vehicle luxury features, luggage space, and chauffeur standards..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase mb-1 block">Vehicle Image</label>
                <div className="mt-1 space-y-4">
                  {previewUrl ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-[var(--border-subtle)] group">
                      <img src={previewUrl} alt="Vehicle Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (fileInputRef.current) fileInputRef.current.click();
                          }}
                          className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[var(--primary-dark)] shadow-lg transition-colors"
                        >
                          <UploadCloud className="w-4 h-4" /> Replace Image
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-600 shadow-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) {
                          handleFileChange(e.dataTransfer.files[0]);
                        }
                      }}
                      className="border-2 border-dashed border-slate-200 dark:border-[var(--border-subtle)] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--primary)] dark:hover:border-[var(--primary)] bg-slate-50/50 dark:bg-[#073126]/30 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-[#031812]/40 text-[var(--primary)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-[var(--text)] dark:text-white">Click or drag image here to upload</p>
                      <p className="text-xs text-[var(--muted)] mt-1">Supports JPG, PNG, WebP (Max 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-[var(--border-subtle)] flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-[var(--muted)] hover:bg-slate-100 dark:text-[var(--text-secondary)] dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            form="car-form" 
            type="submit" 
            disabled={loading} 
            className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {loading ? (selectedFile ? 'Uploading & Saving...' : 'Saving...') : (car ? 'Update Vehicle' : 'Add Vehicle')}
          </button>
        </div>
      </div>
    </div>
  );
};
