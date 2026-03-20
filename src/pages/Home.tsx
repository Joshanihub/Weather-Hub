import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CurrentWeatherCard from '../components/weather/CurrentWeatherCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Search, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { weatherApi } from '../utils/weatherApi';
import type { WeatherData, SavedLocation } from '../types/weather';

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Check if navigation state contains a location to search for
    if (location.state?.location) {
      setSearchQuery(location.state.location);
      loadWeatherData(location.state.location);
    } else {
      // Use environment variable for default location, fallback to Nairobi
      const defaultLocation = import.meta.env.VITE_DEFAULT_LOCATION || 'Nairobi';
      loadWeatherData(defaultLocation);
    }
    loadSavedLocations();
  }, [location.state]);

  const loadWeatherData = async (query: string) => {
    try {
      setLoading(true);
      setApiError(null);
      const data = await weatherApi.getForecast(query);
      setWeatherData(data);
    } catch (err) {
      console.error('Error loading weather data:', err);
      setApiError(err instanceof Error ? err.message : 'Failed to load weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedLocations = () => {
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved locations:', e);
        setSavedLocations([]);
      }
    } else {
      setSavedLocations([]);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      loadWeatherData(searchQuery);
    }
  };

  const handleLocationClick = (location: SavedLocation) => {
    loadWeatherData(`${location.name}, ${location.country}`);
  };

  const handleSaveLocation = () => {
    if (weatherData && searchQuery.trim()) {
      const newLocation: SavedLocation = {
        id: Date.now().toString(),
        name: weatherData.location.name,
        country: weatherData.location.country,
        lat: weatherData.location.lat,
        lon: weatherData.location.lon,
        addedAt: new Date().toISOString(),
      };
      
      const updated = [...savedLocations, newLocation];
      setSavedLocations(updated);
      localStorage.setItem('savedLocations', JSON.stringify(updated));
      setSearchQuery('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            icon={<Search className="h-5 w-5 text-surface-400" />}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="whitespace-nowrap">
            Search
          </Button>
        </div>
      </Card>

      {apiError && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Weather Data Error</p>
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          </div>
        </Card>
      )}

      {weatherData && !apiError && (
        <>
          <CurrentWeatherCard
            location={weatherData.location}
            current={weatherData.current}
          />
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-surface-900">Save Location</h3>
                <p className="text-sm text-surface-600">Save {weatherData.location.name} to your quick access</p>
              </div>
              <Button onClick={handleSaveLocation} className="whitespace-nowrap">
                <MapPin className="h-4 w-4 mr-2" />
                Save Location
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-600">Local Time</p>
                  <p className="text-lg font-semibold text-surface-900">
                    {weatherData.location.localtime && 
                      new Date(weatherData.location.localtime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-weather-sunny/20 rounded-lg">
                  <MapPin className="h-6 w-6 text-weather-sunny" />
                </div>
                <div>
                  <p className="text-sm text-surface-600">Location</p>
                  <p className="text-lg font-semibold text-surface-900">
                    {weatherData.location.name}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-600">Alerts</p>
                  <p className="text-lg font-semibold text-surface-900">
                    {weatherData.alerts?.length || 0} Active
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      <Card className="p-6">
        <h3 className="text-xl font-bold text-surface-900 mb-4">Saved Locations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedLocations.map((location) => (
            <Button
              key={location.id}
              variant="secondary"
              onClick={() => handleLocationClick(location)}
              className="justify-start"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {location.name}, {location.country}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Home;
