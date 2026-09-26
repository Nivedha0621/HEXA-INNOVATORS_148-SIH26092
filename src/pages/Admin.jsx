import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { fetchSchemes, addScheme, updateScheme, deleteScheme } from '../services/api';

const emptyScheme = {
  name: '',
  description: '',
  beneficiaryType: 'entrepreneur',
  category: ['small-industry'],
  eligibility: { minAge: 18, maxAge: 55, maxIncome: 500000, minProjectCost: 0, maxProjectCost: 500000, maxLoan: 450000 },
  financials: {
    projectCostRange: '',
    maxLoanAmount: 0,
    interestRate: 8,
    interestRateDisplay: '8% p.a.',
    repaymentYears: 5,
    repaymentDisplay: '5 Years',
    moratoriumMonths: 3,
    moratoriumDisplay: '3 Months',
  },
  requiredDocuments: [],
  source: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  version: '1.0',
  status: 'active',
};

export default function Admin() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [formData, setFormData] = useState(emptyScheme);

  const loadSchemes = () => {
    setLoading(true);
    fetchSchemes()
      .then(setSchemes)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSchemes(); }, []);

  const openAdd = () => {
    setEditingScheme(null);
    setFormData({ ...emptyScheme });
    setShowModal(true);
  };

  const openEdit = (scheme) => {
    setEditingScheme(scheme);
    setFormData({ ...scheme });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingScheme) {
        await updateScheme(editingScheme.id, formData);
      } else {
        await addScheme(formData);
      }
      setShowModal(false);
      loadSchemes();
    } catch (err) {
      alert('Failed to save scheme');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await deleteScheme(id);
      loadSchemes();
    } catch (err) {
      alert('Failed to delete scheme');
    }
  };

  const updateFormField = (path, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--gray-900)' }}>
          {t('adminTitle')}
        </h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} />
          {t('addScheme')}
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('schemeName')}</th>
            <th>{t('userType')}</th>
            <th>{t('maxLoan')}</th>
            <th>{t('interest')}</th>
            <th>{t('version')}</th>
            <th>{t('effectiveDate')}</th>
            <th>{t('lastUpdated')}</th>
            <th>{t('source')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {schemes.map((scheme) => (
            <tr key={scheme.id}>
              <td style={{ fontWeight: 600 }}>{scheme.name}</td>
              <td><span className="status-badge active">{scheme.beneficiaryType}</span></td>
              <td>₹{(scheme.financials.maxLoanAmount / 100000).toFixed(1)}L</td>
              <td>{scheme.financials.interestRateDisplay}</td>
              <td>v{scheme.version}</td>
              <td>{scheme.effectiveDate}</td>
              <td>{scheme.lastUpdated}</td>
              <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scheme.source}</td>
              <td>
                <div className="admin-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(scheme)}>
                    <Pencil size={14} />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(scheme.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingScheme ? t('editScheme') : t('addScheme')}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <div className="form-group">
              <label className="form-label">{t('schemeName')}</label>
              <input className="form-input" value={formData.name} onChange={(e) => updateFormField('name', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" value={formData.description} onChange={(e) => updateFormField('description', e.target.value)} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('userType')}</label>
                <select className="form-select" value={formData.beneficiaryType} onChange={(e) => updateFormField('beneficiaryType', e.target.value)}>
                  <option value="entrepreneur">{t('entrepreneur')}</option>
                  <option value="student">{t('student')}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('version')}</label>
                <input className="form-input" value={formData.version} onChange={(e) => updateFormField('version', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Max Loan Amount (₹)</label>
                <input type="number" className="form-input" value={formData.financials.maxLoanAmount} onChange={(e) => updateFormField('financials.maxLoanAmount', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Interest Rate (%)</label>
                <input type="number" step="0.1" className="form-input" value={formData.financials.interestRate} onChange={(e) => updateFormField('financials.interestRate', parseFloat(e.target.value) || 0)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Repayment (Years)</label>
                <input type="number" className="form-input" value={formData.financials.repaymentYears} onChange={(e) => updateFormField('financials.repaymentYears', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('effectiveDate')}</label>
                <input type="date" className="form-input" value={formData.effectiveDate} onChange={(e) => updateFormField('effectiveDate', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('source')}</label>
              <input className="form-input" value={formData.source} onChange={(e) => updateFormField('source', e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>{t('cancel')}</button>
              <button className="btn btn-primary" onClick={handleSave}>{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
