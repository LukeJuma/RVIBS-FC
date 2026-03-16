import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';

export function TopScorers() {
  const { store } = useDataStore();
  const players = store.getPlayers();
  
  // Sort players by goals in descending order
  const topScorers = [...players].sort((a, b) => b.goals - a.goals);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/src/images/team-photo.jpg" alt="" className="w-full h-full object-cover object-top" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,82,159,0.88) 0%, rgba(0,40,80,0.92) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity text-white/70 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-xs text-white/60 uppercase tracking-wider mb-2">RVIBS FC</div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">Top Scorers</h1>
          <p className="text-white/70 text-lg">Goal-scoring heroes this season</p>
        </div>
      </section>

      {/* Top Scorers List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {topScorers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center">
                  {/* Left - Player Image */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0" style={{ backgroundColor: '#00529F' }}>
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    loading="lazy"
                    />
                    {/* Ranking Badge */}
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-black" style={{ backgroundColor: '#FEBE10' }}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Middle - Player Info and Progress */}
                  <div className="flex-1 px-4 md:px-6 py-4">
                    <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#00529F' }}>
                      {player.position}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{player.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">KE Kenya</p>
                    
                    {/* Progress Bar */}
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: '#00529F',
                          width: `${topScorers[0].goals > 0 ? (player.goals / topScorers[0].goals) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#00529F' }}>
                      <span className="font-bold">{player.goals} goals</span> {index === 0 ? '· Top scorer' : ''}
                    </p>
                  </div>

                  {/* Right - Stats */}
                  <div className="flex gap-8 md:gap-12 px-6 py-4">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold" style={{ color: '#00529F' }}>{player.goals}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-gray-400">{player.assists}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Assists</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-gray-400">{player.appearances}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Apps</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
