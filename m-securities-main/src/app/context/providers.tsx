'use client';
import { ReactNode } from 'react';
import { DarkModeProvider } from './DarkModeContext';
import { LanguageProvider } from './LanguageContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </DarkModeProvider>
  );
} 