import { Star, MapPin, Clock, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './LabCard.css';

/**
 * Single lab result row, matching the approved search results mockup.
 * Shape matches the backend's /search response exactly (searchService.js):
 * { lab_test_id, test: {test_name}, lab: {name, address, rating, logo_url,
 *   nabl_certified}, price, discounted_price, savings, turnaround_time,
 *   home_collection, distance_km }
 */
const LabCard = ({ result }) => {
  const navigate = useNavigate();
  const { lab_test_id, lab, test, price, discounted_price, savings, turnaround_time, home_collection, distance_km } = result;

  const displayPrice = discounted_price ?? price;

  return (
    <div className="lb-labcard">
      <div className="lb-labcard__logo">
        {lab.logo_url ? (
          <img src={lab.logo_url} alt={`${lab.name} logo`} />
        ) : (
          <span>{lab.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>

      <div className="lb-labcard__info">
        <div className="lb-labcard__title-row">
          <h3>{lab.name}</h3>
          <span className="lb-labcard__rating">
            <Star size={14} fill="currentColor" /> {lab.rating ?? '—'}
          </span>
          {lab.nabl_certified && <Badge tone="info">NABL Certified</Badge>}
        </div>

        <div className="lb-labcard__meta">
          <span>{test.test_name}</span>
          {distance_km !== null && distance_km !== undefined && (
            <span>
              <MapPin size={13} /> {distance_km.toFixed(1)} km away
            </span>
          )}
        </div>

        {home_collection ? (
          <Badge tone="success">
            <Home size={12} /> Home Collection
          </Badge>
        ) : (
          <Badge tone="neutral">Walk-in Only</Badge>
        )}
      </div>

      <div className="lb-labcard__report">
        <span className="lb-labcard__report-label">REPORTS IN</span>
        <span className="lb-labcard__report-time">
          <Clock size={14} /> {turnaround_time}
        </span>
      </div>

      <div className="lb-labcard__action">
        {savings > 0 && (
          <div className="lb-labcard__price-row">
            <span className="lb-labcard__strike">₹{price}</span>
            <Badge tone="success">Save ₹{savings}</Badge>
          </div>
        )}
        <Button variant="primary" size="md" onClick={() => navigate(`/booking/${lab_test_id}`)}>
          Book Now ₹{displayPrice}
        </Button>
      </div>
    </div>
  );
};

export default LabCard;
