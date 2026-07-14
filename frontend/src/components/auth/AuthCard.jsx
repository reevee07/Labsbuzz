import Card from '../common/Card';
import './AuthCard.css';

/**
 * Centered glass card wrapper shared by all auth pages
 * (Login, Register, Forgot Password, Lab Owner variants).
 */
const AuthCard = ({ title, subtitle, children, footer }) => (
  <div className="lb-auth-page">
    <div className="container lb-auth-page__inner">
      <Card className="lb-auth-card">
        <h1 className="lb-auth-card__title">{title}</h1>
        {subtitle && <p className="lb-auth-card__subtitle">{subtitle}</p>}
        {children}
        {footer && <div className="lb-auth-card__footer">{footer}</div>}
      </Card>
    </div>
  </div>
);

export default AuthCard;
