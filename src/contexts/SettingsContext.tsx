import React, { useState, useEffect } from 'react';
import { SettingsContext } from './settingsContext';
import type { UserSettings } from '../types/weather';
import type { ReactNode } from 'react';

const defaultSettings: UserSettings = {
  units: {
    temperature: 'celsius',
    wind: 'kmh',
    pressure: 'mb',
    visibility: 'km',
  },
  notifications: {
    weatherAlerts: true,
    dailyForecast: false,
    severeWeather: true,
  },
  appearance: {
    theme: 'light',
    animations: true,
  },
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('weatherAppSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          units: { ...defaultSettings.units, ...parsedSettings.units },
          notifications: { ...defaultSettings.notifications, ...parsedSettings.notifications },
          appearance: { ...defaultSettings.appearance, ...parsedSettings.appearance },
        });
      } catch (e) {
        console.error('Error parsing settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weatherAppSettings', JSON.stringify(settings));
  }, [settings]);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (settings.appearance.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.appearance.theme]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({
      units: { ...prev.units, ...newSettings.units },
      notifications: { ...prev.notifications, ...newSettings.notifications },
      appearance: { ...prev.appearance, ...newSettings.appearance },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
