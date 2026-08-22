import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost, Tour } from '../types';
import { dataService } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { useCurrency } from '../context/CurrencyContext';
import { SEOHelmet } from '../components/SEOHelmet';
import { SafeImage } from '../components/ui/SafeImage';
import { ArrowLeft, Clock, Tag, Share2, Compass, Sparkles } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { localizeBlogPost, localizeTour } = useLocalizedContent();
  const [rawPost, setPost] = useState<BlogPost | null>(null);
  const [rawRelatedTour, setRelatedTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const post = rawPost ? localizeBlogPost(rawPost) : null;
  const relatedTour = rawRelatedTour ? localizeTour(rawRelatedTour) : null;

  useEffect(() => {
    const loadContent = async () => {
      if (!slug) return;
      setLoading(true);
      const article = await dataService.getBlogPostBySlug(slug);
      setPost(article);

      if (article?.related_tour_id) {
        const tour = await dataService.getTourById(article.related_tour_id);
        setRelatedTour(tour);
      }
      setLoading(false);
    };

    loadContent();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="h-8 bg-slate-200 dark:bg-[var(--surface)] rounded w-1/3 mb-6 animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-[var(--surface)] rounded-2xl mb-6 animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-[var(--surface)] rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 dark:bg-[var(--surface)] rounded w-5/6 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-sans font-bold text-[var(--text)] dark:text-white mb-2">Article Not Found</h2>
        <p className="text-[var(--muted)] dark:text-[var(--muted)] text-sm mb-6">The requested travel guide does not exist or has moved.</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 emerald-btn text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Travel Journal
        </Link>
      </div>
    );
  }

  const blogStructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `https://theluxuryesp.com/blog/${post.slug}`,
      headline: post.title,
      description: post.excerpt,
      image: post.image_url ? [post.image_url] : [],
      datePublished: post.published_at,
      dateModified: post.published_at,
      author: {
        '@type': 'Person',
        name: post.author || 'Premier Tours Editorial Board',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Premier Tours',
        logo: {
          '@type': 'ImageObject',
          url: 'https://theluxuryesp.com/assets/brand/premier-tours-logo.webp',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://theluxuryesp.com/blog/${post.slug}`,
      },
      articleSection: post.category,
      keywords: post.tags?.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://theluxuryesp.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Travel Journal',
          item: 'https://theluxuryesp.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://theluxuryesp.com/blog/${post.slug}`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-20 transition-colors">
      <SEOHelmet
        title={post.title}
        description={post.excerpt}
        image={post.image_url}
        type="article"
        keywords={post.tags?.join(', ') || 'sri lanka travel guide, luxury tour'}
        structuredData={blogStructuredData}
      />

      {/* Top Breadcrumb & Share Bar */}
      <div className="bg-[#061510] text-white border-b border-[var(--border-subtle)] py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link
            to="/blog"
            className="text-xs text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Travel Guides</span>
          </Link>

          <button
            onClick={handleShare}
            className="text-xs text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950/60 rounded-xl border border-[var(--border-subtle)] cursor-pointer shadow-xs transition-all hover:border-emerald-500/50"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Guide'}</span>
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {/* Category & Title */}
        <div className="mb-6">
          <span className="px-3.5 py-1.5 bg-emerald-50 dark:bg-[#031812]/60 text-[#087A5A] dark:text-[#39D39B] rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200/80 dark:border-[var(--border-subtle)] shadow-xs inline-block">
            {post.category}
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-[#10231D] dark:text-white mt-3 leading-tight">
            {post.title}
          </h1>

          {/* Author info & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-emerald-100 dark:border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <SafeImage
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400 dark:border-emerald-600 shadow-sm"
              />
              <div>
                <p className="text-sm font-bold text-[#10231D] dark:text-white">{post.author.name}</p>
                <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)]">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[var(--muted)] dark:text-[var(--muted)] font-mono font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0F9D72] dark:text-[#39D39B]" /> {post.read_time}
              </span>
              <span>•</span>
              <span>Published {post.published_at}</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-[24px] overflow-hidden shadow-md mb-8 bg-emerald-50 dark:bg-[var(--surface)] max-h-[440px] border border-emerald-500/20 dark:border-emerald-500/25">
          <SafeImage src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Markdown-like Content Body */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed space-y-4">
          {(post.content || '').split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={index} className="font-sans font-bold text-xl text-[#10231D] dark:text-white mt-6 mb-2">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('1. ') || trimmed.startsWith('- ')) {
              return (
                <div key={index} className="bg-emerald-50/40 dark:bg-[#073126]/70 p-5 rounded-2xl border border-emerald-200/60 dark:border-[var(--border-subtle)] text-sm my-3 space-y-1.5">
                  {trimmed.split('\n').map((line, liIdx) => (
                    <p key={liIdx} className="leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              );
            }
            return (
              <p key={index} className="text-slate-700 dark:text-[var(--text-secondary)]">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-emerald-100 dark:border-[var(--border-subtle)]">
          <span className="text-xs font-bold text-[#10231D] dark:text-[var(--text-secondary)] uppercase tracking-wider mr-2">Tags:</span>
          {(post.tags || []).map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1 bg-emerald-50/70 dark:bg-[#031812]/60 text-emerald-900 dark:text-[var(--text-secondary)] rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-200/80 dark:border-[var(--border-subtle)] shadow-xs"
            >
              <Tag className="w-3 h-3 text-[#0F9D72] dark:text-[#39D39B]" />
              {tag}
            </span>
          ))}
        </div>

        {/* Related Tour Booking Widget Card */}
        {relatedTour && (
          <div className="mt-12 bg-gradient-to-br from-[#061510] via-[#0D281F] to-[#082017] text-white rounded-[24px] p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Experience This Journey In Real Life
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-white">
                  {relatedTour.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                  {relatedTour.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-emerald-200 font-medium">
                  <span>⏱️ {relatedTour.duration_days} Days / 7 Nights</span>
                  <span>📍 {relatedTour.location.split(',')[0]}</span>
                  <span>⭐ {relatedTour.rating} ({relatedTour.review_count} Reviews)</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-400/20 flex flex-col justify-between">
                <div className="text-xs text-slate-300">From (per guest):</div>
                <div className="text-2xl font-sans font-bold text-white my-1">
                  {formatPrice(relatedTour.price)}
                </div>
                <Link
                  to={`/tours/${relatedTour.id}`}
                  className="mt-3 w-full py-2.5 emerald-btn text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>View Tour Details</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
