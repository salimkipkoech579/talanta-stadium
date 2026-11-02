import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Newspaper, Calendar, ArrowRight, X } from 'lucide-react';

interface NewsSectionProps {
  news: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  return (
    <section id="news" className="py-20 bg-[#060908] border-t border-[#1c2c22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059] flex items-center gap-1.5 mb-2">
              <Newspaper className="w-3.5 h-3.5 text-[#E5C378]" />
              Media &amp; Press Bureau
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Latest News &amp; Announcements
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Official press briefings, tournament technical accreditation, traffic advisories, and stadium operations updates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-[#0a100c] border border-[#1e2c24] hover:border-[#C5A059]/40 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a100c] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/80 text-[#E5C378] border border-[#C5A059]/30">
                  {item.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <Calendar className="w-3 h-3 text-[#0FA958]" />
                    <span>{new Date(item.publishedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#E5C378] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1c2c22]">
                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="text-xs font-bold text-[#0FA958] hover:text-[#E5C378] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Read Full Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c120f] border border-[#1e2c24] p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#1c2c22]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                {selectedArticle.category} · Official Release
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-black text-white leading-snug">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                By {selectedArticle.authorName} · {new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </p>

              <div className="my-4 aspect-[16/9] rounded-xl overflow-hidden">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedArticle.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
