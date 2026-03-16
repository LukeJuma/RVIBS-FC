import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Star, MapPin, Clock, Camera, Trophy, Bus, ChevronRight, CheckCircle, Shield } from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';
import { supabase } from '../lib/supabase';

export function Fans() {
  const { store } = useDataStore();
  const polls = store.getPolls();
  const fanPhotos = store.getFanPhotos();
  const awayTrips = store.getAwayTrips();
  const matchDayInfo = store.getMatchDayInfo();
  const fanOfMonth = store.getFanOfMonth();
  const sealOfSeason = store.getSealOfSeason();

  // Derive hero stats from store
  const totalVotes = polls.reduce((sum, p) => sum + p.options.reduce((s, o) => s + o.votes, 0), 0);
  const awayTripCount = awayTrips.length;

  const [votedPolls, setVotedPolls] = useState<Record<string, string>>({});
  const [tripName, setTripName] = useState('');
  const [registeredTrips, setRegisteredTrips] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'motm' | 'potm'>('motm');

  // Stable voter key per browser
  const voterKey = (() => {
    let k = localStorage.getItem('rvibs_voter_key');
    if (!k) { k = crypto.randomUUID(); localStorage.setItem('rvibs_voter_key', k); }
    return k;
  })();

  // Real-time poll updates
  useEffect(() => {
    const channel = supabase
      .channel('polls-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_options' }, () => {
        store.reloadPolls();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        store.reloadPolls();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const motmPoll = polls.find(p => p.type === 'motm' && p.active);
  const potmPoll = polls.find(p => p.type === 'player_of_month' && p.active);
  const activePoll = activeTab === 'motm' ? motmPoll : potmPoll;

  async function handleVote(pollId: string, optionId: string) {
    if (votedPolls[pollId]) return;
    const result = await store.vote(pollId, optionId, voterKey);
    if (result === 'already_voted') {
      setVotedPolls(prev => ({ ...prev, [pollId]: optionId }));
    } else {
      setVotedPolls(prev => ({ ...prev, [pollId]: optionId }));
    }
  }

  async function handleTripRegister(tripId: string) {
    if (!tripName.trim() || registeredTrips.includes(tripId)) return;
    await store.registerAwayTrip(tripId, tripName.trim());
    setRegisteredTrips(prev => [...prev, tripId]);
  }

  return (
    <div className="min-h-screen bg-white pt-20">

      {/* Hero — full height with crowd atmosphere */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/src/images/fans-hero.jpg"
            alt="Fans at Seals Arena"
            className="w-full h-full object-cover"
            style={{ objectPosition: '60% 30%' }}
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,82,159,0.75) 0%, rgba(0,40,80,0.82) 100%)' }} />
        </div>
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold uppercase tracking-widest">RVIBS FC</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-none">
              The Seal Den
            </h1>
            <p className="text-white/80 text-xl max-w-xl">
              Home of the Seals faithful. The noise, the passion, the blue and white. This is your space.
            </p>
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { label: 'Registered Fans', value: '800+' },
                { label: 'Away Trips This Season', value: '18' },
                { label: 'Fan Votes Cast', value: '200+' },
              ].map(stat => (
                <div key={stat.label} className="border-l-2 border-yellow-400 pl-4">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fan of the Month + Seal of the Season */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Recognising our own</div>
            <h2 className="text-4xl font-black text-gray-900">Fan Spotlights</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">

            {/* Fan of the Month */}
            {fanOfMonth && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="px-7 py-5 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-black uppercase tracking-widest text-xs">Fan of the Month</span>
                <span className="ml-auto text-white/50 text-xs">{fanOfMonth.period}</span>
              </div>
              <div className="p-7 flex gap-6 items-start bg-gradient-to-br from-blue-50 to-white">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                  <Users className="w-9 h-9 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-gray-900 text-xl">{fanOfMonth.name}</div>
                  <div className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Seal since {fanOfMonth.since}</div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{fanOfMonth.quote}"</p>
                </div>
              </div>
            </motion.div>
            )}

            {/* Seal of the Season */}
            {sealOfSeason && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="px-7 py-5 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #FEBE10 0%, #d4a000 100%)' }}>
                <Trophy className="w-5 h-5 text-white" />
                <span className="text-white font-black uppercase tracking-widest text-xs">Seal of the Season</span>
                <span className="ml-auto text-white/70 text-xs">{sealOfSeason.period}</span>
              </div>
              <div className="p-7 flex gap-6 items-start bg-gradient-to-br from-yellow-50 to-white">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #FEBE10 0%, #d4a000 100%)' }}>
                  <Trophy className="w-9 h-9 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-gray-900 text-xl">{sealOfSeason.name}</div>
                  <div className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Seal since {sealOfSeason.since}</div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{sealOfSeason.quote}"</p>
                </div>
              </div>
            </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* Fan Vote */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">Have your say</div>
              <h2 className="text-4xl font-black text-white mb-4">Fan Vote</h2>
              <p className="text-white/70 text-base leading-relaxed">
                Your voice shapes the story. Vote for the Man of the Match after every game, and pick your Player of the Month every month.
              </p>
              <div className="mt-8 flex gap-3">
                {[
                  { label: 'MOTM', desc: 'After every match' },
                  { label: 'POTM', desc: 'Every month' },
                ].map(item => (
                  <div key={item.label} className="flex-1 rounded-xl border border-white/20 px-4 py-3 bg-white/10">
                    <div className="text-white font-black text-lg">{item.label}</div>
                    <div className="text-white/60 text-xs">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              {/* Tab switcher */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('motm')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'motm' ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  style={activeTab === 'motm' ? { background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' } : {}}
                >
                  Man of the Match
                </button>
                <button
                  onClick={() => setActiveTab('potm')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'potm' ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  style={activeTab === 'potm' ? { background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' } : {}}
                >
                  Player of the Month
                </button>
              </div>

              {activePoll && (
                <div className="p-6">
                  <p className="font-bold text-gray-800 mb-5 text-sm">{activePoll.question}</p>
                  <div className="space-y-3">
                    {activePoll.options.map(option => {
                      const total = activePoll.options.reduce((s, o) => s + o.votes, 0);
                      const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;
                      const voted = votedPolls[activePoll.id];
                      const isChosen = voted === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleVote(activePoll.id, option.id)}
                          disabled={!!voted}
                          className={`w-full text-left rounded-xl border-2 transition-all overflow-hidden ${
                            isChosen ? 'border-blue-500' : voted ? 'border-gray-100' : 'border-gray-200 hover:border-blue-300'
                          } ${voted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="relative px-4 py-3">
                            {voted && (
                              <div
                                className="absolute inset-0 rounded-xl transition-all duration-500"
                                style={{ width: `${pct}%`, backgroundColor: isChosen ? '#dbeafe' : '#f9fafb' }}
                              />
                            )}
                            <div className="relative flex items-center justify-between">
                              <span className={`text-sm font-semibold ${isChosen ? 'text-blue-800' : 'text-gray-700'}`}>{option.text}</span>
                              <div className="flex items-center gap-2">
                                {voted && <span className="text-xs font-bold text-gray-500">{pct}%</span>}
                                {isChosen && <CheckCircle className="w-4 h-4 text-blue-500" />}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {!votedPolls[activePoll.id] && (
                    <p className="text-xs text-gray-400 mt-4 text-center">Tap a player to cast your vote</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Fan Photos — full width visual */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Your moments</div>
              <h2 className="text-4xl font-black text-white">Fan Photos</h2>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Camera className="w-4 h-4" />
              <span>Tag us @rvib_seals</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {fanPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`relative overflow-hidden rounded-2xl group ${i === 0 ? 'sm:row-span-2' : ''}`}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${i === 0 ? 'h-80 sm:h-full min-h-[400px]' : 'h-56'}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-semibold">{photo.caption}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Camera className="w-3 h-3 text-white/60" />
                    <span className="text-white/60 text-xs">{photo.fanName}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Match Day Info */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Coming to a game?</div>
            <h2 className="text-4xl font-black text-gray-900">Match Day Info</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Key info cards */}
            {[
              { icon: MapPin, label: 'Venue', value: matchDayInfo.stadium, sub: matchDayInfo.address, color: '#00529F' },
              { icon: Users, label: 'Capacity', value: matchDayInfo.capacity, sub: 'Total seats', color: '#00529F' },
              { icon: Clock, label: 'Gates Open', value: matchDayInfo.gatesOpen, sub: 'Plan your arrival', color: '#FEBE10' },
            ].map(({ icon: Icon, label, value, sub, color }) => (
              <div key={label} className="rounded-2xl border border-gray-100 p-6 shadow-sm flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18' }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</div>
                  <div className="font-black text-gray-900 text-lg leading-tight">{value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{sub}</div>
                </div>
              </div>
            ))}

            {/* Tips — spans full width */}
            <div className="lg:col-span-3 rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="font-black text-gray-900 mb-5 text-lg">Matchday Tips</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchDayInfo.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#00529F' }}>
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Away Trip Organiser */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Follow the Seals</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Away Trip Organiser</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Register your interest in upcoming away fixtures and connect with fellow Seals making the trip.
              </p>
              <div className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Your name</label>
                <input
                  type="text"
                  placeholder="e.g. James K."
                  value={tripName}
                  onChange={e => setTripName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <p className="text-xs text-gray-400 mt-2">Enter your name then click a trip to register</p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5">
              {awayTrips.map((trip, i) => {
                const registered = registeredTrips.includes(trip.id);
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                  >
                    <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                      <div>
                        <div className="font-black text-gray-900">{trip.fixture}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{trip.date}</div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: '#00529F' }}>
                        Away
                      </span>
                    </div>
                    <div className="p-6 grid sm:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#00529F' }} />
                        {trip.venue}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Bus className="w-4 h-4 flex-shrink-0" style={{ color: '#00529F' }} />
                        Departs {trip.departureTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 flex-shrink-0" style={{ color: '#00529F' }} />
                        {trip.interestedFans.length} interested
                      </div>
                      <div className="sm:col-span-3">
                        <div className="text-xs text-gray-400 mb-3">
                          {trip.interestedFans.slice(0, 5).join(' · ')}{trip.interestedFans.length > 5 ? ` +${trip.interestedFans.length - 5} more` : ''}
                        </div>
                        <button
                          onClick={() => handleTripRegister(trip.id)}
                          disabled={registered || !tripName.trim()}
                          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            registered
                              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                              : !tripName.trim()
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'text-white hover:opacity-90'
                          }`}
                          style={!registered && tripName.trim() ? { background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' } : {}}
                        >
                          {registered ? 'Registered! See you there!' : "I'm going on this trip"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
