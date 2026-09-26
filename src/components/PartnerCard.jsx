import { MapPin, Phone, Clock } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function PartnerCard({ partner, schemeNames = {} }) {
  const { t } = useLanguage();

  return (
    <div className="partner-card">
      <div className="partner-card-header">
        <div>
          <h3>{partner.name}</h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>{partner.type}</span>
        </div>
        {partner.distance !== undefined && (
          <span className="distance-badge">
            <MapPin size={12} />
            {partner.distance} km
          </span>
        )}
      </div>

      <div className="partner-info">
        <p><MapPin size={14} /> {partner.address}</p>
        <p><Phone size={14} /> {partner.phone}</p>
        <p><Clock size={14} /> {partner.timings}</p>
      </div>

      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {t('supports')}
      </div>
      <div className="partner-schemes">
        {partner.supportedSchemes.map((schemeId) => (
          <span key={schemeId} className="partner-scheme-tag">
            {schemeNames[schemeId] || schemeId}
          </span>
        ))}
      </div>
    </div>
  );
}
