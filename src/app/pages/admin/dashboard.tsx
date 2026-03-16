import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Users, Calendar, Newspaper, Image, Trophy, TrendingUp, Activity, Eye, User, CalendarDays, ImageIcon, BarChart2, LogOut } from 'lucide-react';
import { useDataStore } from '../../hooks/use-data-store';
import { type ActivityLog } from '../../store/data-store';
import { supabase } from '../../lib/supabase';
import { SESSION_KEY } from './login';

export function AdminDashboard() {
  const { store } = useDataStore();
  const navigate = useNavigate();
  const players = store.getPlayers();
  const fixtures = store.getFixtures();
  const news = store.getNews();
  const gallery = store.getGallery();
  const activityLog = store.getActivityLog();

  const categoryMeta: Record<ActivityLog['category'], { color: string; Icon: React.ElementType }> = {
    player:   { color: '#00529F', Icon: User },
    fixture:  { color: '#22c55e', Icon: CalendarDays },
    news:     { color: '#a855f7', Icon: Newspaper },
    gallery:  { color: '#f97316', Icon: ImageIcon },
    standing: { color: '#FEBE10', Icon: BarChart2 },
    other:    { color: '#6b7280', Icon: Activity },
  };

  function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem(SESSION_KEY);
    navigate('/seals-portal', { replace: true });
  };

  const stats = [
    { icon: Users, label: 'Total Players', value: players.length, link: '/admin/players' },
    { icon: Calendar, label: 'Fixtures', value: fixtures.length, link: '/admin/fixtures' },
    { icon: Newspaper, label: 'News Articles', value: news.length, link: '/admin/news' },
    { icon: Image, label: 'Gallery Images', value: gallery.length, link: '/admin/gallery' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/src/images/rvibs_logo.jpeg" alt="RVIBS FC" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage RVIBS FC website content</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}>
                <Eye className="w-4 h-4" /> View Site
              </Link>
              <button onClick={handleLogout} className="px-4 py-2.5 rounded-xl font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-2 transition-all border border-red-100">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Link to={stat.link} className="block bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#00529F18' }}>
                      <Icon className="w-5 h-5" style={{ color: '#00529F' }} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 tracking-wider uppercase">{stat.label}</div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-5">Quick Actions</h2>
            <div className="space-y-2.5">
              {[
                { to: '/admin/players', label: 'Add New Player' },
                { to: '/admin/staff', label: 'Add Staff Member' },
                { to: '/admin/polls', label: 'Create Fan Poll' },
                { to: '/admin/fixtures', label: 'Schedule Match' },
                { to: '/admin/news', label: 'Publish News Article' },
                { to: '/admin/gallery', label: 'Upload Photos' },
              ].map(item => (
                <Link key={item.to} to={item.to} className="flex items-center justify-between px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-gray-700 hover:text-blue-800 font-medium text-sm transition-all duration-200">
                  {item.label}
                  <span className="text-gray-300 group-hover:text-blue-400"></span>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-5">Recent Activity</h2>
            {activityLog.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="w-8 h-8 text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No activity yet. Start by adding a player or fixture.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {activityLog.slice(0, 8).map((entry) => {
                  const { color, Icon } = categoryMeta[entry.category];
                  return (
                    <div key={entry.id} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${color}18` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-800 font-medium text-sm truncate">{entry.label}</p>
                        <p className="text-xs text-gray-400">{timeAgo(entry.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { to: '/admin/players', icon: Users, label: 'Players', desc: 'Manage squad members, statistics, and profiles' },
            { to: '/admin/staff', icon: Users, label: 'Staff', desc: 'Manage coaches and backroom staff' },
            { to: '/admin/fixtures', icon: Calendar, label: 'Fixtures', desc: 'Schedule matches and update results' },
            { to: '/admin/news', icon: Newspaper, label: 'News', desc: 'Create and publish news articles' },
            { to: '/admin/gallery', icon: Image, label: 'Gallery', desc: 'Upload and manage photo gallery' },
            { to: '/admin/standings', icon: Trophy, label: 'Standings', desc: 'Update league table and team stats' },
            { to: '/admin/polls', icon: BarChart2, label: 'Fan Polls', desc: 'Create MOTM and Player of the Month polls' },
          ].map(({ to, icon: Icon, label, desc }) => (
            <Link key={to} to={to} className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#00529F18' }}>
                <Icon className="w-6 h-6" style={{ color: '#00529F' }} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-blue-800 transition-colors">{label}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </Link>
          ))}
          <div className="bg-white rounded-2xl p-7 border border-gray-200">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gray-100">
              <Activity className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-500">View website statistics and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}