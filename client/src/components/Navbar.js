import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 ease-in-out">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/dashboard" className="inline-flex cursor-pointer items-center gap-2 text-lg font-semibold tracking-wide text-white transition-all duration-300 ease-in-out hover:scale-105 hover:text-indigo-400 hover:drop-shadow-[0_0_12px_rgba(129,140,248,0.7)]">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-500/60" />
          Alumni Nexus
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'cursor-pointer rounded-lg border-b-2 border-indigo-400 bg-white/20 px-3 py-1.5 text-white shadow-lg shadow-indigo-500/50 transition-all duration-300 ease-in-out' : 'cursor-pointer rounded-lg px-3 py-1.5 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-500/50')}>
            Dashboard
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => (isActive ? 'cursor-pointer rounded-lg border-b-2 border-indigo-400 bg-white/20 px-3 py-1.5 text-white shadow-lg shadow-indigo-500/50 transition-all duration-300 ease-in-out' : 'cursor-pointer rounded-lg px-3 py-1.5 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-500/50')}>
            Search
          </NavLink>
          <NavLink to="/experiences" className={({ isActive }) => (isActive ? 'cursor-pointer rounded-lg border-b-2 border-indigo-400 bg-white/20 px-3 py-1.5 text-white shadow-lg shadow-indigo-500/50 transition-all duration-300 ease-in-out' : 'cursor-pointer rounded-lg px-3 py-1.5 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-500/50')}>
            Experiences
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'cursor-pointer rounded-lg border-b-2 border-indigo-400 bg-white/20 px-3 py-1.5 text-white shadow-lg shadow-indigo-500/50 transition-all duration-300 ease-in-out' : 'cursor-pointer rounded-lg px-3 py-1.5 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-500/50')}>
            Profile
          </NavLink>
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="cursor-pointer rounded-lg bg-indigo-500 px-3 py-1.5 text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="cursor-pointer rounded-lg px-3 py-1.5 transition-colors duration-200 ease-in-out hover:scale-105 hover:text-indigo-400 active:scale-95">
              Login
            </NavLink>
          )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
