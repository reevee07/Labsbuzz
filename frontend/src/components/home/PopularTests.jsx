import { useNavigate } from 'react-router-dom';
import './PopularTests.css';

const TESTS = [
  { name: 'CBC', icon: '🩸' },
  { name: 'Vitamin D', icon: '☀️' },
  { name: 'LFT', icon: '🫀' },
  { name: 'KFT', icon: '🫘' },
  { name: 'Blood Sugar', icon: '🍬' },
  { name: 'HbA1c', icon: '📊' },
  { name: 'MRI', icon: '🧲' },
  { name: 'CT Scan', icon: '🩻' },
  { name: 'Ultrasound', icon: '📡' },
];

const PopularTests = () => {
  const navigate = useNavigate();

  return (
    <section className="lb-popular">
      <div className="container">
        <h2 className="lb-section-title">Popular Tests &amp; Scans</h2>
        <div className="lb-popular__grid">
          {TESTS.map((t) => (
            <button
              key={t.name}
              type="button"
              className="lb-popular__chip"
              onClick={() => navigate(`/search?q=${encodeURIComponent(t.name)}`)}
            >
              <span className="lb-popular__icon">{t.icon}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTests;
