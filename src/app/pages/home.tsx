import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Ticket, Video, Gift, ChevronDown } from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';

export function Home() {
  const { store, loading } = useDataStore();
  const nextMatch = store.getNextMatch();
  const featuredNews = store.getFeaturedNews();
  const allNews = store.getNews();
  const players = store.getPlayers();
  const standings = store.getStandings();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nextMatch) return;

    const calculateTimeLeft = () => {
      const matchDate = new Date(`${nextMatch.date}T${nextMatch.time}`);
      const now = new Date();
      const difference = matchDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [nextMatch]);

  const topScorers = players
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 3);

  const teamPosition = standings.find(s => s.team === 'RVIBS FC');
  const rvibsStanding = standings.find(s => s.team === 'RVIBS FC');
  // Use smart getUpcomingFixtures — auto-skips past matches
  const upcomingFixtures = store.getUpcomingFixtures().slice(0, 5);
  const recentResults = store.getFixtures()
    .filter(f => f.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(f => {
      const isHome = f.homeTeam === 'RVIBS FC';
      const rvibsScore = isHome ? f.homeScore! : f.awayScore!;
      const oppScore = isHome ? f.awayScore! : f.homeScore!;
      return rvibsScore > oppScore ? 'W' : rvibsScore < oppScore ? 'L' : 'D';
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: 'url(/src/images/team-photo.jpg)',
              backgroundPosition: '50% 15%',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/85 via-slate-700/75 to-slate-800/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 pb-4 sm:pb-6"
          >
            {/* Top Section - Tickets only */}
            <div className="flex items-start justify-end mb-2 sm:mb-3 md:mb-4">
              {/* Tickets Button */}
              <Link
                to="/tickets"
                className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg flex items-center gap-2 text-xs md:text-sm"
                style={{ 
                  background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 15px -3px rgba(30, 64, 175, 0.3)'
                }}
              >
                TICKETS
              </Link>
            </div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              {loading ? (
                /* Loading skeleton */
                <div className="text-center space-y-4 animate-pulse">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px bg-yellow-500/30 w-16" />
                    <div className="h-3 w-24 bg-yellow-500/30 rounded" />
                    <div className="h-px bg-yellow-500/30 w-16" />
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-white/20" />
                    <div className="w-16 h-8 bg-white/20 rounded-full" />
                    <div className="w-16 h-16 rounded-full bg-white/20" />
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto mt-4">
                    {[0,1,2,3].map(i => <div key={i} className="h-16 bg-white/10 rounded-xl" />)}
                  </div>
                </div>
              ) : nextMatch ? (
                <div className="space-y-2 sm:space-y-2.5 md:space-y-4">
                  {/* Next Match Header */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-2.5 md:mb-3">
                      <div className="h-px bg-gradient-to-r from-transparent to-yellow-500 w-8 sm:w-12 md:w-16"></div>
                      <div className="font-bold text-xs md:text-sm tracking-[0.3em] text-yellow-500">NEXT MATCH</div>
                      <div className="h-px bg-gradient-to-l from-transparent to-yellow-500 w-8 sm:w-12 md:w-16"></div>
                    </div>
                    
                    {/* Teams with Logos */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-6 mb-2 sm:mb-2.5 md:mb-3">
                      {/* Home Team */}
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/30 mb-1 sm:mb-1.5 mx-auto flex items-center justify-center bg-white/10">
                          {nextMatch.homeTeam === 'RVIBS FC'
                            ? <img src="/src/images/rvibs_logo.jpeg" alt="RVIBS FC" className="w-full h-full object-cover" />
                            : nextMatch.homeTeamLogo
                              ? <img src={nextMatch.homeTeamLogo} alt={nextMatch.homeTeam} className="w-full h-full object-contain" />
                              : <span className="text-white font-bold text-xs sm:text-base">{nextMatch.homeTeam.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}</span>
                          }
                        </div>
                        <div className="text-white font-bold text-xs sm:text-sm md:text-base tracking-wide">{nextMatch.homeTeam.toUpperCase()}</div>
                      </div>

                      {/* VS */}
                      <div className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-5 md:py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-yellow-500 font-bold text-xs sm:text-sm md:text-base">VS</span>
                      </div>

                      {/* Away Team */}
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-1 sm:mb-1.5 mx-auto overflow-hidden">
                          {nextMatch.awayTeam === 'RVIBS FC'
                            ? <img src="/src/images/rvibs_logo.jpeg" alt="RVIBS FC" className="w-full h-full object-cover" />
                            : nextMatch.awayTeamLogo
                              ? <img src={nextMatch.awayTeamLogo} alt={nextMatch.awayTeam} className="w-full h-full object-contain" />
                              : <span className="text-white font-bold text-xs sm:text-base md:text-lg">{nextMatch.awayTeam.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}</span>
                          }
                        </div>
                        <div className="text-white/70 font-bold text-xs sm:text-sm md:text-base tracking-wide">{nextMatch.awayTeam.toUpperCase()}</div>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 md:gap-4 text-white/80 text-xs md:text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="font-medium">{new Date(nextMatch.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="font-medium">{nextMatch.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="font-medium">{nextMatch.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                    {[
                      { label: 'DAYS', value: timeLeft.days },
                      { label: 'HOURS', value: timeLeft.hours },
                      { label: 'MINS', value: timeLeft.minutes },
                      { label: 'SECS', value: timeLeft.seconds },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2.5 md:p-4 border border-white/20 relative overflow-hidden">
                        {/* Gold top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg" style={{ background: 'linear-gradient(90deg, transparent, #FEBE10, transparent)' }} />
                        <div className="text-base sm:text-xl md:text-3xl font-bold text-white mb-0.5">
                          {item.value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-white/60 tracking-[0.2em] font-medium">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5 justify-center w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto pt-1 sm:pt-1.5">
                    <Link
                      to="/fixtures"
                      className="group w-full px-5 py-2 sm:py-2.5 md:px-7 md:py-3 text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
                      style={{ 
                        background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                        boxShadow: '0 4px 15px -3px rgba(30, 64, 175, 0.3)'
                      }}
                    >
                      VIEW FIXTURES →
                    </Link>
                    <Link
                      to="/team"
                      className="group w-full px-5 py-2 sm:py-2.5 md:px-7 md:py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-medium rounded-full border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
                    >
                      VIEW SQUAD →
                    </Link>
                  </div>
                </div>
              ) : (
                /* No upcoming matches */
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="h-px bg-yellow-500/40 w-16" />
                    <span className="text-yellow-500 font-bold text-xs tracking-[0.3em]">RVIBS FC</span>
                    <div className="h-px bg-yellow-500/40 w-16" />
                  </div>
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 mx-auto">
                    <img src="/src/images/rvibs_logo.jpeg" alt="RVIBS FC" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white/70 text-sm tracking-wide">No upcoming fixtures scheduled</p>
                  <div className="flex flex-col gap-2 max-w-xs mx-auto pt-2">
                    <Link to="/results" className="w-full px-5 py-2.5 text-white font-medium rounded-full text-sm flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)' }}>
                      VIEW RESULTS →
                    </Link>
                    <Link to="/team" className="w-full px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full border border-white/20 text-sm flex items-center justify-center gap-2 transition-all">
                      VIEW SQUAD →
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-7 h-7 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* League Standing and Results Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-800 to-blue-900"
          >
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - League Standing & Last 5 Results */}
                <div className="space-y-6">
                  {/* League Standing */}
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-3">LEAGUE STANDING</div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-black flex-shrink-0" style={{ backgroundColor: '#FEBE10' }}>
                        {rvibsStanding ? rvibsStanding.position : 'N/A'}
                      </div>
                      <div>
                        <div className="text-white font-bold text-xl mb-1">FKF LEAGUE</div>
                        <div className="text-white/80 text-sm">
                          <span className="text-yellow-400 font-bold">{rvibsStanding?.points ?? 0} pts</span>
                          {rvibsStanding && ` • ${rvibsStanding.played} played • ${rvibsStanding.won}W ${rvibsStanding.drawn}D ${rvibsStanding.lost}L`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Last 5 Results */}
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-3">LAST 5 RESULTS</div>
                    <div className="flex gap-2 mb-3">
                      {recentResults.length > 0
                        ? recentResults.map((result, index) => (
                            <div
                              key={index}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                                result === 'W' ? 'bg-green-600' : result === 'D' ? 'bg-gray-600' : 'bg-red-600'
                              }`}
                            >
                              {result}
                            </div>
                          ))
                        : Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 border border-white/20 text-white/40 font-bold text-lg">
                              -
                            </div>
                          ))
                      }
                    </div>
                    <div className="flex gap-4 text-xs text-white/60">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Win</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-400"></div>Draw</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Loss</span>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Season Stats */}
                <div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mb-4">SEASON STATS</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-4xl font-bold mb-1" style={{ color: '#FEBE10' }}>{rvibsStanding?.goalsFor ?? 0}</div>
                      <div className="text-white/60 text-xs uppercase tracking-wider mb-2">GOALS FOR</div>
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ backgroundColor: '#FEBE10', width: `${Math.min(100, ((rvibsStanding?.goalsFor ?? 0) / 70) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-white mb-1">{rvibsStanding?.goalsAgainst ?? 0}</div>
                      <div className="text-white/60 text-xs uppercase tracking-wider">GOALS AGAINST</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-white mb-1">{rvibsStanding?.won ?? 0}</div>
                      <div className="text-white/60 text-xs uppercase tracking-wider">WINS</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-1" style={{ color: '#FEBE10' }}>
                        {rvibsStanding && rvibsStanding.played > 0 ? Math.round((rvibsStanding.won / rvibsStanding.played) * 100) : 0}%
                      </div>
                      <div className="text-white/60 text-xs uppercase tracking-wider mb-2">WIN RATE</div>
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ backgroundColor: '#FEBE10', width: `${rvibsStanding && rvibsStanding.played > 0 ? Math.round((rvibsStanding.won / rvibsStanding.played) * 100) : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Next 5 Fixtures */}
                <div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mb-4">NEXT FIXTURES</div>
                  <div className="space-y-1.5">
                    {upcomingFixtures.length > 0 ? upcomingFixtures.map((fixture, index) => {
                      const opponent = fixture.homeTeam === 'RVIBS FC' ? fixture.awayTeam : fixture.homeTeam;
                      const isHome = fixture.homeTeam === 'RVIBS FC';
                      return (
                        <div key={index} className="flex items-center justify-between px-2.5 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isHome ? 'text-white' : 'text-black'}`} style={{ backgroundColor: isHome ? '#00529F' : '#FEBE10' }}>{isHome ? 'H' : 'A'}</span>
                            <span className="text-white text-xs font-medium">{opponent}</span>
                          </div>
                          <span className="text-white/60 text-xs">{new Date(fixture.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      );
                    }) : (
                      <p className="text-white/50 text-sm">No upcoming fixtures</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">LATEST</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest News</h2>
                  <p className="text-gray-600 text-sm mt-1">Stay updated with the latest news from RVIBS FC</p>
                </div>
                <Link
                  to="/news"
                  className="hidden md:flex items-center gap-1 font-medium transition-colors text-sm"
                  style={{ color: '#00529F' }}
                >
                  View All News
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Main Featured Article */}
                <div className="md:col-span-2">
                  <Link to={`/news/${featuredNews.id}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden h-80" style={{ backgroundColor: '#00529F' }}>
                      <img src={featuredNews.image} alt={featuredNews.title} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1 text-xs font-medium rounded" style={{ backgroundColor: '#FEBE10', color: '#000' }}>
                          {featuredNews.category.toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{featuredNews.title}</h3>
                        <p className="text-white/80 text-sm mb-4 leading-relaxed">{featuredNews.excerpt}</p>
                        <div className="text-white/60 text-xs">Read Full Story →</div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Side Articles — real data */}
                <div className="space-y-4">
                  {allNews.filter(n => !n.featured).slice(0, 3).map((article, i) => {
                    const gradients = [
                      'from-blue-600 to-blue-800',
                      'from-purple-600 to-purple-800',
                      'from-green-600 to-green-800',
                    ];
                    const textColors = ['text-blue-900', 'text-purple-900', 'text-green-900'];
                    return (
                      <Link key={article.id} to={`/news/${article.id}`} className="group block">
                        <div className={`relative rounded-xl overflow-hidden h-24 bg-gradient-to-r ${gradients[i]}`}>
                          <div className="absolute top-3 left-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded bg-white ${textColors[i]}`}>
                              {article.category.toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-4 right-4">
                            <h4 className="text-white font-medium text-sm leading-tight line-clamp-2">{article.title}</h4>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Top Scorers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">FIRST TEAM</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top Scorers</h2>
              <p className="text-gray-600 text-sm mt-1">Our goal-scoring heroes this season</p>
            </div>

            <div className="space-y-4">
              {topScorers.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center">
                    {/* Left - Player Image */}
                    <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0" style={{ backgroundColor: '#00529F' }}>
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="w-full h-full object-cover"
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

            <div className="text-center mt-8">
              <Link
                to="/top-scorers"
                className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg border-2 transition-all duration-300 text-sm hover:shadow-md"
                style={{ color: '#00529F', borderColor: '#00529F' }}
              >
                VIEW ALL TOP SCORERS →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">OFFICIAL KITS</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">2025/26 Season Kits</h2>
              <p className="text-gray-600 text-sm">Wear the colors with pride</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Home Kit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                  <div className="aspect-square flex items-center justify-center p-8">
                    <img 
                      src="/src/images/HOME.png" 
                      alt="Home Kit" 
                      className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full text-black" style={{ backgroundColor: '#FEBE10' }}>
                      HOME
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Home Kit</h3>
                  <p className="text-sm text-gray-600">Royal blue with red accents</p>
                </div>
              </motion.div>

              {/* Away Kit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4 bg-white border-2 border-gray-200">
                  <div className="aspect-square flex items-center justify-center p-8">
                    <img 
                      src="/src/images/AWAY.png" 
                      alt="Away Kit" 
                      className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-800 text-white">
                      AWAY
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Away Kit</h3>
                  <p className="text-sm text-gray-600">Mint green with black details</p>
                </div>
              </motion.div>

              {/* Third Kit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="aspect-square flex items-center justify-center p-8">
                    <img 
                      src="/src/images/THIRD.png" 
                      alt="Third Kit" 
                      className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full text-black" style={{ backgroundColor: '#FEBE10' }}>
                      THIRD
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Third Kit</h3>
                  <p className="text-sm text-gray-600">Burgundy red with white trim</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-800 to-blue-900"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="px-8 py-12 md:px-12">
                <div className="text-xs text-white/60 uppercase tracking-wider mb-2">BECOME A SEAL</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Be Part of History
                </h2>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Join other of passionate Seals. Get exclusive content, 
                  match updates and much more.
                </p>
                <Link
                  to="/fans"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white font-medium rounded-lg transition-all duration-300 text-sm hover:shadow-lg"
                  style={{ color: '#00529F' }}
                >
                  JOIN THE FAN CLUB
                </Link>
              </div>

              {/* Right Content - Feature Cards */}
              <div className="px-8 py-12 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEBE10' }}>
                    <Ticket className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Priority Tickets</div>
                    <div className="text-white/60 text-xs">Priority access to tickets</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEBE10' }}>
                    <Video className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Exclusive Content</div>
                    <div className="text-white/60 text-xs">Exclusive club content</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEBE10' }}>
                    <Gift className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Member Rewards</div>
                    <div className="text-white/60 text-xs">Rewards and discounts</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}