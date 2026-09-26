import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={16} />
          {t('badge')}
        </div>
        <h1>
          {t('heroTitle')}<span>{t('heroTitleAI')}</span>
        </h1>
        <p>{t('heroDescription')}</p>
        <div className="hero-actions">
          <Link to="/find-scheme" className="btn btn-white btn-lg">
            <Search size={20} />
            {t('findMyScheme')}
          </Link>
          <Link to="/explore" className="btn btn-ghost btn-lg">
            {t('exploreAllSchemes')}
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
