import { Bot, Globe, Calculator, MapPin, FileText, Search } from 'lucide-react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import { useLanguage } from '../hooks/useLanguage';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    { icon: <Bot size={24} />, title: t('featureAI'), description: t('featureAIDesc'), colorClass: 'blue' },
    { icon: <Globe size={24} />, title: t('featureMultilingual'), description: t('featureMultilingualDesc'), colorClass: 'green' },
    { icon: <Calculator size={24} />, title: t('featureEMI'), description: t('featureEMIDesc'), colorClass: 'orange' },
    { icon: <MapPin size={24} />, title: t('featurePartner'), description: t('featurePartnerDesc'), colorClass: 'purple' },
    { icon: <FileText size={24} />, title: t('featureDoc'), description: t('featureDocDesc'), colorClass: 'blue' },
    { icon: <Search size={24} />, title: t('featureExplain'), description: t('featureExplainDesc'), colorClass: 'green' },
  ];

  return (
    <div>
      <Hero />
      <div className="features-header">
        <h2>{t('featuresTitle')}</h2>
        <p>{t('featuresSubtitle')}</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}
