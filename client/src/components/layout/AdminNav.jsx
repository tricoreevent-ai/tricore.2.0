import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import AppIcon from '../common/AppIcon.jsx';
import {
  adminPermissions,
  hasAnyAdminPermission
} from '../../data/adminAccess.js';
import useAdminAuth from '../../hooks/useAdminAuth.js';

const adminLinks = [
  { to: '/admin-portal', label: 'Dashboard', icon: 'overview', permissions: [adminPermissions.overview] },
  { to: '/admin-portal/events', label: 'Events', icon: 'events', permissions: [adminPermissions.events] },
  {
    to: '/admin-portal/registrations',
    label: 'Registrations',
    icon: 'registrations',
    permissions: [adminPermissions.registrations]
  },
  { to: '/admin-portal/matches', label: 'Matches', icon: 'matches', permissions: [adminPermissions.matches] },
  {
    to: '/admin-portal/accounting',
    label: 'Accounting',
    icon: 'accounting',
    permissions: [adminPermissions.accountingTransactions]
  },
  {
    to: '/admin-portal/reports',
    label: 'Reports',
    icon: 'reports',
    permissions: [adminPermissions.reports, adminPermissions.accountingReports]
  },
  { to: '/admin-portal/users', label: 'Users', icon: 'users', permissions: [adminPermissions.users] },
  { to: '/admin-portal/settings', label: 'Settings', icon: 'settings', permissions: [adminPermissions.settings] }
];

const alwaysVisibleLinks = [{ to: '/admin-portal/user-manual', label: 'User Manual', icon: 'book' }];

export default function AdminNav({
  className = '',
  mobileOpen: controlledMobileOpen,
  onMobileOpenChange,
  showDesktop = true,
  showMobile = true,
  showMobileTrigger = true
}) {
  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAdminAuth();
  const visibleLinks = adminLinks.filter((link) =>
    hasAnyAdminPermission(user, link.permissions)
  );
  const combinedLinks = [...visibleLinks, ...alwaysVisibleLinks];
  const mobileOpen =
    controlledMobileOpen !== undefined ? controlledMobileOpen : uncontrolledMobileOpen;
  const setMobileOpen = onMobileOpenChange || setUncontrolledMobileOpen;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, user?._id]);

  return (
    <div className={className}>
      {showMobile ? (
        <div className="md:hidden">
          {showMobileTrigger ? (
            <button
              aria-expanded={mobileOpen}
              className="admin-btn-secondary w-full justify-between"
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
            >
              <span>Admin Sections</span>
              <AppIcon className="h-4 w-4" name={mobileOpen ? 'chevronUp' : 'chevronDown'} />
            </button>
          ) : null}

          {mobileOpen ? (
            <div className={`admin-panel mt-3 grid gap-px bg-[rgba(212,175,55,0.12)] ${showMobileTrigger ? '' : 'mt-0'}`.trim()}>
              {combinedLinks.map((link) => (
                <NavLink
                  key={link.to}
                  className={({ isActive }) =>
                    `flex min-h-[48px] items-center gap-3 bg-[#141414] px-4 text-sm font-medium transition ${
                      isActive ? 'text-[#d4af37]' : 'text-[#a0a0a0] hover:text-white'
                    }`
                  }
                  end={link.to === '/admin-portal'}
                  onClick={() => setMobileOpen(false)}
                  to={link.to}
                >
                  <AppIcon className="h-[18px] w-[18px]" name={link.icon} />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {showDesktop ? (
        <nav className="hidden px-3 py-4 md:block">
          {combinedLinks.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'admin-sidebar-link-active' : ''}`.trim()
              }
              end={link.to === '/admin-portal'}
              to={link.to}
            >
              <AppIcon className="h-[18px] w-[18px]" name={link.icon} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
