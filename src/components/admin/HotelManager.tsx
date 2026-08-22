import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Hotel } from '../../types';
import { HotelFormModal } from './HotelFormModal';
import { getImageUrl } from '../../utils/imageUrl';

export const HotelManager = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await dataService.getHotels();
      if (data) setHotels(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
    const handleUpdate = () => fetchHotels();
    window.addEventListener('hotels-updated', handleUpdate);
    return () => window.removeEventListener('hotels-updated', handleUpdate);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this hotel package?')) {
      await dataService.deleteHotel(id);
      fetchHotels();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--text)] dark:text-white">Manage Hotels</h2>
          <p className="text-sm text-[var(--muted)]">Add, edit, or remove luxury hotel packages</p>
        </div>
        <button 
          onClick={() => { setEditingHotel(null); setIsModalOpen(true); }}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Hotel
        </button>
      </div>

      <div className="glass-card border border-slate-200 dark:border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-[var(--muted)]">Loading hotels...</div>
        ) : hotels.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-bold text-[var(--text)] dark:text-white mb-2">No Hotels Found</h3>
            <p className="text-sm text-[var(--muted)] mb-4">Your hotel catalog is currently empty.</p>
            <button onClick={() => { setEditingHotel(null); setIsModalOpen(true); }} className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-sm font-bold">
              + Create Hotel
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--background)] dark:bg-[#073126]/50 text-[var(--muted)] dark:text-[var(--muted)] text-xs uppercase tracking-wider border-b border-slate-200 dark:border-[var(--border-subtle)]">
                  <th className="p-4 font-semibold">Hotel</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Price/Night</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {hotels.map((hotel, idx) => {
                  const hotelId = hotel.id || (hotel as any)._id || hotel.package_code || `hotel-${idx}`;
                  const title = hotel.name || hotel.title || 'Luxury Hotel';
                  const loc = hotel.location || hotel.city || 'Sri Lanka';
                  const rawImg = hotel.image_urls?.[0] || hotel.image_url;
                  const img = getImageUrl(rawImg, undefined, `${title} ${loc} hotel resort`);
                  const rawPrice = hotel.price_per_night ?? hotel.price;
                  const price = typeof rawPrice === 'object' && rawPrice !== null ? Number((rawPrice as any).amount || 0) : Number(rawPrice || 0);

                  return (
                    <tr key={hotelId} className="hover:bg-[var(--background)] dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                          <div>
                            <p className="font-bold text-sm text-[var(--text)] dark:text-white">{title}</p>
                            <p className="text-[10px] text-[var(--muted)] truncate max-w-[200px]">{loc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[var(--muted)] dark:text-[var(--text-secondary)]">
                        <span className="bg-emerald-50 dark:bg-[#073126]/30 text-[var(--primary-dark)] dark:text-emerald-400 px-2 py-1 rounded text-xs font-semibold">{loc}</span>
                      </td>
                      <td className="p-4 text-sm font-bold text-[var(--text)] dark:text-white">${price}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setEditingHotel(hotel); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-[var(--primary)] transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(hotelId)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="Delete">
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
        <HotelFormModal
          hotel={editingHotel}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            fetchHotels();
          }}
        />
      )}
    </div>
  );
};
