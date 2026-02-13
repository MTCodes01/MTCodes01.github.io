import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  batterySaver: boolean;
  toggleBatterySaver: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [batterySaver, setBatterySaver] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const savedBatterySaver = localStorage.getItem('batterySaver') === 'true';
    if (savedTheme) setTheme(savedTheme);
    setBatterySaver(savedBatterySaver);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply battery saver to document
  useEffect(() => {
    document.documentElement.setAttribute('data-battery-saver', String(batterySaver));
    localStorage.setItem('batterySaver', String(batterySaver));
  }, [batterySaver]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleBatterySaver = () => {
    setBatterySaver(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, batterySaver, toggleBatterySaver }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
