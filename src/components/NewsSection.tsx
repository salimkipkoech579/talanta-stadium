import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Newspaper, Calendar, ArrowRight, X } from 'lucide-react';

interface NewsSectionProps {
  news: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  return (
    <section id="news" className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600 flex items-center gap-1.5 mb-2">
              <Newspaper className="w-3.5 h-3.5 text-blue-600" />
              Media &amp; Press Bureau
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Latest News &amp; Announcements
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              Official press briefings, tournament technical accreditation, traffic advisories, and stadium operations updates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <article
              key={item.id}
              className="rounded-xl bg-white border border-gray-200 hover:border-blue-400 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-white/95 text-gray-800 border border-gray-200 shadow-xs">
                  {item.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{new Date(item.publishedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-gray-200 p-6 shadow-2xl text-gray-900">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                {selectedArticle.category} · Official Release
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded text-gray-400 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-900 leading-snug">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                By {selectedArticle.authorName} · {new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </p>

              <div className="my-4 aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedArticle.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
