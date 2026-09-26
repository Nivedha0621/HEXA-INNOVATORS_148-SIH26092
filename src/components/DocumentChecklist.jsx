import { useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function DocumentChecklist({ documents = [] }) {
  const { t } = useLanguage();
  const [checked, setChecked] = useState({});

  const toggleDoc = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const total = documents.length;
  const completed = Object.values(checked).filter(Boolean).length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="doc-checklist">
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--gray-900)', marginBottom: 'var(--space-4)' }}>
        {t('documentsRequired')}
      </h3>

      <div className="doc-progress">
        <div className="doc-progress-bar">
          <div className="doc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="doc-progress-text">
          {completed} / {total} {t('documentsProgress')}
        </span>
      </div>

      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`doc-item${checked[doc.id] ? ' checked' : ''}`}
          onClick={() => toggleDoc(doc.id)}
        >
          <div className="doc-checkbox">
            {checked[doc.id] && <Check size={14} />}
          </div>
          <span className="doc-item-text">{doc.name}</span>
        </div>
      ))}
    </div>
  );
}
