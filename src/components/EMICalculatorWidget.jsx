import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { calculateEMI, formatCurrency } from '../utils/emi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0d8ecf', '#15b866'];

export default function EMICalculatorWidget({ defaultLoan = '', defaultRate = '', defaultTenure = '' }) {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(defaultLoan);
  const [interestRate, setInterestRate] = useState(defaultRate);
  const [tenure, setTenure] = useState(defaultTenure);

  const loan = parseFloat(loanAmount) || 0;
  const rate = parseFloat(interestRate) || 0;
  const years = parseFloat(tenure) || 0;

  const result = calculateEMI(loan, rate, years);

  const chartData = result.emi > 0
    ? [
        { name: t('principal'), value: loan },
        { name: t('totalInterest'), value: result.totalInterest },
      ]
    : [];

  return (
    <div className="emi-grid">
      <div className="emi-inputs">
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 'var(--space-6)' }}>
          {t('emiTitle')}
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', marginBottom: 'var(--space-6)' }}>
          {t('emiSubtitle')}
        </p>

        <div className="form-group">
          <label className="form-label">{t('loanAmount')}</label>
          <input
            type="number"
            className="form-input"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="e.g. 500000"
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('interestRate')}</label>
          <input
            type="number"
            className="form-input"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="e.g. 8"
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('tenure')}</label>
          <input
            type="number"
            className="form-input"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="e.g. 5"
            min="0"
          />
        </div>
      </div>

      <div className="emi-results">
        {result.emi > 0 ? (
          <>
            <div className="emi-result-card">
              <div className="emi-label">{t('monthlyEMI')}</div>
              <div className="emi-amount">{formatCurrency(result.emi)}</div>
              <div className="emi-label">per month</div>
            </div>

            <div className="emi-breakdown">
              <div className="emi-breakdown-item">
                <div className="value">{formatCurrency(result.totalInterest)}</div>
                <div className="label">{t('totalInterest')}</div>
              </div>
              <div className="emi-breakdown-item">
                <div className="value">{formatCurrency(result.totalPayment)}</div>
                <div className="label">{t('totalRepayment')}</div>
              </div>
            </div>

            {chartData.length > 0 && (
              <div style={{ marginTop: 'var(--space-6)' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', marginTop: 'var(--space-2)' }}>
                  {chartData.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[i] }} />
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <p style={{ color: 'var(--gray-400)' }}>Enter loan details to see EMI calculation</p>
          </div>
        )}
      </div>
    </div>
  );
}
