import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import useAuth from '../../hooks/useAuth.js';
import GoogleLoginButton from '../auth/GoogleLoginButton.jsx';
import TriCoreLogo from '../common/TriCoreLogo.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/corporate-events', label: 'Corporate' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar({ marketing = false }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const mobileIdentity = user?.name || user?.email || 'Signed in';

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={
        marketing
          ? 'sticky top-0 z-50 border-b border-[rgba(212,175,55,0.12)] bg-[rgba(10,10,10,0.88)] backdrop-blur'
          : 'sticky top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur'
      }
    >
      <div className={`container-shell flex items-center justify-between ${marketing ? 'py-5' : 'py-3 sm:py-4'}`}>
        <Link className="flex items-center gap-3" to="/">
          <TriCoreLogo
            markClassName="h-12 w-12"
            titleClassName={
              marketing
                ? 'font-display text-xl font-extrabold uppercase tracking-[0.18em] text-white sm:text-2xl'
                : 'font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-[1.85rem]'
            }
            subtitleClassName={
              marketing
                ? 'text-[10px] uppercase tracking-[0.28em] text-[#d4af37] sm:text-[11px]'
                : 'text-xs text-slate-500 sm:text-sm'
            }
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                marketing
                  ? `text-xs font-medium uppercase tracking-[0.2em] transition ${
                      isActive ? 'text-[#d4af37]' : 'text-[#a0a0a0] hover:text-white'
                    }`
                  : `text-sm font-medium transition ${
                      isActive ? 'text-brand-blue' : 'text-slate-600 hover:text-slate-950'
                    }`
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink
                className={
                  marketing
                    ? 'text-xs font-medium uppercase tracking-[0.2em] text-[#a0a0a0] hover:text-white'
                    : 'text-sm font-medium text-slate-600 hover:text-slate-950'
                }
                to="/dashboard"
              >
                Dashboard
              </NavLink>
              <button
                className={marketing ? 'public-btn-secondary min-h-0 px-5 py-3' : 'btn-secondary'}
                onClick={logout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <GoogleLoginButton />
          )}
          <Link
            className={
              marketing
                ? 'text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37] hover:text-white'
                : 'text-sm font-semibold text-brand-blue'
            }
            to="/admin-portal/login"
          >
            Admin Portal
          </Link>
        </nav>

        <button
          aria-expanded={open}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          className={
            marketing
              ? 'inline-flex h-11 w-11 items-center justify-center border border-[rgba(212,175,55,0.2)] bg-[rgba(255,255,255,0.03)] text-[#d4af37] transition hover:bg-[rgba(255,255,255,0.06)] md:hidden'
              : 'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-blue/20 bg-white text-brand-blue transition hover:bg-brand-mist md:hidden'
          }
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${open ? 'translate-y-[7px] rotate-45' : ''}`.trim()}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition ${open ? 'opacity-0' : ''}`.trim()}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition ${open ? '-translate-y-[7px] -rotate-45' : ''}`.trim()}
            />
          </span>
        </button>
      </div>

      {isAuthenticated ? (
        <div
          className={
            marketing
              ? 'border-t border-[rgba(212,175,55,0.12)] bg-[rgba(10,10,10,0.96)] md:hidden'
              : 'border-t border-slate-200/80 bg-white/95 md:hidden'
          }
        >
          <div className="container-shell flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p
                className={
                  marketing
                    ? 'text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]'
                    : 'text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue'
                }
              >
                Logged in
              </p>
              <p className={`truncate text-sm font-semibold ${marketing ? 'text-white' : 'text-slate-900'}`}>
                {mobileIdentity}
              </p>
            </div>
            <Link
              className={
                marketing
                  ? 'public-btn-secondary min-h-0 shrink-0 px-4 py-2 text-[10px]'
                  : 'btn-secondary shrink-0 px-4 py-2 text-xs'
              }
              to="/dashboard"
            >
              Dashboard
            </Link>
          </div>
        </div>
      ) : null}

      {open ? (
        <div
          className={
            marketing
              ? 'border-t border-[rgba(212,175,55,0.12)] bg-[rgba(10,10,10,0.98)] md:hidden'
              : 'border-t border-slate-200 bg-white/98 shadow-soft md:hidden'
          }
        >
          <div className="container-shell space-y-4 py-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                className={
                  marketing
                    ? 'block border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#a0a0a0]'
                    : 'block rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700'
                }
                onClick={() => setOpen(false)}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <div
                  className={
                    marketing
                      ? 'border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.08)] px-4 py-3'
                      : 'rounded-2xl bg-brand-mist px-4 py-3'
                  }
                >
                  <p
                    className={
                      marketing
                        ? 'text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]'
                        : 'text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue'
                    }
                  >
                    Signed in
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${marketing ? 'text-white' : 'text-slate-900'}`}>
                    {mobileIdentity}
                  </p>
                </div>
                <NavLink
                  className={
                    marketing
                      ? 'block border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#a0a0a0]'
                      : 'block rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700'
                  }
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
                <button
                  className={marketing ? 'public-btn-secondary w-full' : 'btn-secondary w-full'}
                  onClick={logout}
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <GoogleLoginButton />
            )}
            <Link
              className={
                marketing
                  ? 'block border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.08)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#d4af37]'
                  : 'block rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-brand-blue'
              }
              to="/admin-portal/login"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
