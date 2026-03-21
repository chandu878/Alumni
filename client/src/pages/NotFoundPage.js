import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="mx-auto mt-20 max-w-lg text-center">
      <h1 className="text-5xl font-bold text-amber-300">404</h1>
      <p className="mt-2 text-slate-300">The page you are trying to access does not exist.</p>
      <Link to="/dashboard" className="mt-5 inline-block rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
