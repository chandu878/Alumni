import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    branch: '',
    graduationYear: '',
    company: '',
    currentRole: '',
    bio: '',
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        ...form,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to register. Please ensure backend and MongoDB are running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 px-4 py-10 text-white">
      <div className="animate-fade-in-soft w-full max-w-3xl rounded-2xl border border-white/20 bg-white/10 p-7 shadow-lg shadow-indigo-900/40 backdrop-blur-md transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/50">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="mt-1 text-sm text-slate-200">Join as student or alumni</p>

        {error && <p className="mt-4 rounded-xl border border-red-300/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} />
          <select className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-white outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>
          <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} />
          <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" name="graduationYear" type="number" placeholder="Graduation Year" value={form.graduationYear} onChange={handleChange} />
          <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" name="company" placeholder="Company" value={form.company} onChange={handleChange} />
          <input className="cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" name="currentRole" placeholder="Current Role" value={form.currentRole} onChange={handleChange} />
          <textarea className="sm:col-span-2 cursor-pointer rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400" name="bio" placeholder="Bio" rows={3} value={form.bio} onChange={handleChange} />
          <button type="submit" className="sm:col-span-2 cursor-pointer rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

        <p className="mt-4 text-sm text-slate-200">
          Already have an account? <Link to="/login" className="font-semibold text-indigo-300 transition-colors duration-200 hover:text-indigo-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
