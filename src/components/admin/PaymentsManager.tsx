import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { CreditCard, DollarSign, Download, CheckCircle2, Clock, FileText, ArrowUpRight, Search, Eye, X, ExternalLink } from 'lucide-react';
import { Booking } from '../../types';

export const PaymentsManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Booking | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await dataService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    const handleUpdate = () => fetchPayments();
    window.addEventListener('bookings-updated', handleUpdate);
    return () => window.removeEventListener('bookings-updated', handleUpdate);
  }, []);

  const verifiedPayments = bookings.filter(b => b.payment_status === 'Verified');
  const totalVerifiedVolume = verifiedPayments.reduce((acc, b) => acc + (Number(b.total_amount || b.total_price) || 0), 0);
  const pendingVolume = bookings.filter(b => b.payment_status === 'Pending').reduce((acc, b) => acc + (Number(b.total_amount || b.total_price) || 0), 0);

  const filtered = bookings.filter(b => 
    b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.id?.toLowerCase().includes(search.toLowerCase()) ||
    b.service_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('No transaction records in the current view to export.');
      return;
    }

    const headers = [
      'Transaction Reference',
      'Transaction Date',
      'Customer Name',
      'Customer Email',
      'Expedition Service',
      'Payment Method',
      'Amount (USD)',
      'Slip Attached',
      'Payment Status'
    ];

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filtered.map(b => [
      escapeCSV(b.id),
      escapeCSV(new Date(b.created_at).toLocaleDateString()),
      escapeCSV(b.customer_name || 'Traveler'),
      escapeCSV(b.customer_email || 'N/A'),
      escapeCSV(b.service_name || 'Expedition Package'),
      escapeCSV(b.payment_method || 'Bank Wire Transfer'),
      escapeCSV(Number(b.total_amount || b.total_price || 0).toFixed(2)),
      escapeCSV(b.payment_receipt_url || b.receipt_url ? 'Yes' : 'No'),
      escapeCSV(b.payment_status || 'Pending')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `ceylon_premier_payments_ledger_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10231D] dark:text-white">
            Payments & Bank Slip Invoices
          </h1>
          <p className="text-sm text-[#71817B] dark:text-[#8FA9A0]">
            Audit incoming revenue transactions, traveler payment transfers, and attached bank deposit receipts.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F9D72] hover:bg-[#0B7D5A] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
          title="Export payments ledger as CSV"
        >
          <Download className="w-4 h-4" />
          Export Ledger CSV ({filtered.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-[#0F9D72]/30 shadow-xs">
          <span className="text-xs font-bold text-[#0F9D72] dark:text-[#39D39B] uppercase">Total Verified Revenue</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-[#10231D] dark:text-white">${totalVerifiedVolume.toLocaleString()}</span>
            <DollarSign className="w-5 h-5 text-[#0F9D72]" />
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-xs">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Pending Inflow (Slips)</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400">${pendingVolume.toLocaleString()}</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] shadow-xs">
          <span className="text-xs font-bold text-[#71817B] dark:text-[#8FA9A0] uppercase">Processed Transactions</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-[#10231D] dark:text-white">{bookings.length}</span>
            <CreditCard className="w-5 h-5 text-[#71817B]" />
          </div>
        </div>
      </div>

      {/* Transaction Records */}
      <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-base font-bold text-[#10231D] dark:text-white">Transaction History & Receipts</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#71817B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F2F8F5] dark:bg-[var(--surface)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-xl py-1.5 pl-9 pr-3 text-xs text-[#10231D] dark:text-white focus:outline-none focus:border-[#0F9D72]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#71817B]">Loading ledger...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#71817B]">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#F8FCFA] dark:bg-[var(--surface)] text-[#71817B] dark:text-[#8FA9A0] text-[11px] uppercase tracking-wider border-b border-[#DDEBE5] dark:border-[var(--border-subtle)]">
                  <th className="p-3 font-bold">Transaction Ref</th>
                  <th className="p-3 font-bold">Traveler</th>
                  <th className="p-3 font-bold">Expedition</th>
                  <th className="p-3 font-bold">Method</th>
                  <th className="p-3 font-bold">Amount</th>
                  <th className="p-3 font-bold">Slip Attached</th>
                  <th className="p-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDEBE5] dark:divide-[rgba(73,201,151,0.1)]">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-[#F2F8F5]/60 dark:hover:bg-[#13372B]/30 transition-colors">
                    <td className="p-3 font-mono text-xs text-[#0F9D72] dark:text-[#39D39B] font-bold">
                      {b.id}
                    </td>
                    <td className="p-3 text-xs font-semibold text-[#10231D] dark:text-white">
                      {b.customer_name || 'Traveler'}
                    </td>
                    <td className="p-3 text-xs text-[#33453F] dark:text-[#C8DDD5]">
                      {b.service_name}
                    </td>
                    <td className="p-3 text-xs text-[#71817B] dark:text-[#8FA9A0]">
                      {b.payment_method || 'Bank Slip / Wire'}
                    </td>
                    <td className="p-3 text-xs font-bold text-[#10231D] dark:text-white">
                      ${Number(b.total_amount || b.total_price || 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {b.payment_receipt_url ? (
                        <button
                          onClick={() => setSelectedReceipt(b)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0F9D72] hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Slip
                        </button>
                      ) : (
                        <span className="text-xs text-[#71817B] italic">No slip</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.payment_status === 'Verified'
                          ? 'bg-emerald-100 dark:bg-[var(--background)] text-[#0F9D72] dark:text-[#39D39B]'
                          : b.payment_status === 'Rejected'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      }`}>
                        {b.payment_status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slip Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[var(--surface)] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)]">
            <div className="p-5 border-b border-[#DDEBE5] dark:border-[var(--border-subtle)] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#10231D] dark:text-white">Bank Payment Receipt</h3>
                <p className="text-xs text-[#71817B] font-mono">Ref: {selectedReceipt.id}</p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 text-[#71817B] hover:text-[#10231D] rounded-full hover:bg-slate-100 dark:hover:bg-[#13372B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex flex-col items-center justify-center bg-[#F8FCFA] dark:bg-[var(--surface)]">
              {selectedReceipt.payment_receipt_url ? (
                <img
                  src={selectedReceipt.payment_receipt_url}
                  alt="Bank deposit receipt"
                  className="max-h-[350px] w-auto rounded-xl object-contain border border-[#DDEBE5] dark:border-[var(--border-subtle)] shadow-sm"
                />
              ) : (
                <p className="text-xs text-[#71817B]">No image available</p>
              )}
            </div>
            <div className="p-4 border-t border-[#DDEBE5] dark:border-[var(--border-subtle)] flex justify-between items-center">
              <span className="text-xs font-bold text-[#10231D] dark:text-white">
                Amount: ${Number(selectedReceipt.total_amount || selectedReceipt.total_price || 0).toLocaleString()}
              </span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 bg-[#0F9D72] text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
