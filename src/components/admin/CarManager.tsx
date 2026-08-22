import React, { useState, useEffect } from 'react';
import { dataService } from '../../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Car } from '../../types';
import { CarFormModal } from './CarFormModal';

export const CarManager = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await dataService.getCars();
      if (data) setCars(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
    const handleUpdate = () => fetchCars();
    window.addEventListener('cars-updated', handleUpdate);
    return () => window.removeEventListener('cars-updated', handleUpdate);
  }, []);

  const handleSave = async (data: Partial<Car>, file?: File | null) => {
    await dataService.saveCar(data, file);
    await fetchCars();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this car package?')) {
      await dataService.deleteCar(id);
      fetchCars();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--text)] dark:text-white">Rent A Car Catalog</h2>
          <p className="text-sm text-[var(--muted)]">Add, edit, or remove luxury fleet vehicles</p>
        </div>
        <button onClick={() => { setEditingCar(null); setIsModalOpen(true); }} className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      <div className="glass-card border border-slate-200 dark:border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-[var(--muted)]">Loading vehicles...</div>
        ) : cars.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-bold text-[var(--text)] dark:text-white mb-2">No Vehicles Found</h3>
            <p className="text-sm text-[var(--muted)] mb-4">Your vehicle catalog is currently empty.</p>
            <button onClick={() => { setEditingCar(null); setIsModalOpen(true); }} className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-sm font-bold">
              + Add Vehicle
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--background)] dark:bg-[#073126]/50 text-[var(--muted)] dark:text-[var(--muted)] text-xs uppercase tracking-wider border-b border-slate-200 dark:border-[var(--border-subtle)]">
                  <th className="p-4 font-semibold">Vehicle</th>
                  <th className="p-4 font-semibold">Transmission / Type</th>
                  <th className="p-4 font-semibold">Price/Day</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {cars.map(car => {
                  const title = car.vehicle_name || car.name || 'Executive Vehicle';
                  const type = car.vehicle_type || car.category || 'Executive Sedan';
                  const img = car.image_urls?.[0] || car.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341';
                  const price = car.daily_rate || car.daily_rate_self_drive || 120;

                  return (
                    <tr key={car.id} className="hover:bg-[var(--background)] dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                          <div>
                            <p className="font-bold text-sm text-[var(--text)] dark:text-white">{title}</p>
                            <p className="text-[10px] text-[var(--muted)] truncate max-w-[200px]">{car.seats || 4} Seats • {car.transmission || 'Automatic'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[var(--muted)] dark:text-[var(--text-secondary)]">
                        <span className="bg-emerald-50 dark:bg-[#073126]/30 text-[var(--primary-dark)] dark:text-emerald-400 px-2 py-1 rounded text-xs font-semibold">{type}</span>
                      </td>
                      <td className="p-4 text-sm font-bold text-[var(--text)] dark:text-white">${price}/day</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setEditingCar(car); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-[var(--primary)] transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(car.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="Delete">
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
      <CarFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} car={editingCar} />
    </div>
  );
};
