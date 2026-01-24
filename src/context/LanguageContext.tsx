"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Translations } from '@/data/translations';

export type Language = 'ja' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: <K extends keyof Translations>(key: K) => Translations[K];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ja');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ja' ? 'en' : 'ja'));
  };

  const t = <K extends keyof Translations>(key: K): Translations[K] => {
    return translations[language][key] as Translations[K];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};