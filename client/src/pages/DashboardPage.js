import { useCallback, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pendingExperiences, setPendingExperiences] = useState([]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (user.role === 'student') {
        const res = await axiosClient.get('/students/dashboard');
        setData(res.data);
      } else if (user.role === 'alumni') {
        const res = await axiosClient.get('/alumni/dashboard');
        setData(res.data);
      } else {
        const [dashRes, usersRes, expRes] = await Promise.all([
          axiosClient.get('/admin/dashboard'),
          axiosClient.get('/admin/users'),
          axiosClient.get('/experiences?status=pending'),
        ]);
        setData(dashRes.data);
        setUsers(usersRes.data.users);
        setPendingExperiences(expRes.data.experiences.filter((exp) => exp.status === 'pending'));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const respondMentorship = async (requestId, status) => {
    await axiosClient.patch(`/mentorships/${requestId}/respond`, { status });
    loadDashboard();
  };

  const reviewExperience = async (experienceId, status) => {
    await axiosClient.patch(`/admin/experiences/${experienceId}/review`, { status });
    loadDashboard();
  };

  const toggleUserStatus = async (userId, isActive) => {
    await axiosClient.patch(`/admin/users/${userId}/status`, { isActive: !isActive });
    loadDashboard();
  };

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <section className="animate-fade-in-soft space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">{user.role.toUpperCase()} Dashboard</h1>
        <p className="text-slate-200">Centralized networking and placement workspace</p>
      </header>

      {error && <p className="rounded-xl border border-red-300/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

      {data?.summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(data.summary).map(([key, value]) => (
            <StatCard key={key} title={key} value={value} hint="Live portal data" />
          ))}
        </div>
      )}

      {user.role === 'student' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="animate-fade-in-up rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/50">
            <h2 className="text-xl font-semibold text-indigo-300">Recent Experiences</h2>
            <div className="mt-3 space-y-3">
              {data?.recentExperiences?.length ? (
                data.recentExperiences.map((item) => (
                  <article key={item._id} className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-3 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
                    <p className="font-medium text-white">{item.company} - {item.role}</p>
                    <p className="text-xs text-slate-300">By {item.alumni?.name}</p>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-200">{item.interviewExperience}</p>
                  </article>
                ))
              ) : (
                <EmptyState title="No recent experiences" subtitle="Experiences will appear here once available." />
              )}
            </div>
          </div>
          <div className="animate-fade-in-up rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/50">
            <h2 className="text-xl font-semibold text-indigo-300">My Mentorship Requests</h2>
            <div className="mt-3 space-y-3">
              {data?.mentorshipRequests?.length ? (
                data.mentorshipRequests.map((item) => (
                  <article key={item._id} className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-3 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
                    <p className="font-medium text-white">{item.alumni?.name} ({item.alumni?.company || 'N/A'})</p>
                    <p className="text-sm text-slate-200">{item.message}</p>
                    <p className="mt-1 text-xs uppercase tracking-widest text-indigo-300">{item.status}</p>
                  </article>
                ))
              ) : (
                <EmptyState title="No mentorship requests" subtitle="Send requests from the search page." />
              )}
            </div>
          </div>
        </div>
      )}

      {user.role === 'alumni' && (
        <div className="animate-fade-in-up rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/50">
          <h2 className="text-xl font-semibold text-indigo-300">Incoming Mentorship Requests</h2>
          <div className="mt-3 space-y-3">
            {data?.mentorshipRequests?.length ? (
              data.mentorshipRequests.map((item) => (
                <article key={item._id} className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-3 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
                  <p className="font-medium text-white">{item.student?.name} ({item.student?.branch || 'Branch N/A'})</p>
                  <p className="text-sm text-slate-200">{item.message}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="cursor-pointer rounded-lg bg-indigo-500 px-3 py-1 text-sm text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95"
                      onClick={() => respondMentorship(item._id, 'accepted')}
                      disabled={item.status !== 'pending'}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer rounded-lg bg-white/20 px-3 py-1 text-sm text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95"
                      onClick={() => respondMentorship(item._id, 'rejected')}
                      disabled={item.status !== 'pending'}
                    >
                      Reject
                    </button>
                    <span className="ml-auto text-xs uppercase tracking-widest text-indigo-300">{item.status}</span>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState title="No incoming requests" subtitle="Student requests will appear here." />
            )}
          </div>
        </div>
      )}

      {user.role === 'admin' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/50">
            <h2 className="text-xl font-semibold text-indigo-300">Manage Users</h2>
            <div className="mt-3 max-h-96 space-y-2 overflow-auto">
              {users.length ? (
                users.map((item) => (
                  <article key={item._id} className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-3 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
                    <p className="font-medium text-white">{item.name} ({item.role})</p>
                    <p className="text-sm text-slate-200">{item.email}</p>
                    {item.role !== 'admin' && (
                      <button
                        type="button"
                        className="cursor-pointer mt-2 rounded-lg bg-indigo-500 px-3 py-1 text-xs text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95"
                        onClick={() => toggleUserStatus(item._id, item.isActive)}
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </article>
                ))
              ) : (
                <EmptyState title="No users found" subtitle="User list will appear here." />
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/50">
            <h2 className="text-xl font-semibold text-indigo-300">Review Experiences</h2>
            <div className="mt-3 max-h-96 space-y-2 overflow-auto">
              {pendingExperiences.length ? (
                pendingExperiences.map((item) => (
                  <article key={item._id} className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-3 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/50">
                    <p className="font-medium text-white">{item.company} - {item.role}</p>
                    <p className="line-clamp-2 text-sm text-slate-200">{item.interviewExperience}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        className="cursor-pointer rounded-lg bg-indigo-500 px-3 py-1 text-xs text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95"
                        onClick={() => reviewExperience(item._id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer rounded-lg bg-white/20 px-3 py-1 text-xs text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95"
                        onClick={() => reviewExperience(item._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState title="No pending experiences" subtitle="All experience posts are already reviewed." />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardPage;
