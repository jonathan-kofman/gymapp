import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Theme {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const lightTheme: Theme = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#6C757D',
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
};

const darkTheme: Theme = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#FF9F0A',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveThemePreference = async (darkMode: boolean) => {
    try {
      await AsyncStorage.setItem('theme_preference', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveThemePreference(newTheme);
  };

  const setTheme = (darkMode: boolean) => {
    setIsDark(darkMode);
    saveThemePreference(darkMode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  if (!isLoaded) {
    return null; // Or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 