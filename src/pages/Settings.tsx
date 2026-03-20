import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Thermometer, Wind, Eye, Gauge, Bell, Palette } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handleUnitChange = (unit: keyof typeof settings.units, value: string) => {
    updateSettings({
      units: {
        ...settings.units,
        [unit]: value,
      },
    });
  };

  const handleNotificationChange = (notification: keyof typeof settings.notifications, value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [notification]: value,
      },
    });
  };

  const handleAppearanceChange = (setting: keyof typeof settings.appearance, value: string | boolean) => {
    updateSettings({
      appearance: {
        ...settings.appearance,
        [setting]: value,
      },
    });
  };

  const handleSave = () => {
    // Settings are automatically saved via context
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Settings</h1>
        <p className="text-surface-600">Customize your weather experience</p>
      </div>

      {/* Units Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Gauge className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-surface-900">Units</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Thermometer className="h-5 w-5 text-surface-400" />
              <div>
                <p className="font-medium text-surface-900">Temperature</p>
                <p className="text-sm text-surface-600">Choose temperature unit</p>
              </div>
            </div>
            <select
              value={settings.units.temperature}
              onChange={(e) => handleUnitChange('temperature', e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wind className="h-5 w-5 text-surface-400" />
              <div>
                <p className="font-medium text-surface-900">Wind Speed</p>
                <p className="text-sm text-surface-600">Choose wind speed unit</p>
              </div>
            </div>
            <select
              value={settings.units.wind}
              onChange={(e) => handleUnitChange('wind', e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="kmh">km/h</option>
              <option value="mph">mph</option>
              <option value="ms">m/s</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-surface-400" />
              <div>
                <p className="font-medium text-surface-900">Visibility</p>
                <p className="text-sm text-surface-600">Choose visibility unit</p>
              </div>
            </div>
            <select
              value={settings.units.visibility}
              onChange={(e) => handleUnitChange('visibility', e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="km">Kilometers</option>
              <option value="miles">Miles</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-surface-900">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-surface-900">Weather Alerts</p>
              <p className="text-sm text-surface-600">Get notified about severe weather</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.weatherAlerts}
                onChange={(e) => handleNotificationChange('weatherAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-surface-900">Daily Forecast</p>
              <p className="text-sm text-surface-600">Receive daily weather summary</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.dailyForecast}
                onChange={(e) => handleNotificationChange('dailyForecast', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-surface-900">Severe Weather</p>
              <p className="text-sm text-surface-600">Urgent severe weather warnings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.severeWeather}
                onChange={(e) => handleNotificationChange('severeWeather', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Palette className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-surface-900">Appearance</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-surface-900">Theme</p>
              <p className="text-sm text-surface-600">Choose your preferred theme</p>
            </div>
            <select
              value={settings.appearance.theme}
              onChange={(e) => handleAppearanceChange('theme', e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-surface-900">Animations</p>
              <p className="text-sm text-surface-600">Enable interface animations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance.animations}
                onChange={(e) => handleAppearanceChange('animations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
