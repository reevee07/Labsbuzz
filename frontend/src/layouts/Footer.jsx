import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="lb-footer">
    <div className="container lb-footer__inner">
      <div className="lb-footer__brand">
        <div className="lb-footer__logo">
          <span className="lb-navbar__logo-mark"></span>
          <span>Labsbuzz</span>
        </div>
        <p className="lb-footer__tagline">Health deserves clarity.</p>
      </div>

      <div className="lb-footer__cols">
        <div className="lb-footer__col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/careers">Careers</Link>
        </div>
        <div className="lb-footer__col">
          <h4>For Customers</h4>
          <Link to="/search">Find Tests</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/dashboard">My Bookings</Link>
        </div>
        <div className="lb-footer__col">
          <h4>For Labs</h4>
          <Link to="/lab-owner/register">List Your Lab</Link>
          <Link to="/lab-owner/login">Lab Login</Link>
        </div>
        <div className="lb-footer__col">
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </div>
    <div className="lb-footer__bottom">
      <div className="container">
        &copy; {new Date().getFullYear()} Labsbuzz. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
