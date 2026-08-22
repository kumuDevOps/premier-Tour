import React, { useState } from 'react';
import { Landmark, Copy, Check, ShieldCheck, HelpCircle } from 'lucide-react';
import { BANK_DETAILS } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';

interface BankDetailsCardProps {
  amount?: number;
  bookingRef?: string;
  className?: string;
}

export const BankDetailsCard: React.FC<BankDetailsCardProps> = ({
  amount,
  bookingRef,
  className = '',
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div id="bank-transfer-details-card" className={`glass-card bg-emerald-50/80 dark:bg-[#073126]/80 text-[var(--text)] dark:text-emerald-50 rounded-2xl p-6 border border-emerald-100 dark:border-[var(--border-subtle)] shadow-xl relative overflow-hidden ${className}`}>
      {/* Subtle purple accent aura */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-800/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/50 dark:bg-[var(--primary)]/10 border border-emerald-200 dark:border-emerald-400/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-sans text-emerald-900 dark:text-white tracking-wide">{BANK_DETAILS.bankName}</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-300/70">Official Reservations Account</p>
          </div>
        </div>

        {amount != null && (
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-medium block">Total Payable</span>
            <span className="text-xl font-sans text-emerald-800 dark:text-emerald-300 font-bold">
              {formatPrice(Number(amount))}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Account Number */}
        <div className="bg-white/60 dark:bg-emerald-900/40 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between">
          <div>
            <span className="text-emerald-700/70 dark:text-emerald-400/70 block text-[11px]">Account Number</span>
            <span className="font-mono text-sm text-emerald-900 dark:text-emerald-200 font-bold tracking-wider">{BANK_DETAILS.accountNumber}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'account')}
            className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-600 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Copy Account Number"
          >
            {copiedField === 'account' ? <Check className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Account Name */}
        <div className="bg-white/60 dark:bg-emerald-900/40 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between">
          <div>
            <span className="text-emerald-700/70 dark:text-emerald-400/70 block text-[11px]">Beneficiary Name</span>
            <span className="text-emerald-900 dark:text-emerald-200 font-medium">{BANK_DETAILS.accountName}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(BANK_DETAILS.accountName, 'name')}
            className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-600 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Copy Beneficiary Name"
          >
            {copiedField === 'name' ? <Check className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Routing Number */}
        <div className="bg-white/60 dark:bg-emerald-900/40 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between">
          <div>
            <span className="text-emerald-700/70 dark:text-emerald-400/70 block text-[11px]">Routing Code (Bank Code)</span>
            <span className="font-mono text-emerald-900 dark:text-emerald-200 font-semibold">{BANK_DETAILS.routingNumber}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(BANK_DETAILS.routingNumber, 'routing')}
            className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-600 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Copy Routing Number"
          >
            {copiedField === 'routing' ? <Check className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* SWIFT / BIC */}
        <div className="bg-white/60 dark:bg-emerald-900/40 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between">
          <div>
            <span className="text-emerald-700/70 dark:text-emerald-400/70 block text-[11px]">SWIFT / BIC (International)</span>
            <span className="font-mono text-emerald-900 dark:text-emerald-200 font-semibold">{BANK_DETAILS.swiftBic}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(BANK_DETAILS.swiftBic, 'swift')}
            className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-600 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Copy SWIFT Code"
          >
            {copiedField === 'swift' ? <Check className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Transfer Reference Code (Critical) */}
        {bookingRef && (
          <div className="md:col-span-2 bg-emerald-100/50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-300 dark:border-[var(--primary)]/40 flex items-center justify-between">
            <div>
              <span className="text-emerald-800 dark:text-emerald-300 font-medium block text-[11px]">Required Payment Reference Code</span>
              <span className="font-mono text-sm text-emerald-900 dark:text-emerald-200 font-bold tracking-wider">{bookingRef}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(bookingRef, 'ref')}
              className="p-1.5 bg-emerald-200/50 dark:bg-[var(--primary-dark)]/30 hover:bg-emerald-300 dark:hover:bg-[var(--primary-dark)]/50 text-emerald-900 dark:text-emerald-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium border border-emerald-300 dark:border-[var(--primary)]/30"
            >
              {copiedField === 'ref' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Ref
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between text-[11px] text-emerald-700/70 dark:text-slate-400">
        <span className="flex items-center gap-1.5 text-[var(--primary-dark)] dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary-dark)] dark:text-emerald-400" />
          Direct Bank Deposit & 100% Verified Reservations
        </span>
        <span className="text-emerald-700/70 dark:text-[var(--muted)] flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> BOC Head Office, Colombo
        </span>
      </div>
    </div>
  );
};
