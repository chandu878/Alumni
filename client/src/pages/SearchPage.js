import { useCallback, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

const SearchPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ q: '', company: '', role: '', branch: '', graduationYear: '' });
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestMessage, setRequestMessage] = useState({});
  const { addToast } = useToast();

  const loadAlumni = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const { data } = await axiosClient.get('/alumni', { params });
      setAlumni(data.alumni);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch alumni');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAlumni();
  }, [loadAlumni]);

  const sendRequest = async (alumniId) => {
    const message = requestMessage[alumniId] || 'I would like to request mentorship guidance.';
    try {
      await axiosClient.post('/mentorships', { alumniId, message });
      setRequestMessage((prev) => ({ ...prev, [alumniId]: '' }));
      addToast('Mentorship request sent successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send mentorship request', 'error');
    }
  };

  return (
    <section className="animate-fade-in-soft space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white">Search Alumni</h1>
        <p className="text-sm text-slate-200">Find mentors by role, company, branch, and graduation year</p>
      </header>

      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/50">
        <h2 className="text-base font-semibold text-indigo-300">Filters</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input className="w-full cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" placeholder="Keyword" value={filters.q} onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))} />
          <input className="w-full cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" placeholder="Company" value={filters.company} onChange={(e) => setFilters((prev) => ({ ...prev, company: e.target.value }))} />
          <input className="w-full cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" placeholder="Role" value={filters.role} onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))} />
          <input className="w-full cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" placeholder="Branch" value={filters.branch} onChange={(e) => setFilters((prev) => ({ ...prev, branch: e.target.value }))} />
          <input className="w-full cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" type="number" placeholder="Graduation Year" value={filters.graduationYear} onChange={(e) => setFilters((prev) => ({ ...prev, graduationYear: e.target.value }))} />
        </div>
        <button type="button" className="mt-3 cursor-pointer rounded-xl bg-indigo-500 px-4 py-2.5 font-semibold text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95" onClick={loadAlumni}>
          Apply Filters
        </button>
      </div>

      <div className="space-y-4">
        {loading && <LoadingSpinner label="Loading alumni profiles..." />}
        {error && <p className="rounded-xl border border-red-300/40 bg-red-500/10 p-3 text-red-200">{error}</p>}

        {!loading && alumni.length === 0 ? (
          <EmptyState title="No alumni found" subtitle="Try adjusting company, role, branch, or graduation year." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {alumni.map((item) => (
              <article key={item._id} className="animate-fade-in-up cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:bg-white/20 hover:shadow-2xl hover:shadow-indigo-500/50">
                <h2 className="text-xl font-semibold text-indigo-300">{item.name}</h2>
                <p className="text-sm text-slate-200">{item.currentRole || 'Role N/A'} at {item.company || 'Company N/A'}</p>
                <p className="mt-1 text-sm text-slate-300">{item.branch || 'Branch N/A'} | {item.graduationYear || 'Year N/A'}</p>
                <p className="mt-2 text-sm text-slate-200">{item.bio || 'No bio available'}</p>

                {user.role === 'student' && (
                  <div className="mt-4 space-y-2">
                    <textarea
                      rows={2}
                      className="w-full cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400"
                      placeholder="Add mentorship request message"
                      value={requestMessage[item._id] || ''}
                      onChange={(e) => setRequestMessage((prev) => ({ ...prev, [item._id]: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="cursor-pointer rounded-xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95"
                      onClick={() => sendRequest(item._id)}
                    >
                      Request Mentorship
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
