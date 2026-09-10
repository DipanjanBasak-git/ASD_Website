'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Language, translations, Translations } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  triggerPostLoginModal: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'asd_language_preference';
const MODAL_SHOWN_KEY = 'asd_language_selected';
const POST_LOGIN_MODAL_FLAG = 'asd_show_lang_modal_after_login';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Load saved preference on startup (DO NOT auto-open modal for guests on home page)
  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem(STORAGE_KEY) as Language;

    if (savedLang && (savedLang === 'en' || savedLang === 'bn' || savedLang === 'hi')) {
      setLanguageState(savedLang);
    }
  }, []);

  // Check if post-login modal was requested (e.g. after auth redirect)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldShow = sessionStorage.getItem(POST_LOGIN_MODAL_FLAG);
      if (shouldShow === 'true') {
        setIsLanguageModalOpen(true);
        sessionStorage.removeItem(POST_LOGIN_MODAL_FLAG);
      }
    }
  }, [pathname]);

  const triggerPostLoginModal = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(POST_LOGIN_MODAL_FLAG, 'true');
    }
    setIsLanguageModalOpen(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem(MODAL_SHOWN_KEY, 'true');
      document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    }
    setIsLanguageModalOpen(false);
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        triggerPostLoginModal,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
