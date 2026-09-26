import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { formatLakh } from '../utils/emi';

export default function SchemeCard({ scheme, showActions = true }) {
  const { t } = useLanguage();

  return (
    <div className="scheme-card">
      <div className="scheme-card-header">
        <h3>{scheme.name}</h3>
        <span className="status-badge active">{scheme.beneficiaryType === 'entrepreneur' ? t('entrepreneur') : t('student')}</span>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', marginBottom: 'var(--space-4)' }}>
        {scheme.description}
      </p>
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
      {showActions && (
        <div className="scheme-card-actions">
          <Link to={`/scheme/${scheme.id}`} className="btn btn-primary btn-sm">
            {t('viewDetails')}
          </Link>
          <Link to={`/emi-calculator?loan=${scheme.financials.maxLoanAmount}&rate=${scheme.financials.interestRate}&tenure=${scheme.financials.repaymentYears}`} className="btn btn-outline btn-sm">
            {t('calculateEMI')}
          </Link>
        </div>
      )}
    </div>
  );
}
