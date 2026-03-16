import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Ticket, ArrowLeft, Bell } from 'lucide-react';

export function Tickets() {
  return (
    <div className="min-h-screen bg-white pt-20 flex flex-col">
      {/* Header */}
      <section className="relative py-16 overflow-hidden" >
        <div className="absolute inset-0">
          <img src="/team-photo.jpg" alt="" className="w-full h-full object-cover object-top" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,82,159,0.88) 0%, rgba(0,40,80,0.92) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs text-white/60 uppercase tracking-wider mb-2">RVIBS FC</div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">Tickets</h1>
            <p className="text-white/70 text-lg">Match day tickets for RVIBS FC</p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="flex-1 flex items-center justify-center py-24 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-lg mx-auto px-4"
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: '#00529F' }}>
            <Ticket className="w-12 h-12 text-white" />
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-black" style={{ backgroundColor: '#FEBE10' }}>
            Coming Soon
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Ticket Sales Opening Soon
          </h2>
          <p className="text-gray-500 text-base mb-10 leading-relaxed">
            Online ticket purchasing is on its way. Stay tuned for match day ticket availability for all RVIBS FC home games.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border-2 transition-all duration-300 hover:shadow-md"
              style={{ color: '#00529F', borderColor: '#00529F' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white transition-all duration-300 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}
            >
              <Bell className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
