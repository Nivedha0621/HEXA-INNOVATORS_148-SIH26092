import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Search, Loader2 } from 'lucide-react';
import VoiceInput from '../components/VoiceInput';
import { useLanguage } from '../hooks/useLanguage';
import { matchSchemes } from '../services/api';

const STATES_DATA = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
  'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
  'Andhra Pradesh': ['Vijayawada', 'Visakhapatnam', 'Guntur', 'Tirupati'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
};

export default function ProfileForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    age: '',
    state: '',
    district: '',
    userType: '',
    annualIncome: '',
    requiredLoan: '',
    existingBusiness: '',
    businessCategory: '',
    projectCost: '',
    courseType: '',
    courseFee: '',
    requiredEducationLoan: '',
    preferredLanguage: 'en',
    needPartnerHelp: '',
    consent: false,
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!form.name.trim()) newErrors.name = 'Name is required';
      if (!form.age || parseInt(form.age) < 17 || parseInt(form.age) > 70) newErrors.age = 'Enter a valid age (17-70)';
      if (!form.state) newErrors.state = 'Select a state';
      if (!form.district) newErrors.district = 'Select a district';
      if (!form.userType) newErrors.userType = 'Select user type';
    }

    if (stepNum === 2) {
      if (!form.annualIncome || parseFloat(form.annualIncome) <= 0) newErrors.annualIncome = 'Enter valid income';
      if (!form.requiredLoan || parseFloat(form.requiredLoan) <= 0) newErrors.requiredLoan = 'Enter valid loan amount';
      if (!form.existingBusiness) newErrors.existingBusiness = 'Select an option';
    }

    if (stepNum === 3) {
      if (form.userType === 'entrepreneur') {
        if (!form.businessCategory) newErrors.businessCategory = 'Select business category';
        if (!form.projectCost || parseFloat(form.projectCost) <= 0) newErrors.projectCost = 'Enter valid project cost';
      } else {
        if (!form.courseType) newErrors.courseType = 'Select course type';
        if (!form.courseFee || parseFloat(form.courseFee) <= 0) newErrors.courseFee = 'Enter valid course fee';
        if (!form.requiredEducationLoan || parseFloat(form.requiredEducationLoan) <= 0) newErrors.requiredEducationLoan = 'Enter valid loan amount';
      }
    }

    if (stepNum === 4) {
      if (!form.consent) newErrors.consent = 'Please provide consent to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setLoading(true);

    try {
      const profile = {
        name: form.name,
        age: parseInt(form.age),
        state: form.state,
        district: form.district,
        userType: form.userType,
        annualIncome: parseFloat(form.annualIncome),
        requiredLoan: parseFloat(form.requiredLoan),
        existingBusiness: form.existingBusiness === 'yes',
        businessCategory: form.businessCategory,
        projectCost: parseFloat(form.projectCost) || 0,
        courseType: form.courseType,
        courseFee: parseFloat(form.courseFee) || 0,
        requiredEducationLoan: parseFloat(form.requiredEducationLoan) || 0,
        preferredLanguage: form.preferredLanguage,
        needPartnerHelp: form.needPartnerHelp === 'yes',
      };

      const results = await matchSchemes(profile);

      // Save to sessionStorage for Dashboard
      try {
        sessionStorage.setItem('schemesathi_profile', JSON.stringify(profile));
        sessionStorage.setItem('schemesathi_results', JSON.stringify(results));
      } catch (e) {
        console.error('Failed to save to sessionStorage', e);
      }

      // Navigate to recommendations with results
      navigate('/recommendations', { state: { results, profile } });
    } catch (err) {
      console.error('Match error:', err);
      alert('An error occurred while matching schemes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const districts = form.state ? STATES_DATA[form.state] || [] : [];

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4].map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`step-dot${step === s ? ' active' : ''}${step > s ? ' completed' : ''}`}>
            {step > s ? <Check size={16} /> : s}
          </div>
          {i < 3 && <div className={`step-line${step > s ? ' completed' : ''}`} />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <>
      <h2 className="step-title">{t('step1Title')}</h2>
      <p className="step-subtitle">{t('step1Subtitle')}</p>

      <div className="form-group">
        <label className="form-label">{t('name')}</label>
        <div className="input-with-voice">
          <input
            type="text"
            className={`form-input${errors.name ? ' error' : ''}`}
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Ravi Kumar"
          />
          <VoiceInput onResult={(text) => updateField('name', text)} />
        </div>
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('age')}</label>
          <input
            type="number"
            className={`form-input${errors.age ? ' error' : ''}`}
            value={form.age}
            onChange={(e) => updateField('age', e.target.value)}
            placeholder="e.g. 32"
            min="17"
            max="70"
          />
          {errors.age && <div className="form-error">{errors.age}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">{t('userType')}</label>
          <div className="radio-group">
            {['entrepreneur', 'student'].map((type) => (
              <label
                key={type}
                className={`radio-option${form.userType === type ? ' selected' : ''}`}
              >
                <input
                  type="radio"
                  name="userType"
                  value={type}
                  checked={form.userType === type}
                  onChange={() => updateField('userType', type)}
                />
                {t(type)}
              </label>
            ))}
          </div>
          {errors.userType && <div className="form-error">{errors.userType}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('state')}</label>
          <select
            className={`form-select${errors.state ? ' error' : ''}`}
            value={form.state}
            onChange={(e) => {
              updateField('state', e.target.value);
              updateField('district', '');
            }}
          >
            <option value="">{t('pleaseSelectState')}</option>
            {Object.keys(STATES_DATA).map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          {errors.state && <div className="form-error">{errors.state}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">{t('district')}</label>
          <select
            className={`form-select${errors.district ? ' error' : ''}`}
            value={form.district}
            onChange={(e) => updateField('district', e.target.value)}
            disabled={!form.state}
          >
            <option value="">{t('pleaseSelectDistrict')}</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.district && <div className="form-error">{errors.district}</div>}
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="step-title">{t('step2Title')}</h2>
      <p className="step-subtitle">{t('step2Subtitle')}</p>

      <div className="form-group">
        <label className="form-label">{t('annualIncome')}</label>
        <div className="input-with-voice">
          <input
            type="number"
            className={`form-input${errors.annualIncome ? ' error' : ''}`}
            value={form.annualIncome}
            onChange={(e) => updateField('annualIncome', e.target.value)}
            placeholder="e.g. 350000"
            min="0"
          />
          <VoiceInput onResult={(text) => {
            const num = text.replace(/[^\d]/g, '');
            if (num) updateField('annualIncome', num);
          }} />
        </div>
        {errors.annualIncome && <div className="form-error">{errors.annualIncome}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('requiredLoan')}</label>
        <div className="input-with-voice">
          <input
            type="number"
            className={`form-input${errors.requiredLoan ? ' error' : ''}`}
            value={form.requiredLoan}
            onChange={(e) => updateField('requiredLoan', e.target.value)}
            placeholder="e.g. 800000"
            min="0"
          />
          <VoiceInput onResult={(text) => {
            const num = text.replace(/[^\d]/g, '');
            if (num) updateField('requiredLoan', num);
          }} />
        </div>
        {errors.requiredLoan && <div className="form-error">{errors.requiredLoan}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('existingBusiness')}</label>
        <div className="radio-group">
          {['yes', 'no'].map((opt) => (
            <label
              key={opt}
              className={`radio-option${form.existingBusiness === opt ? ' selected' : ''}`}
            >
              <input
                type="radio"
                name="existingBusiness"
                value={opt}
                checked={form.existingBusiness === opt}
                onChange={() => updateField('existingBusiness', opt)}
              />
              {t(opt)}
            </label>
          ))}
        </div>
        {errors.existingBusiness && <div className="form-error">{errors.existingBusiness}</div>}
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 className="step-title">{t('step3Title')}</h2>
      <p className="step-subtitle">{t('step3Subtitle')}</p>

      {form.userType === 'entrepreneur' ? (
        <>
          <div className="form-group">
            <label className="form-label">{t('businessCategory')}</label>
            <div className="radio-group">
              {['agriculture', 'small-industry', 'services', 'transport', 'other'].map((cat) => (
                <label
                  key={cat}
                  className={`radio-option${form.businessCategory === cat ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="businessCategory"
                    value={cat}
                    checked={form.businessCategory === cat}
                    onChange={() => updateField('businessCategory', cat)}
                  />
                  {t(cat.replace('-', 'I').replace('small-industry', 'smallIndustry')
                    .replace('small', '').trim() || cat) === cat
                    ? cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                    : t(cat === 'small-industry' ? 'smallIndustry' : cat)}
                </label>
              ))}
            </div>
            {errors.businessCategory && <div className="form-error">{errors.businessCategory}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('projectCost')}</label>
            <div className="input-with-voice">
              <input
                type="number"
                className={`form-input${errors.projectCost ? ' error' : ''}`}
                value={form.projectCost}
                onChange={(e) => updateField('projectCost', e.target.value)}
                placeholder="e.g. 1000000"
                min="0"
              />
              <VoiceInput onResult={(text) => {
                const num = text.replace(/[^\d]/g, '');
                if (num) updateField('projectCost', num);
              }} />
            </div>
            {errors.projectCost && <div className="form-error">{errors.projectCost}</div>}
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label">{t('courseType')}</label>
            <div className="radio-group">
              {['engineering', 'medical', 'management', 'professional', 'other'].map((ct) => (
                <label
                  key={ct}
                  className={`radio-option${form.courseType === ct ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="courseType"
                    value={ct}
                    checked={form.courseType === ct}
                    onChange={() => updateField('courseType', ct)}
                  />
                  {t(ct)}
                </label>
              ))}
            </div>
            {errors.courseType && <div className="form-error">{errors.courseType}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('courseFee')}</label>
            <input
              type="number"
              className={`form-input${errors.courseFee ? ' error' : ''}`}
              value={form.courseFee}
              onChange={(e) => updateField('courseFee', e.target.value)}
              placeholder="e.g. 1500000"
              min="0"
            />
            {errors.courseFee && <div className="form-error">{errors.courseFee}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('requiredEducationLoan')}</label>
            <input
              type="number"
              className={`form-input${errors.requiredEducationLoan ? ' error' : ''}`}
              value={form.requiredEducationLoan}
              onChange={(e) => updateField('requiredEducationLoan', e.target.value)}
              placeholder="e.g. 1200000"
              min="0"
            />
            {errors.requiredEducationLoan && <div className="form-error">{errors.requiredEducationLoan}</div>}
          </div>
        </>
      )}
    </>
  );

  const renderStep4 = () => (
    <>
      <h2 className="step-title">{t('step4Title')}</h2>
      <p className="step-subtitle">{t('step4Subtitle')}</p>

      <div className="form-group">
        <label className="form-label">{t('preferredLanguage')}</label>
        <div className="radio-group">
          {[
            { code: 'en', label: 'English' },
            { code: 'ta', label: 'Tamil (தமிழ்)' },
            { code: 'hi', label: 'Hindi (हिंदी)' },
            { code: 'te', label: 'Telugu (తెలుగు)' },
          ].map((lang) => (
            <label
              key={lang.code}
              className={`radio-option${form.preferredLanguage === lang.code ? ' selected' : ''}`}
            >
              <input
                type="radio"
                name="preferredLanguage"
                value={lang.code}
                checked={form.preferredLanguage === lang.code}
                onChange={() => updateField('preferredLanguage', lang.code)}
              />
              {lang.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('needPartnerHelp')}</label>
        <div className="radio-group">
          {['yes', 'no'].map((opt) => (
            <label
              key={opt}
              className={`radio-option${form.needPartnerHelp === opt ? ' selected' : ''}`}
            >
              <input
                type="radio"
                name="needPartnerHelp"
                value={opt}
                checked={form.needPartnerHelp === opt}
                onChange={() => updateField('needPartnerHelp', opt)}
              />
              {t(opt)}
            </label>
          ))}
        </div>
      </div>

      <div className="consent-box">
        <input
          type="checkbox"
          id="consent"
          checked={form.consent}
          onChange={(e) => updateField('consent', e.target.checked)}
        />
        <div>
          <label htmlFor="consent">{t('consent')}</label>
          <p className="privacy-note">{t('privacyNote')}</p>
        </div>
      </div>
      {errors.consent && <div className="form-error">{errors.consent}</div>}
    </>
  );

  return (
    <div className="multistep-container">
      {renderStepIndicator()}

      <div className="step-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        <div className="step-actions">
          {step > 1 ? (
            <button className="btn btn-outline" onClick={prevStep}>
              <ArrowLeft size={16} />
              {t('previous')}
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button className="btn btn-primary" onClick={nextStep}>
              {t('next')}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="btn btn-accent btn-lg"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" style={{ animation: 'spin 0.8s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Search size={18} />
                  {t('findSuitableSchemes')}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
