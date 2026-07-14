import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import './SearchBar.css';

const POPULAR_TESTS = [
  'CBC',
  'Vitamin D',
  'LFT',
  'KFT',
  'Blood Sugar',
  'HbA1c',
  'MRI',
  'CT Scan',
  'Ultrasound',
];

/**
 * Large pill search bar from the hero section of the homepage mockup.
 */
const SearchBar = ({ autoFocus = false }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const filtered = query
    ? POPULAR_TESTS.filter((t) => t.toLowerCase().includes(query.toLowerCase()))
    : POPULAR_TESTS;

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const submitSearch = (term) => {
    const q = (term ?? query).trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="lb-searchbar-wrap">
      <form
        className="lb-searchbar"
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
      >
        <input
          className="lb-searchbar__input"
          type="text"
          placeholder="Search Test / Scan..."
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        <button className="lb-searchbar__btn" type="submit">
          <Search size={18} />
          <span>Search</span>
        </button>
      </form>

      {showSuggestions && filtered.length > 0 && (
        <ul className="lb-searchbar__suggestions">
          {filtered.slice(0, 6).map((t) => (
            <li key={t}>
              <button type="button" onMouseDown={() => submitSearch(t)}>
                {t}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
