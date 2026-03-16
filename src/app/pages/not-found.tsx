import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
      <div className="text-center">
        <div className="text-9xl font-black mb-4" style={{ color: '#00529F' }}>404</div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-4 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl border border-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
