import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import settingsService from '../services/settingsService';
import { formatCarbonValue } from '../utils/formatCarbon';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );
  const [carbonUnit, setCarbonUnitState] = useState(
    () => localStorage.getItem('carbonUnit') || 'gCO₂'
  );
  const [defaultExport, setDefaultExportState] = useState(
    () => localStorage.getItem('defaultExport') || 'PDF'
  );
  const { isAuthenticated } = useContext(AuthContext);

  // Apply theme class to <html> so future light-mode CSS has something to hook into
  useEffect(() => {
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  // Load saved preferences from backend once logged in (overrides localStorage defaults)
  useEffect(() => {
    const loadPreferences = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await settingsService.getSettings();
        const appearance = data.preferences?.appearance;

        if (appearance?.theme) {
          setThemeState(appearance.theme);
          localStorage.setItem('theme', appearance.theme);
        }
        if (appearance?.carbonUnit) {
          setCarbonUnitState(appearance.carbonUnit);
          localStorage.setItem('carbonUnit', appearance.carbonUnit);
        }
        if (appearance?.defaultExport) {
          setDefaultExportState(appearance.defaultExport);
          localStorage.setItem('defaultExport', appearance.defaultExport);
        }
      } catch (error) {
        console.error('Failed to load appearance preferences:', error);
      }
    };
    loadPreferences();
  }, [isAuthenticated]);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    if (isAuthenticated) {
      try {
        await settingsService.updateAppearance({ theme: newTheme });
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };

  // For callers (like AppearanceSettings) that already persisted the
  // preference to the backend themselves — avoids a duplicate API call.
  const setThemeLocal = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setPreferencesLocal = ({ theme: t, carbonUnit: cu, defaultExport: de }) => {
    if (t) { setThemeState(t); localStorage.setItem('theme', t); }
    if (cu) { setCarbonUnitState(cu); localStorage.setItem('carbonUnit', cu); }
    if (de) { setDefaultExportState(de); localStorage.setItem('defaultExport', de); }
  };

  // Convenience formatter bound to the user's current unit preference —
  // any page can do formatCarbon(grams) instead of hardcoding "gCO₂".
  const formatCarbon = (grams) => formatCarbonValue(grams, carbonUnit);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        setThemeLocal,
        carbonUnit,
        defaultExport,
        setPreferencesLocal,
        formatCarbon
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

