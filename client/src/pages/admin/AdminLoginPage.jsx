import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import AppIcon from '../../components/common/AppIcon.jsx';
import TriCoreLogo from '../../components/common/TriCoreLogo.jsx';
import useAdminAuth from '../../hooks/useAdminAuth.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticating, isAuthenticated, loading, login } = useAdminAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate replace to="/admin-portal" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      await login(form.username, form.password);
      navigate(location.state?.from?.pathname || '/admin-portal', { replace: true });
    } catch (loginError) {
      const fallbackMessage =
        !loginError.response && typeof window !== 'undefined'
          ? `Admin login failed. Cannot reach the server from this device. Try ${window.location.origin}/api/health first.`
          : 'Admin login failed.';

      setError(loginError.response?.data?.message || fallbackMessage);
    }
  };

  return (
    <div className="admin-portal min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:flex lg:items-center lg:px-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80')] bg-cover bg-center opacity-25" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0A0AFF_0%,#0A0A0A88_50%,#0A0A0AFF_100%)]" />
          <div className="relative z-10 max-w-xl">
            <TriCoreLogo
              markClassName="h-12 w-12"
              subtitle="Operations Console"
              subtitleClassName="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d4af37]"
              titleClassName="text-[28px] font-extrabold tracking-[0.18em] uppercase text-white"
            />
            <h1 className="mt-10 text-[42px] font-extrabold leading-[1.02] tracking-[-1px] text-white xl:text-[52px]">
              Manage your events platform from one admin portal
            </h1>
            <div className="mt-8 h-1 w-16 bg-[#d4af37]" />
            <p className="mt-8 text-base leading-8 text-[#a0a0a0]">
              Sign in to control events, registrations, schedules, payments, reports, and site
              settings from the same operations console.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-14 sm:px-8 lg:px-16">
          <div className="w-full max-w-xl">
            <div className="admin-panel p-8 sm:p-10">
              <div className="lg:hidden">
                <TriCoreLogo
                  markClassName="h-12 w-12"
                  subtitle="Operations Console"
                  subtitleClassName="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d4af37]"
                  titleClassName="text-xl font-extrabold uppercase tracking-[0.18em] text-white"
                />
              </div>

              <p className="admin-label mt-8 lg:mt-0">Admin Login</p>
              <h1 className="mt-4 text-[28px] font-extrabold tracking-[0.12em] text-white">Sign In</h1>
              <p className="mt-3 text-sm leading-7 text-[#a0a0a0]">
                Sign in with local admin credentials. Default bootstrap login is username{' '}
                <strong className="text-white">tricore</strong> and password{' '}
                <strong className="text-white">tricore</strong>.
              </p>
              <p className="mt-2 text-sm leading-7 text-[#666666]">
                Change that password immediately from the Users section after logging in.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="label" htmlFor="admin-username">
                    Username
                  </label>
                  <input
                    className="input"
                    id="admin-username"
                    onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                    required
                    value={form.username}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="admin-password">
                    Password
                  </label>
                  <input
                    className="input"
                    id="admin-password"
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    required
                    type="password"
                    value={form.password}
                  />
                </div>
                {error ? (
                  <p className="border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                ) : null}
                <button className="btn-primary w-full gap-2" disabled={authenticating} type="submit">
                  {authenticating ? 'Signing in...' : 'Sign In to Admin Portal'}
                  <AppIcon className="h-4 w-4" name="chevronRight" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
