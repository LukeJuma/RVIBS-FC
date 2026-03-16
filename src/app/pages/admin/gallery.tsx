import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Trash2, Save, X, Upload, ImageIcon } from 'lucide-react';
import Masonry from 'react-responsive-masonry';
import { useDataStore } from '../../hooks/use-data-store';
import { type GalleryImage } from '../../store/data-store';
import { toast } from 'sonner';

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent text-sm";
const labelCls = "block text-gray-700 font-bold mb-1.5 text-sm";

export function AdminGallery() {
  const { store } = useDataStore();
  const gallery = store.getGallery();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({ url: '', title: '', category: 'Match', date: new Date().toISOString().split('T')[0] });
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setFormData(prev => ({ ...prev, url: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addGalleryImage(formData as Omit<GalleryImage, 'id'>)
      .then(() => { toast.success('Image added!'); setIsAdding(false); setFormData({ url: '', title: '', category: 'Match', date: new Date().toISOString().split('T')[0] }); setImagePreview(''); })
      .catch(() => toast.error('Failed to add image'));
  };
  const handleDelete = (id: string) => {
    if (confirm('Delete this image?')) {
      store.deleteGalleryImage(id)
        .then(() => toast.success('Image deleted!'))
        .catch(() => toast.error('Failed to delete image'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/admin" className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Gallery Management</h1>
                <p className="text-sm text-gray-500">Upload and manage photos</p>
              </div>
            </div>
            {!isAdding && (
              <button onClick={() => setIsAdding(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                <Plus className="w-4 h-4" /> Add Image
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isAdding ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-black text-gray-900 mb-6">Add New Image</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelCls}>Image</label>
                <div
                  className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#00529F' }}>
                    <Upload className="w-4 h-4" />
                    {imagePreview ? 'Change image' : 'Upload image'}
                  </div>
                  <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>
              <div><label className={labelCls}>Title</label><input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-5">
                <div><label className={labelCls}>Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className={inputCls}>
                    <option>Match</option><option>Training</option><option>Behind the Scenes</option><option>Fans</option>
                  </select>
                </div>
                <div><label className={labelCls}>Date</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required className={inputCls} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                  <Save className="w-4 h-4" /> Add Image
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <Masonry columnsCount={4} gutter="1rem">
            {gallery.map((image, index) => (
              <motion.div key={image.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.04 }} className="group relative overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <img src={image.url} alt={image.title} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-bold mb-2 truncate">{image.title}</p>
                    <button onClick={() => handleDelete(image.id)} className="w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  );
}
