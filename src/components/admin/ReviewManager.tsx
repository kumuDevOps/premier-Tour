import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, dataService } from '../../lib/supabase';
import { 
  Star, CheckCircle2, XCircle, Clock, Trash2, 
  MessageSquare, User, Filter, AlertCircle, Edit
} from 'lucide-react';
import { Review } from '../../types';

export const ReviewManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [editModalReview, setEditModalReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', rating: 5, user_name: '' });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await dataService.getReviews('admin');
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (reviewId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    try {
      await dataService.updateReviewStatus(reviewId, status, reason);
      setRejectionModalId(null);
      setRejectionReason('');
      await fetchReviews();
    } catch (err) {
      console.error('Failed to moderate review:', err);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) return;
    try {
      await dataService.deleteReview(reviewId);
      await fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalReview) return;
    try {
      await dataService.updateReview(editModalReview.id, {
        title: editForm.title,
        content: editForm.content,
        rating: editForm.rating,
        user_name: editForm.user_name
      });
      setEditModalReview(null);
      await fetchReviews();
    } catch (err) {
      console.error('Failed to update review:', err);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10231D] dark:text-white">
            Customer Reviews & Moderation
          </h1>
          <p className="text-sm text-[#71817B] dark:text-[#8FA9A0]">
            Audit, approve, or reject verified client trip testimonials.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              statusFilter === tab
                ? 'bg-[#0F9D72] text-white'
                : 'bg-white dark:bg-[var(--surface)] text-[#33453F] dark:text-[#C8DDD5] border border-[#DDEBE5] dark:border-[var(--border-subtle)] hover:bg-[#F2F8F5]'
            }`}
          >
            {tab} {tab === 'PENDING' && reviews.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                {reviews.filter(r => r.status === 'PENDING').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-[#71817B] dark:text-[#8FA9A0]">
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] p-12 text-center">
            <MessageSquare className="w-10 h-10 text-[#71817B] mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-[#10231D] dark:text-white mb-1">No reviews found</h3>
            <p className="text-xs text-[#71817B] dark:text-[#8FA9A0]">No reviews match the selected filter.</p>
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-[#DDEBE5] dark:border-[var(--border-subtle)] p-5 shadow-xs flex flex-col sm:flex-row justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= r.rating ? 'fill-amber-400' : 'fill-slate-200 dark:fill-[#104D39] text-slate-200 dark:text-[#104D39]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#10231D] dark:text-white">{r.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    r.status === 'APPROVED' ? 'bg-emerald-100 text-[#0F9D72] dark:bg-[var(--background)] dark:text-[#39D39B]' :
                    r.status === 'REJECTED' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  }`}>
                    {r.status}
                  </span>
                  {r.verified_purchase ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Unverified Purchase
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#33453F] dark:text-[#C8DDD5] leading-relaxed">
                  "{r.content}"
                </p>

                {r.images && r.images.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {r.images.map((img, idx) => (
                      <a key={idx} href={img} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg overflow-hidden border border-[#DDEBE5] dark:border-[var(--border-subtle)]">
                        <img src={img} alt={`Review photo ${idx}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-[#71817B] dark:text-[#8FA9A0] flex flex-wrap items-center gap-2 mt-2">
                                    <span className="font-semibold">{r.user_name || 'Traveler'}</span>
                  {r.user_location && (
                    <>
                      <span>•</span>
                      <span>{r.user_location}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{r.service_name}</span>
                  <span>•</span>
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>

                {r.rejection_reason && (
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-200 dark:border-rose-900/40">
                    <strong>Rejection reason:</strong> {r.rejection_reason}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center justify-end sm:justify-center gap-2 shrink-0">
                {r.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleUpdateStatus(r.id, 'APPROVED')}
                    className="px-3 py-1.5 rounded-xl bg-[#0F9D72] hover:bg-[#087A5A] text-white text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                )}

                {r.status !== 'REJECTED' && (
                  <button
                    onClick={() => setRejectionModalId(r.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                )}

                <button
                  onClick={() => {
                    setEditModalReview(r);
                    setEditForm({
                      title: r.title,
                      content: r.content,
                      rating: r.rating,
                      user_name: r.user_name || ''
                    });
                  }}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                  title="Edit review"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[var(--surface)] rounded-2xl p-6 max-w-md w-full border border-[#DDEBE5] dark:border-[var(--border-subtle)] shadow-xl">
            <h3 className="text-base font-bold text-[#10231D] dark:text-white mb-2">
              Reject Customer Review
            </h3>
            <p className="text-xs text-[#71817B] dark:text-[#8FA9A0] mb-4">
              Please provide feedback explaining why this review was not approved for publication.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Inappropriate language, off-topic, or unverified order..."
              rows={3}
              className="w-full bg-[#F2F8F5] dark:bg-[var(--surface)] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[#10231D] dark:text-white focus:outline-none focus:border-[#0F9D72] mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => { setRejectionModalId(null); setRejectionReason(''); }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#71817B] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(rejectionModalId, 'REJECTED', rejectionReason || 'Does not meet guidelines')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editModalReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[var(--surface)] rounded-2xl p-6 max-w-md w-full border border-[#DDEBE5] dark:border-[var(--border-subtle)] shadow-xl">
            <h3 className="text-base font-bold text-[#10231D] dark:text-white mb-4">
              Edit Review
            </h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#33453F] dark:text-[#C8DDD5] mb-1">Traveler Name</label>
                <input
                  type="text"
                  value={editForm.user_name}
                  onChange={(e) => setEditForm({...editForm, user_name: e.target.value})}
                  className="w-full bg-[#F2F8F5] dark:bg-[#031812] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[#10231D] dark:text-white focus:outline-none focus:border-[#0F9D72]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33453F] dark:text-[#C8DDD5] mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditForm({...editForm, rating: star})}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`w-5 h-5 ${star <= editForm.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 dark:fill-[#104D39] text-slate-200 dark:text-[#104D39]'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33453F] dark:text-[#C8DDD5] mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-[#F2F8F5] dark:bg-[#031812] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[#10231D] dark:text-white focus:outline-none focus:border-[#0F9D72]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33453F] dark:text-[#C8DDD5] mb-1">Review Content</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  rows={4}
                  className="w-full bg-[#F2F8F5] dark:bg-[#031812] border border-[#DDEBE5] dark:border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[#10231D] dark:text-white focus:outline-none focus:border-[#0F9D72] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalReview(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#71817B] hover:bg-slate-100 dark:hover:bg-[var(--surface-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F9D72] hover:bg-[#087A5A] text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
