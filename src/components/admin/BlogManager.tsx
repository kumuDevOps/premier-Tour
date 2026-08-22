import React, { useState, useEffect } from 'react';
import { dataService } from '../../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { BlogPost } from '../../types';
import { BlogFormModal } from './BlogFormModal';

export const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await dataService.getBlogPosts();
      if (data) setPosts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    const handleUpdate = () => fetchPosts();
    window.addEventListener('blog_posts-updated', handleUpdate);
    return () => window.removeEventListener('blog_posts-updated', handleUpdate);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this article?')) {
      await dataService.deleteBlogPost(id);
      fetchPosts();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--text)] dark:text-white">Blog & Editorial Journal</h2>
          <p className="text-sm text-[var(--muted)]">Manage travel guides, island highlights, and story posts</p>
        </div>
        <button
          onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="glass-card border border-slate-200 dark:border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-[var(--muted)]">Loading articles...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-bold text-[var(--text)] dark:text-white mb-2">No Articles Found</h3>
            <p className="text-sm text-[var(--muted)] mb-4">Your editorial journal is currently empty.</p>
            <button
              onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-sm font-bold"
            >
              + New Article
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--background)] dark:bg-[#073126]/50 text-[var(--muted)] dark:text-[var(--muted)] text-xs uppercase tracking-wider border-b border-slate-200 dark:border-[var(--border-subtle)]">
                  <th className="p-4 font-semibold">Article</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Read Time</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {posts.map(post => {
                  const title = post.title || 'Untitled Story';
                  const author = typeof post.author === 'string' ? post.author : post.author?.name || 'Serendib Editorial';
                  const img = post.cover_image || post.image_url || 'https://images.unsplash.com/photo-1546708973-b339540b5162';
                  const time = post.read_time || `${post.read_time_min || 5} min read`;

                  return (
                    <tr key={post.id} className="hover:bg-[var(--background)] dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                          <div>
                            <p className="font-bold text-sm text-[var(--text)] dark:text-white line-clamp-1">{title}</p>
                            <p className="text-[10px] text-[var(--muted)] truncate max-w-[200px]">By {author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[var(--muted)] dark:text-[var(--text-secondary)]">
                        <span className="bg-emerald-50 dark:bg-[#073126]/30 text-[var(--primary-dark)] dark:text-emerald-400 px-2 py-1 rounded text-xs font-semibold">{post.category || 'Travel Guide'}</span>
                      </td>
                      <td className="p-4 text-sm text-[var(--muted)] dark:text-[var(--text-secondary)]">{time}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setEditingPost(post); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-[var(--primary)] transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(post.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <BlogFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={() => { setIsModalOpen(false); fetchPosts(); }} post={editingPost} />
    </div>
  );
};
