'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const labels: Record<Language, string> = {
    en: 'EN',
    bn: 'বাং',
    hi: 'हिं',
  };

  const options: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'bn', label: 'বাংলা' },
    { id: 'hi', label: 'हिन्दी' },
  ];

  return (
    <div className={styles.container} ref={ref}>
      <button
        type="button"
        className={styles.switchBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change Language"
      >
        <svg className={styles.globeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{labels[language]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`${styles.item} ${language === opt.id ? styles.itemActive : ''}`}
              onClick={() => {
                setLanguage(opt.id);
                setIsOpen(false);
              }}
              role="menuitem"
            >
              <span>{opt.label}</span>
              {language === opt.id && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
