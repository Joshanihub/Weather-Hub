import React from 'react';
import type { CurrentWeather, Location } from '../../types/weather';
import Card from '../ui/Card';
import WeatherIcon from './WeatherIcon';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  MapPin
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useSettings } from '../../hooks/useSettings';
import { 
  convertTemperature, 
  getTemperatureUnit,
  convertWindSpeed, 
  getWindUnit,
  convertVisibility, 
  getVisibilityUnit,
  convertPressure, 
  getPressureUnit
} from '../../utils/unitConversions';

interface CurrentWeatherCardProps {
  location: Location;
  current: CurrentWeather;
  className?: string;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  current,
  className
}) => {
  const { settings } = useSettings();

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWeatherBackground = () => {
    if (!current.is_day) return 'weather-gradient-night';
    if (current.condition.text.toLowerCase().includes('rain')) return 'weather-gradient-rainy';
    if (current.condition.text.toLowerCase().includes('cloud')) return 'weather-gradient-cloudy';
    return 'weather-gradient-sunny';
  };

  // Convert values based on user settings
  const temperature = convertTemperature(current.temperature, settings.units.temperature);
  const feelsLike = convertTemperature(current.feels_like, settings.units.temperature);
  const tempUnit = getTemperatureUnit(settings.units.temperature);
  
  const windSpeed = convertWindSpeed(current.wind_speed, settings.units.wind);
  const windUnit = getWindUnit(settings.units.wind);
  
  const visibility = convertVisibility(current.visibility, settings.units.visibility);
  const visibilityUnit = getVisibilityUnit(settings.units.visibility);
  
  const pressure = convertPressure(current.pressure, settings.units.pressure);
  const pressureUnit = getPressureUnit(settings.units.pressure);

  return (
    <Card 
      variant="weather" 
      className={cn(
        'relative overflow-hidden',
        getWeatherBackground(),
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4">
          <WeatherIcon 
            condition={current.condition.text} 
            isDay={current.is_day}
            size="xl"
            className="text-white/80"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Location */}
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="h-4 w-4 text-white/80" />
          <div>
            <h2 className="text-2xl font-bold text-white">{location.name}</h2>
            <p className="text-white/80">{location.region}, {location.country}</p>
          </div>
        </div>

        {/* Main Temperature */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-6xl font-bold text-white">
              {temperature}{tempUnit}
            </div>
            <p className="text-xl text-white/90 mt-2">{current.condition.text}</p>
            <p className="text-white/80">
              Feels like {feelsLike}{tempUnit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Local Time</p>
            <p className="text-white text-lg font-medium">
              {formatTime(location.localtime)}
            </p>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-white/80" />
            <div>
              <p className="text-white/60 text-xs">Real Feel</p>
              <p className="text-white font-medium">{feelsLike}{tempUnit}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-white/80" />
            <div>
              <p className="text-white/60 text-xs">Humidity</p>
              <p className="text-white font-medium">{current.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-white/80" />
            <div>
              <p className="text-white/60 text-xs">Wind</p>
              <p className="text-white font-medium">{windSpeed} {windUnit}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-white/80" />
            <div>
              <p className="text-white/60 text-xs">Visibility</p>
              <p className="text-white font-medium">{visibility} {visibilityUnit}</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Gauge className="h-4 w-4 text-white/80" />
              <span className="text-white/80">Pressure: {pressure} {pressureUnit}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 text-white/80">☀️</div>
              <span className="text-white/80">UV: {current.uv_index}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CurrentWeatherCard;
