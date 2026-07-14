import './Spinner.css';

const Spinner = ({ size = 'md', label = 'Loading...' }) => (
  <div className={`lb-spinner-wrap lb-spinner-wrap--${size}`} role="status" aria-live="polite">
    <span className="lb-spinner-ring" />
    <span className="visually-hidden">{label}</span>
  </div>
);

export default Spinner;
