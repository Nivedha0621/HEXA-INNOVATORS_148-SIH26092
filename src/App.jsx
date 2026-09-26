import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProfileForm from './pages/ProfileForm';
import Recommendations from './pages/Recommendations';
import SchemeDetails from './pages/SchemeDetails';
import ExploreSchemes from './pages/ExploreSchemes';
import EMICalculator from './pages/EMICalculator';
import PartnerLocator from './pages/PartnerLocator';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { useLanguage } from './hooks/useLanguage';

export default function App() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-scheme" element={<ProfileForm />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/scheme/:id" element={<SchemeDetails />} />
          <Route path="/explore" element={<ExploreSchemes />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/partners" element={<PartnerLocator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>{t('footerText')}</p>
        <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>{t('footerNote')}</p>
      </footer>
    </>
  );
}
