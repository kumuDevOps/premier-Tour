import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import { SEO } from '../components/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-[var(--color-bg-primary)]">
      <SEO
        title="Page Not Found | Premier Tours"
        description="The luxury journey or destination you are seeking could not be found."
      />
      <div className="max-w-lg w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-2xl">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>
        <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-2">Error 404</p>
        <h1 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white mb-4">
          Destination Uncharted
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
          The bespoke experience or page you are looking for has been relocated or does not exist in our luxury portfolio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/tours"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium text-sm transition-all"
          >
            <Search className="w-4 h-4" /> Explore Tours
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
