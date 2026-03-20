export const convertTemperature = (celsius: number, unit: 'celsius' | 'fahrenheit'): number => {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9/5) + 32);
  }
  return Math.round(celsius);
};

export const getTemperatureUnit = (unit: 'celsius' | 'fahrenheit'): string => {
  return unit === 'fahrenheit' ? '°F' : '°C';
};

export const convertWindSpeed = (kmh: number, unit: 'kmh' | 'mph' | 'ms'): number => {
  switch (unit) {
    case 'mph':
      return Math.round(kmh * 0.621371);
    case 'ms':
      return Math.round(kmh / 3.6);
    case 'kmh':
    default:
      return Math.round(kmh);
  }
};

export const getWindUnit = (unit: 'kmh' | 'mph' | 'ms'): string => {
  switch (unit) {
    case 'mph':
      return 'mph';
    case 'ms':
      return 'm/s';
    case 'kmh':
    default:
      return 'km/h';
  }
};

export const convertVisibility = (km: number, unit: 'km' | 'miles'): number => {
  if (unit === 'miles') {
    return Math.round(km * 0.621371);
  }
  return Math.round(km);
};

export const getVisibilityUnit = (unit: 'km' | 'miles'): string => {
  return unit === 'miles' ? 'miles' : 'km';
};

export const convertPressure = (mb: number, unit: 'mb' | 'in' | 'hPa'): number => {
  switch (unit) {
    case 'in':
      return Math.round(mb * 0.02953 * 100) / 100;
    case 'hPa':
      return Math.round(mb);
    case 'mb':
    default:
      return Math.round(mb);
  }
};

export const getPressureUnit = (unit: 'mb' | 'in' | 'hPa'): string => {
  switch (unit) {
    case 'in':
      return 'in';
    case 'hPa':
      return 'hPa';
    case 'mb':
    default:
      return 'mb';
  }
};
