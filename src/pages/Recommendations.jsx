import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, SearchX, ArrowLeft } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import { useLanguage } from '../hooks/useLanguage';

export default function Recommendations() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], profile = {} } = location.state || {};

  if (!location.state) {
    return (
      <div className="recommendations-page">
        <div className="empty-state">
          <SearchX size={64} />
          <h3>No Profile Data</h3>
          <p>Please complete the questionnaire first to get scheme recommendations.</p>
          <Link to="/find-scheme" className="btn btn-primary">
            {t('findMyScheme')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <button
        className="btn btn-outline btn-sm"
        onClick={() => navigate('/find-scheme')}
        style={{ marginBottom: 'var(--space-4)' }}
      >
        <ArrowLeft size={16} />
        {t('tryAgain')}
      </button>

      <div className="disclaimer-banner">
        <AlertTriangle size={16} />
        {t('disclaimer')}
      </div>

      <div className="recommendations-header">
        <h1>{t('recommendedSchemes')}</h1>
        <p>{t('recommendedSubtitle')}</p>
        {profile.name && (
          <p style={{ marginTop: 'var(--space-2)', color: 'var(--gray-600)', fontWeight: 500 }}>
            Profile: {profile.name} • {profile.userType === 'entrepreneur' ? t('entrepreneur') : t('student')} • {profile.state}
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="recommendations-grid">
          {results.map((result) => (
            <RecommendationCard key={result.scheme.id} result={result} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <SearchX size={64} />
          <h3>{t('noMatchTitle')}</h3>
          <p>{t('noMatchDesc')}</p>
          <button className="btn btn-primary" onClick={() => navigate('/find-scheme')}>
            {t('tryAgain')}
          </button>
        </div>
      )}
    </div>
  );
}
