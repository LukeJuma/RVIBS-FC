import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';

function FormBadge({ result }: { result: 'W' | 'D' | 'L' }) {
  const styles = { W: 'bg-green-500 text-white', D: 'bg-gray-400 text-white', L: 'bg-red-500 text-white' };
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-black ${styles[result]}`}>
      {result}
    </span>
  );
}

export function Standings() {
  const { store } = useDataStore();
  const standings = store.getStandings();
  const fixtures = store.getFixtures();

  function getForm(teamName: string): ('W' | 'D' | 'L')[] {
    return fixtures
      .filter(f => f.status === 'completed' && (f.homeTeam === teamName || f.awayTeam === teamName))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(f => {
        const isHome = f.homeTeam === teamName;
        const ts = isHome ? f.homeScore! : f.awayScore!;
        const os = isHome ? f.awayScore! : f.homeScore!;
        return ts > os ? 'W' : ts < os ? 'L' : 'D';
      });
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/team-photo.jpg" alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,82,159,0.88) 0%, rgba(0,40,80,0.92) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs text-white/60 uppercase tracking-wider mb-2">RVIBS FC</div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">Standings</h1>
            <p className="text-white/70 text-lg">FKF League Table 2025/26 Season</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-10 px-3 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Team</th>
                    <th className="w-10 px-3 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">Pl</th>
                    <th className="w-10 px-3 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">Wn</th>
                    <th className="w-10 px-3 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">Dw</th>
                    <th className="w-10 px-3 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">Ls</th>
                    <th className="w-16 px-3 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">F:A</th>
                    <th className="w-12 px-3 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">+/-</th>
                    <th className="w-10 px-3 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">Pts</th>
                    <th className="w-32 px-4 py-3 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => {
                    const isRVIBS = team.team === 'RVIBS FC';
                    const gd = team.goalDifference;
                    const form = getForm(team.team);
                    const logo = team.teamLogo || (isRVIBS ? '/rvibs_logo.jpeg' : null);
                    return (
                      <motion.tr
                        key={team.id ?? team.team}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}
                        className={`border-b border-gray-100 last:border-0 transition-colors ${isRVIBS ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-3 py-3 text-center font-black" style={{ color: isRVIBS ? '#1d4ed8' : '#9ca3af' }}>{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {logo
                              ? <img src={logo} alt={team.team} className="w-6 h-6 object-contain flex-shrink-0" />
                              : <Shield className="w-5 h-5 text-gray-300 flex-shrink-0" />
                            }
                            <span className={`font-bold ${isRVIBS ? 'text-blue-800' : 'text-gray-700'}`}>{team.team}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center" style={{ color: isRVIBS ? '#1d4ed8' : '#6b7280', fontWeight: isRVIBS ? 600 : 400 }}>{team.played}</td>
                        <td className="px-3 py-3 text-center" style={{ color: isRVIBS ? '#1d4ed8' : '#6b7280', fontWeight: isRVIBS ? 600 : 400 }}>{team.won}</td>
                        <td className="px-3 py-3 text-center" style={{ color: isRVIBS ? '#1d4ed8' : '#6b7280', fontWeight: isRVIBS ? 600 : 400 }}>{team.drawn}</td>
                        <td className="px-3 py-3 text-center" style={{ color: isRVIBS ? '#1d4ed8' : '#6b7280', fontWeight: isRVIBS ? 600 : 400 }}>{team.lost}</td>
                        <td className="px-3 py-3 text-center font-mono" style={{ color: isRVIBS ? '#1d4ed8' : '#6b7280' }}>{team.goalsFor}:{team.goalsAgainst}</td>
                        <td className="px-3 py-3 text-center font-semibold">
                          <span className={gd > 0 ? 'text-green-600' : gd < 0 ? 'text-red-500' : 'text-gray-400'}>
                            {gd > 0 ? `+${gd}` : gd}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-black" style={{ color: isRVIBS ? '#1e3a8a' : '#111827' }}>{team.points}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {Array.from({ length: 5 }).map((_, i) =>
                              form[i]
                                ? <FormBadge key={i} result={form[i]} />
                                : <span key={i} className="inline-flex items-center justify-center w-5 h-5 rounded text-xs font-black bg-gray-100 text-gray-300">-</span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400 px-1">
            <span>Pl = Played</span><span>Wn = Won</span><span>Dw = Drawn</span><span>Ls = Lost</span>
            <span>F:A = Goals For:Against</span><span>+/- = Goal Difference</span><span>Pts = Points</span>
          </div>
        </div>
      </section>
    </div>
  );
}

