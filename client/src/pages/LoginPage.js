import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to sign in. Please verify backend service is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-7 shadow-lg shadow-indigo-900/40 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-200">Sign in to access your alumni portal</p>

        {error && (
          <p className="mt-4 rounded-xl border border-red-300/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <input
            className="rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="rounded-xl border border-white/30 bg-transparent p-3 text-white placeholder:text-slate-300 outline-none transition-all duration-200 ease-in-out focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition-all duration-200 ease-in-out hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-200">
          New here?{' '}
          <Link to="/register" className="font-semibold text-indigo-300 transition-colors duration-200 hover:text-indigo-400">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
