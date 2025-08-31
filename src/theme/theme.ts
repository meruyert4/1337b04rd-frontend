export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    surface: string;
    surfaceSecondary: string;
    surfaceHover: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textInverse: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    border: string;
    borderLight: string;
    borderDark: string;
    shadow: string;
    shadowLight: string;
    shadowDark: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Dark neon theme with original black colors
export const darkTheme: Theme = {
  colors: {
    primary: '#4ade80', // Neon green from original
    primaryLight: '#86efac',
    primaryDark: '#22c55e',
    
    secondary: '#94a3b8', // Original secondary color
    secondaryLight: '#cbd5e1',
    secondaryDark: '#64748b',
    
    background: '#000000', // Pure black background
    backgroundSecondary: '#0a0a0a',
    backgroundTertiary: '#1a1a1a',
    
    surface: '#0a0a0a', // Very dark black surface
    surfaceSecondary: '#1a1a1a',
    surfaceHover: '#2a2a2a',
    
    textPrimary: '#ffffff',
    textSecondary: '#e5e5e5',
    textMuted: '#a3a3a3',
    textInverse: '#000000',
    
    success: '#4ade80', // Neon green
    warning: '#22c55e', // Darker neon green
    error: '#16a34a', // Even darker neon green
    info: '#10b981', // Medium neon green
    
    border: '#333333', // Dark gray borders
    borderLight: '#444444',
    borderDark: '#222222',
    
    shadow: 'rgba(74, 222, 128, 0.2)', // Neon green shadow
    shadowLight: 'rgba(74, 222, 128, 0.1)',
    shadowDark: 'rgba(74, 222, 128, 0.3)',
  },
  
  typography: {
    fontFamily: '"Orbitron", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(74, 222, 128, 0.2)',
    md: '0 4px 6px -1px rgba(74, 222, 128, 0.3), 0 2px 4px -1px rgba(74, 222, 128, 0.2)',
    lg: '0 10px 15px -3px rgba(74, 222, 128, 0.3), 0 4px 6px -2px rgba(74, 222, 128, 0.2)',
    xl: '0 20px 25px -5px rgba(74, 222, 128, 0.3), 0 10px 10px -5px rgba(74, 222, 128, 0.2)',
  },
  
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

// Export only dark theme (no light theme)
export const lightTheme = darkTheme; // Keep for compatibility but it's the same
export const defaultTheme = darkTheme;
