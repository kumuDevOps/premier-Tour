import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Tour } from '../../types';
import { TourFormModal } from './TourFormModal';
import { getImageUrl } from '../../utils/imageUrl';

export const TourManager = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = await dataService.getTours();
      if (data) setTours(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTours();
    const handleUpdate = () => fetchTours();
    window.addEventListener('tours-updated', handleUpdate);
    return () => window.removeEventListener('tours-updated', handleUpdate);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this tour package?')) {
      await dataService.deleteTour(id);
      fetchTours();
    }
  };

  const handleCreate = () => {
    setSelectedTour(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tour: Tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    fetchTours();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--text)] dark:text-white">Manage Tour Packages</h2>
          <p className="text-sm text-[var(--muted)]">Add, edit, or remove signature travel expeditions</p>
        </div>
        <button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Create Tour
        </button>
      </div>

      <div className="glass-card border border-slate-200 dark:border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-[var(--muted)]">Loading tours...</div>
        ) : tours.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-bold text-[var(--text)] dark:text-white mb-2">No Tours Found</h3>
            <p className="text-sm text-[var(--muted)] mb-4">Your tour catalog is currently empty.</p>
            <button onClick={handleCreate} className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-sm font-bold">
              + Create Tour
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--background)] dark:bg-[#073126]/50 text-[var(--muted)] dark:text-[var(--muted)] text-xs uppercase tracking-wider border-b border-slate-200 dark:border-[var(--border-subtle)]">
                  <th className="p-4 font-semibold">Tour</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Duration</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {tours.map((tour, idx) => {
                  const tourId = tour.id || (tour as any)._id || tour.package_code || `tour-${idx}`;
                  const title = tour.title || tour.name || 'Tour Package';
                  const loc = tour.location || tour.destination || 'Sri Lanka';
                  const rawImg = tour.image_urls?.[0] || tour.image_url;
                  const img = getImageUrl(rawImg, undefined, `${title} ${loc} ${tour.category || ''}`);
                  const dur = tour.duration || `${tour.duration_days || 3} Days`;
                  const rawPrice = tour.price;
                  const price = typeof rawPrice === 'object' && rawPrice !== null ? Number((rawPrice as any).amount || 450) : Number(rawPrice || 450);

                  return (
                    <tr key={tourId} className="hover:bg-[var(--background)] dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                          <div>
                            <p className="font-bold text-sm text-[var(--text)] dark:text-white">{title}</p>
                            <p className="text-[10px] text-[var(--muted)] truncate max-w-[200px]">{loc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[var(--muted)] dark:text-[var(--text-secondary)]">
                        <span className="bg-emerald-50 dark:bg-[#073126]/30 text-[var(--primary-dark)] dark:text-emerald-400 px-2 py-1 rounded text-xs font-semibold">{tour.category || 'Expedition'}</span>
                      </td>
                      <td className="p-4 text-sm text-[var(--muted)] dark:text-[var(--text-secondary)]">
                        <span className="bg-slate-100 dark:bg-[var(--surface)] text-[var(--text)] dark:text-white px-2 py-1 rounded text-xs font-semibold">{dur}</span>
                      </td>
                      <td className="p-4 text-sm font-bold text-[var(--text)] dark:text-white">${price}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(tour)} className="p-1.5 text-slate-400 hover:text-[var(--primary)] transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(tourId)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="Delete">
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

      {isModalOpen && (
        <TourFormModal
          tour={selectedTour}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};
