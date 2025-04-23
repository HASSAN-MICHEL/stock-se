// settingsApp/ThemeContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const defaultSettings = {
  language: 'fr',
  theme: 'light',
  primaryColor: '#0d6efd', // Bleu Bootstrap par défaut
  notifications: true,
  emailReports: false,
  autoRefresh: true,
  fontSize: 'medium'
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    applyTheme(newSettings);
  };

  const applyTheme = (settings) => {
    // Appliquer la couleur principale à la racine du document
    document.documentElement.style.setProperty('--bs-primary', settings.primaryColor);
    
    // Appliquer le thème clair/sombre
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, isLoading }}>
      {!isLoading && children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);