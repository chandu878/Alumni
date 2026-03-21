import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ToastViewport from '../components/ToastViewport';

const MainLayout = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-70 [background:radial-gradient(circle_at_10%_10%,rgba(99,102,241,0.35),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(129,140,248,0.3),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.2),transparent_35%)]" />
      <Navbar />
      <ToastViewport />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <section className="w-full min-w-0 animate-fade-in-soft opacity-100 transition-all duration-500 ease-in-out">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
