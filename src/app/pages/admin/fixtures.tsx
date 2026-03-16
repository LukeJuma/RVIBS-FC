import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, Shield } from 'lucide-react';
import { useDataStore } from '../../hooks/use-data-store';
import { type Fixture } from '../../store/data-store';
import { toast } from 'sonner';

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent text-sm";
const labelCls = "block text-gray-700 font-bold mb-1.5 text-sm";

export function AdminFixtures() {
  const { store } = useDataStore();
  const fixtures = store.getFixtures();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Fixture>>({ homeTeam: 'RVIBS FC', awayTeam: '', date: '', time: '', venue: 'Seals Arena', competition: 'FKF League', status: 'upcoming' });
  const [filterComp, setFilterComp] = useState('All');
  const homeLogoRef = useRef<HTMLInputElement>(null);
  const awayLogoRef = useRef<HTMLInputElement>(null);

  const competitions = ['All', ...Array.from(new Set(fixtures.map(f => f.competition)))];

  const handleLogoUpload = (side: 'home' | 'away', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (side === 'home') setFormData(prev => ({ ...prev, homeTeamLogo: dataUrl }));
      else setFormData(prev => ({ ...prev, awayTeamLogo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      store.updateFixture(editingId, formData as Fixture)
        .then(() => { toast.success('Fixture updated!'); setEditingId(null); setIsAdding(false); resetForm(); })
        .catch(() => toast.error('Failed to update fixture'));
    } else {
      store.addFixture(formData as Omit<Fixture, 'id'>)
        .then(() => { toast.success('Fixture added!'); setIsAdding(false); resetForm(); })
        .catch(() => toast.error('Failed to add fixture'));
    }
  };
  const handleEdit = (f: Fixture) => { setFormData(f); setEditingId(f.id); setIsAdding(true); };
  const handleDelete = (id: string) => {
    if (confirm('Delete this fixture?')) {
      store.deleteFixture(id)
        .then(() => toast.success('Fixture deleted!'))
        .catch(() => toast.error('Failed to delete fixture'));
    }
  };
  const resetForm = () => setFormData({ homeTeam: 'RVIBS FC', awayTeam: '', date: '', time: '', venue: 'Seals Arena', competition: 'FKF League', status: 'upcoming' });
  const handleCancel = () => { setIsAdding(false); setEditingId(null); resetForm(); };

  const statusColors: Record<string, string> = { upcoming: 'bg-blue-100 text-blue-700', live: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-600' };

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
                <h1 className="text-2xl font-black text-gray-900">Fixture Management</h1>
                <p className="text-sm text-gray-500">Schedule and update match fixtures</p>
              </div>
            </div>
            {!isAdding && (
              <button onClick={() => setIsAdding(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                <Plus className="w-4 h-4" /> Add Fixture
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isAdding ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-3xl mx-auto">
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Fixture' : 'Add New Fixture'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Home Team</label><input type="text" value={formData.homeTeam} onChange={e => setFormData({ ...formData, homeTeam: e.target.value })} required className={inputCls} /></div>
                <div><label className={labelCls}>Away Team</label><input type="text" value={formData.awayTeam} onChange={e => setFormData({ ...formData, awayTeam: e.target.value })} required className={inputCls} /></div>
              </div>

              {/* Team Logo Uploads */}
              <div className="grid md:grid-cols-2 gap-5">
                {(['home', 'away'] as const).map(side => {
                  const logo = side === 'home' ? formData.homeTeamLogo : formData.awayTeamLogo;
                  const ref = side === 'home' ? homeLogoRef : awayLogoRef;
                  return (
                    <div key={side}>
                      <label className={labelCls}>{side === 'home' ? 'Home' : 'Away'} Team Logo</label>
                      <div
                        className="flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                        onClick={() => ref.current?.click()}
                      >
                        {logo ? (
                          <img src={logo} alt="logo" className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#00529F' }}>
                            <Upload className="w-4 h-4" />
                            {logo ? 'Change logo' : 'Upload logo'}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">PNG, SVG, WEBP</p>
                        </div>
                        <input ref={ref} type="file" accept="image/*" onChange={e => handleLogoUpload(side, e)} className="hidden" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Date</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required className={inputCls} /></div>
                <div><label className={labelCls}>Time</label><input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required className={inputCls} /></div>
                <div><label className={labelCls}>Venue</label><input type="text" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} required className={inputCls} /></div>
                <div>
                  <label className={labelCls}>Competition</label>
                  <select
                    value={['FKF League', 'Friendly', 'Cup'].includes(formData.competition ?? '') ? formData.competition : '__custom__'}
                    onChange={e => {
                      if (e.target.value !== '__custom__') setFormData({ ...formData, competition: e.target.value });
                    }}
                    className={inputCls}
                  >
                    <option value="FKF League">FKF League</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Cup">Cup</option>
                    <option value="__custom__">Other (type below)</option>
                  </select>
                  {!['FKF League', 'Friendly', 'Cup'].includes(formData.competition ?? '') && (
                    <input
                      type="text"
                      value={formData.competition}
                      onChange={e => setFormData({ ...formData, competition: e.target.value })}
                      placeholder="Enter competition name"
                      className={`${inputCls} mt-2`}
                    />
                  )}
                </div>
                <div><label className={labelCls}>Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className={inputCls}>
                    <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              {formData.status === 'completed' && (
                <div className="grid md:grid-cols-2 gap-5">
                  <div><label className={labelCls}>Home Score</label><input type="number" value={formData.homeScore ?? ''} onChange={e => setFormData({ ...formData, homeScore: parseInt(e.target.value) })} min="0" className={inputCls} /></div>
                  <div><label className={labelCls}>Away Score</label><input type="number" value={formData.awayScore ?? ''} onChange={e => setFormData({ ...formData, awayScore: parseInt(e.target.value) })} min="0" className={inputCls} /></div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                  <Save className="w-4 h-4" />{editingId ? 'Update Fixture' : 'Add Fixture'}
                </button>
                <button type="button" onClick={handleCancel} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {/* Competition filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {competitions.map(c => (
                <button
                  key={c}
                  onClick={() => setFilterComp(c)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterComp === c ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  style={filterComp === c ? { background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' } : {}}
                >
                  {c}
                </button>
              ))}
            </div>
            {fixtures
              .filter(f => filterComp === 'All' || f.competition === filterComp)
              .map((fixture, index) => (
              <motion.div key={fixture.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: '#00529F' }}>{fixture.competition}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[fixture.status]}`}>{fixture.status.toUpperCase()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(fixture)} className="p-2 rounded-lg text-white hover:opacity-90 transition-all" style={{ backgroundColor: '#00529F' }}><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(fixture.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="px-5 py-3.5">
                  <div className="text-base font-black text-gray-900 mb-1">
                    {fixture.homeTeam} vs {fixture.awayTeam}
                    {fixture.status === 'completed' && <span className="ml-2 text-gray-500 font-bold">({fixture.homeScore}  {fixture.awayScore})</span>}
                  </div>
                  <div className="text-xs text-gray-400">{new Date(fixture.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}  {fixture.time}  {fixture.venue}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
