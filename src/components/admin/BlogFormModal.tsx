import React, { useState, useEffect } from 'react';
import { dataService } from '../../lib/supabase';
import { X, Save, Trash2 } from 'lucide-react';
import { BlogPost } from '../../types';
import { ImageUploadField } from './ImageUploadField';

interface BlogFormModalProps {
  post?: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const BlogFormModal: React.FC<BlogFormModalProps> = ({ post, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: 'Destinations',
    excerpt: '',
    content: '',
    published_at: new Date().toISOString().split('T')[0],
    read_time: '5 min read',
    read_time_min: 5,
    cover_image: '',
    image_url: '',
    tags: ['Sri Lanka', 'Travel Guide'],
    status: 'published',
    featured: false,
    author: {
      name: 'Premier Tours Editorial Concierge',
      role: 'Chief Curator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setFormData(post);
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'Destinations',
        excerpt: '',
        content: '',
        published_at: new Date().toISOString().split('T')[0],
        read_time: '5 min read',
        read_time_min: 5,
        cover_image: '',
        image_url: '',
        tags: ['Sri Lanka', 'Travel Guide'],
        status: 'published',
        featured: false,
        author: {
          name: 'Premier Tours Editorial Concierge',
          role: 'Chief Curator',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
        },
      });
    }
    setError('');
  }, [post, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dataService.saveBlogPost({
        ...formData,
        image_url: formData.cover_image || formData.image_url,
        cover_image: formData.cover_image || formData.image_url,
      });
      onSave();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[var(--background)] w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 dark:border-[var(--border-subtle)]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[var(--border-subtle)] bg-white/90 dark:bg-[#031812]/90 backdrop-blur-md rounded-t-3xl">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)] dark:text-white">
              {post ? 'Edit Article' : 'Create New Article'}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Publish insights, curated itineraries, and travel stories</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
          
          <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-2">Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 10 Secret Waterfalls in Ella"
                  value={formData.title || ''}
                  onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
                  className="w-full p-3 rounded-xl border-none bg-slate-50 dark:bg-[var(--surface)] text-sm focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-2">Category</label>
                <input
                  required
                  type="text"
                  value={formData.category || ''}
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                  className="w-full p-3 rounded-xl border-none bg-slate-50 dark:bg-[var(--surface)] text-sm focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)] dark:text-white"
                  placeholder="e.g. Travel Guide / Heritage / Wildlife"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-2">Author Name</label>
                <input
                  type="text"
                  value={typeof formData.author === 'string' ? formData.author : (formData.author?.name || 'Premier Tours Editorial Concierge')}
                  onChange={e => setFormData({
                    ...formData,
                    author: {
                      name: e.target.value,
                      role: typeof formData.author === 'object' ? formData.author?.role : 'Curator',
                      avatar: typeof formData.author === 'object' ? formData.author?.avatar : ''
                    }
                  })}
                  className="w-full p-3 rounded-xl border-none bg-slate-50 dark:bg-[var(--surface)] text-sm focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)] dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-2">Read Time</label>
                <input
                  type="text"
                  value={formData.read_time || '5 min read'}
                  onChange={e => setFormData({...formData, read_time: e.target.value})}
                  className="w-full p-3 rounded-xl border-none bg-slate-50 dark:bg-[var(--surface)] text-sm focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)] dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-2">Cover Image</label>
                <div className="space-y-3">
                  {formData.cover_image || formData.image_url ? (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-[var(--border-subtle)] group">
                      <img src={formData.cover_image || formData.image_url} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, cover_image: '', image_url: '' })}
                          className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-600 shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" /> Replace Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ImageUploadField
                      bucket="blog-images"
                      folder="articles"
                      onUploadSuccess={(url) => setFormData({ ...formData, cover_image: url, image_url: url })}
                      onError={() => {}}
                    />
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-2">Summary / Excerpt</label>
                <textarea
                  required
                  rows={2}
                  placeholder="A short engaging teaser for article cards..."
                  value={formData.excerpt || ''}
                  onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full p-3 rounded-xl border-none bg-slate-50 dark:bg-[var(--surface)] text-sm focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)] dark:text-white resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-2">Full Article Body (Markdown supported)</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write the full story and travel insights..."
                  value={formData.content || ''}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full p-3 rounded-xl border-none bg-slate-50 dark:bg-[var(--surface)] text-sm focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)] dark:text-white font-mono resize-y"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-[var(--border-subtle)] flex justify-end gap-3 bg-slate-50 dark:bg-[#073126]/50 rounded-b-3xl">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-[var(--muted)] hover:text-[var(--text)] transition-colors">
            Cancel
          </button>
          <button type="submit" form="blog-form" disabled={loading} className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
            <Save className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Save Article'}
          </button>
        </div>
      </div>
    </div>
  );
};
