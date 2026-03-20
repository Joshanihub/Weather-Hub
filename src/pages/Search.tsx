import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Search as SearchIcon, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { weatherApi } from '../utils/weatherApi';
import type { Location } from '../types/weather';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleViewWeather = (location: Location) => {
    navigate('/', { state: { location: `${location.name}, ${location.country}` } });
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const searchResults = await weatherApi.getSearchResults(query);
      setResults(searchResults);
      
      // Add to search history
      if (!searchHistory.includes(query)) {
        setSearchHistory([query, ...searchHistory.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Search Locations</h1>
        <p className="text-surface-600">Find weather information for any city worldwide</p>
      </div>

      {/* Search Input */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Enter city name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            icon={<SearchIcon className="h-5 w-5 text-surface-400" />}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </Card>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                onClick={() => {
                  setQuery(item);
                  handleSearch();
                }}
              >
                <Clock className="h-4 w-4 mr-2" />
                {item}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">
            Search Results ({results.length})
          </h3>
          <div className="space-y-3">
            {results.map((location, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-surface-400" />
                  <div>
                    <p className="font-medium text-surface-900">{location.name}</p>
                    <p className="text-sm text-surface-600">
                      {location.region}, {location.country}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleViewWeather(location)}
                >
                  View Weather
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Search;
