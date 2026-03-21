import { useCallback, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const initialExperience = {
  company: '',
  role: '',
  branch: '',
  graduationYear: '',
  examType: '',
  interviewExperience: '',
  preparationTips: '',
};

const ExperiencesPage = () => {
  const { user } = useAuth();
  const [filterDraft, setFilterDraft] = useState({ company: '', role: '', examType: '' });
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ companies: [], roles: [], examTypes: [] });
  const [form, setForm] = useState(initialExperience);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterAnimating, setFilterAnimating] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const buildOptions = (items) => {
    const companies = [...new Set(items.map((item) => item.company).filter(Boolean))].sort();
    const roles = [...new Set(items.map((item) => item.role).filter(Boolean))].sort();
    const examTypes = [...new Set(items.map((item) => item.examType || 'General').filter(Boolean))].sort();
    setFilterOptions({ companies, roles, examTypes });
  };

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosClient.get('/experiences');
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.experiences)
          ? data.experiences
          : [];

      setExperiences(normalized);
      setFilteredExperiences(normalized);
      buildOptions(normalized);
      setHasFetchedOnce(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch experiences');
      setHasFetchedOnce(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const matchesFilter = (sourceValue, selectedValue) => {
    if (!selectedValue) {
      return true;
    }
    return (sourceValue || '').toString().toLowerCase() === selectedValue.toString().toLowerCase();
  };

  const applyFilters = () => {
    setFilterAnimating(true);
    console.log('All Data:', experiences);
    console.log('Filters:', {
      company: filterDraft.company,
      role: filterDraft.role,
      examType: filterDraft.examType,
    });

    const filtered = experiences.filter((exp) => {
      return (
        matchesFilter(exp.company, filterDraft.company) &&
        matchesFilter(exp.role, filterDraft.role) &&
        matchesFilter(exp.examType || 'General', filterDraft.examType)
      );
    });

    setFilteredExperiences(filtered);
    setTimeout(() => setFilterAnimating(false), 180);
  };

  const clearFilters = () => {
    setFilterAnimating(true);
    setFilterDraft({ company: '', role: '', examType: '' });
    setFilteredExperiences(experiences);
    setTimeout(() => setFilterAnimating(false), 180);
  };

  const handlePostExperience = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await axiosClient.post('/experiences', {
        ...form,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
      });
      setMessage('Experience posted and sent for review.');
      setForm(initialExperience);
      fetchExperiences();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post experience');
    }
  };

  const hasActiveFilters = Boolean(filterDraft.company || filterDraft.role || filterDraft.examType);
  const displayExperiences = hasActiveFilters
    ? filteredExperiences
    : (filteredExperiences.length > 0 ? filteredExperiences : experiences);

  return (
    <section className="animate-fade-in-soft space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white">Placement Experiences</h1>
        <p className="text-sm text-slate-200">Explore interview experiences shared by alumni</p>
      </header>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/50">
        <div className="grid w-full gap-3 md:grid-cols-3">
          <select
            className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400"
            value={filterDraft.company}
            onChange={(e) => setFilterDraft((prev) => ({ ...prev, company: e.target.value }))}
          >
            <option value="">All Companies</option>
            {filterOptions.companies.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select
            className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400"
            value={filterDraft.role}
            onChange={(e) => setFilterDraft((prev) => ({ ...prev, role: e.target.value }))}
          >
            <option value="">All Roles</option>
            {filterOptions.roles.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select
            className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400"
            value={filterDraft.examType}
            onChange={(e) => setFilterDraft((prev) => ({ ...prev, examType: e.target.value }))}
          >
            <option value="">All Exam Types</option>
            {filterOptions.examTypes.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="cursor-pointer rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95" onClick={applyFilters}>
            Apply Filter
          </button>
          <button type="button" className="cursor-pointer rounded-xl border border-white/30 bg-white/10 px-4 py-2 font-semibold text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95" onClick={clearFilters}>
            Clear Filter
          </button>
        </div>
      </div>

      {user.role === 'alumni' && (
        <form className="grid gap-3 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/50" onSubmit={handlePostExperience}>
          <h2 className="text-xl font-semibold text-indigo-300">Share Your Experience</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" placeholder="Company" value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} required />
            <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" placeholder="Role" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))} required />
            <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" placeholder="Branch" value={form.branch} onChange={(e) => setForm((prev) => ({ ...prev, branch: e.target.value }))} />
            <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" type="number" placeholder="Graduation Year" value={form.graduationYear} onChange={(e) => setForm((prev) => ({ ...prev, graduationYear: e.target.value }))} />
            <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-2.5 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400 sm:col-span-2" placeholder="Exam Type" value={form.examType} onChange={(e) => setForm((prev) => ({ ...prev, examType: e.target.value }))} />
          </div>
          <textarea className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" rows={4} placeholder="Interview experience" value={form.interviewExperience} onChange={(e) => setForm((prev) => ({ ...prev, interviewExperience: e.target.value }))} required />
          <textarea className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-sm text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out hover:border-indigo-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" rows={4} placeholder="Preparation tips" value={form.preparationTips} onChange={(e) => setForm((prev) => ({ ...prev, preparationTips: e.target.value }))} required />
          <button type="submit" className="cursor-pointer rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95">
            Post Experience
          </button>
        </form>
      )}

      {message && <p className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 p-3 text-emerald-200">{message}</p>}
      {error && <p className="rounded-xl border border-red-300/40 bg-red-500/10 p-3 text-red-200">{error}</p>}

      {loading && <LoadingSpinner label="Loading experiences..." />}

      {!loading && hasFetchedOnce && displayExperiences.length === 0 ? (
        <EmptyState title="No experiences found" subtitle="Try another company, role, or exam type filter." />
      ) : (
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ease-in-out ${filterAnimating ? 'opacity-40' : 'opacity-100'}`}>
          {displayExperiences.map((item) => (
            <article key={item._id} className="animate-fade-in-up cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:bg-white/20 hover:shadow-2xl hover:shadow-indigo-500/50">
              <h3 className="text-xl font-bold text-indigo-300">{item.company}</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-500/30 px-2.5 py-1 text-xs font-medium text-indigo-100 transition-all duration-300 hover:bg-indigo-500 hover:text-white">{item.examType || 'General'}</span>
                <span className="rounded-full bg-indigo-500/30 px-2.5 py-1 text-xs font-medium text-indigo-100 transition-all duration-300 hover:bg-indigo-500 hover:text-white">{item.role || 'Role N/A'}</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-widest text-indigo-200">{item.branch || 'Branch N/A'} | {item.graduationYear || 'Year N/A'}</p>
              <p className="mt-2 text-sm text-slate-200">
                {expandedCardId === item._id
                  ? item.interviewExperience
                  : `${item.interviewExperience.slice(0, 140)}${item.interviewExperience.length > 140 ? '...' : ''}`}
              </p>
              <p className="mt-2 text-sm text-slate-200"><strong>Tips:</strong> {item.preparationTips}</p>
              <p className="mt-2 text-xs text-slate-300">By {item.alumni?.name || 'Unknown alumni'}</p>
              <button
                type="button"
                className="mt-3 cursor-pointer rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95"
                onClick={() => setExpandedCardId((prev) => (prev === item._id ? null : item._id))}
              >
                {expandedCardId === item._id ? 'Read Less' : 'Read More'}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ExperiencesPage;
