import { createBrowserRouter, Outlet, useLocation, Navigate } from "react-router";
import { useEffect, useState, lazy, Suspense } from "react";
import { Layout } from "./components/layout";
import { AdminLogin, SESSION_KEY } from "./pages/admin/login";
import { supabase } from "./lib/supabase";

// Lazy-load all public pages
const Home        = lazy(() => import('./pages/home').then(m => ({ default: m.Home })));
const Team        = lazy(() => import('./pages/team').then(m => ({ default: m.Team })));
const TopScorers  = lazy(() => import('./pages/top-scorers').then(m => ({ default: m.TopScorers })));
const Fixtures    = lazy(() => import('./pages/fixtures').then(m => ({ default: m.Fixtures })));
const Results     = lazy(() => import('./pages/results').then(m => ({ default: m.Results })));
const Standings   = lazy(() => import('./pages/standings').then(m => ({ default: m.Standings })));
const News        = lazy(() => import('./pages/news').then(m => ({ default: m.News })));
const NewsArticle = lazy(() => import('./pages/news-article').then(m => ({ default: m.NewsArticle })));
const Gallery     = lazy(() => import('./pages/gallery').then(m => ({ default: m.Gallery })));
const Fans        = lazy(() => import('./pages/fans').then(m => ({ default: m.Fans })));
const Contact     = lazy(() => import('./pages/contact').then(m => ({ default: m.Contact })));
const Tickets     = lazy(() => import('./pages/tickets').then(m => ({ default: m.Tickets })));
const NotFound    = lazy(() => import('./pages/not-found').then(m => ({ default: m.NotFound })));

// Lazy-load all admin pages
const AdminDashboard = lazy(() => import('./pages/admin/dashboard').then(m => ({ default: m.AdminDashboard })));
const AdminPlayers   = lazy(() => import('./pages/admin/players').then(m => ({ default: m.AdminPlayers })));
const AdminFixtures  = lazy(() => import('./pages/admin/fixtures').then(m => ({ default: m.AdminFixtures })));
const AdminNews      = lazy(() => import('./pages/admin/news').then(m => ({ default: m.AdminNews })));
const AdminGallery   = lazy(() => import('./pages/admin/gallery').then(m => ({ default: m.AdminGallery })));
const AdminStandings = lazy(() => import('./pages/admin/standings').then(m => ({ default: m.AdminStandings })));
const AdminStaff     = lazy(() => import('./pages/admin/staff').then(m => ({ default: m.AdminStaff })));
const AdminPolls     = lazy(() => import('./pages/admin/polls').then(m => ({ default: m.AdminPolls })));

// Minimal page-level loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );
}

function AdminLayout() {
  const { pathname } = useLocation();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setAuthed(true);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        setAuthed(false);
      }
    });
  }, [pathname]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  if (authed === null) return <PageLoader />;
  if (!authed) return <Navigate to="/seals-portal" replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,        element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
      { path: "team",       element: <Suspense fallback={<PageLoader />}><Team /></Suspense> },
      { path: "top-scorers",element: <Suspense fallback={<PageLoader />}><TopScorers /></Suspense> },
      { path: "fixtures",   element: <Suspense fallback={<PageLoader />}><Fixtures /></Suspense> },
      { path: "results",    element: <Suspense fallback={<PageLoader />}><Results /></Suspense> },
      { path: "standings",  element: <Suspense fallback={<PageLoader />}><Standings /></Suspense> },
      { path: "news",       element: <Suspense fallback={<PageLoader />}><News /></Suspense> },
      { path: "news/:id",   element: <Suspense fallback={<PageLoader />}><NewsArticle /></Suspense> },
      { path: "gallery",    element: <Suspense fallback={<PageLoader />}><Gallery /></Suspense> },
      { path: "fans",       element: <Suspense fallback={<PageLoader />}><Fans /></Suspense> },
      { path: "contact",    element: <Suspense fallback={<PageLoader />}><Contact /></Suspense> },
      { path: "tickets",    element: <Suspense fallback={<PageLoader />}><Tickets /></Suspense> },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true,         Component: AdminDashboard },
      { path: "players",     Component: AdminPlayers },
      { path: "fixtures",    Component: AdminFixtures },
      { path: "news",        Component: AdminNews },
      { path: "gallery",     Component: AdminGallery },
      { path: "standings",   Component: AdminStandings },
      { path: "staff",       Component: AdminStaff },
      { path: "polls",       Component: AdminPolls },
    ],
  },
  { path: "/seals-portal", Component: AdminLogin },
  { path: "*", element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense> },
]);
