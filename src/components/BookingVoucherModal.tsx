import React from 'react';
import { X, CheckCircle2, Clock, XCircle, Printer, Landmark, Calendar, Users, Shield } from 'lucide-react';
import { Booking } from '../types';
import { BANK_DETAILS } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';

interface BookingVoucherModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingVoucherModal: React.FC<BookingVoucherModalProps> = ({ booking, onClose }) => {
  const { formatPrice } = useCurrency();
  if (!booking) return null;

  const isVerified = booking.payment_status === 'Verified';
  const isRejected = booking.payment_status === 'Rejected';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="booking-voucher-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-[var(--border-subtle)] overflow-hidden max-h-[90vh] flex flex-col text-[var(--text)] dark:text-[var(--text)]">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-200 dark:border-[var(--border-subtle)] flex items-center justify-between bg-[var(--background)] dark:bg-[#073126]/60">
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-bold text-[var(--text)] dark:text-white">Premier Tours</span>
            <span className="text-xs px-2.5 py-0.5 bg-slate-200 dark:bg-[var(--surface-subtle)] text-slate-700 dark:text-[var(--text)] rounded-full font-mono">
              Voucher #{booking.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-[var(--text)] rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Voucher"
            >
              <Printer className="w-4 h-4 text-[var(--primary-dark)] dark:text-emerald-400" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--muted)] dark:text-[var(--muted)] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Voucher Document */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isVerified
                ? 'bg-emerald-50 dark:bg-[#031812]/50 border-emerald-200 dark:border-[var(--border-subtle)] text-emerald-900 dark:text-[var(--text-secondary)]'
                : isRejected
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                : 'bg-emerald-50 dark:bg-[#031812]/50 border-emerald-200 dark:border-[var(--border-subtle)] text-emerald-900 dark:text-[var(--text-secondary)]'
            }`}
          >
            <div className="flex items-center gap-3">
              {isVerified ? (
                <CheckCircle2 className="w-6 h-6 text-[var(--primary-dark)] dark:text-emerald-400 shrink-0" />
              ) : isRejected ? (
                <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
              ) : (
                <Clock className="w-6 h-6 text-[var(--primary-dark)] dark:text-emerald-400 shrink-0" />
              )}
              <div>
                <p className="font-medium text-sm">
                  {isVerified
                    ? 'Payment Verified & Booking Confirmed'
                    : isRejected
                    ? 'Bank Receipt Needs Review'
                    : 'Payment Awaiting Verification'}
                </p>
                <p className="text-xs opacity-80">
                  {isVerified
                    ? `Confirmed by ${booking.verified_by || 'Booking Manager'} on ${new Date(
                        booking.verified_at || booking.created_at
                      ).toLocaleDateString()}`
                    : isRejected
                    ? booking.rejection_reason || 'Payment could not be verified with deposit slip.'
                    : 'Bank transfer receipt uploaded. Verification usually completed in 1-2 hours.'}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0 ${
                isVerified
                  ? 'bg-emerald-200/70 dark:bg-[var(--surface)] text-emerald-900 dark:text-[var(--text)]'
                  : isRejected
                  ? 'bg-rose-200/70 dark:bg-rose-900 text-rose-900 dark:text-rose-100'
                  : 'bg-emerald-200/70 dark:bg-[var(--surface)] text-emerald-900 dark:text-[var(--text)]'
              }`}
            >
              {booking.payment_status}
            </span>
          </div>

          {/* Service Item Summary */}
          <div className="border border-slate-200 dark:border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--background)]/50 dark:bg-[#073126]/40 flex flex-col sm:flex-row gap-4 items-center">
            {booking.item_image && (
              <img
                src={booking.item_image}
                alt={booking.item_title}
                className="w-full sm:w-28 h-24 object-cover rounded-xl shrink-0 border border-slate-200 dark:border-[var(--border-subtle)]"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#031812]/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-[var(--border-subtle)] inline-block mb-1">
                {booking.service_type === 'tour' ? 'Luxury Tour Package' : '5-Star Hotel Stay'}
              </span>
              <h3 className="text-base font-sans font-bold text-[var(--text)] dark:text-white truncate">
                {booking.item_title || 'Premier Experience'}
              </h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-[var(--muted)] dark:text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date: {booking.booking_date}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> Guests: {booking.guest_count} Person(s)
                </span>
              </div>
            </div>
          </div>

          {/* Guest & Financial Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[var(--background)] dark:bg-[#073126]/50 p-4 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] space-y-2">
              <p className="font-semibold text-[var(--text)] dark:text-white border-b border-slate-200 dark:border-[var(--border-subtle)] pb-1.5">Traveler Information</p>
              <p><span className="text-[var(--muted)] dark:text-[var(--muted)]">Name:</span> {booking.user_name || 'Valued Traveler'}</p>
              <p><span className="text-[var(--muted)] dark:text-[var(--muted)]">Email:</span> {booking.user_email || 'guest@example.com'}</p>
              <p><span className="text-[var(--muted)] dark:text-[var(--muted)]">Booking Ref:</span> <code className="font-mono text-[var(--text)] dark:text-[var(--text)]">{booking.id}</code></p>
              {booking.notes && <p><span className="text-[var(--muted)] dark:text-[var(--muted)]">Special Notes:</span> {booking.notes}</p>}
            </div>

            <div className="bg-[var(--background)] dark:bg-[#073126]/50 p-4 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] space-y-2">
              <p className="font-semibold text-[var(--text)] dark:text-white border-b border-slate-200 dark:border-[var(--border-subtle)] pb-1.5">Payment Summary</p>
              <p><span className="text-[var(--muted)] dark:text-[var(--muted)]">Payment Channel:</span> Direct Bank Transfer</p>
              <p><span className="text-[var(--muted)] dark:text-[var(--muted)]">Bank:</span> {BANK_DETAILS.bankName}</p>
              <p><span className="text-[var(--muted)] dark:text-[var(--muted)]">Total Settlement:</span> <strong className="text-[var(--text)] dark:text-white font-bold">{formatPrice(Number(booking.total_amount || booking.total_price || 0))}</strong></p>
              <p><span className="text-[var(--muted)] dark:text-[var(--muted)]">Created:</span> {new Date(booking.created_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Attached Receipt Preview */}
          {booking.payment_receipt_url && (
            <div className="border border-slate-200 dark:border-[var(--border-subtle)] rounded-xl p-4 glass-card">
              <p className="text-xs font-semibold text-[var(--text)] dark:text-[var(--text)] mb-2 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[var(--primary-dark)] dark:text-emerald-400" /> Attached Bank Transfer Slip:
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={booking.payment_receipt_url}
                  alt="Bank Slip"
                  className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-[var(--border-subtle)]"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs text-[var(--muted)] dark:text-[var(--muted)] space-y-1">
                  <p className="font-medium text-[var(--text)] dark:text-[var(--text)]">Stored securely</p>
                  <a
                    href={booking.payment_receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--primary-dark)] dark:text-emerald-400 hover:underline inline-block font-mono text-[11px]"
                  >
                    View Original Full Resolution Slip &rarr;
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-100 dark:bg-[#073126]/60 rounded-xl text-[11px] text-[var(--muted)] dark:text-[var(--muted)] text-center flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Official reservation voucher issued by Premier Tours (SLTDA Certified).
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-[var(--border-subtle)] bg-[var(--background)] dark:bg-[#073126]/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="emerald-btn px-5 py-2 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-sm"
          >
            Close Voucher
          </button>
        </div>
      </div>
    </div>
  );
};
