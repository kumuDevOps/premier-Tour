import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, dataService } from '../../lib/supabase';
import { 
  Users, Map, Hotel, CalendarCheck, TrendingUp, 
  DollarSign, Clock, CheckCircle2, ArrowUpRight, Compass, ShieldCheck
} from 'lucide-react';
import { Booking, Tour, Hotel as HotelType } from '../../types';

export const AdminOverview: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      setLoading(true);
      try {
        const [bList, tList, hList] = await Promise.all([
          dataService.getBookings(undefined, 'admin'),
          dataService.getTours(),
          dataService.getHotels(),
        ]);
        setBookings(bList);
        setTours(tList);
        setHotels(hList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOverviewData();
  }, []);

  const pendingBookings = bookings.filter(b => b.payment_status === 'Pending');
  const verifiedBookings = bookings.filter(b => b.payment_status === 'Verified');
  const totalRevenue = verifiedBookings.reduce((sum, b) => sum + (Number(b.total_amount || b.total_price) || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#0F9D72] to-[#087A5A] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Operations Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Welcome to Premier Tours Admin
          </h1>
          <p className="text-sm text-emerald-50 leading-relaxed">
            Monitor incoming bookings, verified bank slips, luxury travel packages, and customer accounts in real time.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71817B] dark:text-[#8FA9A0] uppercase">Total Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-[#0F9D72]/10 text-[#0F9D72] dark:text-[#39D39B] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#10231D] dark:text-white">{bookings.length}</div>
            <div className="text-[11px] text-[#71817B] dark:text-[#8FA9A0] mt-0.5">{verifiedBookings.length} confirmed / verified</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Pending Verification</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-amber-700 dark:text-amber-400">{pendingBookings.length}</div>
            <div className="text-[11px] text-[#71817B] dark:text-[#8FA9A0] mt-0.5">Require slip verification</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71817B] dark:text-[#8FA9A0] uppercase">Active Tours</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#031812]/50 text-[#0F9D72] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#10231D] dark:text-white">{tours.length}</div>
            <div className="text-[11px] text-[#71817B] dark:text-[#8FA9A0] mt-0.5">Published expeditions</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71817B] dark:text-[#8FA9A0] uppercase">Verified Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-[#0F9D72]/10 text-[#0F9D72] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#0F9D72] dark:text-[#39D39B]">${totalRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-[#71817B] dark:text-[#8FA9A0] mt-0.5">From bank transfers</div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Queue */}
      <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#10231D] dark:text-white">Recent Traveler Reservations</h2>
            <p className="text-xs text-[#71817B] dark:text-[#8FA9A0]">Latest inquiries and orders awaiting fulfillment</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#71817B] dark:text-[#8FA9A0]">
            No booking records yet.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-[#F8FCFA] dark:bg-[var(--surface)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#10231D] dark:text-white">{b.service_name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[var(--surface)] text-slate-700 dark:text-[var(--text-secondary)]">
                      {b.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#71817B] dark:text-[#8FA9A0] mt-0.5">
                    Customer: <span className="font-semibold">{b.customer_name || 'Traveler'}</span> ({b.customer_email || 'No email'}) • {new Date(b.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-bold text-xs text-[#10231D] dark:text-white">
                    ${Number(b.total_amount || b.total_price || 0).toLocaleString()}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    b.payment_status === 'Verified'
                      ? 'bg-emerald-100 text-[#0F9D72] dark:bg-[var(--background)] dark:text-[#39D39B]'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  }`}>
                    {b.payment_status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
