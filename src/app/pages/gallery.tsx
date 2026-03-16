import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
// @ts-ignore — no types for react-responsive-masonry
import Masonry from 'react-responsive-masonry';
import { useDataStore } from '../hooks/use-data-store';

export function Gallery() {
  const { store } = useDataStore();
  const allImages = store.getGallery();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const categories = ['All', ...Array.from(new Set(allImages.map(img => img.category)))];
  const filteredImages = selectedCategory === 'All' ? allImages : allImages.filter(img => img.category === selectedCategory);

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
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">Gallery</h1>
            <p className="text-white/70 text-lg">Moments that define our journey</p>
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
                  selectedCategory === category ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedCategory === category ? { background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredImages.length > 0 ? (
            <Masonry columnsCount={3} gutter="1.5rem">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedImage(image)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <img src={image.url} alt={image.title} className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-xs font-bold mb-1 tracking-wider uppercase" style={{ color: '#FEBE10' }}>{image.category}</div>
                      <h3 className="text-white text-sm font-bold">{image.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Masonry>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-5xl w-full"
            >
              <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-auto rounded-2xl" loading="lazy" />
              <div className="mt-4 text-center">
                <div className="text-xs font-bold mb-1 tracking-wider uppercase" style={{ color: '#FEBE10' }}>{selectedImage.category}</div>
                <h3 className="text-white text-xl font-bold">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
