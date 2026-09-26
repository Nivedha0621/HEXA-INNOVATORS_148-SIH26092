import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import PartnerCard from '../components/PartnerCard';
import { useLanguage } from '../hooks/useLanguage';
import { fetchPartners, fetchSchemes } from '../services/api';

export default function PartnerLocator() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [partners, setPartners] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || '');
  const [districtFilter, setDistrictFilter] = useState('');
  const [schemeFilter, setSchemeFilter] = useState(searchParams.get('scheme') || '');
  const [userLocation, setUserLocation] = useState(null);

  // Try to get geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {} // silently fail
      );
    }
  }, []);

  // Load schemes for name mapping
  useEffect(() => {
    fetchSchemes().then(setSchemes).catch(console.error);
  }, []);

  // Load partners with filters
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (stateFilter) params.state = stateFilter;
    if (districtFilter) params.district = districtFilter;
    if (schemeFilter) params.scheme = schemeFilter;
    if (userLocation) {
      params.lat = userLocation.lat;
      params.lng = userLocation.lng;
    }
    fetchPartners(params)
      .then(setPartners)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [stateFilter, districtFilter, schemeFilter, userLocation]);

  const schemeNames = {};
  schemes.forEach((s) => { schemeNames[s.id] = s.name; });

  const states = [...new Set(partners.map((p) => p.state))].sort();
  const districts = stateFilter
    ? [...new Set(partners.filter((p) => p.state === stateFilter).map((p) => p.district))].sort()
    : [];

  return (
    <div className="partner-page">
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 'var(--space-2)' }}>
        {t('partnerTitle')}
      </h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-6)' }}>
        {t('partnerSubtitle')}
      </p>

      <div className="disclaimer-banner">
        <AlertTriangle size={16} />
        {t('demoPartnerNote')}
      </div>

      <div className="partner-filters">
        <select
          className="form-select"
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
            setDistrictFilter('');
          }}
        >
          <option value="">{t('allStates')}</option>
          {['Tamil Nadu', 'Maharashtra', 'Delhi', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Uttar Pradesh', 'Rajasthan'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="form-select"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          disabled={!stateFilter}
        >
          <option value="">{t('allDistricts')}</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className="form-select"
          value={schemeFilter}
          onChange={(e) => setSchemeFilter(e.target.value)}
        >
          <option value="">{t('allSchemes')}</option>
          {schemes.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : partners.length > 0 ? (
        <div className="partners-grid">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} schemeNames={schemeNames} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>{t('noPartners')}</h3>
        </div>
      )}
    </div>
  );
}
