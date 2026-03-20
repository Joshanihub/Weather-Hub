import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WeatherIcon from '../components/weather/WeatherIcon';
import { Calendar, Droplets, Wind } from 'lucide-react';
import { weatherApi } from '../utils/weatherApi';
import type { WeatherData } from '../types/weather';
import { useSettings } from '../contexts/SettingsContext';
import { 
  convertTemperature, 
  getTemperatureUnit,
  convertWindSpeed, 
  getWindUnit
} from '../utils/unitConversions';

const Forecast: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('San Francisco');
  const [currentLocation, setCurrentLocation] = useState('San Francisco');
  const { settings } = useSettings();

  const loadForecastData = useCallback(async (location: string) => {
    if (!location.trim()) {
      setError('Please enter a city name to search');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await weatherApi.getForecast(location);
      setWeatherData(data);
      setCurrentLocation(location);
    } catch (err) {
      console.error('Error loading forecast data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load forecast data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadForecastData(currentLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      loadForecastData(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setError(null);
    // Don't clear weatherData so user still sees the last forecast
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Weather Forecast</h1>
          <p className="text-surface-600">5-day weather forecast with hourly details</p>
        </div>
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'No weather data available'}</p>
            <Button onClick={() => loadForecastData(currentLocation)}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  const forecastDays = weatherData.forecast.forecastday;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get unit conversion functions
  const tempUnit = getTemperatureUnit(settings.units.temperature);
  const windUnit = getWindUnit(settings.units.wind);

  // Convert temperature function
  const convertTemp = (celsius: number) => convertTemperature(celsius, settings.units.temperature);
  
  // Convert wind speed function
  const convertWind = (kmh: number) => convertWindSpeed(kmh, settings.units.wind);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Weather Forecast</h1>
        <p className="text-surface-600">5-day weather forecast with hourly details</p>
      </div>

      {/* Search Input */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter city name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button onClick={handleSearch}>
            Search
          </Button>
          {searchQuery && (
            <Button variant="secondary" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Day Selector */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-surface-900">Select Day</h3>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {forecastDays.map((day, index) => (
            <Button
              key={index}
              variant={selectedDay === index ? 'primary' : 'secondary'}
              onClick={() => setSelectedDay(index)}
              className="whitespace-nowrap"
            >
              {formatDate(day.date)}
            </Button>
          ))}
        </div>
      </Card>

      {/* Selected Day Details */}
      {forecastDays[selectedDay] && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Day Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Day Overview</h3>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <WeatherIcon 
                  condition={forecastDays[selectedDay].day.condition.text} 
                  size="xl"
                />
                <div>
                  <p className="text-2xl font-bold text-surface-900">
                    {convertTemp(forecastDays[selectedDay].day.max_temp)}{tempUnit} / {convertTemp(forecastDays[selectedDay].day.min_temp)}{tempUnit}
                  </p>
                  <p className="text-surface-600">
                    {forecastDays[selectedDay].day.condition.text}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-surface-600">Average Temperature</span>
                <span className="font-medium">{convertTemp(forecastDays[selectedDay].day.avg_temp)}{tempUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Humidity</span>
                <span className="font-medium">{forecastDays[selectedDay].day.avg_humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Wind Speed</span>
                <span className="font-medium">{convertWind(forecastDays[selectedDay].day.max_wind)} {windUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">UV Index</span>
                <span className="font-medium">{forecastDays[selectedDay].day.uv}</span>
              </div>
            </div>
          </Card>

          {/* Sun & Moon */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Sun & Moon</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
                  <span className="text-surface-600">Sunrise</span>
                </div>
                <span className="font-medium">{forecastDays[selectedDay].astro.sunrise}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                  <span className="text-surface-600">Sunset</span>
                </div>
                <span className="font-medium">{forecastDays[selectedDay].astro.sunset}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <span className="text-surface-600">Moonrise</span>
                </div>
                <span className="font-medium">{forecastDays[selectedDay].astro.moonrise}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                  <span className="text-surface-600">Moonset</span>
                </div>
                <span className="font-medium">{forecastDays[selectedDay].astro.moonset}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 5-Day Forecast */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">5-Day Forecast</h3>
        <div className="space-y-3">
          {forecastDays.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <WeatherIcon condition={day.day.condition.text} size="lg" />
                <div>
                  <p className="font-medium text-surface-900">{formatDate(day.date)}</p>
                  <p className="text-sm text-surface-600">{day.day.condition.text}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-surface-600">
                  <Droplets className="h-4 w-4" />
                  <span className="text-sm">{day.day.daily_chance_of_rain}%</span>
                </div>
                <div className="flex items-center space-x-2 text-surface-600">
                  <Wind className="h-4 w-4" />
                  <span className="text-sm">{convertWind(day.day.max_wind)} {windUnit}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-surface-900">
                    {convertTemp(day.day.max_temp)}{tempUnit} / {convertTemp(day.day.min_temp)}{tempUnit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Forecast;
