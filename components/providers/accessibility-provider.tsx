'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  isAccessibilityMode: boolean;
  toggleAccessibilityMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false);

  useEffect(() => {
    // Load preference from localStorage safely
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('estatex-accessibility-mode');
      if (saved === 'true') {
        setIsAccessibilityMode(true);
        document.documentElement.classList.add('accessibility-mode');
      }
    }
  }, []);

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('accessibility-mode');
          localStorage.setItem('estatex-accessibility-mode', 'true');
        } else {
          document.documentElement.classList.remove('accessibility-mode');
          localStorage.setItem('estatex-accessibility-mode', 'false');
        }
      }
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ isAccessibilityMode, toggleAccessibilityMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
