import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Share2, Tag } from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';

export function NewsArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store } = useDataStore();
  const article = store.getNewsById(id || '');
  const allNews = store.getNews();
  const relatedNews = allNews.filter(n => n.id !== id).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Article Not Found</h2>
          <Link to="/news" className="font-medium hover:opacity-70" style={{ color: '#00529F' }}>
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Back Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate('/news')}
            className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#00529F' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden w-full">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-lg mb-3 text-black" style={{ backgroundColor: '#FEBE10' }}>
              {article.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
              {article.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Meta */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" style={{ color: '#00529F' }} />
              <span>{new Date(article.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" style={{ color: '#00529F' }} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" style={{ color: '#00529F' }} />
              <span>{article.category}</span>
            </div>
            <button
              onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
              className="flex items-center gap-1.5 ml-auto font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#00529F' }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {/* Excerpt */}
            <p className="text-xl text-gray-700 font-medium leading-relaxed mb-8 pb-8 border-b border-gray-200">
              {article.excerpt}
            </p>

            {/* Body */}
            <div className="space-y-5">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 leading-relaxed text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">MORE STORIES</div>
            <h2 className="text-2xl font-black text-gray-900 mb-8">Related News</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/news/${related.id}`}
                    className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-white text-xs font-bold rounded" style={{ backgroundColor: '#00529F' }}>
                          {related.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gray-400 mb-2">
                        {new Date(related.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-800 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
