import React, { useState } from 'react';
import { Settings, Save, Globe, Shield, CreditCard, Mail, CheckCircle2 } from 'lucide-react';

interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  vatRate: number;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankSwift: string;
  bankBranch: string;
  allowPublicRegistrations: boolean;
  requireEmailVerification: boolean;
  notifyOnNewBooking: boolean;
  notifyOnNewInquiry: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platformName: 'The Luxury Experience Sri Lanka',
  supportEmail: 'concierge@theluxuryesp.com',
  supportPhone: '+94 11 234 5678',
  defaultCurrency: 'USD',
  vatRate: 0,
  bankName: 'Commercial Bank of Ceylon PLC',
  bankAccountName: 'Ceylon Premier Concierge Ltd',
  bankAccountNumber: '8910023491823',
  bankSwift: 'CCEYLKX',
  bankBranch: 'Kollupitiya Premier Branch, Colombo',
  allowPublicRegistrations: true,
  requireEmailVerification: false,
  notifyOnNewBooking: true,
  notifyOnNewInquiry: true,
};

export const SettingsManager = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'payments' | 'notifications'>('general');
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('premier_platform_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('premier_platform_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--text)] dark:text-white">Platform Settings</h2>
          <p className="text-sm text-[var(--muted)]">Configure global application settings and integrations</p>
        </div>
        <button
          onClick={() => handleSave()}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" /> Platform configurations successfully synchronized and saved.
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'general' ? 'bg-emerald-50 dark:bg-[#073126]/30 text-[var(--primary-dark)] dark:text-emerald-400' : 'text-[var(--muted)] dark:text-[var(--muted)] hover:bg-[var(--background)] dark:hover:bg-slate-800/50'}`}>
             <Globe className="w-4 h-4" /> General
          </button>
          <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'security' ? 'bg-emerald-50 dark:bg-[#073126]/30 text-[var(--primary-dark)] dark:text-emerald-400' : 'text-[var(--muted)] dark:text-[var(--muted)] hover:bg-[var(--background)] dark:hover:bg-slate-800/50'}`}>
             <Shield className="w-4 h-4" /> Security & Roles
          </button>
          <button onClick={() => setActiveTab('payments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'payments' ? 'bg-emerald-50 dark:bg-[#073126]/30 text-[var(--primary-dark)] dark:text-emerald-400' : 'text-[var(--muted)] dark:text-[var(--muted)] hover:bg-[var(--background)] dark:hover:bg-slate-800/50'}`}>
             <CreditCard className="w-4 h-4" /> Payment Gateways
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'notifications' ? 'bg-emerald-50 dark:bg-[#073126]/30 text-[var(--primary-dark)] dark:text-emerald-400' : 'text-[var(--muted)] dark:text-[var(--muted)] hover:bg-[var(--background)] dark:hover:bg-slate-800/50'}`}>
             <Mail className="w-4 h-4" /> Email & Notifications
          </button>
        </div>

        <div className="flex-1 glass-card border border-slate-200 dark:border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm min-h-[400px]">
           {activeTab === 'general' && (
             <div className="space-y-6 max-w-2xl">
               <h3 className="text-lg font-bold text-[var(--text)] dark:text-white border-b border-slate-100 dark:border-[var(--border-subtle)] pb-4 mb-4">General Configuration</h3>
               <div className="space-y-4">
                 <div>
                   <label className="text-xs font-bold text-[var(--muted)] uppercase">Platform Name</label>
                   <input
                     type="text"
                     value={settings.platformName}
                     onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                     className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-[var(--muted)] uppercase">Support Email</label>
                   <input
                     type="email"
                     value={settings.supportEmail}
                     onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                     className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-[var(--muted)] uppercase">Support Hotline</label>
                   <input
                     type="text"
                     value={settings.supportPhone}
                     onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                     className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                   />
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-[var(--muted)] uppercase">Default Currency</label>
                     <select
                       value={settings.defaultCurrency}
                       onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                       className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                     >
                       <option value="USD">USD ($)</option>
                       <option value="EUR">EUR (€)</option>
                       <option value="GBP">GBP (£)</option>
                       <option value="LKR">LKR (Rs.)</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-[var(--muted)] uppercase">VAT Rate (%)</label>
                     <input
                       type="number"
                       min="0"
                       max="100"
                       value={settings.vatRate}
                       onChange={(e) => setSettings({ ...settings, vatRate: Number(e.target.value) })}
                       className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                     />
                   </div>
                 </div>
               </div>
             </div>
           )}
           
           {activeTab === 'payments' && (
             <div className="space-y-6 max-w-2xl">
               <h3 className="text-lg font-bold text-[var(--text)] dark:text-white border-b border-slate-100 dark:border-[var(--border-subtle)] pb-4 mb-4">Official Bank Wire Instructions</h3>
               <div className="space-y-4">
                 <div>
                   <label className="text-xs font-bold text-[var(--muted)] uppercase">Bank Name</label>
                   <input
                     type="text"
                     value={settings.bankName}
                     onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                     className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-[var(--muted)] uppercase">Account Name</label>
                   <input
                     type="text"
                     value={settings.bankAccountName}
                     onChange={(e) => setSettings({ ...settings, bankAccountName: e.target.value })}
                     className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                   />
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-[var(--muted)] uppercase">Account Number</label>
                     <input
                       type="text"
                       value={settings.bankAccountNumber}
                       onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })}
                       className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                     />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-[var(--muted)] uppercase">SWIFT / BIC Code</label>
                     <input
                       type="text"
                       value={settings.bankSwift}
                       onChange={(e) => setSettings({ ...settings, bankSwift: e.target.value })}
                       className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                     />
                   </div>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-[var(--muted)] uppercase">Branch</label>
                   <input
                     type="text"
                     value={settings.bankBranch}
                     onChange={(e) => setSettings({ ...settings, bankBranch: e.target.value })}
                     className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:text-white"
                   />
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'security' && (
             <div className="space-y-6 max-w-2xl">
               <h3 className="text-lg font-bold text-[var(--text)] dark:text-white border-b border-slate-100 dark:border-[var(--border-subtle)] pb-4 mb-4">Access & Security Policies</h3>
               <div className="space-y-4">
                 <label className="flex items-center justify-between p-4 bg-[var(--background)] dark:bg-[var(--surface)] rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] cursor-pointer">
                   <div>
                     <span className="font-bold text-sm text-[var(--text)] dark:text-white block">Allow Public Member Signups</span>
                     <span className="text-xs text-[var(--muted)]">Enable luxury travelers to create personal member portals</span>
                   </div>
                   <input
                     type="checkbox"
                     checked={settings.allowPublicRegistrations}
                     onChange={(e) => setSettings({ ...settings, allowPublicRegistrations: e.target.checked })}
                     className="w-4 h-4 accent-[var(--primary)]"
                   />
                 </label>
                 <label className="flex items-center justify-between p-4 bg-[var(--background)] dark:bg-[var(--surface)] rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] cursor-pointer">
                   <div>
                     <span className="font-bold text-sm text-[var(--text)] dark:text-white block">Require Email Verification</span>
                     <span className="text-xs text-[var(--muted)]">Require verification before reservation confirmation</span>
                   </div>
                   <input
                     type="checkbox"
                     checked={settings.requireEmailVerification}
                     onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                     className="w-4 h-4 accent-[var(--primary)]"
                   />
                 </label>
               </div>
             </div>
           )}

           {activeTab === 'notifications' && (
             <div className="space-y-6 max-w-2xl">
               <h3 className="text-lg font-bold text-[var(--text)] dark:text-white border-b border-slate-100 dark:border-[var(--border-subtle)] pb-4 mb-4">Email & Dispatch Alerts</h3>
               <div className="space-y-4">
                 <label className="flex items-center justify-between p-4 bg-[var(--background)] dark:bg-[var(--surface)] rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] cursor-pointer">
                   <div>
                     <span className="font-bold text-sm text-[var(--text)] dark:text-white block">New Reservation Alert</span>
                     <span className="text-xs text-[var(--muted)]">Notify administrator immediately when new booking is created</span>
                   </div>
                   <input
                     type="checkbox"
                     checked={settings.notifyOnNewBooking}
                     onChange={(e) => setSettings({ ...settings, notifyOnNewBooking: e.target.checked })}
                     className="w-4 h-4 accent-[var(--primary)]"
                   />
                 </label>
                 <label className="flex items-center justify-between p-4 bg-[var(--background)] dark:bg-[var(--surface)] rounded-2xl border border-slate-200 dark:border-[var(--border-subtle)] cursor-pointer">
                   <div>
                     <span className="font-bold text-sm text-[var(--text)] dark:text-white block">New Inquiry Alert</span>
                     <span className="text-xs text-[var(--muted)]">Notify concierge inbox when contact inquiries arrive</span>
                   </div>
                   <input
                     type="checkbox"
                     checked={settings.notifyOnNewInquiry}
                     onChange={(e) => setSettings({ ...settings, notifyOnNewInquiry: e.target.checked })}
                     className="w-4 h-4 accent-[var(--primary)]"
                   />
                 </label>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
