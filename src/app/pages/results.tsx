import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';

const ITEMS_PER_PAGE = 8;

function TeamLogo({ name, logo, isRVIBS }: { name: string; logo?: string; isRVIBS: boolean }) {
  if (isRVIBS) {
    return <img src="/rvibs_logo.jpeg" alt="RVIBS FC" className="w-8 h-8 object-contain flex-shrink-0" />;
  }
  if (logo) {
    return <img src={logo} alt={name} className="w-8 h-8 object-contain flex-shrink-0" />;
  }
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
      <span className="text-gray-500 text-xs font-black">{initials}</span>
    </div>
  );
}

export function Results() {
  const { store } = useDataStore();
  const allFixtures = store.getFixtures();
  const [selectedCompetition, setSelectedCompetition] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const competitions = ['All', ...Array.from(new Set(allFixtures.map(f => f.competition)))];
  const completedFixtures = allFixtures
    .filter(f => f.status === 'completed')
    .filter(f => selectedCompetition === 'All' || f.competition === selectedCompetition)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.max(1, Math.ceil(completedFixtures.length / ITEMS_PER_PAGE));
  const paginated = completedFixtures.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCompetitionChange = (comp: string) => {
    setSelectedCompetition(comp);
    setCurrentPage(1);
  };

  const getMatchResult = (fixture: any) => {
    const isHome = fixture.homeTeam === 'RVIBS FC';
    const rvibsScore = isHome ? fixture.homeScore : fixture.awayScore;
    const opponentScore = isHome ? fixture.awayScore : fixture.homeScore;
    if (rvibsScore > opponentScore) return 'win';
    if (rvibsScore < opponentScore) return 'loss';
    return 'draw';
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/team-photo.jpg" alt="" className="w-full h-full object-cover object-top" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,82,159,0.88) 0%, rgba(0,40,80,0.92) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs text-white/60 uppercase tracking-wider mb-2">RVIBS FC</div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">Results</h1>
            <p className="text-white/70 text-lg">Match results and performance history</p>
          </motion.div>
        </div>
      </section>

      <section className="py-6 bg-white sticky top-20 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {competitions.map(competition => (
              <button
                key={competition}
                onClick={() => handleCompetitionChange(competition)}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  selectedCompetition === competition ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedCompetition === competition ? { background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' } : {}}
              >
                {competition}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {completedFixtures.length > 0 ? (
            <div className="space-y-3">
              {paginated.map((fixture, index) => {
                const result = getMatchResult(fixture);
                const resultColor = result === 'win' ? '#16a34a' : result === 'loss' ? '#dc2626' : '#ca8a04';
                const resultBg = result === 'win' ? 'bg-green-50' : result === 'loss' ? 'bg-red-50' : 'bg-yellow-50';
                return (
                  <motion.div
                    key={fixture.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-all duration-200"
                  >
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{fixture.competition}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {fixture.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(fixture.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase text-white`} style={{ backgroundColor: resultColor }}>
                          {result}
                        </span>
                      </div>
                    </div>

                    {/* Score row */}
                    <div className="flex items-center px-4 py-3 gap-3">
                      {/* Home team */}
                      <div className="flex-1 flex items-center justify-end gap-2">
                        <span className={`text-sm font-bold ${fixture.homeTeam === 'RVIBS FC' ? 'text-gray-900' : 'text-gray-500'}`}>
                          {fixture.homeTeam}
                        </span>
                        {fixture.homeTeam === 'RVIBS FC' && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: '#00529F' }}>H</span>
                        )}
                        <TeamLogo name={fixture.homeTeam} logo={fixture.homeTeamLogo} isRVIBS={fixture.homeTeam === 'RVIBS FC'} />
                      </div>

                      {/* Score */}
                      <div className={`flex items-center gap-1 px-4 py-1.5 rounded-lg ${resultBg}`}>
                        <span className="text-xl font-black text-gray-900 w-5 text-center">{fixture.homeScore}</span>
                        <span className="text-sm font-bold text-gray-400 mx-1">–</span>
                        <span className="text-xl font-black text-gray-900 w-5 text-center">{fixture.awayScore}</span>
                      </div>

                      {/* Away team */}
                      <div className="flex-1 flex items-center gap-2">
                        <TeamLogo name={fixture.awayTeam} logo={fixture.awayTeamLogo} isRVIBS={fixture.awayTeam === 'RVIBS FC'} />
                        {fixture.awayTeam === 'RVIBS FC' && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded text-black" style={{ backgroundColor: '#FEBE10' }}>A</span>
                        )}
                        <span className={`text-sm font-bold ${fixture.awayTeam === 'RVIBS FC' ? 'text-gray-900' : 'text-gray-500'}`}>
                          {fixture.awayTeam}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No completed matches found.</p>
            </div>
          )}

          {completedFixtures.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === page ? 'text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  style={currentPage === page ? { background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' } : {}}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
