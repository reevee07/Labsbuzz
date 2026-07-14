import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './DashboardLayout.css';

const CUSTOMER_MENU = [
  { label: 'Overview', to: '/dashboard', icon: '\u2302', end: true },
  { label: 'Bookings', to: '/dashboard/bookings', icon: '\uD83D\uDCC5' },
  { label: 'Saved Labs', to: '/dashboard/saved-labs', icon: '\u2665' },
  { label: 'Notifications', to: '/dashboard/notifications', icon: '\uD83D\uDD14' },
  { label: 'Profile', to: '/dashboard/profile', icon: '\uD83D\uDC64' },
  { label: 'Settings', to: '/dashboard/settings', icon: '\u2699' },
];

const LAB_OWNER_MENU = [
  { label: 'Overview', to: '/lab-owner/dashboard', icon: '\u2302', end: true },
  { label: 'Manage Tests', to: '/lab-owner/tests', icon: '\uD83E\uDDEA' },
  { label: 'Bookings', to: '/lab-owner/bookings', icon: '\uD83D\uDCC5' },
  { label: 'Calendar', to: '/lab-owner/calendar', icon: '\uD83D\uDDD3' },
  { label: 'Lab Profile', to: '/lab-owner/profile', icon: '\uD83C\uDFE2' },
  { label: 'Settings', to: '/lab-owner/settings', icon: '\u2699' },
];

const DashboardLayout = ({ role = 'customer' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menu = role === 'lab_owner' ? LAB_OWNER_MENU : CUSTOMER_MENU;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="lb-dash">
      <button
        className="lb-dash__mobile-toggle"
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        &#9776;
      </button>

      <aside className={`lb-dash__sidebar ${sidebarOpen ? 'lb-dash__sidebar--open' : ''}`}>
        <NavLink to="/" className="lb-dash__logo">
          <span className="lb-navbar__logo-mark">L</span>
          <span>Labsbuzz</span>
        </NavLink>

        <div className="lb-dash__user">
          <div className="lb-dash__avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <p className="lb-dash__user-name">{user?.name || 'User'}</p>
            <p className="lb-dash__user-role">{role === 'lab_owner' ? 'Lab Owner' : 'Customer'}</p>
          </div>
        </div>

        <nav className="lb-dash__nav">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `lb-dash__nav-link ${isActive ? 'lb-dash__nav-link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="lb-dash__nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="lb-dash__logout" onClick={handleLogout}>
          &#8630; Logout
        </button>
      </aside>

      <div className="lb-dash__content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
