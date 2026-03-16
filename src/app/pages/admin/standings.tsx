import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Edit, Save, X, Plus, Trash2, Upload, Shield } from 'lucide-react';
import { useDataStore } from '../../hooks/use-data-store';
import { type Standing } from '../../store/data-store';
import { toast } from 'sonner';

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent text-sm";
const labelCls = "block text-gray-700 font-bold mb-1.5 text-sm";

const emptyForm = (): Partial<Standing> => ({ team: '', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, position: 0, teamLogo: '' });

export function AdminStandings() {
  const { store } = useDataStore();
  const standings = store.getStandings();
  const [mode, setMode] = useState<'list' | 'edit' | 'add'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Standing>>(emptyForm());
  const logoRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData(prev => ({ ...prev, teamLogo: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleEdit = (s: Standing) => { setFormData(s); setEditingId(s.id); setMode('edit'); };
  const handleAdd = () => { setFormData(emptyForm()); setMode('add'); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gd = (formData.goalsFor || 0) - (formData.goalsAgainst || 0);
    const data = { ...formData, goalDifference: gd };
    if (mode === 'edit' && editingId) {
      store.updateStanding(editingId, data)
        .then(() => { toast.success('Standing updated!'); setMode('list'); setEditingId(null); setFormData(emptyForm()); })
        .catch(() => toast.error('Failed to update standing'));
    } else {
      store.addStanding(data as Omit<Standing, 'id'>)
        .then(() => { toast.success('Team added to standings!'); setMode('list'); setFormData(emptyForm()); })
        .catch(() => toast.error('Failed to add team'));
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove ${name} from standings?`)) {
      store.deleteStanding(id)
        .then(() => toast.success('Team removed!'))
        .catch(() => toast.error('Failed to remove team'));
    }
  };

  const handleCancel = () => { setMode('list'); setEditingId(null); setFormData(emptyForm()); };

  const statFields = [
    { key: 'played', label: 'Played' }, { key: 'won', label: 'Won' }, { key: 'drawn', label: 'Drawn' },
    { key: 'lost', label: 'Lost' }, { key: 'goalsFor', label: 'Goals For' }, { key: 'goalsAgainst', label: 'Goals Against' },
    { key: 'points', label: 'Points' },
  ];

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
                <h1 className="text-2xl font-black text-gray-900">Standings Management</h1>
                <p className="text-sm text-gray-500">Update league table statistics</p>
              </div>
            </div>
            {mode === 'list' && (
              <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                <Plus className="w-4 h-4" /> Add Team
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {mode !== 'list' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">{mode === 'add' ? 'Add New Team' : `Edit: ${formData.team}`}</h2>
            <form onSubmit={handleSubmit}>
              {mode === 'add' && (
                <div className="mb-5">
                  <label className={labelCls}>Team Name</label>
                  <input type="text" value={formData.team} onChange={e => setFormData({ ...formData, team: e.target.value })} required placeholder="e.g. Nairobi City FC" className={inputCls} />
                </div>
              )}
              {/* Team Logo Upload */}
              <div className="mb-5">
                <label className={labelCls}>Team Logo</label>
                <div
                  className="flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                  onClick={() => logoRef.current?.click()}
                >
                  {formData.teamLogo ? (
                    <img src={formData.teamLogo} alt="logo" className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#00529F' }}>
                      <Upload className="w-4 h-4" />
                      {formData.teamLogo ? 'Change logo' : 'Upload logo'}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, SVG, WEBP</p>
                  </div>
                  <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-5 mb-6">
                {statFields.map(({ key, label }) => (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <input type="number" value={(formData as any)[key] ?? ''} onChange={e => setFormData({ ...formData, [key]: parseInt(e.target.value) || 0 })} required min="0" className={inputCls} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                  <Save className="w-4 h-4" />{mode === 'add' ? 'Add Team' : 'Update Statistics'}
                </button>
                <button type="button" onClick={handleCancel} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Pos', 'Team', 'Pl', 'Wn', 'Dw', 'Ls', 'F:A', '+/-', 'Pts', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-black text-gray-400 uppercase tracking-wider first:text-center last:text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <motion.tr key={team.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}
                      className={`border-b border-gray-100 last:border-0 ${team.team === 'RVIBS FC' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-5 py-3.5 text-center text-sm font-black text-gray-400">{index + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {team.teamLogo
                            ? <img src={team.teamLogo} alt={team.team} className="w-6 h-6 object-contain flex-shrink-0" />
                            : team.team === 'RVIBS FC'
                              ? <img src="/rvibs_logo.jpeg" alt="" className="w-6 h-6 object-contain flex-shrink-0" />
                              : <Shield className="w-5 h-5 text-gray-300 flex-shrink-0" />
                          }
                          <span className={`text-sm font-bold ${team.team === 'RVIBS FC' ? 'text-blue-800' : 'text-gray-800'}`}>{team.team}</span>
                        </div>
                      </td>
                      {[team.played, team.won, team.drawn, team.lost].map((v, i) => (
                        <td key={i} className="px-5 py-3.5 text-center text-sm text-gray-500">{v}</td>
                      ))}
                      <td className="px-5 py-3.5 text-center text-sm font-mono text-gray-500">{team.goalsFor}:{team.goalsAgainst}</td>
                      <td className="px-5 py-3.5 text-center text-sm font-bold">
                        <span className={team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-500' : 'text-gray-400'}>
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center text-sm font-black text-gray-900">{team.points}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(team)} className="px-3 py-1.5 rounded-lg font-bold text-xs text-white hover:opacity-90 transition-all inline-flex items-center gap-1.5" style={{ backgroundColor: '#00529F' }}>
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          {team.team !== 'RVIBS FC' && (
                            <button onClick={() => handleDelete(team.id, team.team)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
