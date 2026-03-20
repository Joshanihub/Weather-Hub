import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Layers, Navigation, Cloud, Droplets, Wind } from 'lucide-react';
import { weatherApi } from '../utils/weatherApi';
import type { WeatherData } from '../types/weather';

interface WeatherMapLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const Map: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('temperature');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number }>({ lat: 40.7128, lon: -74.0060 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mapLayers: WeatherMapLayer[] = useMemo(() => [
    { 
      id: 'temperature', 
      name: 'Temperature', 
      icon: <span className="text-lg">🌡️</span>,
      color: '#ef4444',
      description: 'View global temperature patterns and heat maps'
    },
    { 
      id: 'precipitation', 
      name: 'Precipitation', 
      icon: <Droplets className="h-5 w-5" />,
      color: '#3b82f6',
      description: 'Track rainfall and snowfall worldwide'
    },
    { 
      id: 'wind', 
      name: 'Wind', 
      icon: <Wind className="h-5 w-5" />,
      color: '#10b981',
      description: 'Monitor wind speed and direction patterns'
    },
    { 
      id: 'clouds', 
      name: 'Clouds', 
      icon: <Cloud className="h-5 w-5" />,
      color: '#6b7280',
      description: 'View cloud cover and density'
    },
  ], []);

  const handleMyLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lon: longitude });
          
          try {
            setLoading(true);
            const data = await weatherApi.getForecast(`${latitude},${longitude}`);
            setWeatherData(data);
          } catch (error) {
            console.error('Error getting weather for location:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const drawWeatherLayer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base map
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      const x = (canvas.width / 10) * i;
      const y = (canvas.height / 10) * i;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw weather data based on selected layer
    const layer = mapLayers.find(l => l.id === selectedLayer);
    if (layer) {
      drawWeatherPattern(ctx, layer, canvas.width, canvas.height);
    }

    // Draw location marker if we have weather data
    if (weatherData) {
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [selectedLayer, weatherData, mapLayers]);

  const drawWeatherPattern = (ctx: CanvasRenderingContext2D, layer: WeatherMapLayer, width: number, height: number) => {
    const color = layer.color;
    
    // Simulate weather patterns with gradients and shapes
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 30 + Math.random() * 50;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(0.5, color + '20');
      gradient.addColorStop(1, color + '00');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
  };

  useEffect(() => {
    drawWeatherLayer();
  }, [selectedLayer, weatherData, drawWeatherLayer]);

  useEffect(() => {
    // Load default weather data for map center
    const loadDefaultWeather = async () => {
      try {
        setLoading(true);
        const data = await weatherApi.getForecast(`${mapCenter.lat},${mapCenter.lon}`);
        setWeatherData(data);
      } catch (error) {
        console.error('Error loading default weather:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDefaultWeather();
  }, [mapCenter.lat, mapCenter.lon]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Weather Map</h1>
        <p className="text-surface-600">Interactive weather map with multiple layers</p>
      </div>

      {/* Map Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-surface-900">Map Layers</h3>
          </div>
          <Button variant="secondary" size="sm" onClick={handleMyLocation} disabled={loading}>
            <Navigation className="h-4 w-4 mr-2" />
            {loading ? 'Loading...' : 'My Location'}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {mapLayers.map((layer) => (
            <Button
              key={layer.id}
              variant={selectedLayer === layer.id ? 'primary' : 'secondary'}
              onClick={() => setSelectedLayer(layer.id)}
              size="sm"
            >
              <span className="mr-2">{layer.icon}</span>
              {layer.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Map Container */}
      <Card className="p-0 overflow-hidden" style={{ height: '500px' }}>
        <div className="w-full h-full relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-full"
            style={{ imageRendering: 'crisp-edges' }}
          />
          
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}
        </div>
      </Card>

      {/* Weather Info */}
      {weatherData && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Current Location Weather</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-surface-600 mb-1">Location</p>
              <p className="text-lg font-semibold text-surface-900">
                {weatherData.location.name}, {weatherData.location.country}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-surface-600 mb-1">Temperature</p>
              <p className="text-lg font-semibold text-surface-900">
                {weatherData.current.temperature}°C
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-surface-600 mb-1">Conditions</p>
              <p className="text-lg font-semibold text-surface-900">
                {weatherData.current.condition.text}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Layer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mapLayers.map((layer) => (
          <Card 
            key={layer.id} 
            className={`p-4 cursor-pointer transition-all ${
              selectedLayer === layer.id ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:bg-surface-50'
            }`}
            onClick={() => setSelectedLayer(layer.id)}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-lg bg-surface-100">
                {layer.icon}
              </div>
              <h4 className="font-semibold text-surface-900">{layer.name}</h4>
            </div>
            <p className="text-sm text-surface-600">{layer.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Map;
