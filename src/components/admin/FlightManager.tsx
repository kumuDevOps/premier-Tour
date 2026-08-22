import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Plus, Edit2, Trash2, Plane } from 'lucide-react';
import { Flight } from '../../types';
import { FlightFormModal } from './FlightFormModal';

export const FlightManager = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const data = await dataService.getFlights();
      if (data) setFlights(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlights();
    const handleUpdate = () => fetchFlights();
    window.addEventListener('flights-updated', handleUpdate);
    return () => window.removeEventListener('flights-updated', handleUpdate);
  }, []);

  const handleSave = async (data: Partial<Flight>) => {
    await dataService.saveFlight(data);
    await fetchFlights();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this flight schedule?')) {
      await dataService.deleteFlight(id);
      fetchFlights();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--text)] dark:text-white">Flight Schedules & Packages</h2>
          <p className="text-sm text-[var(--muted)]">Manage real scheduled flights and international routes to Sri Lanka</p>
        </div>
        <button 
          onClick={() => { setEditingFlight(null); setIsModalOpen(true); }} 
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Flight
        </button>
      </div>

      <div className="glass-card border border-slate-200 dark:border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-[var(--muted)]">Loading flight schedules...</div>
        ) : flights.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-bold text-[var(--text)] dark:text-white mb-2">No Flights Found</h3>
            <p className="text-sm text-[var(--muted)] mb-4">Your flight catalog is currently empty.</p>
            <button onClick={() => { setEditingFlight(null); setIsModalOpen(true); }} className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-sm font-bold">
              + Add Flight
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--background)] dark:bg-[#073126]/50 text-[var(--muted)] dark:text-[var(--muted)] text-xs uppercase tracking-wider border-b border-slate-200 dark:border-[var(--border-subtle)]">
                  <th className="p-4 font-semibold">Airline</th>
                  <th className="p-4 font-semibold">Flight Number</th>
                  <th className="p-4 font-semibold">From</th>
                  <th className="p-4 font-semibold">To</th>
                  <th className="p-4 font-semibold">Departure</th>
                  <th className="p-4 font-semibold">Arrival</th>
                  <th className="p-4 font-semibold">Stops</th>
                  <th className="p-4 font-semibold">Fare</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {flights.map(flight => {
                  const fullAirline = flight.airline || flight.airline_name || flight.title || 'Aviation Service';
                  // Extract airline and flight number if combined
                  const fnMatch = fullAirline.match(/\(([^)]+)\)/);
                  const flightNumber = flight.flight_number || (fnMatch ? fnMatch[1] : (flight.code || 'QR 668'));
                  const airlineName = flight.airline_name || fullAirline.replace(/\([^)]+\)/, '').trim();
                  
                  const from = flight.route_from || flight.departure_city || flight.departure_location || 'Doha (DOH)';
                  const to = flight.route_to || flight.arrival_city || flight.arrival_location || 'Colombo (CMB), Sri Lanka';
                  
                  // Extract departure & arrival from duration or fields
                  let departure = flight.departure_time || '18:50';
                  let arrival = flight.arrival_time || '02:10 (+1)';
                  if (flight.duration && flight.duration.includes('-')) {
                    const parts = flight.duration.split('-');
                    departure = parts[0]?.trim() || departure;
                    arrival = parts[1]?.trim() || arrival;
                  }
                  
                  const stops = flight.cabin_class || 'Direct';
                  const fare = Number(flight.price || flight.base_price || 560);

                  return (
                    <tr key={flight.id} className="hover:bg-[var(--background)] dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 font-bold text-sm text-[var(--text)] dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#031812]/40 flex items-center justify-center shrink-0">
                          <Plane className="w-4 h-4 text-[var(--primary)]" />
                        </div>
                        <span>{airlineName}</span>
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-700 dark:text-[var(--text)]">
                        <span className="bg-slate-100 dark:bg-[var(--surface)] px-2 py-1 rounded text-xs font-mono font-bold">{flightNumber}</span>
                      </td>
                      <td className="p-4 text-sm text-[var(--text)] dark:text-[var(--text-secondary)] font-medium">{from}</td>
                      <td className="p-4 text-sm text-[var(--text)] dark:text-[var(--text-secondary)] font-medium">{to}</td>
                      <td className="p-4 text-sm font-semibold text-slate-800 dark:text-[var(--text)]">{departure}</td>
                      <td className="p-4 text-sm font-semibold text-slate-800 dark:text-[var(--text)]">{arrival}</td>
                      <td className="p-4 text-sm">
                        <span className="bg-emerald-50 dark:bg-[#073126]/30 text-[var(--primary-dark)] dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold">
                          {stops}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-black text-[var(--text)] dark:text-white">${fare}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setEditingFlight(flight); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-[var(--primary)] transition-colors" title="Edit Flight">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(flight.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="Delete Flight">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <FlightFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        onSaved={fetchFlights} 
        flight={editingFlight} 
      />
    </div>
  );
};
