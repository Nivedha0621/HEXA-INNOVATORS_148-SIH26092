import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calculator, MapPin } from 'lucide-react';
import DocumentChecklist from '../components/DocumentChecklist';
import { useLanguage } from '../hooks/useLanguage';
import { fetchScheme } from '../services/api';
import { formatLakh } from '../utils/emi';

export default function SchemeDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScheme(id)
      .then(setScheme)
      .catch(() => setError('Failed to load scheme details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="scheme-details">
        <div className="empty-state">
          <h3>Scheme not found</h3>
          <p>{error || 'The scheme you are looking for does not exist.'}</p>
          <Link to="/explore" className="btn btn-primary">Browse Schemes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="scheme-details">
      <Link to="/explore" className="btn btn-outline btn-sm" style={{ marginBottom: 'var(--space-4)' }}>
        <ArrowLeft size={16} />
        {t('backToRecommendations')}
      </Link>

      <div className="scheme-details-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1>{scheme.name}</h1>
            <p style={{ color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>{scheme.description}</p>
          </div>
          <span className="status-badge active" style={{ fontSize: 'var(--text-sm)' }}>
            {scheme.beneficiaryType === 'entrepreneur' ? t('entrepreneur') : t('student')}
          </span>
        </div>

        <div className="scheme-details-grid">
          <div className="scheme-detail-item">
            <div className="label">{t('projectCostRange')}</div>
            <div className="value">{scheme.financials.projectCostRange}</div>
          </div>
          <div className="scheme-detail-item">
            <div className="label">{t('maxLoan')}</div>
            <div className="value">{formatLakh(scheme.financials.maxLoanAmount)}</div>
          </div>
          <div className="scheme-detail-item">
            <div className="label">{t('interest')}</div>
            <div className="value">{scheme.financials.interestRateDisplay}</div>
          </div>
          <div className="scheme-detail-item">
            <div className="label">{t('repayment')}</div>
            <div className="value">{scheme.financials.repaymentDisplay}</div>
          </div>
          <div className="scheme-detail-item">
            <div className="label">{t('moratorium')}</div>
            <div className="value">{scheme.financials.moratoriumDisplay}</div>
          </div>
        </div>

        <div className="scheme-actions-row">
          <Link
            to={`/emi-calculator?loan=${scheme.financials.maxLoanAmount}&rate=${scheme.financials.interestRate}&tenure=${scheme.financials.repaymentYears}`}
            className="btn btn-primary"
          >
            <Calculator size={16} />
            {t('calculateEMI')}
          </Link>
          <Link to={`/partners?scheme=${scheme.id}`} className="btn btn-outline">
            <MapPin size={16} />
            {t('findPartner')}
          </Link>
        </div>
      </div>

      <DocumentChecklist documents={scheme.requiredDocuments} />

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
          Scheme Metadata
        </h3>
        <div className="scheme-details-grid">
          <div className="scheme-detail-item">
            <div className="label">{t('source')}</div>
            <div className="value" style={{ fontSize: 'var(--text-sm)' }}>{scheme.source}</div>
          </div>
          <div className="scheme-detail-item">
            <div className="label">{t('effectiveDate')}</div>
            <div className="value" style={{ fontSize: 'var(--text-sm)' }}>{scheme.effectiveDate}</div>
          </div>
          <div className="scheme-detail-item">
            <div className="label">{t('version')}</div>
            <div className="value" style={{ fontSize: 'var(--text-sm)' }}>v{scheme.version}</div>
          </div>
          <div className="scheme-detail-item">
            <div className="label">{t('lastUpdated')}</div>
            <div className="value" style={{ fontSize: 'var(--text-sm)' }}>{scheme.lastUpdated}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
