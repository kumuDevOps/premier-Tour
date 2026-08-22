import React, { useState, useEffect } from 'react';
import { dataService } from '../../lib/supabase';
import { X, Save, Plane, AlertCircle } from 'lucide-react';
import { Flight } from '../../types';

interface FlightFormModalProps {
  isOpen?: boolean;
  flight?: Flight | null;
  onClose: () => void;
  onSave?: (data: Partial<Flight>) => Promise<void>;
  onSaved?: () => void;
}

export const FlightFormModal: React.FC<FlightFormModalProps> = ({ 
  isOpen = true, 
  flight, 
  onClose, 
  onSave, 
  onSaved 
}) => {
  const getInitialFormData = (existingFlight?: Flight | null) => {
    if (existingFlight) {
      const fullAirline = existingFlight.airline || existingFlight.airline_name || existingFlight.title || '';
      const fnMatch = fullAirline.match(/\(([^)]+)\)/);
      const flightNumber = existingFlight.flight_number || (fnMatch ? fnMatch[1] : '');
      const airlineName = existingFlight.airline_name || fullAirline.replace(/\([^)]+\)/, '').trim();

      let depTime = existingFlight.departure_time || '18:50';
      let arrTime = existingFlight.arrival_time || '02:10 (+1)';
      if (existingFlight.duration && existingFlight.duration.includes('-')) {
        const parts = existingFlight.duration.split('-');
        depTime = parts[0]?.trim() || depTime;
        arrTime = parts[1]?.trim() || arrTime;
      }

      return {
        id: existingFlight.id,
        airline_name: airlineName || 'Qatar Airways',
        flight_number: flightNumber || 'QR 668',
        from: existingFlight.route_from || existingFlight.departure_city || existingFlight.departure_location || 'Doha (DOH)',
        to: existingFlight.route_to || existingFlight.arrival_city || existingFlight.arrival_location || 'Colombo (CMB), Sri Lanka',
        departure_time: depTime,
        arrival_time: arrTime,
        stops: existingFlight.cabin_class || 'Direct',
        fare: Number(existingFlight.price || existingFlight.base_price || 560),
        cabin_class: existingFlight.cabin_class || 'Direct',
        description: existingFlight.description || 'Scheduled international connection to Bandaranaike International Airport (CMB).',
      };
    }
    return {
      airline_name: 'Qatar Airways',
      flight_number: 'QR 668',
      from: 'Doha (DOH)',
      to: 'Colombo (CMB), Sri Lanka',
      departure_time: '18:50',
      arrival_time: '02:10 (+1)',
      stops: 'Direct',
      fare: 560,
      cabin_class: 'Direct',
      description: 'Scheduled international connection to Bandaranaike International Airport (CMB).',
    };
  };

  const [formData, setFormData] = useState(() => getInitialFormData(flight));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(flight));
      setError('');
    }
  }, [isOpen, flight]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const combinedAirline = `${formData.airline_name.trim()} (${formData.flight_number.trim()})`;
      const combinedDuration = `${formData.departure_time.trim()} - ${formData.arrival_time.trim()}`;

      const payload: Partial<Flight> = {
        id: flight?.id,
        title: combinedAirline,
        airline: combinedAirline,
        airline_name: formData.airline_name.trim(),
        flight_number: formData.flight_number.trim(),
        route_from: formData.from.trim(),
        route_to: formData.to.trim(),
        departure_city: formData.from.trim(),
        departure_location: formData.from.trim(),
        arrival_city: formData.to.trim(),
        arrival_location: formData.to.trim(),
        departure_time: formData.departure_time.trim(),
        arrival_time: formData.arrival_time.trim(),
        duration: combinedDuration,
        flight_duration: combinedDuration,
        price: Number(formData.fare || 560),
        base_price: Number(formData.fare || 560),
        cabin_class: formData.stops || 'Direct',
        image_url: '',
        image_urls: [],
        description: formData.description || 'International scheduled flight.',
      };

      if (onSave) {
        await onSave(payload);
      } else {
        await dataService.saveFlight(payload);
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      console.error('Save flight schedule error:', err);
      setError(err?.message || 'Failed to save flight schedule');
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
              {flight ? 'Edit Flight Schedule' : 'Add Flight Schedule'}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Manage scheduled airline connections and flight packages</p>
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

          <form id="flight-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Airline Name</label>
                <input
                  required
                  type="text"
                  value={formData.airline_name}
                  onChange={e => setFormData({ ...formData, airline_name: e.target.value })}
                  placeholder="e.g. Qatar Airways"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Flight Number</label>
                <input
                  required
                  type="text"
                  value={formData.flight_number}
                  onChange={e => setFormData({ ...formData, flight_number: e.target.value })}
                  placeholder="e.g. QR 668"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">From (Origin)</label>
                <input
                  required
                  type="text"
                  value={formData.from}
                  onChange={e => setFormData({ ...formData, from: e.target.value })}
                  placeholder="e.g. Doha (DOH)"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">To (Destination)</label>
                <input
                  required
                  type="text"
                  value={formData.to}
                  onChange={e => setFormData({ ...formData, to: e.target.value })}
                  placeholder="e.g. Colombo (CMB), Sri Lanka"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Departure Time</label>
                <input
                  required
                  type="text"
                  value={formData.departure_time}
                  onChange={e => setFormData({ ...formData, departure_time: e.target.value })}
                  placeholder="e.g. 18:50"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Arrival Time</label>
                <input
                  required
                  type="text"
                  value={formData.arrival_time}
                  onChange={e => setFormData({ ...formData, arrival_time: e.target.value })}
                  placeholder="e.g. 02:10 (+1)"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Stops</label>
                <input
                  required
                  type="text"
                  value={formData.stops}
                  onChange={e => setFormData({ ...formData, stops: e.target.value, cabin_class: e.target.value })}
                  placeholder="e.g. Direct or 1 Stop"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Fare (USD)</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formData.fare || ''}
                  onChange={e => setFormData({ ...formData, fare: Number(e.target.value) })}
                  placeholder="560"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Flight Details & Baggage Policy</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional route or in-flight notes..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                />
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
            form="flight-form" 
            type="submit" 
            disabled={loading} 
            className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : (flight ? 'Update Schedule' : 'Add Flight')}
          </button>
        </div>
      </div>
    </div>
  );
};
