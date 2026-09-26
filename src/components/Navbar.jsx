import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../hooks/useLanguage';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    { to: '/', label: t('home') },
    { to: '/find-scheme', label: t('findScheme') },
    { to: '/explore', label: t('exploreSchemes') },
    { to: '/emi-calculator', label: t('emiCalculator') },
    { to: '/partners', label: t('partnerLocator') },
    { to: '/dashboard', label: t('dashboard') },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <Shield size={24} />
          SchemeSathi AI
        </Link>

        <ul className={`navbar-links${isOpen ? ' open' : ''}`}>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setIsOpen(false)}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          <LanguageSelector />
          <button
            className="hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
