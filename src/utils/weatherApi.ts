import axios from 'axios';
import type { Location, CurrentWeather, Forecast, WeatherAlert } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Validate API key on module load
if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.warn('⚠️ OpenWeather API key not configured. Please add your API key to .env file');
  console.warn('Get your free API key from: https://openweathermap.org/api');
}

const api = axios.create({
  baseURL: BASE_URL,
});

export const weatherApi = {
  getCurrentWeather: async (location: string): Promise<{ location: Location; current: CurrentWeather }> => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('API key not configured. Please add your OpenWeather API key to .env file');
    }
    
    try {
      let params;
      
      // Check if location is coordinates (lat,lon format)
      if (location.includes(',')) {
        const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lon)) {
          params = { lat, lon, appid: API_KEY, units: 'metric' };
        } else {
          params = { q: location, appid: API_KEY, units: 'metric' };
        }
      } else {
        params = { q: location, appid: API_KEY, units: 'metric' };
      }
      
      const response = await api.get('/weather', { params });
      
      // Transform OpenWeatherMap response to match our types
      const data = response.data;
      return {
        location: {
          name: data.name,
          country: data.sys.country,
          region: '',
          lat: data.coord.lat,
          lon: data.coord.lon,
          timezone: '',
          localtime: new Date().toISOString()
        },
        current: {
          temperature: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          visibility: data.visibility / 1000, // Convert to km
          uv_index: 0, // Not available in current weather endpoint
          wind_speed: data.wind.speed,
          wind_direction: '',
          wind_degree: data.wind.deg || 0,
          condition: {
            text: data.weather[0].description,
            icon: data.weather[0].icon,
            code: data.weather[0].id
          },
          is_day: true
        }
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  getForecast: async (location: string, days: number = 5): Promise<{ location: Location; current: CurrentWeather; forecast: Forecast }> => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('API key not configured. Please add your OpenWeather API key to .env file');
    }
    
    try {
      let params;
      
      // Check if location is coordinates (lat,lon format)
      if (location.includes(',')) {
        const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lon)) {
          params = { lat, lon, appid: API_KEY, units: 'metric', cnt: days * 8 };
        } else {
          params = { q: location, appid: API_KEY, units: 'metric', cnt: days * 8 };
        }
      } else {
        params = { q: location, appid: API_KEY, units: 'metric', cnt: days * 8 };
      }
      
      const response = await api.get('/forecast', { params });
      
      const data = response.data;
      
      // Transform OpenWeatherMap response to match our types
      const forecastDays: unknown[] = [];
      const processedDates = new Set();
      
      data.list.forEach((item: unknown) => {
        const typedItem = item as {
          dt_txt: string;
          main: { temp: number; feels_like: number; humidity: number; pressure: number };
          wind: { speed: number; deg?: number };
          rain?: { '3h': number };
          snow?: { '3h': number };
          weather: Array<{ description: string; icon: string; id: number }>;
          sys: { pod: string };
        };
        
        const date = typedItem.dt_txt.split(' ')[0];
        if (!processedDates.has(date)) {
          processedDates.add(date);
          
          // Get all forecasts for this day
          const dayForecasts = data.list.filter((f: unknown) => {
            const typedF = f as { dt_txt: string };
            return typedF.dt_txt.startsWith(date);
          }) as Array<{
            main: { temp: number; humidity: number };
            wind: { speed: number };
            rain?: { '3h': number };
            weather: Array<{ description: string; icon: string; id: number }>;
          }>;
          
          const temps = dayForecasts.map(f => f.main.temp);
          
          forecastDays.push({
            date: date,
            day: {
              max_temp: Math.round(Math.max(...temps)),
              min_temp: Math.round(Math.min(...temps)),
              avg_temp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
              max_wind: Math.round(Math.max(...dayForecasts.map(f => f.wind.speed))),
              total_precip: dayForecasts.reduce((sum, f) => sum + (f.rain?.['3h'] || 0), 0),
              avg_humidity: Math.round(dayForecasts.reduce((sum, f) => sum + f.main.humidity, 0) / dayForecasts.length),
              condition: {
                text: dayForecasts[Math.floor(dayForecasts.length / 2)].weather[0].description,
                icon: dayForecasts[Math.floor(dayForecasts.length / 2)].weather[0].icon,
                code: dayForecasts[Math.floor(dayForecasts.length / 2)].weather[0].id
              },
              uv: 0,
              daily_chance_of_rain: Math.round(dayForecasts.filter(f => (f.rain?.['3h'] || 0) > 0).length / dayForecasts.length * 100),
              daily_chance_of_snow: 0
            },
            astro: {
              sunrise: '',
              sunset: '',
              moonrise: '',
              moonset: '',
              moon_phase: '',
              moon_illumination: ''
            },
            hour: dayForecasts.map((f: unknown) => {
              const typedF = f as {
                dt_txt: string;
                main: { temp: number; feels_like: number; humidity: number; pressure: number };
                wind: { speed: number; deg?: number };
                rain?: { '3h': number };
                snow?: { '3h': number };
                weather: Array<{ description: string; icon: string; id: number }>;
                sys: { pod: string };
              };
              
              return {
                time: typedF.dt_txt,
                temperature: Math.round(typedF.main.temp),
                feels_like: Math.round(typedF.main.feels_like),
                humidity: typedF.main.humidity,
                wind_speed: typedF.wind.speed,
                wind_degree: typedF.wind.deg || 0,
                pressure: typedF.main.pressure,
                precip: typedF.rain?.['3h'] || 0,
                chance_of_rain: typedF.rain?.['3h'] ? Math.min(100, typedF.rain['3h'] * 10) : 0,
                chance_of_snow: typedF.snow?.['3h'] ? Math.min(100, typedF.snow['3h'] * 10) : 0,
                condition: {
                  text: typedF.weather[0].description,
                  icon: typedF.weather[0].icon,
                  code: typedF.weather[0].id
                },
                is_day: typedF.sys.pod === 'd'
              };
            })
          });
        }
      });
      
      return {
        location: {
          name: data.city.name,
          country: data.city.country,
          region: '',
          lat: data.city.coord.lat,
          lon: data.city.coord.lon,
          timezone: '',
          localtime: new Date().toISOString()
        },
        current: {
          temperature: Math.round(data.list[0].main.temp),
          feels_like: Math.round(data.list[0].main.feels_like),
          humidity: data.list[0].main.humidity,
          pressure: data.list[0].main.pressure,
          visibility: data.list[0].visibility / 1000,
          uv_index: 0,
          wind_speed: data.list[0].wind.speed,
          wind_direction: '',
          wind_degree: data.list[0].wind.deg || 0,
          condition: {
            text: data.list[0].weather[0].description,
            icon: data.list[0].weather[0].icon,
            code: data.list[0].weather[0].id
          },
          is_day: data.list[0].sys.pod === 'd'
        },
        forecast: {
          forecastday: forecastDays.slice(0, days) as Forecast['forecastday']
        }
      };
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  getSearchResults: async (query: string): Promise<Location[]> => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('API key not configured. Please add your OpenWeather API key to .env file');
    }
    
    try {
      const response = await api.get('/find', {
        params: { q: query, appid: API_KEY, type: 'like', cnt: 5 }
      });
      
      // Transform OpenWeatherMap response to match our types
      return response.data.list.map((item: unknown) => {
        const typedItem = item as {
          name: string;
          sys: { country: string };
          coord: { lat: number; lon: number };
        };
        
        return {
          name: typedItem.name,
          country: typedItem.sys.country,
          region: '',
          lat: typedItem.coord.lat,
          lon: typedItem.coord.lon,
          timezone: '',
          localtime: new Date().toISOString()
        };
      });
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },

  getWeatherAlerts: async (location: string): Promise<WeatherAlert[]> => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      return [];
    }
    
    try {
      // OpenWeatherMap One Call API 3.0 includes alerts
      const geoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
        params: { q: location, appid: API_KEY, limit: 1 }
      });
      
      if (geoResponse.data.length === 0) {
        return [];
      }
      
      const { lat, lon } = geoResponse.data[0] as { lat: number; lon: number };
      
      const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall`, {
        params: { lat, lon, appid: API_KEY, exclude: 'minutely,hourly,daily' }
      });
      
      // Transform OpenWeatherMap alerts to match our types
      return (response.data.alerts || []).map((alert: unknown) => {
        const typedAlert = alert as {
          event: string;
          severity?: string;
          sender_name?: string;
          description: string;
          start: number;
          end: number;
        };
        
        return {
          headline: typedAlert.event,
          msgtype: 'Alert',
          severity: typedAlert.severity || 'Unknown',
          urgency: 'Unknown',
          areas: typedAlert.sender_name || 'Unknown',
          category: 'Weather',
          certainty: 'Unknown',
          event: typedAlert.event,
          note: typedAlert.description,
          effective: new Date(typedAlert.start * 1000).toISOString(),
          expires: new Date(typedAlert.end * 1000).toISOString(),
          description: typedAlert.description,
          instruction: typedAlert.description
        };
      });
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  },

  getHistoricalWeather: async (location: string, date: string): Promise<{ location: Location; current: CurrentWeather; forecast: Forecast }> => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('API key not configured. Please add your OpenWeather API key to .env file');
    }
    
    try {
      // Get coordinates for the location
      const geoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
        params: { q: location, appid: API_KEY, limit: 1 }
      });
      
      if (geoResponse.data.length === 0) {
        throw new Error('Location not found');
      }
      
      const { lat, lon, name, country } = geoResponse.data[0] as { 
        lat: number; 
        lon: number; 
        name: string; 
        country: string 
      };
      
      // Convert date to timestamp
      const targetDate = new Date(date);
      const timestamp = Math.floor(targetDate.getTime() / 1000);
      
      // OpenWeatherMap historical data requires a different endpoint
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall/timemachine`, {
        params: { lat, lon, dt: timestamp, appid: API_KEY, units: 'metric' }
      });
      
      const data = response.data.current as {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
        visibility: number;
        uvi: number;
        wind_speed: number;
        wind_deg?: number;
        weather: Array<{ description: string; icon: string; id: number }>;
        dt: number;
      };
      
      return {
        location: {
          name: name,
          country: country,
          region: '',
          lat: lat,
          lon: lon,
          timezone: '',
          localtime: new Date(data.dt * 1000).toISOString()
        },
        current: {
          temperature: Math.round(data.temp),
          feels_like: Math.round(data.feels_like),
          humidity: data.humidity,
          pressure: data.pressure,
          visibility: data.visibility / 1000,
          uv_index: data.uvi,
          wind_speed: data.wind_speed,
          wind_direction: '',
          wind_degree: data.wind_deg || 0,
          condition: {
            text: data.weather[0].description,
            icon: data.weather[0].icon,
            code: data.weather[0].id
          },
          is_day: true
        },
        forecast: {
          forecastday: []
        }
      };
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      throw error;
    }
  },
};

// Note: Mock data removed - app now uses only real API data
// Get your free API key from: https://openweathermap.org/api
