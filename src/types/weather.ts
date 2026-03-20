export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  forecast: Forecast;
  alerts?: WeatherAlert[];
}

export interface Location {
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  timezone: string;
  localtime: string;
}

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uv_index: number;
  wind_speed: number;
  wind_direction: string;
  wind_degree: number;
  condition: WeatherCondition;
  is_day: boolean;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface Forecast {
  forecastday: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  day: DayForecast;
  astro: AstroData;
  hour: HourlyForecast[];
}

export interface DayForecast {
  max_temp: number;
  min_temp: number;
  avg_temp: number;
  max_wind: number;
  total_precip: number;
  avg_humidity: number;
  condition: WeatherCondition;
  uv: number;
  daily_chance_of_rain: number;
  daily_chance_of_snow: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_degree: number;
  pressure: number;
  precip: number;
  chance_of_rain: number;
  chance_of_snow: number;
  condition: WeatherCondition;
  is_day: boolean;
}

export interface AstroData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: string;
}

export interface WeatherAlert {
  headline: string;
  msgtype: string;
  severity: string;
  urgency: string;
  areas: string;
  category: string;
  certainty: string;
  event: string;
  note: string;
  effective: string;
  expires: string;
  description: string;
  instruction: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: string;
}

export interface UserSettings {
  units: {
    temperature: 'celsius' | 'fahrenheit';
    wind: 'kmh' | 'mph' | 'ms';
    pressure: 'mb' | 'in' | 'hPa';
    visibility: 'km' | 'miles';
  };
  notifications: {
    weatherAlerts: boolean;
    dailyForecast: boolean;
    severeWeather: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    animations: boolean;
  };
}
