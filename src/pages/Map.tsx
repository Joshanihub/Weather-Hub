import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Map as MapIcon, Layers, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Map: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('temperature');
  const navigate = useNavigate();

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Navigate to home with coordinates
          navigate('/', { 
            state: { 
              location: `${latitude},${longitude}` 
            } 
          });
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

  const mapLayers = [
    { id: 'temperature', name: 'Temperature', icon: '🌡️' },
    { id: 'precipitation', name: 'Precipitation', icon: '🌧️' },
    { id: 'wind', name: 'Wind', icon: '💨' },
    { id: 'clouds', name: 'Clouds', icon: '☁️' },
  ];

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
          <Button variant="secondary" size="sm" onClick={handleMyLocation}>
            <Navigation className="h-4 w-4 mr-2" />
            My Location
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
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <MapIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-900 mb-2">Interactive Weather Map</h3>
            <p className="text-surface-600 mb-4">
              Map integration would go here with Leaflet and weather data layers
            </p>
            <div className="text-sm text-surface-500">
              Selected Layer: <span className="font-medium">{selectedLayer}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Map Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="font-semibold text-surface-900 mb-2">Temperature Layer</h4>
          <p className="text-sm text-surface-600">
            View global temperature patterns and heat maps
          </p>
        </Card>
        <Card className="p-6">
          <h4 className="font-semibold text-surface-900 mb-2">Precipitation Layer</h4>
          <p className="text-sm text-surface-600">
            Track rainfall and snowfall worldwide
          </p>
        </Card>
        <Card className="p-6">
          <h4 className="font-semibold text-surface-900 mb-2">Wind Layer</h4>
          <p className="text-sm text-surface-600">
            Monitor wind speed and direction patterns
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Map;
