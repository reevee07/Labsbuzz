import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { searchLabTests } from '../services/searchService';
import FilterBar from '../components/search/FilterBar';
import LabCard from '../components/search/LabCard';
import Spinner from '../components/common/Spinner';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [filters, setFilters] = useState(new Set());

  const filterParams = useMemo(
    () => ({
      q: query || undefined,
      sortBy,
      homeCollection: filters.has('homeCollection') || undefined,
      nablCertified: filters.has('nablCertified') || undefined,
    }),
    [query, sortBy, filters]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    searchLabTests(filterParams)
      .then((data) => {
        if (cancelled) return;
        setResults(data.results || []);
        setMeta(data.meta || null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load results. Please try again.');
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [filterParams]);

  const handleFilterToggle = (key) => {
    setFilters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="lb-search-page">
      <div className="container">
        <h1 className="lb-search-page__title">Diagnostic Labs</h1>

        <div className="lb-search-page__category">
          <FlaskConical size={16} />
          <span>{query || 'All Tests'}</span>
        </div>

        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          filters={filters}
          onFilterToggle={handleFilterToggle}
        />

        {loading && (
          <div className="lb-search-page__status">
            <Spinner size="lg" />
          </div>
        )}

        {!loading && error && <div className="lb-search-page__status lb-search-page__status--error">{error}</div>}

        {!loading && !error && results.length === 0 && (
          <div className="lb-search-page__status">
            No labs found{query ? ` for "${query}"` : ''}. Try a different test name.
          </div>
        )}

        {!loading &&
          !error &&
          results.map((r) => <LabCard key={r.lab_test_id} result={r} />)}

        {meta && meta.total > 0 && (
          <p className="lb-search-page__count">
            Showing {results.length} of {meta.total} results
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
