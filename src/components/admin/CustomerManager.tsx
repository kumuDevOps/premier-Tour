import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Users, Mail, Phone, Edit2, Shield, User, Search, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { SEED_USERS } from '../../data/mockData';

export const CustomerManager: React.FC = () => {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    let loadedUsers: UserProfile[] = [];

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          loadedUsers = data as UserProfile[];
        }
      } catch (err) {
        console.warn('Could not fetch users from Supabase, checking local stores:', err);
      }
    }

    if (loadedUsers.length === 0) {
      const stored = localStorage.getItem('premier_users_store');
      if (stored) {
        try {
          loadedUsers = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (loadedUsers.length === 0) {
      loadedUsers = SEED_USERS;
      localStorage.setItem('premier_users_store', JSON.stringify(SEED_USERS));
    }

    setCustomers(loadedUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRoleToggle = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      if (isSupabaseConfigured) {
        await supabase.from('users').update({ role: newRole }).eq('id', user.id);
      }
      const updated = customers.map(c => c.id === user.id ? { ...c, role: newRole } : c);
      setCustomers(updated);
      localStorage.setItem('premier_users_store', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const filtered = customers.filter(c => 
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10231D] dark:text-white">Customer Directory</h1>
          <p className="text-sm text-[#71817B] dark:text-[#8FA9A0]">Manage registered travelers, account roles, and concierge access privileges</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#71817B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search travelers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[var(--surface)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-xl py-2 pl-9 pr-3 text-xs text-[#10231D] dark:text-white focus:outline-none focus:border-[#0F9D72]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#71817B]">Loading travelers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71817B]">No customers found matching search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-[#F8FCFA] dark:bg-[var(--surface)] text-[#71817B] dark:text-[#8FA9A0] text-xs uppercase tracking-wider border-b border-[#DDEBE5] dark:border-[var(--border-subtle)]">
                  <th className="p-4 font-bold">Traveler</th>
                  <th className="p-4 font-bold">Contact</th>
                  <th className="p-4 font-bold">Role & Permissions</th>
                  <th className="p-4 font-bold">Joined</th>
                  <th className="p-4 font-bold text-center">Toggle Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDEBE5] dark:divide-[rgba(73,201,151,0.1)]">
                {filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-[#F2F8F5]/60 dark:hover:bg-[#13372B]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={customer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.full_name)}&background=0F9D72&color=fff`} 
                          alt="" 
                          className="w-10 h-10 rounded-full object-cover bg-slate-100 dark:bg-[var(--surface)]" 
                        />
                        <div>
                          <p className="font-bold text-sm text-[#10231D] dark:text-white">{customer.full_name}</p>
                          <p className="text-xs text-[#71817B] dark:text-[#8FA9A0] font-mono">{customer.id.substring(0, 12)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-[#71817B] dark:text-[#8FA9A0]">
                        <Mail className="w-3.5 h-3.5 text-[#0F9D72]" /> {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-xs text-[#71817B] dark:text-[#8FA9A0]">
                          <Phone className="w-3.5 h-3.5 text-[#0F9D72]" /> {customer.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        customer.role === 'admin' 
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' 
                          : 'bg-emerald-100 dark:bg-[var(--background)] text-[#0F9D72] dark:text-[#39D39B]'
                      }`}>
                        <Shield className="w-3.5 h-3.5" />
                        {customer.role}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-[#71817B] dark:text-[#8FA9A0]">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Active Member'}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleRoleToggle(customer)}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] hover:bg-[#0F9D72] hover:text-white hover:border-[#0F9D72] text-[#10231D] dark:text-white transition-all shadow-xs"
                      >
                        Set as {customer.role === 'admin' ? 'User' : 'Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
