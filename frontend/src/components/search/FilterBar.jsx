import { IndianRupee, MapPin, Clock, Star, Home, ShieldCheck } from 'lucide-react';
import './FilterBar.css';

// Values match the backend's `sortBy` enum exactly (searchQuerySchema).
export const SORT_OPTIONS = [
  { key: 'price_low', label: 'Price: Low to High', icon: IndianRupee },
  { key: 'price_high', label: 'Price: High to Low', icon: IndianRupee },
  { key: 'distance', label: 'Distance', icon: MapPin },
  { key: 'turnaround', label: 'Report Time', icon: Clock },
  { key: 'rating', label: 'Rating', icon: Star },
];

// Keys match the backend's boolean filter params exactly.
export const FILTER_OPTIONS = [
  { key: 'homeCollection', label: 'Home Collection', icon: Home },
  { key: 'nablCertified', label: 'NABL Certified', icon: ShieldCheck },
];

/**
 * Sort + filter pill bar, matching the approved search results mockup.
 * `sortBy` is the single active backend sort key; `filters` is a Set of
 * active filter keys sent straight through as query params.
 */
const FilterBar = ({ sortBy, onSortChange, filters, onFilterToggle }) => (
  <div className="lb-filterbar">
    <div className="lb-filterbar__group">
      <span className="lb-filterbar__label">Sort by:</span>
      {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className={`lb-filter-pill ${sortBy === key ? 'lb-filter-pill--active' : ''}`}
          onClick={() => onSortChange(key)}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </div>

    <div className="lb-filterbar__group">
      {FILTER_OPTIONS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className={`lb-filter-pill ${filters.has(key) ? 'lb-filter-pill--active' : ''}`}
          onClick={() => onFilterToggle(key)}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default FilterBar;
