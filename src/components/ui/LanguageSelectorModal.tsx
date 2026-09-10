'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import styles from './LanguageSelectorModal.module.css';

export default function LanguageSelectorModal() {
  const { language, setLanguage, isLanguageModalOpen, setIsLanguageModalOpen, t } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);

  if (!isLanguageModalOpen) return null;

  const options: { id: Language; native: string; sub: string }[] = [
    { id: 'en', native: 'English', sub: 'English (Default)' },
    { id: 'bn', native: 'বাংলা', sub: 'Bengali (বাংলা)' },
    { id: 'hi', native: 'हिन्दी', sub: 'Hindi (हिन्दी)' },
  ];

  const handleConfirm = () => {
    setLanguage(selected);
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="lang-modal-title">
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.globeIconWrap}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <h2 id="lang-modal-title" className={styles.title}>{t.langModal.title}</h2>
          <p className={styles.subtitle}>{t.langModal.subtitle}</p>
        </div>

        <div className={styles.body}>
          {options.map((opt) => {
            const isActive = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`${styles.optionBtn} ${isActive ? styles.optionBtnActive : ''}`}
                onClick={() => setSelected(opt.id)}
              >
                <div className={styles.langTextGroup}>
                  <span className={styles.langNative}>{opt.native}</span>
                  <span className={styles.langSub}>{opt.sub}</span>
                </div>
                <div className={styles.radioIndicator}>
                  {isActive && <div className={styles.radioDot} />}
                </div>
              </button>
            );
          })}

          <button type="button" className={styles.confirmBtn} onClick={handleConfirm}>
            <span>{t.langModal.continueBtn}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
