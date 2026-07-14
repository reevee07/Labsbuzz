import './Badge.css';

/**
 * Small pill-shaped status label.
 * tone: success | warning | danger | info | neutral
 */
const Badge = ({ children, tone = 'neutral', className = '' }) => (
  <span className={`lb-badge lb-badge--${tone} ${className}`}>{children}</span>
);

export default Badge;
