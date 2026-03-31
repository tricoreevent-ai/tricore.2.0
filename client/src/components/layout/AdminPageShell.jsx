import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getSecurityAlerts } from '../../api/securityAlertApi.js';
import useAdminAuth from '../../hooks/useAdminAuth.js';
import useAdminTheme from '../../hooks/useAdminTheme.js';
import { adminPermissions, getAdminRoleLabel } from '../../data/adminAccess.js';
import AppIcon from '../common/AppIcon.jsx';
import AdminNav from './AdminNav.jsx';
import TriCoreLogo from '../common/TriCoreLogo.jsx';
import { formatDateTime } from '../../utils/formatters.js';

const getAlertIconName = (alert) => {
  if (alert?.category === 'contact') {
    return 'users';
  }

  if (alert?.category === 'registration') {
    return 'registrations';
  }

  if (alert?.category === 'payment') {
    return 'accounting';
  }

  return 'security';
};

export default function AdminPageShell({
  children,
  description,
  mobileDescription = description,
  title
}) {
  const { hasAnyPermission, logout, user } = useAdminAuth();
  const { theme } = useAdminTheme();
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [alertSummary, setAlertSummary] = useState({ items: [], openCount: 0 });
  const canSeeSecurityAlerts = hasAnyPermission([
    adminPermissions.overview,
    adminPermissions.reports,
    adminPermissions.settings
  ]);

  useEffect(() => {
    if (!canSeeSecurityAlerts) {
      setAlertSummary({ items: [], openCount: 0 });
      return undefined;
    }

    let ignore = false;

    const loadAlerts = async () => {
      try {
        const response = await getSecurityAlerts({ status: 'open', limit: 5 });

        if (!ignore) {
          setAlertSummary({
            items: response.items || [],
            openCount: response.openCount || 0
          });
        }
      } catch {
        if (!ignore) {
          setAlertSummary({ items: [], openCount: 0 });
        }
      }
    };

    loadAlerts();
    const intervalId = window.setInterval(loadAlerts, 45000);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [canSeeSecurityAlerts]);

  return (
    <div className="admin-portal min-h-screen" data-admin-theme={theme}>
      <div className="min-h-screen md:grid md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[rgba(255,255,255,0.08)] bg-[#111111] md:flex md:flex-col">
          <div className="px-6 py-6">
            <Link
              className="block transition hover:opacity-90"
              onClick={() => {
                setMobileNavOpen(false);
                setAlertsOpen(false);
              }}
              to="/admin-portal"
            >
              <TriCoreLogo
                markClassName="h-10 w-10"
                subtitle="Admin Portal"
                subtitleClassName="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#d4af37]"
                titleClassName="text-base font-extrabold uppercase tracking-[0.18em] text-white"
              />
            </Link>
          </div>
          <div className="h-px bg-[rgba(255,255,255,0.08)]" />
          <div className="flex-1 overflow-y-auto">
            <AdminNav className="h-full" showMobile={false} />
          </div>
          <div className="border-t border-[rgba(255,255,255,0.08)] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(212,175,55,0.08)] text-[#d4af37]">
                <AppIcon className="h-4 w-4" name="users" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-white">{user?.name || 'Admin User'}</p>
                <p className="truncate text-[11px] text-[#666666]">{getAdminRoleLabel(user)}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-[90] border-b border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.92)] backdrop-blur">
            <div className="admin-shell flex min-h-[64px] items-center justify-between gap-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  aria-expanded={mobileNavOpen}
                  aria-label={mobileNavOpen ? 'Close admin navigation menu' : 'Open admin navigation menu'}
                  className="admin-btn-secondary px-3 md:hidden"
                  onClick={() => {
                    setMobileNavOpen((current) => !current);
                    setAlertsOpen(false);
                  }}
                  type="button"
                >
                  <AppIcon className="h-4 w-4" name={mobileNavOpen ? 'close' : 'menu'} />
                </button>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#666666]">
                    Admin Portal
                  </p>
                  <p className="admin-topbar-title truncate">{title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {canSeeSecurityAlerts ? (
                  <div className="relative">
                    <button
                      className="admin-btn-secondary"
                      onClick={() => {
                        setAlertsOpen((current) => !current);
                        setMobileNavOpen(false);
                      }}
                      type="button"
                    >
                      <AppIcon className="h-4 w-4" name="bell" />
                      Alerts
                      {alertSummary.openCount ? (
                        <span className="rounded-full bg-[#f44336] px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {alertSummary.openCount}
                        </span>
                      ) : null}
                    </button>
                    {alertsOpen ? (
                      <div className="admin-panel absolute right-0 top-[calc(100%+0.75rem)] z-[140] w-[min(92vw,340px)] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="admin-label">Critical Alerts</p>
                            <p className="mt-2 text-sm text-[#a0a0a0]">
                              {alertSummary.openCount || 0} open notifications
                            </p>
                          </div>
                          <Link
                            className="text-sm font-semibold text-[#d4af37]"
                            onClick={() => setAlertsOpen(false)}
                            to="/admin-portal/reports?tab=security"
                          >
                            Open
                          </Link>
                        </div>
                        <div className="mt-4 grid gap-px bg-[rgba(255,255,255,0.08)]">
                          {alertSummary.items.length ? (
                            alertSummary.items.map((alert) => (
                              <div className="bg-[#141414] p-4" key={alert._id}>
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`flex h-8 w-8 items-center justify-center ${
                                      alert.severity === 'critical'
                                        ? 'bg-red-500/10 text-red-300'
                                        : alert.severity === 'high'
                                          ? 'bg-amber-500/10 text-amber-300'
                                          : 'bg-sky-500/10 text-sky-300'
                                    }`}
                                  >
                                    <AppIcon className="h-4 w-4" name={getAlertIconName(alert)} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white">{alert.title}</p>
                                    <p className="mt-1 text-xs leading-5 text-[#a0a0a0]">{alert.message}</p>
                                    <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#666666]">
                                      {formatDateTime(alert.lastSeenAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="bg-[#141414] px-4 py-5 text-sm text-[#a0a0a0]">
                              No open admin alerts right now.
                            </p>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <button className="admin-btn-secondary" onClick={logout} type="button">
                  <AppIcon className="h-4 w-4" name="logout" />
                  Logout
                </button>
              </div>
            </div>

            <div className="admin-shell pb-4 md:hidden">
              <AdminNav
                mobileOpen={mobileNavOpen}
                onMobileOpenChange={setMobileNavOpen}
                showDesktop={false}
                showMobile
                showMobileTrigger={false}
              />
            </div>
          </header>

          <main className="admin-shell py-6 sm:py-8 lg:py-10">
            <section className="admin-panel mb-8 p-6 sm:p-8">
              <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
                <div>
                  <p className="admin-label">Operations Console</p>
                  <h1 className="mt-4 text-[42px] font-extrabold tracking-[-1px]">{title}</h1>
                  {mobileDescription ? (
                    <p className="mt-4 text-sm leading-7 text-[#a0a0a0] sm:hidden">{mobileDescription}</p>
                  ) : null}
                  {description ? (
                    <p className="mt-4 hidden max-w-3xl text-sm leading-7 text-[#a0a0a0] sm:block">
                      {description}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-px bg-[rgba(255,255,255,0.08)] sm:grid-cols-2">
                  <div className="bg-[#141414] px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#666666]">
                      Signed In Role
                    </p>
                    <p className="mt-2 text-xl font-extrabold text-white">{getAdminRoleLabel(user)}</p>
                  </div>
                  <div className="bg-[#141414] px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#666666]">
                      Open Alerts
                    </p>
                    <p className="mt-2 text-xl font-extrabold text-white">{alertSummary.openCount || 0}</p>
                  </div>
                </div>
              </div>
            </section>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
