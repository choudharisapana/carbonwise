// frontend/src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import settingsService from '../services/settingsService';

export const ThemeContext = createContext();

// NOTE: The whole UI currently uses hardcoded dark-mode Tailwind classes
// (no `dark:`/light variants exist yet). This context makes the theme
// CHOICE persist (backend + localStorage) and applies a `theme-light`/
// `theme-dark` class on <html> as a foundation — but visually the app
// will keep rendering in dark mode until light-mode styles are added
// across components. That's a separate, larger follow-up task.
const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );
  const { isAuthenticated } = useContext(AuthContext);

  // Apply theme class to <html> so future light-mode CSS has something to hook into
  useEffect(() => {
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  // Load saved preference from backend once logged in (overrides localStorage default)
  useEffect(() => {
    const loadTheme = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await settingsService.getSettings();
        const savedTheme = data.preferences?.theme;
        if (savedTheme) {
          setThemeState(savedTheme);
          localStorage.setItem('theme', savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, [isAuthenticated]);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    if (isAuthenticated) {
      try {
        await settingsService.updateSettings({ theme: newTheme });
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
