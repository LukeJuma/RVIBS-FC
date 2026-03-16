import { motion } from 'motion/react';
import { useDataStore } from '../hooks/use-data-store';
import { type Player } from '../store/data-store';

const POSITION_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Staff'];

function PlayerCard({ player }: { player: Player }) {
  const isStaff = player.position === 'Staff';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(160deg, #1a3a5c 0%, #00529F 100%)' }}
    >
      {/* Jersey number / staff indicator top-left */}
      {!isStaff && (
        <>
          <div className="absolute top-2 left-3 z-10 text-5xl font-black leading-none" style={{ color: 'rgba(255,255,255,0.15)' }}>
            {player.number}
          </div>
          <div className="absolute top-2 left-3 z-10 text-lg font-black text-white/80 leading-none">
            {player.number}
          </div>
        </>
      )}

      {/* Player photo */}
      <div className="h-52 overflow-hidden">
        <img
          src={player.photo}
          alt={player.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Name bar — always visible */}
      <div className="px-3 py-2 bg-white/5">
        <div className="text-white font-black text-sm truncate">{player.name}</div>
        <div className="text-white/50 text-xs uppercase tracking-wider">
          {isStaff ? (player.role || 'Coaching Staff') : player.position}
        </div>
      </div>

      {/* Stats overlay — slides up on hover */}
      <div className="absolute inset-0 flex flex-col justify-end translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
        style={{ background: 'linear-gradient(to top, rgba(0,40,80,0.97) 60%, rgba(0,40,80,0.7) 100%)' }}>
        <div className="p-4">
          <div className="text-white font-black text-base mb-0.5">{player.name}</div>
          <div className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">
            {isStaff ? (player.role || 'Coaching Staff') : player.position}
          </div>
          {!isStaff && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: 'Apps', value: player.appearances },
                { label: 'Goals', value: player.goals },
                { label: 'Assists', value: player.assists },
              ].map(stat => (
                <div key={stat.label} className="text-center bg-white/10 rounded-lg py-2">
                  <div className="text-white font-black text-lg leading-none">{stat.value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          <div className="text-white/60 text-xs leading-relaxed line-clamp-3">{player.biography}</div>
        </div>
      </div>
    </motion.div>
  );
}

export function Team() {
  const { store } = useDataStore();
  const players = store.getPlayers();

  const grouped = POSITION_ORDER.reduce<Record<string, Player[]>>((acc, pos) => {
    const group = players.filter(p => p.position === pos);
    if (group.length > 0) acc[pos] = group;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="relative py-16 overflow-hidden" >
        <div className="absolute inset-0">
          <img src="/team-photo.jpg" alt="" className="w-full h-full object-cover object-top" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,82,159,0.88) 0%, rgba(0,40,80,0.92) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs text-white/60 uppercase tracking-wider mb-2">RVIBS FC</div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">Our Squad</h1>
            <p className="text-white/70 text-lg">2025/26 Season</p>
          </motion.div>
        </div>
      </section>

      {/* Players grouped by position */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {Object.entries(grouped).map(([position, posPlayers]) => (
            <div key={position}>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                  {position === 'Staff' ? 'Coaching Staff' : `${position}s`}
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {posPlayers.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
