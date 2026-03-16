import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';

export function News() {
  const { store } = useDataStore();
  const allNews = store.getNews();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Match Report', 'Transfer News', 'Player Interview', 'Club News'];
  const filteredNews = selectedCategory === 'All' ? allNews : allNews.filter(n => n.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Page Header */}
      <section className="relative py-16 overflow-hidden" >
        <div className="absolute inset-0">
          <img src="/src/images/team-photo.jpg" alt="" className="w-full h-full object-cover object-top" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,82,159,0.88) 0%, rgba(0,40,80,0.92) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs text-white/60 uppercase tracking-wider mb-2">RVIBS FC</div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">News & Media</h1>
            <p className="text-white/70 text-lg">Latest stories, interviews, and updates</p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white sticky top-20 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${
                  selectedCategory === category
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedCategory === category ? { background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/news/${article.id}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 h-full"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-white text-xs font-bold tracking-wider rounded-lg" style={{ backgroundColor: '#00529F' }}>
                          {article.category}
                        </span>
                      </div>
                      {article.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 text-black text-xs font-bold tracking-wider rounded-lg" style={{ backgroundColor: '#FEBE10' }}>
                            FEATURED
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center gap-2 font-medium text-sm" style={{ color: '#00529F' }}>
                        Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No news articles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
