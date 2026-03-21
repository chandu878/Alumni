import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  const tags = useMemo(() => {
    if (!user?.skills) {
      return [];
    }
    return Array.isArray(user.skills) ? user.skills : [];
  }, [user]);

  return (
    <section className="animate-fade-in-soft mx-auto max-w-5xl space-y-5 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/50">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-indigo-500/30 text-2xl font-bold text-white shadow-lg shadow-indigo-500/40">
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-sm text-slate-200">Professional details and account information</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
          <p className="text-xs uppercase tracking-widest text-indigo-300">Name</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.name}</p>
        </div>
        <div className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
          <p className="text-xs uppercase tracking-widest text-indigo-300">Email</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.email}</p>
        </div>
        <div className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
          <p className="text-xs uppercase tracking-widest text-indigo-300">Role</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.role}</p>
        </div>
        <div className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
          <p className="text-xs uppercase tracking-widest text-indigo-300">Branch</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.branch || 'N/A'}</p>
        </div>
        <div className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
          <p className="text-xs uppercase tracking-widest text-indigo-300">Graduation Year</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.graduationYear || 'N/A'}</p>
        </div>
        <div className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
          <p className="text-xs uppercase tracking-widest text-indigo-300">Organization</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.company || 'N/A'}</p>
        </div>
      </div>

      <div className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 ease-in-out hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
        <p className="text-xs uppercase tracking-widest text-indigo-300">Bio</p>
        <p className="mt-2 text-sm text-slate-200">{user?.bio || 'No bio available.'}</p>
      </div>

      <div className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 ease-in-out hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
        <p className="text-xs uppercase tracking-widest text-indigo-300">Skills</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span key={tag} className="cursor-pointer rounded-full border border-white/30 bg-indigo-500/30 px-3 py-1 text-xs text-indigo-100 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/50">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-300">No skills added</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
