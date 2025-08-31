import React, { createContext, useContext, ReactNode } from 'react';
import { Theme, darkTheme } from './theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always use dark theme
  const theme = darkTheme;
  const isDark = true;

  // Set body class immediately
  React.useEffect(() => {
    document.body.className = 'dark-theme';
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
