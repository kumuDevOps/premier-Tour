import { BANNER_IMAGES, BANNER_LOCAL_FALLBACKS, BANNER_ALT_TEXTS } from "../config/bannerImages";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BlogPost } from '../types';
import { dataService } from '../services/dataService';
import { resolveImageUrl } from '../utils/imageUtils';
import { SafeImage } from "../components/ui/SafeImage";
import { SEOHelmet } from '../components/SEOHelmet';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { PageHero } from "../components/PageHero";
import { SriLankaInteractiveMap } from "../components/SriLankaInteractiveMap";
import {
  Clock, ArrowRight, Search, Sparkles, MapPin, Camera, 
  CloudSun, Wifi, Car, ShieldAlert, BookOpen, X
} from 'lucide-react';

// Custom icons or generic lucide ones for Curated Experiences
const EXPERIENCES = [
  { title: 'Beach Escapes', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop', desc: 'Pristine coastal luxury' },
  { title: 'Hill Country', image: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?q=80&w=600&auto=format&fit=crop', desc: 'Tea estates & misty peaks' },
  { title: 'Wildlife', image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop', desc: 'Leopards & elephants' },
  { title: 'Heritage', image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=600&auto=format&fit=crop', desc: 'Ancient kingdoms' }
];

const TRAVEL_EXTRAS = [
  { title: 'Weather Guide', icon: CloudSun, action: 'CHECK WEATHER', desc: 'Best times to visit different regions.' },
  { title: 'Connectivity', icon: Wifi, action: 'GET A SIM', desc: 'Stay connected throughout your journey.' },
  { title: 'Transportation', icon: Car, action: 'PLAN TRANSPORT', desc: 'Navigating the island in comfort.' },
  { title: 'Travel Safety', icon: ShieldAlert, action: 'TRAVEL SAFELY', desc: 'Essential health & safety tips.' },
  { title: 'Language & Culture', icon: BookOpen, action: 'LEARN BASICS', desc: 'Customs, greetings and etiquette.' }
];

const MAP_DESTINATIONS = ['Colombo', 'Kandy', 'Sigiriya', 'Ella', 'Nuwara Eliya', 'Yala', 'Galle', 'Mirissa', 'Bentota'];

export const BlogPage: React.FC = () => {
  const { t } = useLanguage();
  const { localizeBlogPosts } = useLocalizedContent();
  const [rawPosts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const posts = React.useMemo(() => localizeBlogPosts(rawPosts), [rawPosts, localizeBlogPosts]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const data = await dataService.getBlogPosts();
      setPosts(data);
      setLoading(false);
    };
    loadPosts();
  }, []);

  const categories = ['All', 'Cultural Heritage', 'Wildlife & Safari', 'Luxury Itineraries', 'Culinary & Wellness', 'Destinations', 'Travel Tips'];

  const filteredPosts = posts.filter((post) => {
    if (post.status && post.status !== "published") return false;
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    
    // Match selected destination from map
    const matchesDest = !selectedDestination || (
      post.title.toLowerCase().includes(selectedDestination.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(selectedDestination.toLowerCase()) ||
      (post.content && post.content.toLowerCase().includes(selectedDestination.toLowerCase())) ||
      (Array.isArray(post.tags) && post.tags.some((t) => t.toLowerCase().includes(selectedDestination.toLowerCase())))
    );

    const tags = Array.isArray(post.tags) ? post.tags : [];
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesDest && matchesSearch;
  });

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const trendingPosts = posts.filter(p => p.id !== featuredPost?.id).slice(0, 3);
  
  // For the 'Through the Lens' section - filter by destination if active
  const photoPosts = posts.filter((post) => {
    if (!post.cover_image || (post.status && post.status !== "published")) return false;
    if (!selectedDestination) return true;
    return (
      post.title.toLowerCase().includes(selectedDestination.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(selectedDestination.toLowerCase()) ||
      (Array.isArray(post.tags) && post.tags.some((t) => t.toLowerCase().includes(selectedDestination.toLowerCase())))
    );
  }).slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--text)] dark:text-[var(--text)] pb-0 transition-colors font-sans overflow-hidden">
      <SEOHelmet
        title="Sri Lanka Travel Guide | Premier Tours"
        description="Discover Sri Lanka through our luxury travel journal. Destination guides, cultural insights, wildlife safari tips, and curated itineraries."
        image={BANNER_IMAGES.blog}
        path="/blog"
      />

      {/* Hero Banner */}
      <PageHero
        badge={t('blog_page_hero_badge', 'JOURNAL & TRAVEL INSPIRATION')}
        title={t('blog_page_hero_title', 'Discover Sri Lanka Through Stories')}
        subtitle={t('blog_page_hero_subtitle', 'Travel inspiration, destination guides, cultural insights, wildlife stories, and practical advice for your next Sri Lankan adventure.')}
        bgImage={BANNER_IMAGES.blog}
        fallbackImage={BANNER_LOCAL_FALLBACKS.blog}
        altText={BANNER_ALT_TEXTS.blog}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('journal')?.scrollIntoView({ behavior: 'smooth' })} 
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-emerald-950 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl cursor-pointer"
          >
            {t('blog_read_stories') || 'Read Stories'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/contact')}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-900/60 backdrop-blur-md border border-emerald-400/30 text-white rounded-xl font-bold text-sm hover:bg-emerald-800 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            {t('contact_badge') || 'Plan Your Journey'}
          </motion.button>
        </div>
      </PageHero>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24 sm:space-y-32">
        
        {/* 2. CURATED EXPERIENCES */}
        <section>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200/70 dark:border-[var(--border-subtle)] text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-widest uppercase mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Curated Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#10231D] dark:text-white mb-3">Find Your Sri Lankan Story</h2>
            <p className="text-[var(--muted)] dark:text-[var(--muted)] max-w-xl mx-auto text-sm sm:text-base">Explore Sri Lanka through experiences designed for every kind of traveler.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXPERIENCES.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative h-72 rounded-[24px] overflow-hidden cursor-pointer bg-white dark:bg-[var(--surface)] border border-emerald-500/18 dark:border-emerald-500/25 shadow-md shadow-emerald-900/5 hover:shadow-xl hover:shadow-emerald-500/15 hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300"
              >
                <SafeImage src={exp.image} alt={exp.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061510]/90 via-[#061510]/30 to-transparent"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-white text-xl font-sans font-bold mb-1 group-hover:text-emerald-300 transition-colors">{exp.title}</h3>
                  <p className="text-slate-200 text-xs mb-4 opacity-90 leading-relaxed">{exp.desc}</p>
                  <div className="w-9 h-9 rounded-full bg-white/20 dark:bg-[#031812]/50 backdrop-blur-md border border-white/30 dark:border-emerald-400/30 flex items-center justify-center transform group-hover:translate-x-1.5 group-hover:bg-emerald-500 transition-all">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. EDITOR'S CHOICE (Featured & Trending) */}
        {featuredPost && (
          <section>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
              
              {/* Featured Left */}
              <div className="lg:w-2/3">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-2xl font-sans font-bold text-[#10231D] dark:text-white">Editor's Choice</h2>
                </div>
                
                <Link to={`/blog/${featuredPost.slug}`} className="block group relative rounded-[28px] overflow-hidden bg-white dark:bg-[var(--surface)] border border-emerald-500/20 dark:border-emerald-500/25 shadow-lg shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-500/15 hover:border-emerald-500/45 hover:-translate-y-1.5 transition-all duration-400">
                  <div className="h-64 sm:h-80 md:h-[380px] overflow-hidden relative">
                    <SafeImage src={featuredPost.cover_image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104" />
                    <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#031812]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/30 shadow-xs uppercase tracking-wider">
                      {featuredPost.category}
                    </div>
                  </div>
                  <div className="p-7 sm:p-9 md:p-10">
                    <div className="flex items-center gap-3 text-xs text-[var(--muted)] dark:text-[var(--muted)] mb-3.5">
                      <span className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                        <Clock className="w-3.5 h-3.5" /> {featuredPost.read_time}
                      </span>
                      <span>•</span>
                      <span>{new Date(featuredPost.published_at || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-sans font-bold text-[#10231D] dark:text-white leading-tight mb-4 group-hover:text-[#0F9D72] dark:group-hover:text-[#39D39B] transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-[var(--muted)] dark:text-[var(--muted)] mb-8 line-clamp-2 md:line-clamp-3 leading-relaxed text-sm sm:text-base">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-emerald-100/80 dark:border-[var(--border-subtle)]">
                      <div className="flex items-center gap-3">
                        <SafeImage src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-200 dark:border-[var(--border-subtle)]" />
                        <div>
                          <p className="text-xs font-bold text-[#10231D] dark:text-white">{featuredPost.author.name}</p>
                          <p className="text-[10px] text-[var(--muted)] dark:text-[var(--muted)]">{featuredPost.author.role}</p>
                        </div>
                      </div>
                      <span className="emerald-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                        Read Story <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Trending Right */}
              <div className="lg:w-1/3 flex flex-col">
                <div className="mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-2xl font-sans font-bold text-[#10231D] dark:text-white">Trending Now</h2>
                </div>
                
                <div className="flex flex-col gap-4">
                  {trendingPosts.map((post, idx) => (
                    <Link to={`/blog/${post.slug}`} key={post.id} className="group flex gap-4 items-start bg-white dark:bg-[var(--surface)] p-4 sm:p-5 rounded-[22px] border border-emerald-500/18 dark:border-emerald-500/25 shadow-sm hover:shadow-md hover:shadow-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1">
                      <div className="text-2xl sm:text-3xl font-sans font-bold text-emerald-200 dark:text-emerald-900/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase mb-1 block">{post.category}</span>
                        <h4 className="text-sm font-bold text-[#10231D] dark:text-white mb-2 leading-snug group-hover:text-[#0F9D72] dark:group-hover:text-[#39D39B] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] dark:text-[var(--muted)] font-medium">
                          <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {post.read_time}
                        </div>
                      </div>
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 dark:bg-[var(--surface)]">
                        <SafeImage src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. LATEST FROM THE JOURNAL */}
        <section id="journal">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200/70 dark:border-[var(--border-subtle)] text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-widest uppercase shadow-xs">
                  The Journal
                </span>
                {selectedDestination && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Destination: {selectedDestination}</span>
                    <button
                      onClick={() => setSelectedDestination(null)}
                      title="Clear filter"
                      className="ml-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#10231D] dark:text-white mb-2">Latest Travel Stories</h2>
              <p className="text-[var(--muted)] dark:text-[var(--muted)] text-sm sm:text-base">
                {selectedDestination 
                  ? `Showing curated guides and stories for ${selectedDestination}.`
                  : 'Discover authentic Ceylon guides, cultural insights, and hidden wonders.'}
              </p>
            </div>
            
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search stories, places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-[var(--surface)] border border-emerald-500/20 dark:border-emerald-500/25 text-sm text-[#10231D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 w-full sm:w-72 shadow-xs transition-all"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer shadow-xs border ${
                  selectedCategory === cat
                    ? 'bg-[#0F9D72] text-white border-[#0F9D72] shadow-sm shadow-emerald-500/20'
                    : 'bg-white dark:bg-[var(--surface)] text-[#33453F] dark:text-[var(--text-secondary)] border-emerald-500/18 dark:border-emerald-500/25 hover:border-emerald-500/50 hover:text-[#0F9D72] dark:hover:text-[#39D39B] hover:bg-emerald-50/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid - STRICTLY 3 COLS DESKTOP, 2 COLS TABLET, 1 COL MOBILE */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-[var(--surface)] rounded-[24px] h-[460px] animate-pulse border border-emerald-500/15" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-[var(--surface)] rounded-[24px] p-12 sm:p-16 text-center border border-emerald-500/20 shadow-sm flex flex-col items-center justify-center">
              <BookOpen className="w-12 h-12 text-emerald-400/60 mx-auto mb-4" />
              <h3 className="text-lg font-sans font-bold text-[#10231D] dark:text-white mb-2">
                {selectedDestination 
                  ? (t('map_no_stories') || 'No stories available for this destination yet.')
                  : 'No stories found'}
              </h3>
              <p className="text-[var(--muted)] dark:text-[var(--muted)] text-sm mb-6 max-w-md">
                {selectedDestination
                  ? `We haven't published articles specifically tagged for ${selectedDestination} yet. Check back soon or explore other regions!`
                  : 'Try adjusting your search query or category filter.'}
              </p>
              {selectedDestination && (
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="emerald-btn px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer shadow-md"
                >
                  View All Destination Stories
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, idx) => (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 3) * 0.08 }}
                  key={post.id}
                  className="group package-glow-card flex flex-col h-full overflow-hidden p-3 sm:p-3.5 bg-white dark:bg-[var(--surface)] rounded-[24px] border border-emerald-500/18 dark:border-emerald-500/25 shadow-sm hover:shadow-xl hover:shadow-emerald-500/12 hover:border-emerald-500/45 hover:-translate-y-2 transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] sm:aspect-[4/3] rounded-[18px] overflow-hidden bg-slate-100 dark:bg-[var(--background)]">
                    <SafeImage
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Top-Left Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 dark:bg-[#031812]/90 backdrop-blur-md border border-[var(--border-subtle)] dark:border-emerald-500/20 text-emerald-950 dark:text-emerald-300 font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-xs">
                        {post.category}
                      </span>
                    </div>

                    {/* Top-Right Read Time */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold shadow-xs">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{post.read_time}</span>
                      </div>
                    </div>
                  </Link>

                  <div className="pt-4 px-2 pb-2 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-[11px] text-[var(--muted)] dark:text-[var(--muted)] mb-2 font-medium">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Ceylon Dispatch</span>
                      <span>{new Date(post.published_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <h3 className="font-sans font-bold text-lg sm:text-xl text-[#10231D] dark:text-white line-clamp-2 group-hover:text-[#0F9D72] dark:group-hover:text-[#39D39B] transition-colors mb-2.5 leading-snug">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--muted)] dark:text-[var(--muted)] line-clamp-3 leading-relaxed mb-5 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-3.5 border-t border-emerald-100/80 dark:border-[var(--border-subtle)] mt-auto">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <SafeImage src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover border border-emerald-200 dark:border-[var(--border-subtle)] shrink-0" />
                        <span className="text-xs font-bold text-[#10231D] dark:text-[var(--text)] truncate">{post.author.name}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`} className="btn-circle-cta !w-9 !h-9 text-xs" aria-label={`Read story: ${post.title}`}>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* 5. EXPLORE SRI LANKA MAP */}
        <SriLankaInteractiveMap
          selectedDestination={selectedDestination}
          onSelectDestination={(dest) => setSelectedDestination(dest)}
        />

        {/* 6. THROUGH THE LENS */}
        {photoPosts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200/60 dark:border-[var(--border-subtle)] flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#10231D] dark:text-white">Through the Lens</h2>
                <p className="text-sm text-[var(--muted)] dark:text-[var(--muted)] mt-0.5">See Sri Lanka through the eyes of our discerning travelers.</p>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x snap-mandatory no-scrollbar">
              {photoPosts.map((post, idx) => (
                <div key={post.id} className={`snap-center shrink-0 w-[280px] sm:w-[320px] rounded-[24px] overflow-hidden relative group bg-white dark:bg-[var(--surface)] border border-emerald-500/18 dark:border-emerald-500/25 shadow-md hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 ${idx % 2 === 0 ? 'h-[380px]' : 'h-[340px] mt-[40px]'}`}>
                  <SafeImage src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-white text-sm font-sans font-bold leading-tight mb-1.5">{post.title}</p>
                    <span className="text-emerald-300 text-xs flex items-center gap-1 font-semibold"><MapPin className="w-3 h-3 text-emerald-400" /> Ceylon Heritage</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. TRAVEL EXTRAS */}
        <section>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200/70 dark:border-[var(--border-subtle)] text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-widest uppercase mb-2 shadow-xs">
              Essential Tools
            </span>
            <h2 className="text-3xl font-sans font-bold text-[#10231D] dark:text-white mb-2">Travel Extras</h2>
            <p className="text-[var(--muted)] dark:text-[var(--muted)] text-sm sm:text-base">Everything you need to travel seamlessly through Sri Lanka.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {TRAVEL_EXTRAS.map((extra, idx) => (
              <div key={idx} className="bg-white dark:bg-[var(--surface)] p-6 rounded-[24px] border border-emerald-500/18 dark:border-emerald-500/25 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-[#031812]/50 border border-emerald-200/60 dark:border-[var(--border-subtle)] flex items-center justify-center mb-4 group-hover:bg-[#0F9D72] group-hover:border-[#0F9D72] transition-all">
                  <extra.icon className="w-6 h-6 text-emerald-700 dark:text-emerald-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-sans font-bold text-[#10231D] dark:text-white mb-1.5">{extra.title}</h3>
                <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] mb-6 flex-1 leading-relaxed">{extra.desc}</p>
                <button className="text-[11px] font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">
                  {extra.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 8. WHERE TO NEXT (Newsletter) */}
        <section className="bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 dark:from-[#0D281F] dark:to-[#061510] rounded-[32px] border border-emerald-500/20 dark:border-emerald-500/25 p-8 sm:p-12 md:p-16 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 dark:opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4">
             <div className="w-96 h-96 rounded-full border-[40px] border-[#0F9D72]"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-[#031812]/60 border border-emerald-300/60 dark:border-[var(--border-subtle)] text-emerald-900 dark:text-emerald-300 text-xs font-bold tracking-widest uppercase mb-4 shadow-xs">
                Private Journal Dispatch
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#10231D] dark:text-white mb-4 leading-tight">Where To Next?</h2>
              <p className="text-[var(--muted)] dark:text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
                Receive newly published Ceylon dispatches, seasonal wildlife calendars, and exclusive VIP itinerary invitations straight to your inbox.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[var(--background)] p-6 sm:p-8 rounded-[24px] shadow-lg shadow-emerald-900/5 border border-emerald-500/20 dark:border-emerald-500/25">
              <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to newsletter successfully!'); }}>
                <div>
                  <label className="block text-xs font-bold text-[#10231D] dark:text-[var(--text)] mb-2 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter your private email" 
                    className="w-full luxury-input px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <button type="submit" className="w-full emerald-btn py-3.5 text-sm font-bold shadow-lg cursor-pointer">
                  Subscribe to Journal
                </button>
                <p className="text-[10px] text-center text-[var(--muted)] dark:text-[var(--muted)] mt-1">
                  We respect your privacy. Strictly curated Ceylon dispatches without marketing clutter.
                </p>
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
