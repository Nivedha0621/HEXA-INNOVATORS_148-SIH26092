import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Award, Calculator, MapPin, FileText, ClipboardList, BarChart3 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { fetchSchemes, fetchPartners } from '../services/api';
import { calculateEMI, formatCurrency, formatLakh } from '../utils/emi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0d8ecf', '#15b866', '#f79009', '#9333ea', '#ea580c'];

export default function Dashboard() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check for saved profile/results from sessionStorage or show empty state
  const [profile] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('schemesathi_profile')) || null; } catch { return null; }
  });
  const [results] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('schemesathi_results')) || []; } catch { return []; }
  });

  useEffect(() => {
    Promise.all([fetchSchemes(), fetchPartners({})])
      .then(([s, p]) => { setSchemes(s); setPartners(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  const bestMatch = results.length > 0 ? results[0] : null;
  const bestScheme = bestMatch?.scheme;
  const emiResult = bestScheme
    ? calculateEMI(bestScheme.financials.maxLoanAmount, bestScheme.financials.interestRate, bestScheme.financials.repaymentYears)
    : null;

  const nearbyPartners = profile?.state
    ? partners.filter((p) => p.state === profile.state).slice(0, 3)
    : partners.slice(0, 3);

  const chartData = results.slice(0, 5).map((r) => ({
    name: r.scheme.name.length > 15 ? r.scheme.name.substring(0, 15) + '…' : r.scheme.name,
    score: r.matchScore,
  }));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboardTitle')}</h1>
        {!profile && (
          <p style={{ color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>
            Complete the questionnaire to see your personalized dashboard.{' '}
            <Link to="/find-scheme" style={{ fontWeight: 600 }}>{t('findMyScheme')}</Link>
          </p>
        )}
      </div>

      <div className="dashboard-grid">
        {/* Profile Summary */}
        <div className="dashboard-card">
          <h3><User size={18} /> {t('profileSummary')}</h3>
          {profile ? (
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <div className="dashboard-stat"><span className="label">{t('name')}</span><span className="value" style={{ fontSize: 'var(--text-lg)' }}>{profile.name}</span></div>
              <div className="dashboard-stat"><span className="label">{t('userType')}</span><span className="value" style={{ fontSize: 'var(--text-lg)' }}>{profile.userType === 'entrepreneur' ? t('entrepreneur') : t('student')}</span></div>
              <div className="dashboard-stat"><span className="label">{t('state')}</span><span className="value" style={{ fontSize: 'var(--text-lg)' }}>{profile.state}, {profile.district}</span></div>
              <div className="dashboard-stat"><span className="label">{t('annualIncome')}</span><span className="value" style={{ fontSize: 'var(--text-lg)' }}>{formatCurrency(profile.annualIncome)}</span></div>
            </div>
          ) : (
            <p style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)' }}>No profile data yet</p>
          )}
        </div>

        {/* Best Match */}
        <div className="dashboard-card">
          <h3><Award size={18} /> {t('bestMatch')}</h3>
          {bestMatch ? (
            <div>
              <div className="dashboard-stat">
                <span className="value">{bestScheme.name}</span>
                <span className="label" style={{ marginTop: 'var(--space-1)' }}>{bestMatch.matchScore}% {t('match')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <div className="dashboard-stat"><span className="label">{t('maxLoan')}</span><span style={{ fontWeight: 600 }}>{formatLakh(bestScheme.financials.maxLoanAmount)}</span></div>
                <div className="dashboard-stat"><span className="label">{t('interest')}</span><span style={{ fontWeight: 600 }}>{bestScheme.financials.interestRateDisplay}</span></div>
              </div>
              <Link to={`/scheme/${bestScheme.id}`} className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-4)' }}>
                {t('viewDetails')}
              </Link>
            </div>
          ) : (
            <p style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)' }}>Run scheme matching to see your best match</p>
          )}
        </div>

        {/* Estimated EMI */}
        <div className="dashboard-card">
          <h3><Calculator size={18} /> {t('estimatedEMI')}</h3>
          {emiResult ? (
            <div>
              <div className="dashboard-stat">
                <span className="value">{formatCurrency(emiResult.emi)}</span>
                <span className="label">{t('monthlyEMI')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <div className="dashboard-stat"><span className="label">{t('totalInterest')}</span><span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{formatCurrency(emiResult.totalInterest)}</span></div>
                <div className="dashboard-stat"><span className="label">{t('totalRepayment')}</span><span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{formatCurrency(emiResult.totalPayment)}</span></div>
              </div>
              <Link to={`/emi-calculator?loan=${bestScheme.financials.maxLoanAmount}&rate=${bestScheme.financials.interestRate}&tenure=${bestScheme.financials.repaymentYears}`} className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-4)' }}>
                {t('calculateEMI')}
              </Link>
            </div>
          ) : (
            <p style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)' }}>EMI will appear after scheme matching</p>
          )}
        </div>

        {/* Schemes Matched Chart */}
        <div className="dashboard-card">
          <h3><BarChart3 size={18} /> {t('schemesMatched')}</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)' }}>No match data yet</p>
          )}
        </div>

        {/* Nearby Partners */}
        <div className="dashboard-card">
          <h3><MapPin size={18} /> {t('nearbyPartners')}</h3>
          {nearbyPartners.length > 0 ? (
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {nearbyPartners.map((p) => (
                <div key={p.id} style={{ padding: 'var(--space-3)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{p.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>{p.district}, {p.state}</div>
                </div>
              ))}
              <Link to="/partners" className="btn btn-outline btn-sm">{t('partnerLocator')}</Link>
            </div>
          ) : (
            <p style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)' }}>No partners found</p>
          )}
        </div>

        {/* Application Status */}
        <div className="dashboard-card">
          <h3><ClipboardList size={18} /> {t('applicationStatus')}</h3>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {results.length > 0 ? results.slice(0, 3).map((r) => (
              <div key={r.scheme.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{r.scheme.name}</span>
                <span className="status-badge pending">{t('statusNotStarted')}</span>
              </div>
            )) : (
              <p style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)' }}>{t('statusNotStarted')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
