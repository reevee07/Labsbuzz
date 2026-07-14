import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Headset, Sparkles, User } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import './Navbar.css';

/**
 * Top navigation - matches the approved homepage mockup:
 * split-color "labsbuzz" wordmark + tagline on the left,
 * pill-shaped Location / Sign In / Support / Register Labs on the right.
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  const dashboardPath = user?.role === 'lab_owner' ? '/lab-owner/dashboard' : '/dashboard';

  return (
    <header className="lb-navbar">
      <div className="container lb-navbar__inner">
        <NavLink to="/" className="lb-navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="lb-navbar__logo-mark">
            <span className="lb-navbar__logo-labs">Labs</span>
            <span className="lb-navbar__logo-buzz">buzz</span>
          </span>
          <span className="lb-navbar__tagline">health deserves clarity</span>
        </NavLink>

        <nav className={`lb-navbar__actions ${menuOpen ? 'lb-navbar__actions--open' : ''}`}>
          <button type="button" className="lb-pill">
            <MapPin size={16} />
            <span>Location</span>
          </button>

          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="lb-pill"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(dashboardPath);
                }}
              >
                <User size={16} />
                <span>{user?.name?.split(' ')[0] || 'Dashboard'}</span>
              </button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <button
              type="button"
              className="lb-pill"
              onClick={() => {
                setMenuOpen(false);
                navigate('/login');
              }}
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}

          <button
            type="button"
            className="lb-pill"
            onClick={() => {
              setMenuOpen(false);
              navigate('/support');
            }}
          >
            <Headset size={16} />
            <span>Support</span>
          </button>

          <button
            type="button"
            className="lb-pill lb-pill--cta"
            onClick={() => {
              setMenuOpen(false);
              navigate('/lab-owner/register');
            }}
          >
            <Sparkles size={16} />
            <span>Register Labs</span>
          </button>
        </nav>

        <button
          className="lb-navbar__toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
