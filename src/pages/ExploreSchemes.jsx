import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import SchemeCard from '../components/SchemeCard';
import { fetchSchemes } from '../services/api';

export default function ExploreSchemes() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSchemes()
      .then(setSchemes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? schemes
    : schemes.filter((s) => s.beneficiaryType === filter);

  if (loading) {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1>{t('exploreSchemes')}</h1>
        <div className="radio-group">
          {[
            { value: 'all', label: t('allSchemes') },
            { value: 'entrepreneur', label: t('entrepreneur') },
            { value: 'student', label: t('student') },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`radio-option${filter === opt.value ? ' selected' : ''}`}
            >
              <input
                type="radio"
                name="filter"
                value={opt.value}
                checked={filter === opt.value}
                onChange={() => setFilter(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="explore-grid">
        {filtered.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>
    </div>
  );
}
