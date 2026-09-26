import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import EligibilityExplanation from './EligibilityExplanation';
import { useLanguage } from '../hooks/useLanguage';
import { formatLakh } from '../utils/emi';

export default function RecommendationCard({ result }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const { t } = useLanguage();
  const { scheme, matchScore } = result;

  const matchLevel = matchScore >= 80 ? 'high' : matchScore >= 50 ? 'medium' : 'low';

  return (
    <div className="scheme-card">
      <div className="scheme-card-header">
        <div>
          <h3>{scheme.name}</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', marginTop: 'var(--space-1)' }}>
            {scheme.description}
          </p>
        </div>
        <span className={`match-badge ${matchLevel}`}>
          {matchScore}% {t('match')}
        </span>
      </div>

      <div className="scheme-card-stats">
        <div className="scheme-stat">
          <span className="scheme-stat-label">{t('maxLoan')}</span>
          <span className="scheme-stat-value">{formatLakh(scheme.financials.maxLoanAmount)}</span>
        </div>
        <div className="scheme-stat">
          <span className="scheme-stat-label">{t('interest')}</span>
          <span className="scheme-stat-value">{scheme.financials.interestRateDisplay}</span>
        </div>
        <div className="scheme-stat">
          <span className="scheme-stat-label">{t('repayment')}</span>
          <span className="scheme-stat-value">{scheme.financials.repaymentDisplay}</span>
        </div>
        <div className="scheme-stat">
          <span className="scheme-stat-label">{t('moratorium')}</span>
          <span className="scheme-stat-value">{scheme.financials.moratoriumDisplay}</span>
        </div>
      </div>

      <div className="scheme-card-actions">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? t('hideWhy') : t('viewWhy')}
          {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <Link to={`/scheme/${scheme.id}`} className="btn btn-primary btn-sm">
          {t('viewDetails')}
          <ArrowRight size={16} />
        </Link>
      </div>

      {showExplanation && <EligibilityExplanation result={result} />}
    </div>
  );
}
