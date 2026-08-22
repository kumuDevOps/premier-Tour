import React, { useState, useEffect } from 'react';
import { dataService } from '../../lib/supabase';
import { Inbox, Mail, Phone, Calendar, CheckCircle2, Clock, Trash2, Search, Send, X, MessageSquare, AlertCircle } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
  created_at: string;
  service_interest?: any;
}

export const InboxManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'Unread' | 'In Progress' | 'Replied' | 'Resolved'>('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await dataService.getInquiries();
      setInquiries(data || []);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    const handleUpdate = () => fetchInquiries();
    window.addEventListener('inquiries-updated', handleUpdate);
    return () => window.removeEventListener('inquiries-updated', handleUpdate);
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await dataService.updateInquiryStatus(id, newStatus);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await dataService.deleteInquiry(id);
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;

    setSendingReply(true);
    // Simulate sending dispatch email and update status to Replied
    setTimeout(async () => {
      await handleStatusChange(selectedInquiry.id, 'Replied');
      setSendingReply(false);
      setReplySuccess(true);
      setTimeout(() => {
        setReplySuccess(false);
        setReplyText('');
      }, 2500);
    }, 600);
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesFilter = filter === 'ALL' || (inq.status || 'Unread') === filter;
    const matchesSearch = 
      inq.name?.toLowerCase().includes(search.toLowerCase()) ||
      inq.email?.toLowerCase().includes(search.toLowerCase()) ||
      inq.subject?.toLowerCase().includes(search.toLowerCase()) ||
      inq.message?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10231D] dark:text-white">
            Inbox & Concierge Inquiries
          </h1>
          <p className="text-sm text-[#71817B] dark:text-[#8FA9A0]">
            Review custom itinerary inquiries, private charter dispatches, and traveler requests.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[var(--surface)] p-4 rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] shadow-xs">
          <span className="text-xs font-bold text-[#71817B] dark:text-[#8FA9A0] uppercase">Total Inquiries</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-[#10231D] dark:text-white">{inquiries.length}</span>
            <Inbox className="w-5 h-5 text-[#0F9D72]" />
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-xs">
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">Unread</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {inquiries.filter(i => !i.status || i.status === 'Unread').length}
            </span>
            <Mail className="w-5 h-5 text-rose-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-xs">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">In Progress</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400">
              {inquiries.filter(i => i.status === 'In Progress').length}
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-4 rounded-2xl border border-emerald-200 dark:border-[var(--border-subtle)] shadow-xs">
          <span className="text-xs font-bold text-[#0F9D72] dark:text-[#39D39B] uppercase">Resolved / Replied</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-[#0F9D72] dark:text-[#39D39B]">
              {inquiries.filter(i => i.status === 'Resolved' || i.status === 'Replied').length}
            </span>
            <CheckCircle2 className="w-5 h-5 text-[#0F9D72]" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {(['ALL', 'Unread', 'In Progress', 'Replied', 'Resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filter === tab
                  ? 'bg-[#0F9D72] text-white'
                  : 'bg-white dark:bg-[var(--surface)] text-[#71817B] dark:text-[#8FA9A0] hover:bg-[#F2F8F5] dark:hover:bg-[#13372B]/50 border border-[#DDEBE5] dark:border-[var(--border-subtle)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#71817B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[var(--surface)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-xl py-2 pl-9 pr-3 text-xs text-[#10231D] dark:text-white focus:outline-none focus:border-[#0F9D72]"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#71817B]">Loading inquiries...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-[#71817B] flex flex-col items-center">
            <Inbox className="w-10 h-10 mb-2 opacity-40 text-[#0F9D72]" />
            <p className="font-bold text-sm text-[#10231D] dark:text-white">No inquiries found</p>
            <p className="text-xs text-[#71817B] dark:text-[#8FA9A0] mt-1">There are no messages matching your search or filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#DDEBE5] dark:divide-[rgba(73,201,151,0.1)]">
            {filteredInquiries.map((inq) => {
              const currentStatus = inq.status || 'Unread';
              return (
                <div
                  key={inq.id}
                  onClick={() => {
                    setSelectedInquiry(inq);
                    if (currentStatus === 'Unread') {
                      handleStatusChange(inq.id, 'In Progress');
                    }
                  }}
                  className="p-4 sm:p-5 hover:bg-[#F2F8F5]/60 dark:hover:bg-[#13372B]/30 cursor-pointer transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      currentStatus === 'Unread'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        : 'bg-emerald-100 dark:bg-[var(--background)] text-[#0F9D72] dark:text-[#39D39B]'
                    }`}>
                      {inq.name ? inq.name.charAt(0).toUpperCase() : 'M'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#10231D] dark:text-white truncate">
                          {inq.name}
                        </span>
                        <span className="text-xs text-[#71817B] dark:text-[#8FA9A0]">
                          &lt;{inq.email}&gt;
                        </span>
                        {inq.phone && (
                          <span className="text-xs text-[#71817B] dark:text-[#8FA9A0] flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {inq.phone}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-xs text-[#10231D] dark:text-white mt-0.5 truncate">
                        {inq.subject}
                      </p>
                      <p className="text-xs text-[#71817B] dark:text-[#8FA9A0] line-clamp-1 mt-0.5">
                        {inq.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      currentStatus === 'Unread'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        : currentStatus === 'In Progress'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-[var(--background)] text-[#0F9D72] dark:text-[#39D39B]'
                    }`}>
                      {currentStatus}
                    </span>

                    <span className="text-[11px] text-[#71817B] dark:text-[#8FA9A0]">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(inq.id);
                      }}
                      className="p-1.5 text-[#71817B] hover:text-rose-600 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inquiry Detail & Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[var(--surface)] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)]">
            <div className="p-6 border-b border-[#DDEBE5] dark:border-[var(--border-subtle)] flex justify-between items-start shrink-0">
              <div>
                <span className="text-xs font-bold text-[#0F9D72] dark:text-[#39D39B] uppercase">Inquiry Details</span>
                <h2 className="text-xl font-bold text-[#10231D] dark:text-white mt-1">
                  {selectedInquiry.subject}
                </h2>
                <p className="text-xs text-[#71817B] dark:text-[#8FA9A0] mt-0.5">
                  From {selectedInquiry.name} ({selectedInquiry.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-[#13372B] rounded-full text-[#71817B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Sender info bar */}
              <div className="bg-[#F8FCFA] dark:bg-[var(--surface)] p-4 rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] flex flex-wrap gap-4 items-center justify-between text-xs">
                <div>
                  <span className="text-[#71817B] dark:text-[#8FA9A0] block">Received:</span>
                  <span className="font-bold text-[#10231D] dark:text-white">
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </span>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <span className="text-[#71817B] dark:text-[#8FA9A0] block">Phone:</span>
                    <span className="font-bold text-[#10231D] dark:text-white">{selectedInquiry.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-[#71817B] dark:text-[#8FA9A0] block">Current Status:</span>
                  <select
                    value={selectedInquiry.status || 'Unread'}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                    className="mt-1 font-bold text-xs bg-white dark:bg-[var(--surface)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-lg px-2.5 py-1 text-[#10231D] dark:text-white focus:outline-none"
                  >
                    <option value="Unread">Unread</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Replied">Replied</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="text-xs font-bold text-[#71817B] dark:text-[#8FA9A0] uppercase mb-1.5 block">
                  Traveler Message
                </label>
                <div className="bg-[#F8FCFA] dark:bg-[var(--surface)] p-4 rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] text-sm text-[#10231D] dark:text-white whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Quick Reply Form */}
              <div>
                <label className="text-xs font-bold text-[#71817B] dark:text-[#8FA9A0] uppercase mb-1.5 block">
                  Compose Dispatch Reply
                </label>
                {replySuccess && (
                  <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-[#0F9D72]" /> Reply dispatched to traveler email address!
                  </div>
                )}
                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Dear ${selectedInquiry.name},\nThank you for reaching out to Ceylon Premier Concierge...`}
                    className="w-full p-3 bg-white dark:bg-[var(--surface)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-2xl text-xs text-[#10231D] dark:text-white focus:outline-none focus:border-[#0F9D72]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="px-5 py-2.5 bg-[#0F9D72] hover:bg-[#0B7D5A] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      {sendingReply ? 'Sending...' : 'Send Email Reply'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-4 border-t border-[#DDEBE5] dark:border-[var(--border-subtle)] flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={() => handleDelete(selectedInquiry.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Message
              </button>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2 text-xs font-bold text-[#71817B] hover:bg-slate-100 dark:hover:bg-[#13372B] rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

