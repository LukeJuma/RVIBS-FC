import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, User } from 'lucide-react';
import { useDataStore } from '../../hooks/use-data-store';
import { type Player } from '../../store/data-store';
import { toast } from 'sonner';

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent text-sm";
const labelCls = "block text-gray-700 font-bold mb-1.5 text-sm";

export function AdminPlayers() {
  const { store } = useDataStore();
  const players = store.getPlayers().filter(p => p.position !== 'Staff');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Player>>({ name: '', position: 'Forward', number: 0, photo: '', nationality: 'Kenya', appearances: 0, goals: 0, assists: 0, biography: '', role: '' });
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
      setFormData(prev => ({ ...prev, photo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      store.updatePlayer(editingId, formData as Player)
        .then(() => { toast.success('Player updated!'); setEditingId(null); setIsAdding(false); resetForm(); })
        .catch(() => toast.error('Failed to update player'));
    } else {
      store.addPlayer(formData as Omit<Player, 'id'>)
        .then(() => { toast.success('Player added!'); setIsAdding(false); resetForm(); })
        .catch(() => toast.error('Failed to add player'));
    }
  };
  const handleEdit = (p: Player) => { setFormData(p); setEditingId(p.id); setIsAdding(true); setPhotoPreview(p.photo || ''); };
  const handleDelete = (id: string) => {
    if (confirm('Delete this player?')) {
      store.deletePlayer(id)
        .then(() => toast.success('Player deleted!'))
        .catch(() => toast.error('Failed to delete player'));
    }
  };
  const resetForm = () => { setFormData({ name: '', position: 'Forward', number: 0, photo: '', nationality: 'Kenya', appearances: 0, goals: 0, assists: 0, biography: '', role: '' }); setPhotoPreview(''); };
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
                <h1 className="text-2xl font-black text-gray-900">Player Management</h1>
                <p className="text-sm text-gray-500">Manage squad members and statistics</p>
              </div>
            </div>
            {!isAdding && (
              <button onClick={() => setIsAdding(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                <Plus className="w-4 h-4" /> Add Player
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isAdding ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-3xl mx-auto">
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Player' : 'Add New Player'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Player Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className={inputCls} /></div>
                <div><label className={labelCls}>Position</label>
                  <select value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value as any })} className={inputCls}>
                    <option>Goalkeeper</option><option>Defender</option><option>Midfielder</option><option>Forward</option>
                  </select>
                </div>
                <div><label className={labelCls}>Jersey Number</label><input type="number" value={formData.number} onChange={e => setFormData({ ...formData, number: parseInt(e.target.value) })} required min="1" max="99" className={inputCls} /></div>
                <div><label className={labelCls}>Nationality</label><input type="text" value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} required className={inputCls} /></div>
                <div><label className={labelCls}>Appearances</label><input type="number" value={formData.appearances} onChange={e => setFormData({ ...formData, appearances: parseInt(e.target.value) })} required min="0" className={inputCls} /></div>
                <div><label className={labelCls}>Goals</label><input type="number" value={formData.goals} onChange={e => setFormData({ ...formData, goals: parseInt(e.target.value) })} required min="0" className={inputCls} /></div>
                <div><label className={labelCls}>Assists</label><input type="number" value={formData.assists} onChange={e => setFormData({ ...formData, assists: parseInt(e.target.value) })} required min="0" className={inputCls} /></div>
                <div>
                  <label className={labelCls}>Player Photo</label>
                  <div
                    className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#00529F' }}>
                      <Upload className="w-4 h-4" />
                      {photoPreview ? 'Change photo' : 'Upload photo'}
                    </div>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              <div><label className={labelCls}>Biography</label><textarea value={formData.biography} onChange={e => setFormData({ ...formData, biography: e.target.value })} required rows={4} className={inputCls} /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                  <Save className="w-4 h-4" />{editingId ? 'Update Player' : 'Add Player'}
                </button>
                <button type="button" onClick={handleCancel} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {players.map((player, index) => (
              <motion.div key={player.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="relative h-56" style={{ backgroundColor: '#00529F' }}>
                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-3 right-3 text-5xl font-black text-white/20">{player.number}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider">{player.position}</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black text-gray-900 mb-3">{player.name}</h3>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    {[{ v: player.appearances, l: 'Apps' }, { v: player.goals, l: 'Goals' }, { v: player.assists, l: 'Assists' }].map(s => (
                      <div key={s.l} className="bg-gray-50 rounded-lg py-2">
                        <div className="text-lg font-black text-gray-900">{s.v}</div>
                        <div className="text-xs text-gray-400">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(player)} className="flex-1 px-3 py-2 rounded-lg font-bold text-xs text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-all" style={{ backgroundColor: '#00529F' }}>
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(player.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors">
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
