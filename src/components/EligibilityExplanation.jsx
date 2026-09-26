import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function EligibilityExplanation({ result }) {
  const { t } = useLanguage();

  return (
    <div className="explanation-panel">
      <h4>
        <CheckCircle size={18} />
        {t('whyStrongMatch')}
      </h4>
      <ul className="explanation-list">
        {result.eligibilityReasons.map((reason, i) => (
          <li key={i}>
            <CheckCircle size={16} />
            {reason}
          </li>
        ))}
      </ul>

      <h4 style={{ marginTop: 'var(--space-4)' }}>
        {t('whyRanked')} #{result.rank}
      </h4>
      <div className="ranking-note">
        {result.rankingExplanation}
      </div>

      <div className="match-score-display">
        {t('matchScore')}: {result.matchScore}/100
      </div>
    </div>
  );
}
