import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/search', label: 'Alumni Search' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/profile', label: 'Profile' },
];

const SidebarNav = ({ onNavigate, mode = 'desktop' }) => {
  const wrapperClass =
    mode === 'mobile'
      ? 'w-full rounded-2xl border border-indigo-100 bg-white p-2'
      : 'hidden w-64 shrink-0 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm lg:block';

  return (
    <aside className={wrapperClass}>
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Navigation</p>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                'block cursor-pointer rounded-xl border-l-4 px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out',
                isActive
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-md'
                  : 'border-transparent text-slate-600 hover:translate-x-1 hover:bg-indigo-50 hover:text-indigo-700 hover:underline',
              ].join(' ')
            }
            onClick={onNavigate}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarNav;
