import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, dataService } from '../../lib/supabase';
import { Database, Download, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { SEED_TOURS, SEED_HOTELS, SEED_CARS, SEED_FLIGHTS, SEED_BLOG_POSTS } from '../../data/mockData';

export const DatabaseManager = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const handleSeed = async () => {
    if (!window.confirm('Are you sure you want to seed the database? This will populate the catalog and refresh your local environment.')) return;
    
    setLoading(true);
    setStatus({ type: 'info', message: 'Seeding database and catalog stores... Please wait.' });
    
    try {
      dataService.resetDemoData();

      if (isSupabaseConfigured) {
        // Seed tours
        for (const t of SEED_TOURS) {
          await dataService.saveTour(t as any).catch(e => console.warn('Tour seed warning', e));
        }
        // Seed hotels
        for (const h of SEED_HOTELS) {
          await dataService.saveHotel(h as any).catch(e => console.warn('Hotel seed warning', e));
        }
        // Seed cars
        for (const c of SEED_CARS) {
          await dataService.saveCar(c as any).catch(e => console.warn('Car seed warning', e));
        }
        // Seed flights
        for (const f of SEED_FLIGHTS) {
          await dataService.saveFlight(f as any).catch(e => console.warn('Flight seed warning', e));
        }
      }
      
      setStatus({ type: 'success', message: 'Database successfully seeded with comprehensive luxury catalog packages and demo data.' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Failed to seed database' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--text)] dark:text-white">Database Operations</h2>
          <p className="text-sm text-[var(--muted)]">Manage database state and seed data</p>
        </div>
      </div>

      <div className="glass-card border border-slate-200 dark:border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-[var(--border-subtle)]">
           <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-[#073126]/30 flex items-center justify-center shrink-0">
             <Database className="w-6 h-6 text-[var(--primary)]" />
           </div>
           <div>
             <h3 className="font-bold text-[var(--text)] dark:text-white mb-1">Seed Database</h3>
             <p className="text-sm text-[var(--muted)] max-w-2xl">
               Populate your Supabase tables with the default placeholder catalog items (Tours, Hotels, Cars, Flights). This is useful for initializing a new environment.
             </p>
             
             <div className="mt-4">
                <button 
                  onClick={handleSeed}
                  disabled={loading}
                  className="bg-slate-900 dark:bg-white text-white dark:text-[var(--text)] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
                  {loading ? 'Seeding...' : 'Run Seed Script'}
                </button>
             </div>
           </div>
        </div>
        
        {status && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            status.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
            'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
             {status.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : 
              status.type === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0" /> :
              <RefreshCw className="w-5 h-5 shrink-0 animate-spin" />}
             <p className="text-sm font-medium">{status.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
