import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, ImageIcon } from 'lucide-react';
import { useDataStore } from '../../hooks/use-data-store';
import { type NewsArticle } from '../../store/data-store';
import { toast } from 'sonner';

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent text-sm";
const labelCls = "block text-gray-700 font-bold mb-1.5 text-sm";

export function AdminNews() {
  const { store } = useDataStore();
  const news = store.getNews();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NewsArticle>>({ title: '', excerpt: '', content: '', category: 'Club News', image: '', date: new Date().toISOString().split('T')[0], author: 'Sports Desk', featured: false });
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setFormData(prev => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      store.updateNews(editingId, formData as NewsArticle)
        .then(() => { toast.success('Article updated!'); setEditingId(null); setIsAdding(false); resetForm(); })
        .catch(() => toast.error('Failed to update article'));
    } else {
      store.addNews(formData as Omit<NewsArticle, 'id'>)
        .then(() => { toast.success('Article published!'); setIsAdding(false); resetForm(); })
        .catch(() => toast.error('Failed to publish article'));
    }
  };
  const handleEdit = (a: NewsArticle) => { setFormData(a); setEditingId(a.id); setIsAdding(true); setImagePreview(a.image || ''); };
  const handleDelete = (id: string) => {
    if (confirm('Delete this article?')) {
      store.deleteNews(id)
        .then(() => toast.success('Article deleted!'))
        .catch(() => toast.error('Failed to delete article'));
    }
  };
  const resetForm = () => { setFormData({ title: '', excerpt: '', content: '', category: 'Club News', image: '', date: new Date().toISOString().split('T')[0], author: 'Sports Desk', featured: false }); setImagePreview(''); };
  const handleCancel = () => { setIsAdding(false); setEditingId(null); resetForm(); };

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
                <h1 className="text-2xl font-black text-gray-900">News Management</h1>
                <p className="text-sm text-gray-500">Create and manage news articles</p>
              </div>
            </div>
            {!isAdding && (
              <button onClick={() => setIsAdding(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                <Plus className="w-4 h-4" /> Add Article
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isAdding ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Article' : 'Create New Article'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className={labelCls}>Title</label><input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className={inputCls} /></div>
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className={inputCls}>
                    <option>Match Report</option><option>Transfer News</option><option>Player Interview</option><option>Club News</option>
                  </select>
                </div>
                <div><label className={labelCls}>Author</label><input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} required className={inputCls} /></div>
                <div><label className={labelCls}>Date</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required className={inputCls} /></div>
                <div>
                  <label className={labelCls}>Article Image</label>
                  <div
                    className="flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#00529F' }}>
                        <Upload className="w-4 h-4" />
                        {imagePreview ? 'Change image' : 'Upload image'}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded" />
                Feature this article
              </label>
              <div><label className={labelCls}>Excerpt</label><textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} required rows={3} className={inputCls} /></div>
              <div><label className={labelCls}>Content</label><textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required rows={12} className={inputCls} /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                  <Save className="w-4 h-4" />{editingId ? 'Update Article' : 'Publish Article'}
                </button>
                <button type="button" onClick={handleCancel} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((article, index) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="relative h-44">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-white text-xs font-bold rounded-lg" style={{ backgroundColor: '#00529F' }}>{article.category}</span>
                  </div>
                  {article.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 text-black text-xs font-bold rounded-lg" style={{ backgroundColor: '#FEBE10' }}>FEATURED</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-black text-gray-900 mb-1.5 line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(article)} className="flex-1 px-3 py-2 rounded-lg font-bold text-xs text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-all" style={{ backgroundColor: '#00529F' }}>
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(article.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}