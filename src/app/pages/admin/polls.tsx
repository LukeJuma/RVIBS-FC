import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Trash2, X, Save, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { useDataStore } from '../../hooks/use-data-store';
import { toast } from 'sonner';

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent text-sm";
const labelCls = "block text-gray-700 font-bold mb-1.5 text-sm";

export function AdminPolls() {
  const { store } = useDataStore();
  const polls = store.getPolls();
  const [isAdding, setIsAdding] = useState(false);
  const [question, setQuestion] = useState('');
  const [type, setType] = useState<'motm' | 'player_of_month'>('motm');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => setOptions(prev => [...prev, '']);
  const handleOptionChange = (i: number, val: string) => setOptions(prev => prev.map((o, idx) => idx === i ? val : o));
  const handleRemoveOption = (i: number) => setOptions(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filled = options.filter(o => o.trim());
    if (filled.length < 2) { toast.error('Add at least 2 options'); return; }
    try {
      await store.addPoll(question.trim(), type, filled);
      toast.success('Poll created!');
      setIsAdding(false);
      setQuestion('');
      setOptions(['', '']);
    } catch {
      toast.error('Failed to create poll');
    }
  };

  const handleClose = async (id: string) => {
    try {
      await store.closePoll(id);
      toast.success('Poll closed');
    } catch {
      toast.error('Failed to close poll');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this poll and all its votes?')) return;
    try {
      await store.deletePoll(id);
      toast.success('Poll deleted');
    } catch {
      toast.error('Failed to delete poll');
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
                <h1 className="text-2xl font-black text-gray-900">Fan Polls</h1>
                <p className="text-sm text-gray-500">Create and manage MOTM and Player of the Month polls</p>
              </div>
            </div>
            {!isAdding && (
              <button onClick={() => setIsAdding(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                <Plus className="w-4 h-4" /> New Poll
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {isAdding && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">Create New Poll</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelCls}>Question</label>
                  <input type="text" value={question} onChange={e => setQuestion(e.target.value)} required className={inputCls} placeholder="e.g. Man of the Match — RVIBS FC vs Nakuru United" />
                </div>
                <div>
                  <label className={labelCls}>Poll Type</label>
                  <select value={type} onChange={e => setType(e.target.value as any)} className={inputCls}>
                    <option value="motm">Man of the Match</option>
                    <option value="player_of_month">Player of the Month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Options</label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => handleOptionChange(i, e.target.value)}
                        placeholder={`Option ${i + 1} — e.g. player name`}
                        className={inputCls}
                      />
                      {options.length > 2 && (
                        <button type="button" onClick={() => handleRemoveOption(i)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleAddOption} className="mt-2 text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: '#00529F' }}>
                  <Plus className="w-4 h-4" /> Add option
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                  <Save className="w-4 h-4" /> Create Poll
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {polls.length === 0 && !isAdding && (
          <div className="text-center py-20 text-gray-400">
            <BarChart2 className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="text-sm">No polls yet. Create one after a match.</p>
          </div>
        )}

        {polls.map((poll, index) => {
          const total = poll.options.reduce((s, o) => s + o.votes, 0);
          const winner = poll.options.reduce((a, b) => a.votes >= b.votes ? a : b, poll.options[0]);
          return (
            <motion.div key={poll.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${poll.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {poll.active ? 'Active' : 'Closed'}
                    </span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{poll.type === 'motm' ? 'Man of the Match' : 'Player of the Month'}</span>
                  </div>
                  <h3 className="font-black text-gray-900">{poll.question}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{total} total votes</p>
                </div>
                <div className="flex items-center gap-2">
                  {poll.active && (
                    <button onClick={() => handleClose(poll.id)} className="px-3 py-2 rounded-lg text-xs font-bold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 flex items-center gap-1.5 transition-colors border border-yellow-200">
                      <XCircle className="w-3.5 h-3.5" /> Close Poll
                    </button>
                  )}
                  <button onClick={() => handleDelete(poll.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {poll.options.map(opt => {
                  const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                  const isWinner = !poll.active && opt.id === winner?.id && opt.votes > 0;
                  return (
                    <div key={opt.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">{opt.text}</span>
                          {isWinner && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <span className="text-sm font-black text-gray-600">{opt.votes} <span className="text-gray-400 font-normal text-xs">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: isWinner ? '#22c55e' : '#00529F' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
