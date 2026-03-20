import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Bookmark, MapPin, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SavedLocation } from '../types/weather';

const Saved: React.FC = () => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved locations:', e);
        return [];
      }
    }
    return [];
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const navigate = useNavigate();

  const handleRemoveLocation = (id: string) => {
    const updated = savedLocations.filter(loc => loc.id !== id);
    setSavedLocations(updated);
    localStorage.setItem('savedLocations', JSON.stringify(updated));
  };

  const handleViewWeather = (location: SavedLocation) => {
    navigate('/', { state: { location: `${location.name}, ${location.country}` } });
  };

  const handleAddLocation = async () => {
    if (!newLocationName.trim()) return;

    try {
      // For now, just add with basic coordinates (could be enhanced with geocoding)
      const newLocation: SavedLocation = {
        id: Date.now().toString(),
        name: newLocationName,
        country: 'Unknown',
        lat: 0,
        lon: 0,
        addedAt: new Date().toISOString(),
      };
      
      const updated = [...savedLocations, newLocation];
      setSavedLocations(updated);
      localStorage.setItem('savedLocations', JSON.stringify(updated));
      setNewLocationName('');
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Saved Locations</h1>
          <p className="text-surface-600">Manage your favorite weather locations</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Bookmark className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Total Saved</p>
              <p className="text-2xl font-bold text-surface-900">{savedLocations.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Countries</p>
              <p className="text-2xl font-bold text-surface-900">
                {new Set(savedLocations.map(loc => loc.country)).size}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="h-6 w-6 text-blue-600 font-bold">🌍</div>
            </div>
            <div>
              <p className="text-sm text-surface-600">Continents</p>
              <p className="text-2xl font-bold text-surface-900">3</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Saved Locations List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Your Locations</h3>
        <div className="space-y-3">
          {savedLocations.map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-surface-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-surface-600" />
                </div>
                <div>
                  <p className="font-medium text-surface-900">{location.name}</p>
                  <p className="text-sm text-surface-600">
                    {location.country} • Added {formatDate(location.addedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleViewWeather(location)}
                >
                  View Weather
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveLocation(location.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {savedLocations.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No saved locations</h3>
            <p className="text-surface-600 mb-4">
              Start adding locations to quickly access their weather
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Location
            </Button>
          </div>
        )}
      </Card>

      {/* Add Location Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Add Location</h3>
            <input
              type="text"
              placeholder="Enter location name..."
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
              className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowAddDialog(false);
                  setNewLocationName('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddLocation}>
                Add Location
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Saved;
