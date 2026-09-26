import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'hi', label: 'हिंदी' },
  ];

  return (
    <div className="lang-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`lang-btn${language === lang.code ? ' active' : ''}`}
          onClick={() => setLanguage(lang.code)}
          aria-label={`Switch to ${lang.label}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
