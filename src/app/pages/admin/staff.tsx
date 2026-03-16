import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, User } from 'lucide-react';
import { useDataStore } from '../../hooks/use-data-store';
import { type Player } from '../../store/data-store';
import { toast } from 'sonner';

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent text-sm";
const labelCls = "block text-gray-700 font-bold mb-1.5 text-sm";

const ROLES = ['Head Coach', 'Assistant Coach', 'Goalkeeper Coach', 'Fitness Coach', 'Team Doctor', 'Kit Manager', 'Other'];

const emptyForm = (): Partial<Player> => ({
  name: '', position: 'Staff', role: 'Head Coach',
  number: 0, photo: '', nationality: 'Kenya',
  appearances: 0, goals: 0, assists: 0, biography: '',
});

export function AdminStaff() {
  const { store } = useDataStore();
  const staff = store.getPlayers().filter(p => p.position === 'Staff');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Player>>(emptyForm());
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setPhotoPreview(url);
      setFormData(prev => ({ ...prev, photo: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, position: 'Staff' as const };
    if (editingId) {
      store.updatePlayer(editingId, data as Player)
        .then(() => { toast.success('Staff member updated!'); reset(); })
        .catch(() => toast.error('Failed to update'));
    } else {
      store.addPlayer(data as Omit<Player, 'id'>)
        .then(() => { toast.success('Staff member added!'); setIsAdding(false); reset(); })
        .catch(() => toast.error('Failed to add'));
    }
  };

  const handleEdit = (p: Player) => { setFormData(p); setEditingId(p.id); setIsAdding(true); setPhotoPreview(p.photo || ''); };
  const handleDelete = (id: string) => {
    if (confirm('Remove this staff member?')) {
      store.deletePlayer(id)
        .then(() => toast.success('Removed!'))
        .catch(() => toast.error('Failed to remove'));
    }
  };
  const reset = () => { setFormData(emptyForm()); setPhotoPreview(''); setEditingId(null); setIsAdding(false); };

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
                <h1 className="text-2xl font-black text-gray-900">Coaching Staff</h1>
                <p className="text-sm text-gray-500">Manage coaches and backroom staff</p>
              </div>
            </div>
            {!isAdding && (
              <button onClick={() => setIsAdding(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                <Plus className="w-4 h-4" /> Add Staff
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isAdding ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className={inputCls} placeholder="e.g. John Mwenda" />
                </div>
                <div>
                  <label className={labelCls}>Role</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className={inputCls}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Nationality</label>
                  <input type="text" value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Photo</label>
                  <div
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {photoPreview
                      ? <img src={photoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                      : <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center"><User className="w-8 h-8 text-gray-300" /></div>
                    }
                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#00529F' }}>
                      <Upload className="w-4 h-4" />
                      {photoPreview ? 'Change photo' : 'Upload photo'}
                    </div>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelCls}>Biography</label>
                <textarea value={formData.biography} onChange={e => setFormData({ ...formData, biography: e.target.value })} rows={4} className={inputCls} placeholder="Brief background and experience..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                  <Save className="w-4 h-4" />{editingId ? 'Update' : 'Add Staff Member'}
                </button>
                <button type="button" onClick={reset} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {staff.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-400">
                <User className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                <p className="text-sm">No staff added yet. Click "Add Staff" to get started.</p>
              </div>
            )}
            {staff.map((member, index) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="relative h-56" style={{ background: 'linear-gradient(160deg, #1a3a5c 0%, #00529F 100%)' }}>
                  {member.photo
                    ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover opacity-80" />
                    : <div className="w-full h-full flex items-center justify-center"><span className="text-6xl font-black text-white/20">{member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span></div>
                  }
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider">{member.role || 'Staff'}</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{member.biography || 'No bio added'}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(member)} className="flex-1 px-3 py-2 rounded-lg font-bold text-xs text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-all" style={{ backgroundColor: '#00529F' }}>
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors">
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
